import type { Ref } from "react";

export type ZoroState = "run" | "stand" | "sleep" | "walk" | "lost" | "turn" | "stop";

// Frames per strip in public/cursor/zoro-{state}.png. Every strip is drawn at
// the same scale with feet on the bottom edge, so swapping sheets never
// shifts his size or baseline. run/sleep use 172x126 cells; the rest use
// 172x150 cells (extra headroom for the "?" marks) - see cursor.css.
export const ZORO_SHEETS: Record<ZoroState, number> = {
  run: 8,
  stand: 6,
  sleep: 11,
  walk: 8,
  lost: 4,
  turn: 3,
  stop: 2,
};
export const ZORO_HEIGHT = 46;
export const ZORO_WIDTH = Math.round((ZORO_HEIGHT * 172) / 126);

// Bump whenever a strip's pixels change: the file names stay the same, so
// without this browsers keep showing the cached old strip (misaligned
// against the new frame count).
const SHEET_VERSION = 6;
export const zoroSheetUrl = (state: ZoroState) => `/cursor/zoro-${state}.png?v=${SHEET_VERSION}`;

const sheetVars = Object.fromEntries(
  (Object.keys(ZORO_SHEETS) as ZoroState[]).map((state) => [
    `--zoro-sheet-${state}`,
    `url("${zoroSheetUrl(state)}")`,
  ]),
) as React.CSSProperties;

type ZoroRunnerProps = {
  ref: Ref<HTMLDivElement>;
  spriteRef: Ref<HTMLDivElement>;
  /** Speech-bubble glyph shown while `data-alert` is true. */
  alertText?: string;
};

/**
 * Sprite-sheet Zoro. LostZoro drives position, `data-facing`,
 * `data-state` (which sheet is shown), `data-alert` and the sprite frame
 * imperatively from its rAF loop.
 */
export function ZoroRunner({ ref, spriteRef, alertText = "!" }: ZoroRunnerProps) {
  return (
    <div ref={ref} className="zoro-runner" data-facing="right" data-state="stand" style={sheetVars}>
      <div className="zoro-runner__bob">
        <div ref={spriteRef} className="zoro-runner__sprite" />
      </div>
      <span className="zoro-runner__alert">{alertText}</span>
    </div>
  );
}
