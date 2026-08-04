"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { DrawOutlineButton } from "@/components/ui/DrawOutlineButton";
import { profile } from "@/lib/content";
import { fadeUp, staggerChildren } from "@/lib/motion";
import { handleAnchorClick } from "@/lib/scroll";
import { useIntro } from "@/components/providers/IntroProvider";

export function Hero() {
  const { introDone } = useIntro();
  const show = introDone ? "show" : "hidden";

  return (
    <section id="top" className="pt-16 sm:pt-24">
      <Container className="grid items-center gap-10 py-12 sm:py-20 md:grid-cols-[3fr_2fr]">
        <motion.div initial="hidden" animate={show} variants={staggerChildren}>
          <motion.h1
            variants={fadeUp}
            className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl"
          >
            {profile.name}
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-3 text-xl font-medium text-primary">
            {profile.tagline}
          </motion.p>
          <motion.p variants={fadeUp} className="mt-4 max-w-xl text-lg text-muted-foreground">
            {profile.summary}
          </motion.p>

          <motion.p variants={fadeUp} className="mt-6 text-sm text-muted-foreground">
            {profile.availability}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-4 flex flex-wrap items-center gap-3">
            <DrawOutlineButton as="a" href="#contact" onClick={handleAnchorClick("contact")}>
              Get in touch
              <ArrowDown size={16} />
            </DrawOutlineButton>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={introDone ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="justify-self-center"
        >
          <div className="relative h-64 w-64 sm:h-80 sm:w-80">
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <Image
                src={profile.photo}
                alt={`${profile.name} portrait`}
                fill
                sizes="(min-width: 640px) 320px, 256px"
                className="object-cover"
                priority
              />
            </div>
            
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
