"use client";

import { createContext, useContext, useEffect, useState } from "react";

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
};

const IntroContext = createContext<IntroContextValue>({
  stage: "done",
  target: null,
  introDone: true,
  introReady: false,
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

/**
 * Owns the intro's timing/measurement so it lives in exactly one place:
 * `IntroAnimation` (the overlay) and `Hero` (whose entrance animation
 * should wait for the intro, not play hidden behind the opaque overlay)
 * both read from this context instead of duplicating the state machine.
 *
 * Defaults to "done"/introDone=true — the safe value for SSR and the
 * client's first render (both must match to avoid a hydration mismatch).
 * The effect below only runs client-side, after mount, and flips into the
 * actual intro sequence if reduced-motion isn't set and the real navbar
 * logo (id="site-logo-target") can be measured.
 */
export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState<IntroStage>("done");
  const [target, setTarget] = useState<IntroRect | null>(null);
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntroReady(true);
      setStage("done");
      return;
    }

    const logoEl = document.getElementById("site-logo-target");
    if (!logoEl) {
      setIntroReady(true);
      setStage("done");
      return;
    }

    const rect = logoEl.getBoundingClientRect();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time DOM measurement at mount, not a prop/state sync
    setTarget({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    setStage("tag");
    setIntroReady(true);
    document.body.style.overflow = "hidden";

    let index = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    function advance() {
      index += 1;
      const next = STAGE_ORDER[index];
      setStage(next);
      if (next !== "done") {
        timeouts.push(setTimeout(advance, STAGE_DELAY[next]));
      } else {
        document.body.style.overflow = "";
      }
    }

    timeouts.push(setTimeout(advance, STAGE_DELAY.tag));

    return () => {
      timeouts.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <IntroContext.Provider
      value={{ stage, target, introDone: stage === "done", introReady }}
    >
      {children}
    </IntroContext.Provider>
  );
}
