"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DrawOutlineButton } from "@/components/ui/DrawOutlineButton";
import { characterStats, profile } from "@/lib/content";
import { fadeUp, staggerChildren, viewportOnce } from "@/lib/motion";
import { handleAnchorClick } from "@/lib/scroll";

export function About() {
  return (
    <section id="about" className="scroll-mt-16 py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Character Arc" title="Behind the Code" />

        <div className="grid gap-10 md:grid-cols-[3fr_2fr]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerChildren}
          >
            <motion.div
              variants={fadeUp}
              className="max-w-2xl space-y-4 text-base leading-relaxed text-muted-foreground"
            >
              {profile.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center gap-3">
              {profile.resumeUrl ? (
                <DrawOutlineButton
                  as="a"
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Resume
                  <ExternalLink size={16} />
                </DrawOutlineButton>
              ) : null}
              <DrawOutlineButton as="a" href="#projects" onClick={handleAnchorClick("projects")}>
                View Missions
                <ArrowRight size={16} />
              </DrawOutlineButton>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerChildren}
            className="space-y-3"
          >
            {characterStats.map((item) => (
              <motion.div
                key={item.label}
                variants={fadeUp}
                className="group border rounded-lg border-border bg-surface p-2 hover:border-primary/50 hover:shadow-lg"
              >

                <div className="relative flex items-center justify-between">
                  <p className="relative mt-3 text-sm text-muted-foreground">{item.subtitle}</p>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <item.icon size={12} />
                  </span>
                </div>
                
                <p className="relative mt-2 text-3xl font-bold text-foreground">
                  <span className="text-primary">{item.value}</span>
                  {item.unit ? <> {item.unit}</> : null}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
