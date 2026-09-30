"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUp, FileText, Mail, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/ui/LogoMark";
import { DrawOutlineButton } from "@/components/ui/DrawOutlineButton";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { NAV_LINKS } from "@/components/layout/Navbar";
import { profile } from "@/lib/content";
import { handleAnchorClick } from "@/lib/scroll";
import { fadeUp, viewportOnce } from "@/lib/motion";

const CONNECT = [
  { label: "Email", href: `mailto:${profile.email}`, icon: Mail, external: false },
  { label: "LinkedIn", href: profile.social.linkedin, icon: LinkedinIcon, external: true },
  { label: "GitHub", href: profile.social.github, icon: GithubIcon, external: true },
  { label: "Resume", href: profile.resumeUrl, icon: FileText, external: true },
];

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-primary font-mono text-xs font-semibold tracking-[0.2em] uppercase">
      {children}
    </p>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border relative mt-8 overflow-hidden border-t">
      {/* Soft accent glow bleeding in from the top edge. */}
      <div
        aria-hidden
        className="bg-primary/10 pointer-events-none absolute inset-x-0 -top-24 mx-auto h-48 max-w-3xl rounded-full blur-3xl"
      />

      <Container className="relative py-14">
        {/* "To be continued..." - the episode-ending card. */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="border-border bg-surface/60 flex flex-col gap-6 rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
        >
          <div>
            <p className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
              Next episode
            </p>
            <p className="font-anime text-foreground mt-2 text-3xl sm:text-4xl">To be continued…</p>
            <p className="text-muted-foreground mt-2 max-w-md text-sm">
              The next arc needs a co-star. Got a project, role or idea? Let&apos;s write it
              together.
            </p>
          </div>
          <DrawOutlineButton
            as="a"
            href="#contact"
            onClick={handleAnchorClick("contact")}
            className="shrink-0 self-start sm:self-auto"
          >
            Start the next arc
            <ArrowRight size={16} />
          </DrawOutlineButton>
        </motion.div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a
              href="#top"
              onClick={handleAnchorClick("top")}
              className="text-foreground inline-flex items-center gap-2 text-base font-semibold"
            >
              <LogoMark size={32} />
              {profile.name}
            </a>
            <p className="text-muted-foreground mt-3 max-w-xs text-sm">{profile.tagline}</p>
            <div className="text-muted-foreground mt-4 space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-primary" />
                Based in {profile.location}
              </p>
              <p className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Open to opportunities
              </p>
            </div>
          </div>

          {/* Navigate */}
          <nav aria-label="Footer">
            <ColumnTitle>Navigate</ColumnTitle>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={handleAnchorClick(link.id)}
                    className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
                  >
                    <span className="bg-border group-hover:bg-primary h-px w-3 transition-all group-hover:w-5" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div>
            <ColumnTitle>Connect</ColumnTitle>
            <ul className="mt-4 space-y-2.5">
              {CONNECT.map(({ label, href, icon: Icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-2.5 text-sm transition-colors"
                  >
                    <span className="border-border group-hover:border-primary group-hover:text-primary flex h-7 w-7 items-center justify-center rounded-full border transition-colors">
                      <Icon size={13} />
                    </span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-border text-muted-foreground mt-12 flex flex-col-reverse gap-4 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.name}. Crafted with Next.js, Tailwind &amp; a lot of anime.
          </p>
          <a
            href="#top"
            onClick={handleAnchorClick("top")}
            className="group hover:text-primary inline-flex items-center gap-2 self-start font-mono tracking-wide uppercase transition-colors sm:self-auto"
          >
            Back to top
            <span className="border-border group-hover:border-primary flex h-7 w-7 items-center justify-center rounded-full border transition-all group-hover:-translate-y-0.5">
              <ArrowUp size={13} />
            </span>
          </a>
        </div>
      </Container>
    </footer>
  );
}
