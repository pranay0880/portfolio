import { describe, expect, it } from "vitest";
import { contactFormSchema } from "@/lib/validation";

describe("contactFormSchema", () => {
  it("accepts a well-formed submission", () => {
    const result = contactFormSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Hello, I'd like to get in touch about a project.",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a name that is too short", () => {
    const result = contactFormSchema.safeParse({
      name: "J",
      email: "jane@example.com",
      message: "Hello, I'd like to get in touch about a project.",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid email address", () => {
    const result = contactFormSchema.safeParse({
      name: "Jane Doe",
      email: "not-an-email",
      message: "Hello, I'd like to get in touch about a project.",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a message that is too short", () => {
    const result = contactFormSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "hi",
    });

    expect(result.success).toBe(false);
  });

  it("allows an empty honeypot field", () => {
    const result = contactFormSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Hello, I'd like to get in touch about a project.",
      company: "",
    });

    expect(result.success).toBe(true);
  });

  it("still parses successfully when the honeypot is filled (rejection happens in the route, not the schema)", () => {
    const result = contactFormSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Hello, I'd like to get in touch about a project.",
      company: "Acme Corp",
    });

    expect(result.success).toBe(true);
  });
});
