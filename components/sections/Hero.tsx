"use client";

import Image from "next/image";
import localFont from "next/font/local";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { DrawOutlineButton } from "@/components/ui/DrawOutlineButton";
import { profile } from "@/lib/content";
import { fadeUp, staggerChildren } from "@/lib/motion";
import { handleAnchorClick } from "@/lib/scroll";

// Display face for the name only. "Japan Ramen" by Maknastudio - free for
// personal use; a commercial licence is needed for commercial/promotional use.
const japanRamen = localFont({
  src: "../../app/fonts/japan-ramen.otf",
  display: "swap",
  fallback: ["Miyukatsu", "Arial", "sans-serif"],
});

export function Hero() {
  return (
    <section id="top" className="pt-4 sm:pt-8">
      <Container className="grid items-center gap-10 py-12 sm:py-20 md:grid-cols-[3fr_2fr] md:items-start">
        <motion.div initial="hidden" animate="show" variants={staggerChildren}>
          <motion.h1
            variants={fadeUp}
            className={`${japanRamen.className} text-foreground text-5xl`}
          >
            {profile.name}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-primary mt-3 text-xl font-medium">
            {profile.tagline}
          </motion.p>
          <motion.p variants={fadeUp} className="text-muted-foreground mt-4 max-w-xl text-lg">
            {profile.summary}
          </motion.p>

          {/* Proof points - each one is backed by a project / architecture case. */}
          <motion.ul
            variants={fadeUp}
            aria-label="Highlights"
            className="mt-6 flex max-w-xl flex-wrap gap-2"
          >
            {profile.highlights.map((item) => (
              <li
                key={item}
                className="border-border text-foreground/85 rounded-full border px-3 py-1 font-mono text-xs"
              >
                {item}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={fadeUp} className="mt-4 flex flex-wrap items-center gap-3">
            <DrawOutlineButton as="a" href="#contact" onClick={handleAnchorClick("contact")}>
              Get in touch
              <ArrowDown size={16} />
            </DrawOutlineButton>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="justify-self-center"
        >
          <div className="relative h-64 w-64 sm:h-80 sm:w-80">
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              {/* Theme picks the portrait in CSS, so there's no flash of the
                  wrong one before the theme script runs. */}
              <Image
                src={profile.photoLight}
                alt={`${profile.name} portrait`}
                fill
                sizes="(min-width: 640px) 320px, 256px"
                className="object-cover dark:hidden"
                priority
              />
              <Image
                src={profile.photo}
                alt={`${profile.name} portrait`}
                fill
                sizes="(min-width: 640px) 320px, 256px"
                className="hidden object-cover dark:block"
                priority
              />
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
