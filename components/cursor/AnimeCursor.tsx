"use client";

import { useEffect, useRef, useState } from "react";
import {
  SwordCursor,
  SWORD_ANGLE,
  SWORD_GHOSTS,
  SWORD_LENGTH,
  SWORD_REACH,
  SWORD_THICKNESS,
} from "@/components/cursor/SwordCursor";
import {
  ZoroRunner,
  ZORO_HEIGHT,
  ZORO_SHEETS,
  ZORO_WIDTH,
  zoroSheetUrl,
  type ZoroState,
} from "@/components/cursor/ZoroRunner";
import "./cursor.css";

const INTERACTIVE_SELECTOR = "a, button, [role='button'], input, textarea, select, label";

// Zoro's chase lag: time constant of the exponential lerp (~150ms to close
// most of the gap), frame-rate independent.
const CHASE_TAU = 0.15;
// Smoothing for the pointer velocity used for facing + trail.
const VELOCITY_TAU = 0.08;
// Horizontal speed (px/s) needed to flip Zoro - hysteresis against jitter.
const FLIP_SPEED = 80;
// Distance (px) from his target above which Zoro starts running, and below
// which he counts as having reached the sword - hysteresis so tiny nudges
// don't flicker him between standing and running.
const RUN_START = 6;
const RUN_STOP = 2;
// Pointer speed (px/s) at which the sword trail starts / is fully visible.
const TRAIL_MIN_SPEED = 700;
const TRAIL_FULL_SPEED = 2200;
// Frames of position history between each trail ghost.
const TRAIL_SPACING = 2;
// Seconds after the pointer stops before the sword's aura starts breathing,
// and before Zoro (having reached the sword) nods off.
const IDLE_AFTER = 0.6;
const SLEEP_AFTER = 3;
// Pointer travel (px) that counts as "the user moved" - filters synthetic
// zero-distance pointermoves and hand jitter out of the stillness timer.
const MOVE_THRESHOLD = 2;
// Playback rates (sprite frames/s) for the idle loops.
const STAND_FPS = 6;
const SLEEP_FPS = 5;
// How long the "!" pops when he's woken up.
const ALERT_DURATION = 0.6;

type Facing = "left" | "right";

/** Sprite frame to show for a state, given seconds-in-state * fps. */
function frameFor(state: ZoroState, clock: number) {
  const f = Math.floor(clock);
  if (state === "sleep") {
    // Play the fold-arms -> sit -> doze sequence once, then loop the last
    // few dozing frames (their Zzz drifts) for as long as he sleeps.
    const loop = 4;
    const last = ZORO_SHEETS.sleep - 1;
    return f <= last ? f : last - loop + 1 + ((f - last - 1) % loop);
  }
  return f % ZORO_SHEETS[state];
}

/** Where Zoro should stand relative to the sword tip for a given facing. */
function chaseTarget(px: number, py: number, facing: Facing) {
  // Facing right he trails to the left of the tip, fist reaching for it.
  // Facing left he's mirrored, but the sword body extends right/down from
  // the tip, so he stands past the hilt rather than on top of the blade.
  return facing === "right"
    ? { x: px - ZORO_WIDTH - 6, y: py - ZORO_HEIGHT * 0.3 }
    : { x: px + SWORD_REACH.x + 2, y: py + SWORD_REACH.y - ZORO_HEIGHT * 0.8 };
}

/**
 * Sword cursor that tracks the pointer 1:1, with a small Zoro sprite
 * lerping after it and a purple motion trail on fast flicks.
 *
 * The sword is always visible. Zoro chases it while the pointer moves; once
 * he reaches it he stands idle, and after a few seconds of stillness he
 * folds his arms, sits down and dozes off. Moving again wakes him with a
 * "!" and he gives chase.
 *
 * Everything per-frame is written straight to the DOM from one rAF loop;
 * React state only holds hover/press, which change rarely.
 *
 * Disabled (falls back to the CSS cursor in globals.css) on touch / coarse
 * pointers and under prefers-reduced-motion.
 */
