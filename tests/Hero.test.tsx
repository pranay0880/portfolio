import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { profile } from "@/lib/content";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={props.alt as string} src={props.src as string} />;
  },
}));

const { Hero } = await import("@/components/sections/Hero");

describe("Hero", () => {
  it("renders the profile name and tagline", () => {
    render(<Hero />);

    expect(screen.getByRole("heading", { name: profile.name })).toBeInTheDocument();
    expect(screen.getByText(profile.tagline)).toBeInTheDocument();
  });

  it("links to the contact section", () => {
    render(<Hero />);

    const contactLink = screen.getByRole("link", { name: /get in touch/i });
    expect(contactLink).toHaveAttribute("href", "#contact");
  });
});
