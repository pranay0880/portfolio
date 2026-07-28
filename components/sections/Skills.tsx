"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { techStack } from "@/lib/content";
import { fadeUp, staggerChildren, viewportOnce } from "@/lib/motion";

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-16 py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Abilities" title="Technologies I work with" />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerChildren}
          className="grid gap-6 sm:grid-cols-2"
        >
          {techStack.map(({ category, icon: Icon, items }) => (
            <motion.div key={category} variants={fadeUp}>
              <Card>
                <div className="mb-4 flex items-center gap-2">
                  <Icon size={20} className="text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">{category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <Badge key={item}>{item}</Badge>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
