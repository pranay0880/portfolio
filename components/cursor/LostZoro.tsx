"use client";

import { useEffect, useRef, useState } from "react";
import {
  ZoroRunner,
  ZORO_HEIGHT,
  ZORO_SHEETS,
  ZORO_WIDTH,
  zoroSheetUrl,
  type ZoroState,
} from "@/components/cursor/ZoroRunner";
import "./cursor.css";

// Strolling pace (px/s) and walk-cycle rate. One 8-frame cycle is two steps
// of ~22px on screen, so 8fps covers ~44px/s - matching the speed keeps the
// planted foot from sliding. Heading the wrong way off-screen he jogs.
const WALK_SPEED = 44;
const WALK_FPS = 8;
const JOG_SPEED = 90;
const JOG_FPS = 10;
const STAND_FPS = 4;
const SLEEP_FPS = 5;
// Turn-around and walk-to-stop play once at these rates.
const TURN_FPS = 7;
const STOP_FPS = 5;
// Gap from the viewport edges when picking a spot to wander to.
const EDGE = 24;
// How long he stands around confused, and how long a nap lasts (seconds).
const LOOK_TIME: [number, number] = [2, 3.5];
const NAP_TIME: [number, number] = [6, 10];
// Odds, after a bout of looking around, of napping / wandering off-screen.
const NAP_CHANCE = 0.2;
const WANDER_OFF_CHANCE = 0.15;
// Odds a stop is spent in one of the lost poses (looking up, shading his
// eyes, crouching, scratching his head - each with its own "?") rather than
// idling with a "?" popping up.
const LOST_POSE_CHANCE = 0.7;
const ALERT_DURATION = 0.6;

type Phase = "walk" | "turn" | "stop" | "look" | "nap";
type Facing = "left" | "right";
const rand = ([min, max]: [number, number]) => min + Math.random() * (max - min);

/** Sprite frame for a sheet, given seconds-in-phase * fps. */
function frameFor(state: ZoroState, clock: number) {
  const f = Math.floor(clock);
  if (state === "sleep") {
    // Fold arms -> sit -> doze once, then loop the last few dozing frames.
    const loop = 4;
    const last = ZORO_SHEETS.sleep - 1;
    return f <= last ? f : last - loop + 1 + ((f - last - 1) % loop);
  }
  return f % ZORO_SHEETS[state];
}

/**
 * Zoro, famously unable to find his way anywhere, wanders along the bottom
 * of the screen on his own: turns around, strolls to a random spot, slows to
 * a stop and strikes a lost pose (or idles with a "?"), sometimes naps, and
 * now and then jogs confidently off one edge only to reappear from the other.
 *
 * Independent of the cursor, so it never gets in the way of reading or
 * clicking. Decorative: aria-hidden, pointer-events: none, hidden below md
 * and not rendered under prefers-reduced-motion.
 */
