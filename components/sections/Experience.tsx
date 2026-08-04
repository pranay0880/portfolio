"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { currentlyBuilding, timeline, type TimelineNode } from "@/lib/content";
import { fadeUp, staggerChildren, viewportOnce } from "@/lib/motion";

function ChipRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
      <span className="text-sm font-medium text-muted-foreground">{label}:</span>
      {items.map((item, i) => (
        <span key={item} className={i > 0 ? "border-l-2 border-primary pl-3" : ""}>
          {item}
        </span>
      ))}
    </div>
  );
}

function TimelineRow({ node, index }: { node: TimelineNode; index: number }) {
  const projectsHaveBlurb = node.projects?.some((p) => p.blurb);

  return (
    <motion.div variants={fadeUp} className="relative pl-20 sm:pl-24">
      <span className="absolute top-0.5 left-0 w-12 text-right font-mono text-xs text-muted-foreground sm:w-16">
        {node.year}
      </span>

      <motion.span
        className="absolute top-1 left-[52px] h-3 w-3 sm:left-[68px]"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={viewportOnce}
        transition={{ type: "spring", stiffness: 260, damping: 14, delay: index * 0.15 }}
      >
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full border-2 border-primary bg-background"
          whileHover={{ scale: 1.35 }}
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(189,68,68,0.4)",
              "0 0 0 6px rgba(189,68,68,0)",
            ],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: index * 0.5 + 0.6 }}
        />
      </motion.span>

      <h3 className="text-xl font-semibold text-foreground sm:text-2xl">{node.title}</h3>
      {node.role ? <p className="mt-0.5 text-sm text-muted-foreground">{node.role}</p> : null}
      {node.scope ? (
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">{node.scope}</p>
      ) : null}

      {node.projects ? (
        projectsHaveBlurb ? (
          <div className="mt-2 space-y-1">
            {node.projects.map((project) => (
              <p key={project.name} className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{project.name}</span>
                {project.blurb ? <> — {project.blurb}</> : null}
              </p>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            {node.projects.map((p) => p.name).join(" · ")}
          </p>
        )
      ) : null}

      {node.bullets ? (
        <ul className="mt-2 max-w-xl list-disc space-y-1 pl-4 text-sm text-muted-foreground">
          {node.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}

      {node.stack ? <ChipRow label="Stack" items={node.stack} /> : null}
      {node.focus ? <ChipRow label="Focus" items={node.focus} /> : null}
    </motion.div>
  );
}

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  return (
    <section id="experience" className="scroll-mt-16 py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Experience"
          title="Building, Shipping, Growing."
          description="From self-directed learning to production applications and full-stack ownership."
        />

        <div ref={containerRef} className="relative">
          <div
            aria-hidden
            className="absolute top-0 bottom-0 left-[56px] w-1 rounded-full bg-border sm:left-[72px]"
          />
          <motion.div
            aria-hidden
            className="absolute top-0 left-[56px] w-1 origin-top rounded-full bg-primary/40 blur-[4px] sm:left-[72px]"
            style={{ scaleY: scrollYProgress, height: "100%" }}
          />
          <motion.div
            aria-hidden
            className="absolute top-0 left-[56px] w-1 origin-top overflow-hidden rounded-full bg-gradient-to-b from-primary/50 to-primary sm:left-[72px]"
            style={{ scaleY: scrollYProgress, height: "100%" }}
          >
            <motion.span
              aria-hidden
              className="absolute left-1/2 h-20 w-3 -translate-x-1/2 rounded-full bg-primary/80 blur-[6px]"
              animate={{ top: ["-8%", "100%"] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              aria-hidden
              className="absolute left-1/2 h-20 w-3 -translate-x-1/2 rounded-full bg-primary/80 blur-[6px]"
              animate={{ top: ["-8%", "100%"] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerChildren}
            className="space-y-12"
          >
            {timeline.map((node, index) => (
              <TimelineRow key={`${node.year}-${node.title}`} node={node} index={index} />
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="relative mt-8 pl-20 sm:pl-24"
          >
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown size={14} className="text-primary" />
              </motion.span>
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                {currentlyBuilding.label}
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
