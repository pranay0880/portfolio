"use client";

import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/lib/content";
import { LogoMark } from "@/components/ui/LogoMark";
import { useIntro } from "@/components/providers/IntroProvider";

const CLONE_SIZE = 96;

/**
 * A one-time intro: `<Pranay Dasari/>` loses the name down to `</>`, gains a
 * second slash and offsets both vertically (first up, second down) while
 * spreading them apart horizontally (`</  />`), then closes that gap to
 * form the tight `<//>` mark, cross-fades into the actual logo image, then
 * flies from center-screen to wherever the real navbar logo
 * (id="site-logo-target") already sits — measured via getBoundingClientRect
 * rather than a cross-component shared layoutId, so the target is exact and
 * doesn't depend on the Navbar's logo ever being unmounted (it's rendered
 * the whole time, just visually covered by this opaque overlay until the
 * very end, whose own fade-out is what reads as the navbar "fading into
 * view").
 */
export function IntroAnimation() {
  const { stage, target } = useIntro();

  const active = stage !== "done" && target !== null;

  const showText =
    stage === "tag" ||
    stage === "collapsing" ||
    stage === "addSlash" ||
    stage === "offsetSlashes" ||
    stage === "closeSlashes";
  const offsetSlashes =
    stage === "offsetSlashes" ||
    stage === "closeSlashes" ||
    stage === "logoReveal" ||
    stage === "flying";
  // Once the slash pair opens up horizontally, keep that spacing through the
  // later stages instead of snapping back when the stage advances.
  const slashesSpread =
    stage === "offsetSlashes" ||
    stage === "closeSlashes" ||
    stage === "logoReveal" ||
    stage === "flying";
  const showLogo = stage === "logoReveal" || stage === "flying";
  const isFlying = stage === "flying";

  const initialCloneRect =
    typeof window !== "undefined"
      ? {
          top: window.innerHeight / 2 - CLONE_SIZE / 2,
          left: window.innerWidth / 2 - CLONE_SIZE / 2,
          width: CLONE_SIZE,
          height: CLONE_SIZE,
        }
      : { top: 0, left: 0, width: CLONE_SIZE, height: CLONE_SIZE };

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence>
            {showText ? (
              <motion.div
                key="text-logo"
                layout
                className="flex items-baseline font-mono text-4xl font-medium sm:text-5xl"
                exit={{ opacity: 0, scale: 1.15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <motion.span
                  layout
                  animate={{ x: slashesSpread ? 10 : 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="inline-flex items-baseline text-primary"
                >
                  <span>&lt;</span>

                  <motion.span
                    layout
                    animate={{ y: offsetSlashes ? -14 : 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="inline-block"
                  >
                    /
                  </motion.span>
                </motion.span>

                {stage === "tag" ? (
                  <motion.span
                    layout
                    className="px-1 text-foreground"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {profile.name}
                  </motion.span>
                ) : null}

                <motion.span
                  layout
                  animate={{ x: slashesSpread ? -10 : 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="inline-flex items-baseline text-primary"
                >
                  {stage === "addSlash" || offsetSlashes ? (
                    <motion.span
                      layout
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: offsetSlashes ? 14 : 0,
                      }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="inline-block"
                    >
                      /
                    </motion.span>
                  ) : null}

                  <span>&gt;</span>
                </motion.span>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {showLogo && target ? (
            <motion.div
              className="fixed"
              style={{ color: "var(--primary)" }}
              initial={{
                top: initialCloneRect.top,
                left: initialCloneRect.left,
                width: initialCloneRect.width,
                height: initialCloneRect.height,
                opacity: 0,
              }}
              animate={
                isFlying
                  ? {
                      top: target.top,
                      left: target.left,
                      width: target.width,
                      height: target.height,
                      opacity: 1,
                    }
                  : { ...initialCloneRect, opacity: 1 }
              }
              transition={{ duration: isFlying ? 0.7 : 0.4, ease: "easeInOut" }}
            >
              <LogoMark size="100%" />
            </motion.div>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
