"use client";

import { useEffect, useRef, useState } from "react";

// Sprite strips in public/navbar: frames laid out horizontally, each frame a
// w x h cell with the feet on the bottom edge.
const SHEETS = {
  luffyRun: { src: "/navbar/luffy-run.webp", frames: 8, w: 142, h: 113 },
  luffyShock: { src: "/navbar/luffy-shock.webp", frames: 1, w: 82, h: 86 },
  garpLook: { src: "/navbar/garp-look.webp", frames: 6, w: 125, h: 129 },
  garpRun: { src: "/navbar/garp-run.webp", frames: 5, w: 132, h: 107 },
} as const;
type SheetKey = keyof typeof SHEETS;

// Source art -> on-screen px. Luffy ends up ~34px tall on the border.
const SCALE = 0.3;
// garp-look frames: 2-3 back turned, 4 turning with "?", 5 facing left with "!".
const GARP_BACK = [2, 3];
const GARP_HUH = 4;
const GARP_ALERT = 5;

// Timeline (seconds / px per second).
const LUFFY_SPEED = 150;
const FLEE_SPEED = 230;
const CHASE_SPEED = 215;
const NOTICE_HUH = 0.6;
const NOTICE_TOTAL = 1.4;
const CHASE_DELAY = 0.25;
const REST = 2.5;
const RUN_FPS = 12;

type Pose = { sheet: SheetKey; frame: number; x: number; flip: boolean; opacity: number };
type Scene = { luffy: Pose; garp: Pose; loop: number };

/** Pure function of loop time: where everyone is and what they're doing. */
function sceneAt(t: number, width: number): Scene {
  const garpX = width * 0.62;
  const luffyStart = -60;
  const luffyStop = garpX - 90;
  const arrive = (luffyStop - luffyStart) / LUFFY_SPEED;
  const notice = arrive + NOTICE_TOTAL;
  const chaseEnd = notice + CHASE_DELAY + (garpX + 120) / CHASE_SPEED;
  const loop = chaseEnd + REST;
  const run = (clock: number, frames: number) => Math.floor(clock * RUN_FPS) % frames;

  let luffy: Pose;
  let garp: Pose;
  if (t < arrive) {
    // Luffy runs in; Garp idles with his back turned.
    luffy = {
      sheet: "luffyRun",
      frame: run(t, 8),
      x: luffyStart + t * LUFFY_SPEED,
      flip: false,
      opacity: 1,
    };
    garp = {
      sheet: "garpLook",
      frame: GARP_BACK[Math.floor(t * 1.5) % 2],
      x: garpX,
      flip: false,
      opacity: Math.min(t / 0.4, 1),
    };
  } else if (t < notice) {
    // Garp turns: "?" then "!" - Luffy freezes.
    const n = t - arrive;
    luffy = { sheet: "luffyShock", frame: 0, x: luffyStop, flip: false, opacity: 1 };
    garp = {
      sheet: "garpLook",
      frame: n < NOTICE_HUH ? GARP_HUH : GARP_ALERT,
      x: garpX,
      flip: false,
      opacity: 1,
    };
  } else {
    // Luffy bolts back the way he came; Garp gives chase a beat later.
    const c = t - notice;
    const garpClock = Math.max(0, c - CHASE_DELAY);
    luffy = {
      sheet: "luffyRun",
      frame: run(c, 8),
      x: luffyStop - c * FLEE_SPEED,
      flip: true,
      opacity: 1,
    };
    garp =
      c < CHASE_DELAY
        ? { sheet: "garpLook", frame: GARP_ALERT, x: garpX, flip: false, opacity: 1 }
        : {
            sheet: "garpRun",
            frame: run(garpClock, 5),
            x: garpX - garpClock * CHASE_SPEED,
            flip: true,
            opacity: 1,
          };
  }
  return { luffy, garp, loop };
}

/** Writes a pose to a sprite element; sheet-level styles only on change. */
function applyPose(el: HTMLDivElement, pose: Pose) {
  const sheet = SHEETS[pose.sheet];
  const w = sheet.w * SCALE;
  if (el.dataset.sheet !== pose.sheet) {
    el.dataset.sheet = pose.sheet;
    el.style.width = `${w}px`;
    el.style.height = `${sheet.h * SCALE}px`;
    el.style.backgroundImage = `url("${sheet.src}")`;
    el.style.backgroundSize = `${sheet.frames * 100}% 100%`;
  }
  el.style.backgroundPosition =
    sheet.frames > 1 ? `${(pose.frame * 100) / (sheet.frames - 1)}% 0` : "0 0";
  el.style.opacity = String(pose.opacity);
  // x is the sprite's centre; mirror in place when running left.
  el.style.transform = `translateX(${pose.x - w / 2}px) scaleX(${pose.flip ? -1 : 1})`;
}

/**
 * A looping gag that plays out along the navbar's bottom border: Luffy runs
 * in, Garp notices him, Luffy flees and Garp chases him off-screen.
 *
 * Purely decorative - pointer-events: none, aria-hidden, hidden below md
 * (where the nav collapses) and not rendered under prefers-reduced-motion.
 */
export function NavbarChase({ active }: { active: boolean }) {
  const [enabled, setEnabled] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const luffyRef = useRef<HTMLDivElement>(null);
  const garpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!reduced.matches);
    update();
    reduced.addEventListener("change", update);
    return () => reduced.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled || !active) return;
    for (const sheet of Object.values(SHEETS)) new Image().src = sheet.src;

    let raf = 0;
    let start = 0;
    function tick(time: number) {
      raf = requestAnimationFrame(tick);
      const stage = stageRef.current;
      const luffy = luffyRef.current;
      const garp = garpRef.current;
      if (!stage || !luffy || !garp) return;
      if (!start) start = time;

      const width = stage.clientWidth;
      const { loop } = sceneAt(0, width);
      const t = ((time - start) / 1000) % loop;
      const scene = sceneAt(t, width);
      applyPose(luffy, scene.luffy);
      applyPose(garp, scene.garp);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, active]);

  if (!enabled) return null;

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-12 overflow-hidden md:block"
    >
      <div
        ref={luffyRef}
        className="absolute bottom-0 left-0 bg-no-repeat opacity-0 will-change-transform"
      />
      <div
        ref={garpRef}
        className="absolute bottom-0 left-0 bg-no-repeat opacity-0 will-change-transform"
      />
    </div>
  );
}
