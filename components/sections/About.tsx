"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile } from "@/lib/content";
import { fadeUp, viewportOnce } from "@/lib/motion";

export function About() {
  return (
    <section id="about" className="scroll-mt-16 py-16 sm:py-24">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <SectionHeading eyebrow="Character Arc" title="Behind the Code" />
          <div className="max-w-2xl space-y-4 text-base leading-relaxed text-muted-foreground">
            {profile.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
