"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DrawOutlineButton } from "@/components/ui/DrawOutlineButton";
import { projects, type ProjectEntry } from "@/lib/content";
import { ProjectDrawer } from "@/components/sections/ProjectDrawer";
import { fadeUp, viewportOnce } from "@/lib/motion";

export function Projects() {
  const [open, setOpen] = useState<ProjectEntry | null>(null);
  // Stable so the drawer's effect doesn't re-run (and refocus) on every render.
  const closeDrawer = useCallback(() => setOpen(null), []);

  return (
    <section id="projects" className="scroll-mt-16 py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Quests"
          title="What I built"
          description="Open a case study for the problem, what I owned, the architecture, the key decision and the impact."
        />
      </Container>

      <div className="border-border border-t">
        {projects.map((project, index) => (
          <motion.article
            key={project.title}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className={`border-border border-b ${index % 2 === 1 ? "bg-surface-muted/40" : ""}`}
          >
            <Container>
              <div className="grid gap-10 py-12 sm:grid-cols-2 sm:gap-8 sm:py-16">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="bg-primary inline-block"
                      style={{
                        width: 24,
                        height: 24,
                        WebkitMaskImage: "url(/images/logo-mark-tight.webp)",
                        maskImage: "url(/images/logo-mark-tight.webp)",
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                      }}
                    />
                    <span className="text-muted-foreground font-mono text-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-4 font-mono text-xs tracking-wide uppercase">
                    {project.meta}
                  </p>
                  <h3 className="text-foreground mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mt-4 max-w-md text-base">
                    {project.description}
                  </p>

                  <div className="text-muted-foreground mt-6 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm">
                    {project.stack.map((tech, i) => (
                      <span key={tech} className="flex items-center gap-x-2">
                        {i > 0 ? (
                          <span aria-hidden className="text-primary">
                            |
                          </span>
                        ) : null}
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Headline impact, so the outcome is visible before opening the drawer. */}
                  <p className="border-primary text-foreground mt-5 max-w-md border-l-2 pl-3 text-sm">
                    {project.caseStudy.impact[0]}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <DrawOutlineButton as="button" type="button" onClick={() => setOpen(project)}>
                      <FileText size={16} aria-hidden="true" />
                      Case study
                    </DrawOutlineButton>
                    {project.links ? (
                      project.links.map((link) => (
                        <DrawOutlineButton
                          key={link.url}
                          as="a"
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.label}
                          <ArrowRight size={16} />
                        </DrawOutlineButton>
                      ))
                    ) : project.link ? (
                      <DrawOutlineButton
                        as="a"
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit site
                        <ArrowRight size={16} />
                      </DrawOutlineButton>
                    ) : null}
                  </div>
                </div>

                <div className="relative flex min-h-96 items-start justify-center sm:min-h-full sm:justify-end">
                  <div className="relative w-80 sm:w-96">
                    {project.badge ? (
                      <span className="border-primary text-primary absolute top-0 right-0 -rotate-6 rounded-md border-2 px-3 py-1 font-mono text-xs font-bold tracking-widest uppercase">
                        {project.badge}
                      </span>
                    ) : null}

                    {project.image ? (
                      <div className="relative mt-14 h-48 w-80 -rotate-3 overflow-hidden rounded-sm border-4 border-white shadow-[3px_6px_14px_rgba(0,0,0,0.25)] sm:mt-16 sm:h-64 sm:w-full">
                        <Image
                          src={project.image}
                          alt={`${project.title} screenshot`}
                          fill
                          // Real rendered width, so Next serves a sharp
                          // variant ("100%" isn't a valid sizes value).
                          sizes="(min-width: 640px) 384px, 320px"
                          quality={90}
                          className="object-cover object-top"
                        />
                      </div>
                    ) : null}

                    <div className="absolute top-52 -right-2 w-40 rotate-2 rounded-sm border border-black/10 bg-[#f3dd8c] px-2.5 py-2 text-black/75 shadow-[2px_4px_10px_rgba(0,0,0,0.2)] sm:top-68">
                      <span className="pointer-events-none absolute right-0 bottom-0 h-3 w-3 bg-black/15 [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
                      <p className="text-xs leading-snug italic">&ldquo;{project.quote}&rdquo;</p>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </motion.article>
        ))}
      </div>
      <ProjectDrawer project={open} onClose={closeDrawer} />
    </section>
  );
}