export function AnimeCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  const swordRef = useRef<HTMLDivElement>(null);
  const ghostRefs = useRef<(HTMLDivElement | null)[]>([]);
  const zoroRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !reduced.matches);
    update();
    fine.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("has-custom-cursor", enabled);
    if (!enabled) return;

    // Warm the idle sheets so the first stand/sleep swap doesn't flash empty.
    for (const sheet of Object.keys(ZORO_SHEETS) as ZoroState[])
      new Image().src = zoroSheetUrl(sheet);

    const pointer = { x: 0, y: 0, inside: false, seen: false };
    const prev = { x: 0, y: 0 };
    const velocity = { x: 0, y: 0 };
    const zoro = { x: 0, y: 0 };
    const history: { x: number; y: number }[] = [];
    let facing: Facing = "right";
    let state: ZoroState = "stand";
    let lastMoveTime = 0;
    // Where the pointer was at the last move that counted (see handleMove).
    const moveAnchor = { x: 0, y: 0 };
    let alertTime = 0;
    let frameClock = 0;
    let lastTime = 0;
    let raf = 0;

    function handleMove(event: PointerEvent) {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.inside = true;
      // Only real travel resets the stillness timer. Chrome fires synthetic
      // pointermoves at a resting cursor (after scrolls, and when content
      // repaints under it - which this cursor does every frame), and hands /
      // trackpads jitter by a pixel; either kept Zoro from ever standing or
      // sleeping. Distance is measured from the last counted move, so slow
      // deliberate drags still add up.
      if (
        !pointer.seen ||
        Math.hypot(pointer.x - moveAnchor.x, pointer.y - moveAnchor.y) >= MOVE_THRESHOLD
      ) {
        moveAnchor.x = pointer.x;
        moveAnchor.y = pointer.y;
        lastMoveTime = performance.now();
      }
      if (!pointer.seen) {
        // First sighting: drop Zoro straight into place instead of having
        // him sprint in from the top-left corner.
        pointer.seen = true;
        prev.x = pointer.x;
        prev.y = pointer.y;
        const target = chaseTarget(pointer.x, pointer.y, facing);
        zoro.x = target.x;
        zoro.y = target.y;
      }
    }
    function handleOver(event: PointerEvent) {
      setHovering(Boolean((event.target as Element).closest?.(INTERACTIVE_SELECTOR)));
    }
    function handleDown() {
      setPressed(true);
    }
    function handleUp() {
      setPressed(false);
    }
    function handleLeaveWindow() {
      pointer.inside = false;
      setPressed(false);
    }

    function tick(time: number) {
      raf = requestAnimationFrame(tick);
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;

      const sword = swordRef.current;
      const zoroEl = zoroRef.current;
      const sprite = spriteRef.current;
      if (!sword || !zoroEl || !sprite) return;

      const visible = pointer.seen && pointer.inside;
      sword.style.opacity = visible ? "1" : "0";
      zoroEl.dataset.visible = String(visible);
      if (!pointer.seen) return;

      // Sword: its zero-size anchor sits on the pointer; the blade tip is it.
      sword.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;

      // Smoothed pointer velocity.
      const vk = 1 - Math.exp(-dt / VELOCITY_TAU);
      velocity.x += ((pointer.x - prev.x) / dt - velocity.x) * vk;
      velocity.y += ((pointer.y - prev.y) / dt - velocity.y) * vk;
      prev.x = pointer.x;
      prev.y = pointer.y;
      const speed = Math.hypot(velocity.x, velocity.y);

      if (velocity.x > FLIP_SPEED) facing = "right";
      else if (velocity.x < -FLIP_SPEED) facing = "left";

      // Zoro: exponential lerp toward his spot beside the sword.
      const target = chaseTarget(pointer.x, pointer.y, facing);
      const ck = 1 - Math.exp(-dt / CHASE_TAU);
      zoro.x += (target.x - zoro.x) * ck;
      zoro.y += (target.y - zoro.y) * ck;
      const gap = Math.hypot(target.x - zoro.x, target.y - zoro.y);

      // State machine: run -> stand (reached the sword) -> sleep, and any
      // real movement sends him running again. Stillness is timed from the
      // last pointer event, not from the smoothed velocity (slow to decay).
      const stillTime = (time - lastMoveTime) / 1000;
      const moving = stillTime < 0.05;
      let nextState: ZoroState;
      if (gap > RUN_START || (state === "run" && gap > RUN_STOP)) nextState = "run";
      else if (state === "sleep" && !moving) nextState = "sleep";
      else if (stillTime > SLEEP_AFTER) nextState = "sleep";
      else nextState = "stand";
      if (nextState !== state) {
        if (state === "sleep") alertTime = ALERT_DURATION;
        state = nextState;
        frameClock = 0;
      }
      alertTime = Math.max(0, alertTime - dt);

      let bob = 0;
      let lean = 0;
      if (state === "run") {
        // Stride speed scales with how far behind he is.
        const fps = Math.min(9 + gap * 0.12, 22);
        frameClock += dt * fps;
        bob = -Math.abs(Math.sin((frameClock * Math.PI * 2) / ZORO_SHEETS.run)) * 2;
        lean = Math.min(gap * 0.05, 6) * (facing === "right" ? 1 : -1);
      } else {
        frameClock += dt * (state === "sleep" ? SLEEP_FPS : STAND_FPS);
      }
      const frames = ZORO_SHEETS[state];
      const frame = frameFor(state, frameClock);
      sprite.style.backgroundPosition = `${(frame * 100) / (frames - 1)}% 0`;
      zoroEl.dataset.facing = facing;
      zoroEl.dataset.state = state;
      zoroEl.dataset.alert = String(alertTime > 0);
      sword.dataset.idle = String(stillTime > IDLE_AFTER);
      zoroEl.style.transform = `translate3d(${zoro.x}px, ${zoro.y + bob}px, 0) rotate(${lean}deg)`;

      // Trail: ghosts pinned to recent positions, fading in with speed.
      history.push({ x: pointer.x, y: pointer.y });
      if (history.length > SWORD_GHOSTS * TRAIL_SPACING + 1) history.shift();
      const trail = Math.max(
        0,
        Math.min((speed - TRAIL_MIN_SPEED) / (TRAIL_FULL_SPEED - TRAIL_MIN_SPEED), 1),
      );
      ghostRefs.current.forEach((ghost, i) => {
        if (!ghost) return;
        const point = history[history.length - 1 - (i + 1) * TRAIL_SPACING];
        if (!point || !visible || trail === 0) {
          ghost.style.opacity = "0";
          return;
        }
        ghost.style.opacity = String(trail * 0.55 * (1 - (i + 1) / (SWORD_GHOSTS + 1)));
        ghost.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;
      });
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerover", handleOver);
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("blur", handleUp);
    document.documentElement.addEventListener("pointerleave", handleLeaveWindow);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerover", handleOver);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("blur", handleUp);
      document.documentElement.removeEventListener("pointerleave", handleLeaveWindow);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="anime-cursor-layer"
      style={
        {
          "--sword-l": `${SWORD_LENGTH}px`,
          "--sword-t": `${SWORD_THICKNESS}px`,
          "--sword-angle": `${SWORD_ANGLE}deg`,
          "--zoro-w": `${ZORO_WIDTH}px`,
          "--zoro-h": `${ZORO_HEIGHT}px`,
        } as React.CSSProperties
      }
    >
      <ZoroRunner ref={zoroRef} spriteRef={spriteRef} />
      <SwordCursor ref={swordRef} ghostRefs={ghostRefs} hovering={hovering} pressed={pressed} />
    </div>
  );
}
