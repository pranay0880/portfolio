import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export const staggerChildren: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
};

// Positive bottom margin starts the reveal just before content scrolls into
// view, so sections are already visible by the time the reader reaches them.
export const viewportOnce = { once: true, margin: "0px 0px 120px 0px" } as const;
