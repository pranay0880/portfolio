"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { projects } from "@/lib/content";
import { fadeUp, staggerChildren, viewportOnce } from "@/lib/motion";

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-16 py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Missions" title="Things I've built" />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerChildren}
          className="grid gap-6 sm:grid-cols-2"
        >
          {projects.map((project) => (
            <motion.div key={project.title} variants={fadeUp}>
              <Card className="flex h-full flex-col overflow-hidden p-0">
                <div className="relative h-48 w-full border-b border-border">
                  <Image
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Visit site
                    <ExternalLink size={14} />
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
