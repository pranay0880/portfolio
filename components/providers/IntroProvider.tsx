"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export type IntroStage =
  | "tag"
  | "collapsing"
  | "addSlash"
  | "offsetSlashes"
  | "closeSlashes"
  | "logoReveal"
  | "flying"
  | "done";

export type IntroRect = { top: number; left: number; width: number; height: number };

type IntroContextValue = {
  stage: IntroStage;
  target: IntroRect | null;
  introDone: boolean;
  introReady: boolean;
  replay: () => void;
};

const IntroContext = createContext<IntroContextValue>({
  stage: "done",
  target: null,
  introDone: true,
  introReady: false,
  replay: () => {},
});

export function useIntro() {
  return useContext(IntroContext);
}

const STAGE_ORDER: IntroStage[] = [
  "tag",
  "collapsing",
  "addSlash",
  "offsetSlashes",
  "closeSlashes",
  "logoReveal",
  "flying",
  "done",
];

const STAGE_DELAY: Record<Exclude<IntroStage, "done">, number> = {
  tag: 900,
  collapsing: 500,
  addSlash: 450,
  offsetSlashes: 450,
  closeSlashes: 450,
  logoReveal: 500,
  flying: 750,
};

const INTRO_SEEN_KEY = "intro-seen";

// The intro plays on a visitor's first visit only; later visits and reloads
// skip straight to the page. If storage is blocked (private mode etc.) the
// intro simply plays again.
function hasSeenIntro() {
  try {
    return window.localStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markIntroSeen() {
  try {
    window.localStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {}
}

/**
 * Owns the intro's timing/measurement so it lives in exactly one place:
 * `IntroAnimation` (the overlay) and `Hero` (whose entrance animation
 * should wait for the intro, not play hidden behind the opaque overlay)
 * both read from this context instead of duplicating the state machine.
 *
 * Defaults to "done"/introDone=true - the safe value for SSR and the
 * client's first render (both must match to avoid a hydration mismatch).
 * The effect below only runs client-side, after mount, and flips into the
 * actual intro sequence on a first visit, if reduced-motion isn't set and
 * the real navbar logo (id="site-logo-target") can be measured.
 */
export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState<IntroStage>("done");
  const [target, setTarget] = useState<IntroRect | null>(null);
  const [introReady, setIntroReady] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    document.body.style.overflow = "";
  }, []);

  // Returns false if the intro couldn't start (no logo to fly to).
  const startIntro = useCallback(() => {
    const logoEl = document.getElementById("site-logo-target");
    if (!logoEl) return false;

    clearTimers();
    const rect = logoEl.getBoundingClientRect();
    setTarget({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    setStage("tag");
    markIntroSeen();
    document.body.style.overflow = "hidden";

    let index = 0;

    function advance() {
      index += 1;
      const next = STAGE_ORDER[index];
      setStage(next);
      if (next !== "done") {
        timeoutsRef.current.push(setTimeout(advance, STAGE_DELAY[next]));
      } else {
        document.body.style.overflow = "";
      }
    }

    timeoutsRef.current.push(setTimeout(advance, STAGE_DELAY.tag));
    return true;
  }, [clearTimers]);

  const replay = useCallback(() => {
    // The overlay is fixed, but the flight target is measured in viewport
    // coordinates and the navbar is sticky, so scrolling to top keeps the
    // page behind the intro consistent with the first-visit experience.
    window.scrollTo({ top: 0 });
    startIntro();
  }, [startIntro]);

  useEffect(() => {
    if (hasSeenIntro() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntroReady(true);
      setStage("done");
      return;
    }

    startIntro();
    setIntroReady(true);

    return clearTimers;
  }, [startIntro, clearTimers]);

  return (
    <IntroContext.Provider
      value={{ stage, target, introDone: stage === "done", introReady, replay }}
    >
      {children}
    </IntroContext.Provider>
  );
}
