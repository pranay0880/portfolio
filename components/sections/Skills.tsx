"use client";

import { Caveat } from "next/font/google";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { techStack, type TechCategory } from "@/lib/content";
import { fadeUp, staggerChildren, viewportOnce } from "@/lib/motion";

const caveat = Caveat({ subsets: ["latin"], weight: ["600", "700"] });

const GRAIN_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E";

const PAPER_TONES = [
  { base: "#f3dd8c", grain: "rgba(90,70,10,0.5)" },
  { base: "#e9b9ae", grain: "rgba(90,30,20,0.4)" },
  { base: "#cfe0c9", grain: "rgba(30,60,20,0.4)" },
] as const;

// deterministic per-card variation so the board reads as pinned-up, not templated
const NOTE_LAYOUT = [
  { rotate: -7, offset: "sm:mt-3 sm:-ml-1", pin: "pin" as const, width: "sm:w-[19rem]" },
  { rotate: 5, offset: "sm:mt-10 sm:-ml-6", pin: "tape" as const, width: "sm:w-[17rem]" },
  { rotate: -4, offset: "sm:-mt-2 sm:ml-2", pin: "pin" as const, width: "sm:w-[18.5rem]" },
  { rotate: 6, offset: "sm:mt-6 sm:-ml-8", pin: "tape" as const, width: "sm:w-[17.5rem]" },
  { rotate: -5, offset: "sm:mt-0 sm:-ml-3", pin: "pin" as const, width: "sm:w-[18rem]" },
];

const DUST = [
  { top: "12%", left: "8%", size: 5, duration: 9 },
  { top: "68%", left: "18%", size: 3, duration: 7 },
  { top: "30%", left: "42%", size: 4, duration: 10 },
  { top: "80%", left: "55%", size: 3, duration: 8 },
  { top: "18%", left: "72%", size: 4, duration: 11 },
  { top: "55%", left: "88%", size: 5, duration: 9 },
  { top: "92%", left: "34%", size: 3, duration: 7.5 },
  { top: "40%", left: "95%", size: 3, duration: 8.5 },
];

function getRank(level: number) {
  if (level >= 95) return "S+";
  if (level >= 85) return "S";
  if (level >= 75) return "A";
  if (level >= 65) return "B";
  return "C";
}

function Pin() {
  return (
    <span className="absolute -top-3 left-1/2 z-20 h-6 w-6 -translate-x-1/2 rounded-full border border-black/20 bg-[radial-gradient(circle_at_35%_30%,#ff9d9d,var(--color-primary)_55%,#5c0f0f_100%)] shadow-[0_3px_5px_rgba(0,0,0,0.4)]">
      <span className="absolute top-1 left-1.5 h-1.5 w-1.5 rounded-full bg-white/80" />
    </span>
  );
}

function Tape() {
  return (
    <span className="absolute -top-3 left-1/2 z-20 h-6 w-16 -translate-x-1/2 -rotate-2 border border-black/5 bg-foreground/10 shadow-sm backdrop-blur-[1px]" />
  );
}

function StickyNote({
  category,
  icon: Icon,
  level,
  quote,
  items,
  index,
}: TechCategory & { index: number }) {
  const layout = NOTE_LAYOUT[index % NOTE_LAYOUT.length];
  const paper = PAPER_TONES[index % PAPER_TONES.length];
  const rank = getRank(level);

  return (
    <motion.div
      variants={fadeUp}
      className={`relative w-[85%] shrink-0 snap-start sm:w-auto ${layout.offset}`}
      style={{ zIndex: index + 1 }}
    >
      {layout.pin === "pin" ? <Pin /> : <Tape />}

      <motion.div
        className={`relative overflow-hidden rounded-[2px] p-6 pt-8 text-black/80 ${layout.width}`}
        style={{
          rotate: layout.rotate,
          transformOrigin: "50% 4%",
          backgroundColor: paper.base,
          backgroundImage: `radial-gradient(ellipse at 50% 10%, rgba(255,255,255,0.5), transparent 55%), repeating-linear-gradient(90deg, rgba(0,0,0,0.045) 0px, transparent 1.5px, transparent 4px), url(${GRAIN_URI}), radial-gradient(circle at 50% 50%, transparent 50%, rgba(0,0,0,0.22) 100%)`,
          boxShadow: "3px 6px 10px rgba(0,0,0,0.25)",
        }}
        whileHover={{ rotate: 0, y: -10, scale: 1.04, boxShadow: "6px 22px 30px rgba(0,0,0,0.4)" }}
        transition={{ type: "spring", stiffness: 180, damping: 9 }}
      >
        {/* fold shadow */}
        <span className="pointer-events-none absolute right-0 bottom-0 z-10 h-10 w-10 bg-black/25 blur-[3px] [clip-path:polygon(100%_25%,100%_100%,25%_100%)]" />
        {/* folded flap */}
        <span
          className="pointer-events-none absolute right-0 bottom-0 z-10 h-8 w-8 [clip-path:polygon(100%_0,100%_100%,0_100%)]"
          style={{
            background:
              "linear-gradient(315deg, rgba(255,255,255,0.55), rgba(0,0,0,0.12) 70%)",
            boxShadow: "-2px -2px 6px rgba(0,0,0,0.25)",
          }}
        />

        <div className="relative mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon size={18} className="text-black/70" />
            <h3 className={`${caveat.className} text-2xl leading-none font-bold`}>{category}</h3>
          </div>
          <span
            className={`${caveat.className} flex h-11 w-11 shrink-0 rotate-6 items-center justify-center rounded-full border-2 border-black/30 text-xl font-bold text-black/70`}
            style={{ boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.08)" }}
          >
            {rank}
          </span>
        </div>

        <ul className="relative mb-4 space-y-1">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-1.5 text-sm text-black/80">
              <span className="mt-1 text-black/60">✓</span>
              {item}
            </li>
          ))}
        </ul>

        <p className={`${caveat.className} relative text-lg leading-tight text-black/70`}>
          &ldquo;{quote}&rdquo;
        </p>
      </motion.div>
    </motion.div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-16 py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Skill Progression"
          title="Technologies I work with"
          description="Pinned up like notes on my wall — the stack, the current rank, and the motto that keeps me grinding."
        />

        <div className="relative overflow-hidden rounded-2xl border border-border bg-[radial-gradient(circle,var(--color-border)_1px,transparent_1px)] bg-[length:18px_18px] p-6 sm:p-10">
          {DUST.map((d, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="pointer-events-none absolute rounded-full bg-foreground/40 blur-[1px]"
              style={{ top: d.top, left: d.left, width: d.size, height: d.size }}
              animate={{ y: [0, -16, 0], opacity: [0.1, 0.45, 0.1] }}
              transition={{ duration: d.duration, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
            />
          ))}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -z-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
            animate={{ x: ["-10%", "60%", "-10%"], y: ["0%", "40%", "0%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerChildren}
            className="relative -mx-4 flex snap-x snap-mandatory gap-8 overflow-x-auto px-4 pt-3 pb-4 sm:mx-0 sm:flex-wrap sm:gap-x-4 sm:gap-y-2 sm:overflow-visible sm:px-2 sm:pb-6"
          >
            {techStack.map((entry, index) => (
              <StickyNote key={entry.category} {...entry} index={index} />
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
