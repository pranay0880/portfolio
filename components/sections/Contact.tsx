"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Mail, XCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { DrawOutlineButton } from "@/components/ui/DrawOutlineButton";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { profile } from "@/lib/content";
import { contactFormSchema, type ContactFormValues } from "@/lib/validation";
import { fadeUp, viewportOnce } from "@/lib/motion";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function Contact() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitState("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setErrorMessage(data?.error ?? "Something went wrong. Please try again.");
        setSubmitState("error");
        return;
      }

      setSubmitState("success");
      reset();
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setSubmitState("error");
    }
  };

  return (
    <section id="contact" className="scroll-mt-16 py-16 sm:py-24">
      <Container>
        <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp}>
          <SectionHeading
            eyebrow="Portal"
            title="Open a Portal. Let's Build."
            description="Have a project, idea, or opportunity in mind? Send a message and let's start a conversation."
          />

          <div className="grid gap-8 md:grid-cols-[2fr_3fr]">
            <Card className="flex flex-col justify-between">
              <div>
                <p className="text-sm font-medium tracking-wide text-primary uppercase">
                  Direct Contact
                </p>

                <div className="mt-5 space-y-4">
                  <a
                    href={`mailto:${profile.email}`}
                    className="group flex items-start gap-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-primary group-hover:text-primary">
                      <Mail size={16} />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-foreground">Email</span>
                      <span className="block text-sm text-muted-foreground">{profile.email}</span>
                    </span>
                  </a>

                  <a
                    href={profile.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-primary group-hover:text-primary">
                      <LinkedinIcon size={16} />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-foreground">LinkedIn</span>
                      <span className="block text-sm text-muted-foreground">
                        Connect with me
                      </span>
                    </span>
                  </a>

                  <a
                    href={profile.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-primary group-hover:text-primary">
                      <GithubIcon size={16} />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-foreground">GitHub</span>
                      <span className="block text-sm text-muted-foreground">Explore my work</span>
                    </span>
                  </a>
                </div>
              </div>

              <div className="mt-8 border-t border-border pt-4">
                <p className="text-sm font-medium tracking-wide text-primary uppercase">
                  Current Status
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm text-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Open to opportunities
                </p>
              </div>
            </Card>

            <Card>
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium text-foreground">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                    aria-invalid={errors.name ? "true" : undefined}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    {...register("name")}
                  />
                  {errors.name ? (
                    <p id="name-error" className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                    aria-invalid={errors.email ? "true" : undefined}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register("email")}
                  />
                  {errors.email ? (
                    <p id="email-error" className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-1 block text-sm font-medium text-foreground"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                    aria-invalid={errors.message ? "true" : undefined}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    {...register("message")}
                  />
                  {errors.message ? (
                    <p id="message-error" className="mt-1 text-sm text-red-500">
                      {errors.message.message}
                    </p>
                  ) : null}
                </div>

                {/* Honeypot field — hidden from sighted/keyboard users, bots tend to fill every input. */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("company")}
                  />
                </div>

                <DrawOutlineButton
                  as="button"
                  type="submit"
                  disabled={submitState === "submitting"}
                  className="disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitState === "submitting" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : null}
                  Send message
                </DrawOutlineButton>

                {submitState === "success" ? (
                  <p className="flex items-center gap-2 text-sm text-emerald-500">
                    <CheckCircle2 size={16} />
                    Thanks — your message has been sent.
                  </p>
                ) : null}

                {submitState === "error" ? (
                  <p className="flex items-center gap-2 text-sm text-red-500" role="alert">
                    <XCircle size={16} />
                    {errorMessage}
                  </p>
                ) : null}
              </form>
            </Card>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
