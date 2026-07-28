import type { MouseEvent } from "react";

/**
 * Scrolls to a section by id without letting the browser's default anchor
 * navigation write the hash into the URL — `scrollIntoView` performs the
 * same smooth-scroll animation but is a JS-driven scroll, not a navigation.
 */
export function handleAnchorClick(id: string) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
}
