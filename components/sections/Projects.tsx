"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DrawOutlineButton } from "@/components/ui/DrawOutlineButton";
import { projects } from "@/lib/content";
import { fadeUp, viewportOnce } from "@/lib/motion";

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-16 py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Missions" title="Things I've built" />
      </Container>

      <div className="border-t border-border">
        {projects.map((project, index) => (
          <motion.article
            key={project.title}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className={`border-b border-border ${index % 2 === 1 ? "bg-surface-muted/40" : ""}`}
          >
            <Container>
              <div className="grid gap-10 py-12 sm:grid-cols-2 sm:gap-8 sm:py-16">
                <div>
                  <span className="font-mono text-sm text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-4 font-mono text-xs tracking-wide text-muted-foreground uppercase">
                    {project.meta}
                  </p>
                  <h3 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                    {project.title}
                  </h3>
                  <p className="mt-4 max-w-md text-base text-muted-foreground">
                    {project.description}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-muted-foreground">
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

                  <DrawOutlineButton
                    as="a"
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8"
                  >
                    Visit site
                    <ArrowRight size={16} />
                  </DrawOutlineButton>
                </div>

                <div className="relative flex items-start justify-center sm:justify-end">
                  {project.badge ? (
                    <span className="absolute top-0 right-6 -rotate-6 rounded-md border-2 border-primary px-3 py-1 text-xs font-bold tracking-widest text-primary uppercase sm:right-16">
                      {project.badge}
                    </span>
                  ) : null}

                  {project.image ? (
                    <div className="relative mt-14 h-40 w-56 -rotate-3 overflow-hidden rounded-sm border-4 border-white shadow-[3px_6px_14px_rgba(0,0,0,0.25)] sm:mt-16 sm:mr-10">
                      <Image
                        src={project.image}
                        alt={`${project.title} screenshot`}
                        fill
                        sizes="224px"
                        className="object-cover"
                      />
                    </div>
                  ) : null}

                  <div className="absolute top-24 right-0 w-52 rotate-2 rounded-sm border border-black/10 bg-[#f3dd8c] p-4 text-black/80 shadow-[2px_4px_10px_rgba(0,0,0,0.2)] sm:top-32">
                    <span className="pointer-events-none absolute right-0 bottom-0 h-5 w-5 bg-black/15 [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
                    <p className="text-sm leading-snug italic">&ldquo;{project.quote}&rdquo;</p>
                  </div>
                </div>
              </div>
            </Container>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
