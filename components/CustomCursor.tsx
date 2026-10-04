"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { LogoMark } from "@/components/ui/LogoMark";

const INTERACTIVE_SELECTOR = "a, button, [role='button'], input, textarea, select";
// LogoMark is rendered at its full native size and only ever scaled DOWN via
// transform (never up) - upscaling would stretch the already-rasterized mask
// and blur/fade the thin </> strokes, which is what made hover look dimmer
// instead of bolder. Growing on hover means animating back toward scale 1.
const NATIVE_SIZE = 52;
const REST_SCALE = 0.78;
const PRESS_SCALE = 0.6;

/**
 * Replaces the system pointer with the actual </> brand mark (same asset as
 * the navbar LogoMark) on devices that can support it. Position tracks the
 * raw pointer 1:1 - no lag - so clicking small targets stays precise; only
 * scale (hover/press feedback) is spring-animated.
 *
 * Disabled (falls back to the CSS cursor) for touch devices and
 * prefers-reduced-motion, matching the pattern in IntroProvider.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const scale = useSpring(REST_SCALE, { stiffness: 400, damping: 28 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
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

    function handleMove(event: PointerEvent) {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
    }
    function handleOver(event: PointerEvent) {
      setHovering(Boolean((event.target as HTMLElement).closest(INTERACTIVE_SELECTOR)));
    }
    function handleDown() {
      setPressed(true);
    }
    function handleUp() {
      setPressed(false);
    }
    function handleLeaveWindow() {
      cursorX.set(-100);
      cursorY.set(-100);
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerover", handleOver);
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    document.documentElement.addEventListener("pointerleave", handleLeaveWindow);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerover", handleOver);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      document.documentElement.removeEventListener("pointerleave", handleLeaveWindow);
    };
  }, [enabled, cursorX, cursorY]);

  useEffect(() => {
    scale.set(pressed ? PRESS_SCALE : hovering ? 1 : REST_SCALE);
  }, [hovering, pressed, scale]);

  if (!enabled) return null;

  // Bigger alone doesn't read as "bolder" - the stroke weight of the mark
  // stays the same. Stacking a few 1px-offset drop-shadows around it is the
  // classic faux-bold trick (same idea as text-shadow faux bold): it
  // visually thickens the strokes instead of just enlarging them.
  const restFilter = "drop-shadow(0 1px 2px rgb(0 0 0 / 0.35))";
  const boldFilter =
    "drop-shadow(1px 0 0 color-mix(in srgb, var(--primary) 70%, transparent))" +
    "drop-shadow(0 1px 0 color-mix(in srgb, var(--primary) 70%, transparent))" +
    "drop-shadow(0 2px 6px rgb(0 0 0 / 0.35)) ";

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[200] will-change-transform"
      style={{
        x: cursorX,
        y: cursorY,
        scale,
        marginLeft: -NATIVE_SIZE / 2,
        marginTop: -NATIVE_SIZE / 2,
        filter: hovering || pressed ? boldFilter : restFilter,
        transition: "filter 150ms ease-out",
      }}
    >
      <LogoMark size={NATIVE_SIZE} />
    </motion.div>
  );
}
