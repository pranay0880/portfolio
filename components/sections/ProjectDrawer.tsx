"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Link2, X } from "lucide-react";
import { CaseStudyContent } from "@/components/sections/CaseStudyContent";
import type { ProjectEntry } from "@/lib/content";

type ProjectDrawerProps = {
  project: ProjectEntry | null;
  onClose: () => void;
};

/**
 * Right-hand case-study drawer, with a link to the shareable
 * /projects/<slug> page. Esc / backdrop / close button dismiss it; focus
 * moves into the drawer on open and back to the trigger on close.
 */
export function ProjectDrawer({ project, onClose }: ProjectDrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    const trigger = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      trigger?.focus();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project ? (
        <div className="fixed inset-0 z-[60]">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
            className="border-border bg-background absolute inset-y-0 right-0 flex w-full max-w-xl flex-col border-l shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <header className="border-border flex items-start justify-between gap-4 border-b p-6">
              <div>
                <p className="text-muted-foreground font-mono text-xs tracking-wide uppercase">
                  Case study
                </p>
                <h2 id="case-study-title" className="text-foreground mt-1 text-2xl font-bold">
                  {project.title}
                </h2>
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-muted-foreground hover:text-primary mt-2 inline-flex items-center gap-1.5 font-mono text-xs"
                >
                  <Link2 size={12} aria-hidden="true" />
                  Open as page
                </Link>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close case study"
                className="border-border text-foreground hover:border-primary hover:text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors"
              >
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6">
              <CaseStudyContent project={project} />
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
