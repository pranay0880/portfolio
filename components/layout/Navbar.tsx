"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { FileUser, Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NavbarChase } from "@/components/layout/NavbarChase";
import { LogoMark } from "@/components/ui/LogoMark";
import { profile } from "@/lib/content";
import { handleAnchorClick } from "@/lib/scroll";

export const NAV_LINKS = [
  { id: "about", label: "Character" },
  { id: "skills", label: "Abilities" },
  { id: "projects", label: "Quests" },
  { id: "experience", label: "Journey" },
  { id: "contact", label: "Summon" },
];

export function Navbar() {
  const [activeId, setActiveId] = useState<string>("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // "top" (the Hero section) is observed too, even though it has no nav
    // link - otherwise activeId has nothing to reset it back to "top" once
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

    // Arriving from another page via /#section: jump there once the sections exist.
    const hashTarget =
      window.location.hash && document.getElementById(window.location.hash.slice(1));
    if (hashTarget) hashTarget.scrollIntoView();

    return () => observerRef.current?.disconnect();
  }, [pathname]);

  return (
    <header className="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/#top"
          onClick={handleAnchorClick("top")}
          className="text-foreground flex items-center gap-2 text-base font-semibold tracking-tight"
        >
          <LogoMark id="site-logo-target" size={44} />
          <span className="whitespace-nowrap">{profile.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.id}
                href={`/#${link.id}`}
                onClick={handleAnchorClick(link.id)}
                className={`group relative rounded-full px-4 py-2 font-mono text-sm font-medium transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                <span className="relative">
                  {link.label}
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="bg-primary absolute inset-x-0 -bottom-1 h-0.5 rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  ) : (
                    <span
                      className="bg-primary absolute inset-x-0 -bottom-1 h-0.5 origin-center scale-x-0 rounded-full transition-transform duration-200 ease-out group-hover:scale-x-100"
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
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group text-muted-foreground hover:text-foreground relative hidden items-center gap-1 rounded-full px-4 py-2 font-mono text-sm font-medium transition-colors md:inline-flex"
          >
            <span>Resume</span>
            <span
              className="bg-primary absolute inset-x-0 -bottom-1 h-0.5 origin-center scale-x-0 rounded-full transition-transform duration-200 ease-out group-hover:scale-x-100"
              aria-hidden="true"
            />
          </a>
          {/* Mobile: one-tap resume as an icon, matching the toggle buttons. */}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Resume"
            title="Resume"
            className="border-border text-foreground hover:border-primary hover:text-primary flex h-9 w-9 items-center justify-center rounded-full border transition-colors md:hidden"
          >
            <FileUser size={17} aria-hidden="true" />
          </a>
          <button
            type="button"
            className="border-border text-foreground flex h-9 w-9 items-center justify-center rounded-full border md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </Container>

      <NavbarChase active />

      {menuOpen ? (
        <nav className="border-border bg-background border-t md:hidden">
          <Container className="flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`/#${link.id}`}
                onClick={(event) => {
                  handleAnchorClick(link.id)(event);
                  setMenuOpen(false);
                }}
                className={`rounded-lg px-3 py-2 font-mono text-sm font-medium ${
                  activeId === link.id ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </a>
            ))}
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
