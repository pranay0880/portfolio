import type { Ref } from "react";

export type ZoroState = "run" | "stand" | "sleep";

// Frames per strip in public/cursor/zoro-{state}.png. Every strip shares one
// 172x126 cell with feet on the bottom edge, so swapping sheets never shifts
// his size or baseline.
export const ZORO_SHEETS: Record<ZoroState, number> = { run: 8, stand: 7, sleep: 11 };
export const ZORO_HEIGHT = 46;
export const ZORO_WIDTH = Math.round((ZORO_HEIGHT * 172) / 126);

// Bump whenever a strip's pixels change: the file names stay the same, so
// without this browsers keep showing the cached old strip (misaligned
// against the new frame count).
const SHEET_VERSION = 3;
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
};

/**
 * Sprite-sheet Zoro. AnimeCursor drives position, `data-facing`,
 * `data-state` (which sheet is shown), `data-alert` and the sprite frame
 * imperatively from its rAF loop.
 */
export function ZoroRunner({ ref, spriteRef }: ZoroRunnerProps) {
  return (
    <div ref={ref} className="zoro-runner" data-facing="right" data-state="stand" style={sheetVars}>
      <div className="zoro-runner__bob">
        <div ref={spriteRef} className="zoro-runner__sprite" />
      </div>
      <span className="zoro-runner__alert">!</span>
    </div>
  );
}
