"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LogoMark } from "@/components/ui/LogoMark";
import { profile } from "@/lib/content";
import { handleAnchorClick } from "@/lib/scroll";
import { useIntro } from "@/components/providers/IntroProvider";

const NAV_LINKS = [
  { id: "about", label: "Character" },
  { id: "skills", label: "Abilities" },
  { id: "projects", label: "Missions" },
    { id: "experience", label: "Experience" },
  { id: "contact", label: "Portal" },
];

export function Navbar() {
  const { introDone, introReady } = useIntro();
  const [activeId, setActiveId] = useState<string>("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const showNavbar = introReady && introDone;

  useEffect(() => {
    // "top" (the Hero section) is observed too, even though it has no nav
    // link — otherwise activeId has nothing to reset it back to "top" once
    // you scroll back up, and the last real section stays stuck as active.
    const sections = ["top", ...NAV_LINKS.map((link) => link.id)]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((section) => observerRef.current?.observe(section));

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <motion.header
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur"
      initial={false}
      animate={showNavbar ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      aria-hidden={!showNavbar}
    >
      <Container className="flex h-16 items-center justify-between">
        <a
          href="#top"
          onClick={handleAnchorClick("top")}
          className="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground"
        >
          <LogoMark id="site-logo-target" size={44} />
          {profile.name}
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={handleAnchorClick(link.id)}
                className={`group relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                <span className="relative">
                  {link.label}
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  ) : (
                    <span
                      className="absolute inset-x-0 -bottom-1 h-0.5 origin-center scale-x-0 rounded-full bg-primary transition-transform duration-200 ease-out group-hover:scale-x-100"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </Container>

      {menuOpen ? (
        <nav className="border-t border-border bg-background md:hidden">
          <Container className="flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(event) => {
                  handleAnchorClick(link.id)(event);
                  setMenuOpen(false);
                }}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  activeId === link.id ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </a>
            ))}
          </Container>
        </nav>
      ) : null}
    </motion.header>
  );
}