export function LostZoro() {
  const [enabled, setEnabled] = useState(false);
  const zoroRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!reduced.matches);
    update();
    reduced.addEventListener("change", update);
    return () => reduced.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    for (const sheet of Object.keys(ZORO_SHEETS) as ZoroState[])
      new Image().src = zoroSheetUrl(sheet);

    const width = () => window.innerWidth;
    const randomSpot = () => EDGE + Math.random() * Math.max(0, width() - ZORO_WIDTH - EDGE * 2);

    let x = randomSpot();
    let target = x;
    let phase: Phase = "look";
    let phaseLeft = 0;
    let clock = 0;
    // Which lost pose he's holding this stop, or null when idling.
    let lostPose: number | null = null;
    let alertTime = 0;
    let facing: Facing = Math.random() < 0.5 ? "left" : "right";
    // Direction he'll face once the turn-around finishes.
    let turnTo: Facing = facing;
    // Set when he heads off-screen: re-enter from the opposite edge.
    let wrapTo: number | null = null;
    let lastTime = 0;
    let raf = 0;

    const walk = () => {
      phase = "walk";
      clock = 0;
    };

    const startWalk = () => {
      if (Math.random() < WANDER_OFF_CHANCE) {
        // Off he goes, the wrong way entirely...
        const leftward = Math.random() < 0.5;
        target = leftward ? -ZORO_WIDTH - 20 : width() + 20;
        wrapTo = leftward ? width() + 20 : -ZORO_WIDTH - 20;
      } else {
        target = randomSpot();
      }
      const heading: Facing = target > x ? "right" : "left";
      if (heading !== facing) {
        // Turn around properly instead of snapping to the new direction.
        phase = "turn";
        clock = 0;
        turnTo = heading;
      } else {
        walk();
      }
    };

    const startLook = () => {
      phase = "look";
      phaseLeft = rand(LOOK_TIME);
      clock = 0;
      if (Math.random() < LOST_POSE_CHANCE) {
        lostPose = Math.floor(Math.random() * ZORO_SHEETS.lost);
        alertTime = 0; // the pose art carries its own "?"
      } else {
        lostPose = null;
        alertTime = ALERT_DURATION;
      }
    };

    function tick(time: number) {
      raf = requestAnimationFrame(tick);
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      const el = zoroRef.current;
      const sprite = spriteRef.current;
      if (!el || !sprite) return;

      clock += dt;
      alertTime = Math.max(0, alertTime - dt);

      if (phase === "walk") {
        const step = (wrapTo !== null ? JOG_SPEED : WALK_SPEED) * dt;
        if (Math.abs(target - x) <= step) {
          x = target;
          if (wrapTo !== null) {
            // ...and pops back in from the other side, none the wiser.
            x = wrapTo;
            wrapTo = null;
            target = randomSpot();
            facing = target > x ? "right" : "left";
          } else {
            phase = "stop";
            clock = 0;
          }
        } else {
          x += Math.sign(target - x) * step;
        }
      } else if (phase === "turn") {
        if (clock * TURN_FPS >= ZORO_SHEETS.turn) {
          facing = turnTo;
          walk();
        }
      } else if (phase === "stop") {
        if (clock * STOP_FPS >= ZORO_SHEETS.stop) startLook();
      } else if (phase === "look") {
        phaseLeft -= dt;
        if (phaseLeft <= 0) {
          if (Math.random() < NAP_CHANCE) {
            phase = "nap";
            phaseLeft = rand(NAP_TIME);
            clock = 0;
          } else {
            startWalk();
          }
        }
      } else {
        phaseLeft -= dt;
        if (phaseLeft <= 0) startLook();
      }

      let state: ZoroState;
      let frame: number;
      const once = (fps: number, frames: number) => Math.min(Math.floor(clock * fps), frames - 1);
      if (phase === "walk") {
        state = wrapTo !== null ? "run" : "walk";
        frame = frameFor(state, clock * (wrapTo !== null ? JOG_FPS : WALK_FPS));
      } else if (phase === "turn") {
        state = "turn";
        // Drawn as a right-to-left turn; play it backwards to turn the other way.
        const f = once(TURN_FPS, ZORO_SHEETS.turn);
        frame = turnTo === "left" ? f : ZORO_SHEETS.turn - 1 - f;
      } else if (phase === "stop") {
        state = "stop";
        frame = once(STOP_FPS, ZORO_SHEETS.stop);
      } else if (phase === "nap") {
        state = "sleep";
        frame = frameFor(state, clock * SLEEP_FPS);
      } else if (lostPose !== null) {
        state = "lost";
        frame = lostPose;
      } else {
        state = "stand";
        frame = frameFor(state, clock * STAND_FPS);
      }

      const frames = ZORO_SHEETS[state];
      sprite.style.backgroundPosition = `${(frame * 100) / (frames - 1)}% 0`;
      el.dataset.state = state;
      el.dataset.facing = facing;
      el.dataset.alert = String(alertTime > 0);
      el.dataset.visible = "true";
      el.style.transform = `translate3d(${x}px, 0, 0)`;
    }

    startLook();
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-2 z-40 hidden h-0 md:block"
      style={
        {
          "--zoro-w": `${ZORO_WIDTH}px`,
          "--zoro-h": `${ZORO_HEIGHT}px`,
        } as React.CSSProperties
      }
    >
      <div className="absolute bottom-0 left-0">
        <ZoroRunner ref={zoroRef} spriteRef={spriteRef} alertText="?" />
      </div>
    </div>
  );
}
