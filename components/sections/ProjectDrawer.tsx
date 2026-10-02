"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import type { ProjectEntry } from "@/lib/content";

const SECTIONS = [
  { key: "problem", label: "Problem" },
  { key: "ownership", label: "What I owned" },
  { key: "architecture", label: "Architecture" },
  { key: "decision", label: "Key decision" },
  { key: "impact", label: "Impact" },
] as const;

type ProjectDrawerProps = {
  project: ProjectEntry | null;
  onClose: () => void;
};

/**
 * Right-hand case-study drawer: problem -> ownership -> architecture ->
 * key decision -> impact. Esc / backdrop / close button dismiss it; focus
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
              <dl className="space-y-6">
                {SECTIONS.map(({ key, label }) => {
                  const value = project.caseStudy[key];
                  return (
                    <div key={key}>
                      <dt className="text-primary font-mono text-xs font-semibold tracking-wider uppercase">
                        {/* "Key decision" -> "Key decisions" when there are several. */}
                        {Array.isArray(value) && value.length > 1 && key === "decision"
                          ? `${label}s`
                          : label}
                      </dt>
                      <dd className="text-foreground/90 mt-2 text-sm leading-relaxed">
                        {Array.isArray(value) ? (
                          <ul className="list-disc space-y-1.5 pl-4">
                            {value.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>{value}</p>
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>

              <div className="border-border mt-8 border-t pt-6">
                <p className="text-muted-foreground font-mono text-xs font-semibold tracking-wider uppercase">
                  Stack
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="border-border text-muted-foreground rounded-full border px-2.5 py-0.5 font-mono text-[11px]"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>

              {project.links || project.link ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  {(project.links ?? [{ label: "Visit site", url: project.link! }]).map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary inline-flex items-center gap-1.5 font-mono text-sm hover:underline"
                    >
                      {link.label}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
