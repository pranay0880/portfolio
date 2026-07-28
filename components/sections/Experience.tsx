"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { experience } from "@/lib/content";
import { fadeUp, staggerChildren, viewportOnce } from "@/lib/motion";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-16 py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Experience" title="Where I've worked" />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerChildren}
          className="space-y-6"
        >
          {experience.map((entry) => (
            <motion.div key={`${entry.company}-${entry.period}`} variants={fadeUp}>
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-muted">
                      <Image
                        src={entry.companyLogo}
                        alt={`${entry.company} logo`}
                        fill
                        sizes="48px"
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{entry.role}</h3>
                      <p className="text-sm text-muted-foreground">{entry.company}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {entry.period}
                  </span>
                </div>

                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {entry.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
