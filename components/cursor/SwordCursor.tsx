import type { Ref, RefObject } from "react";

// Enma is drawn along a horizontal 100x14 viewBox with the tip at (0, 7),
// then rotated about the tip so it points up-left like an arrow pointer.
// The tip is the hotspot: the anchor element sits exactly on the pointer.
export const SWORD_LENGTH = 44;
export const SWORD_THICKNESS = (SWORD_LENGTH * 14) / 100;
export const SWORD_ANGLE = 38;
// How far the hilt reaches from the tip, for keeping Zoro off the blade.
export const SWORD_REACH = {
  x: SWORD_LENGTH * Math.cos((SWORD_ANGLE * Math.PI) / 180),
  y: SWORD_LENGTH * Math.sin((SWORD_ANGLE * Math.PI) / 180),
};
export const SWORD_GHOSTS = 4;

/**
 * Enma - Zoro's black-and-purple katana: steel blade with a hamon line,
 * gold habaki and lobed tsuba, purple diamond-wrapped tsuka, gold kashira.
 * Rendered once as a <symbol> and <use>d by the sword and every trail ghost.
 */
function EnmaDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <linearGradient id="enma-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f4f8" />
          <stop offset="0.45" stopColor="#b9bcc8" />
          <stop offset="1" stopColor="#5d6070" />
        </linearGradient>
        <linearGradient id="enma-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="0.5" stopColor="#d4a017" />
          <stop offset="1" stopColor="#8a5a00" />
        </linearGradient>
        <pattern id="enma-wrap" width="4" height="5" patternUnits="userSpaceOnUse">
          <rect width="4" height="5" fill="#1a0b24" />
          <path d="M0 2.5 L2 0.4 L4 2.5 L2 4.6 Z" fill="#6b2fa0" />
          <path d="M1.2 2.5 L2 1.6 L2.8 2.5 L2 3.4 Z" fill="#e9d5ff" opacity="0.55" />
        </pattern>
        <symbol id="enma" viewBox="0 0 100 14">
          {/* Blade with a slight sori (curve) toward the tip. */}
          <path
            d="M0 7.2 Q3 4.6 11 4.3 L57 4.4 L57 8.6 L11 8.7 Q4 8.8 0 7.2 Z"
            fill="url(#enma-steel)"
            stroke="#2b2d38"
            strokeWidth="0.4"
          />
          {/* Hamon - the wavy temper line along the edge. */}
          <path
            d="M3 7.6 Q8 6.6 13 7.4 T23 7.3 T33 7.4 T43 7.3 T56 7.3"
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.5"
            opacity="0.7"
          />
          {/* Habaki */}
          <rect x="57" y="3.9" width="3" height="5.2" rx="0.4" fill="url(#enma-gold)" />
          {/* Tsuba - lobed gold guard */}
          <rect
            x="60"
            y="0.8"
            width="3.4"
            height="12.4"
            rx="1.6"
            fill="url(#enma-gold)"
            stroke="#5c3b00"
            strokeWidth="0.4"
          />
          <circle cx="61.7" cy="1.6" r="1.3" fill="url(#enma-gold)" />
          <circle cx="61.7" cy="12.4" r="1.3" fill="url(#enma-gold)" />
          {/* Tsuka - purple diamond ito wrap */}
          <rect
            x="63.4"
            y="4.4"
            width="32"
            height="5.2"
            rx="1"
            fill="url(#enma-wrap)"
            stroke="#0d0512"
            strokeWidth="0.4"
          />
          {/* Kashira */}
          <rect x="95" y="4" width="3.8" height="6" rx="1.4" fill="url(#enma-gold)" />
        </symbol>
      </defs>
    </svg>
  );
}

function Blade() {
  return (
    <svg className="sword-cursor__blade" viewBox="0 0 100 14" aria-hidden="true">
      <use href="#enma" />
    </svg>
  );
}

type SwordCursorProps = {
  ref: Ref<HTMLDivElement>;
  ghostRefs: RefObject<(HTMLDivElement | null)[]>;
  hovering: boolean;
  pressed: boolean;
};

/**
 * Purely presentational: AnimeCursor's rAF loop writes `transform` on the
 * sword and its trail ghosts directly, so moving the pointer never re-renders.
 */
export function SwordCursor({ ref, ghostRefs, hovering, pressed }: SwordCursorProps) {
  const setGhost = (index: number) => (node: HTMLDivElement | null) => {
    ghostRefs.current[index] = node;
  };

  return (
    <>
      <EnmaDefs />
      {Array.from({ length: SWORD_GHOSTS }, (_, i) => (
        <div key={i} ref={setGhost(i)} className="sword-ghost">
          <Blade />
        </div>
      ))}
      <div ref={ref} className="sword-cursor" data-hover={hovering} data-pressed={pressed}>
        <Blade />
      </div>
    </>
  );
}
