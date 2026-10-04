import type { MouseEvent } from "react";

/**
 * Scrolls to a section by id without letting the browser's default anchor
 * navigation write the hash into the URL - `scrollIntoView` performs the
 * same smooth-scroll animation but is a JS-driven scroll, not a navigation.
 * When the section isn't on this page (e.g. on a case-study page), the link
 * is left to navigate normally to `/#id`.
 */
export function handleAnchorClick(id: string) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  };
}
