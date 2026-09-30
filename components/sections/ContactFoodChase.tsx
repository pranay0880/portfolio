"use client";

import { useEffect, useRef, useState } from "react";

// Sprites: the 8-frame run strip is shared with the navbar chase; the rest
// are single frames cut from the same Luffy sheet (so one SCALE fits all).
const SHEETS = {
  run: { src: "/navbar/luffy-run.png", frames: 8, w: 142, h: 113 },
  alert: { src: "/contact/luffy-alert.png", frames: 1, w: 97, h: 93 },
  dive: { src: "/contact/luffy-dive.png", frames: 1, w: 129, h: 64 },
} as const;
type SheetKey = keyof typeof SHEETS;
const MEAT = { src: "/contact/meat.png", w: 75, h: 46 };

// Source art -> on-screen px (Luffy ~34px tall); the meat is drawn larger
// than life so it reads at this size.
const SCALE = 0.3;
const MEAT_SCALE = 0.42;

// Timeline (seconds, px/s).
const JOG_SPEED = 110;
const SPRINT_SPEED = 240;
const EXIT_SPEED = 200;
const ALERT_TIME = 0.7;
const DIVE_TIME = 0.4;
const DIVE_LIFT = 10;
const REST = 2.2;
const RUN_FPS = 12;

type Pose = { sheet: SheetKey; frame: number; x: number; lift: number; visible: boolean };
type Scene = { luffy: Pose; meat: { x: number; visible: boolean; pop: number }; loop: number };

/** Pure function of loop time: where Luffy and the meat are. */
function sceneAt(t: number, width: number): Scene {
  const meatX = width * 0.8;
  const start = -50;
  const noticeX = width * 0.3;
  const diveFrom = meatX - 70;
  const exitX = width + 60;

  const jogEnd = (noticeX - start) / JOG_SPEED;
  const alertEnd = jogEnd + ALERT_TIME;
  const sprintEnd = alertEnd + (diveFrom - noticeX) / SPRINT_SPEED;
  const diveEnd = sprintEnd + DIVE_TIME;
  const exitEnd = diveEnd + (exitX - meatX) / EXIT_SPEED;
  const loop = exitEnd + REST;
  const run = (clock: number) => Math.floor(clock * RUN_FPS) % SHEETS.run.frames;

  const meatBack = Math.min(1, Math.max(0, (t - (loop - REST + 0.8)) / 0.3));
  let luffy: Pose;
  let meat = { x: meatX, visible: true, pop: 1 };

  if (t < jogEnd) {
    luffy = { sheet: "run", frame: run(t), x: start + t * JOG_SPEED, lift: 0, visible: true };
  } else if (t < alertEnd) {
    // Spots the meat: "!"
    luffy = { sheet: "alert", frame: 0, x: noticeX, lift: 0, visible: true };
  } else if (t < sprintEnd) {
    const c = t - alertEnd;
    luffy = {
      sheet: "run",
      frame: run(c * 1.5),
      x: noticeX + c * SPRINT_SPEED,
      lift: 0,
      visible: true,
    };
  } else if (t < diveEnd) {
    // Leaps onto it in a shallow arc.
    const p = (t - sprintEnd) / DIVE_TIME;
    luffy = {
      sheet: "dive",
      frame: 0,
      x: diveFrom + (meatX - diveFrom) * p,
      lift: Math.sin(p * Math.PI) * DIVE_LIFT,
      visible: true,
    };
    meat = { x: meatX, visible: p < 0.85, pop: 1 };
  } else if (t < exitEnd) {
    // Meat's gone - he trots off happy.
    const c = t - diveEnd;
    luffy = { sheet: "run", frame: run(c), x: meatX + c * EXIT_SPEED, lift: 0, visible: true };
    meat = { x: meatX, visible: false, pop: 0 };
  } else {
    // Rest; a fresh piece of meat pops back in.
    luffy = { sheet: "run", frame: 0, x: exitX, lift: 0, visible: false };
    meat = { x: meatX, visible: meatBack > 0, pop: meatBack };
  }
  return { luffy, meat, loop };
}

/**
 * A looping gag on the top edge of the contact form card: Luffy jogs along,
 * spots a piece of meat, sprints and dives for it, then runs off happy.
 *
 * Decorative only: aria-hidden, pointer-events: none, only animates while
 * the card is on screen, and not rendered under prefers-reduced-motion.
 */
export function ContactFoodChase() {
  const [enabled, setEnabled] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const luffyRef = useRef<HTMLDivElement>(null);
  const meatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!reduced.matches);
    update();
    reduced.addEventListener("change", update);
    return () => reduced.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!enabled || !stage) return;
    for (const sheet of Object.values(SHEETS)) new Image().src = sheet.src;
    new Image().src = MEAT.src;

    let inView = false;
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    observer.observe(stage);

    let raf = 0;
    let elapsed = 0;
    let last = 0;
    function tick(time: number) {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min((time - last) / 1000, 0.05) : 0;
      last = time;
      const luffy = luffyRef.current;
      const meat = meatRef.current;
      if (!stage || !luffy || !meat || !inView) return;
      // Only advance while visible, so the gag starts from the top when you
      // scroll to it.
      elapsed += dt;

      const width = stage.clientWidth;
      const { loop } = sceneAt(0, width);
      const scene = sceneAt(elapsed % loop, width);

      const pose = scene.luffy;
      const sheet = SHEETS[pose.sheet];
      const w = sheet.w * SCALE;
      if (luffy.dataset.sheet !== pose.sheet) {
        luffy.dataset.sheet = pose.sheet;
        luffy.style.width = `${w}px`;
        luffy.style.height = `${sheet.h * SCALE}px`;
        luffy.style.backgroundImage = `url("${sheet.src}")`;
        luffy.style.backgroundSize = `${sheet.frames * 100}% 100%`;
      }
      luffy.style.backgroundPosition =
        sheet.frames > 1 ? `${(pose.frame * 100) / (sheet.frames - 1)}% 0` : "0 0";
      luffy.style.opacity = pose.visible ? "1" : "0";
      luffy.style.transform = `translate(${pose.x - w / 2}px, ${-pose.lift}px)`;

      const mw = MEAT.w * MEAT_SCALE;
      meat.style.opacity = scene.meat.visible ? "1" : "0";
      meat.style.transform = `translateX(${scene.meat.x - mw / 2}px) scale(${0.4 + 0.6 * scene.meat.pop})`;
    }
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-full h-14 overflow-hidden"
    >
      <div
        ref={meatRef}
        className="absolute bottom-0 left-0 origin-bottom bg-contain bg-no-repeat opacity-0"
        style={{
          width: MEAT.w * MEAT_SCALE,
          height: MEAT.h * MEAT_SCALE,
          backgroundImage: `url("${MEAT.src}")`,
        }}
      />
      <div
        ref={luffyRef}
        className="absolute bottom-0 left-0 bg-no-repeat opacity-0 will-change-transform"
      />
    </div>
  );
}
