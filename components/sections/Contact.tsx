"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Mail, XCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactFoodChase } from "@/components/sections/ContactFoodChase";
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
            eyebrow="Summon"
            title="Cast the Summon. Let's Build."
            description="Have a project, idea, or opportunity in mind? Send a message and let's start a conversation."
          />

          <div className="grid gap-8 md:grid-cols-[2fr_3fr]">
            <Card className="flex flex-col justify-between">
              <div>
                <p className="text-primary font-mono text-sm font-medium tracking-wide uppercase">
                  Direct Contact
                </p>

                <div className="mt-5 space-y-4">
                  <a href={`mailto:${profile.email}`} className="group flex items-start gap-3">
                    <span className="border-border text-muted-foreground group-hover:border-primary group-hover:text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors">
                      <Mail size={16} />
                    </span>
                    <span>
                      <span className="text-foreground block text-sm font-medium">Email</span>
                      <span className="text-muted-foreground block text-sm">{profile.email}</span>
                    </span>
                  </a>

                  <a
                    href={profile.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3"
                  >
                    <span className="border-border text-muted-foreground group-hover:border-primary group-hover:text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors">
                      <LinkedinIcon size={16} />
                    </span>
                    <span>
                      <span className="text-foreground block text-sm font-medium">LinkedIn</span>
                      <span className="text-muted-foreground block text-sm">Connect with me</span>
                    </span>
                  </a>

                  <a
                    href={profile.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3"
                  >
                    <span className="border-border text-muted-foreground group-hover:border-primary group-hover:text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors">
                      <GithubIcon size={16} />
                    </span>
                    <span>
                      <span className="text-foreground block text-sm font-medium">GitHub</span>
                      <span className="text-muted-foreground block text-sm">Explore my work</span>
                    </span>
                  </a>
                </div>
              </div>

              <div className="border-border mt-8 border-t pt-4">
                <p className="text-primary font-mono text-sm font-medium tracking-wide uppercase">
                  Current Status
                </p>
                <p className="text-foreground mt-2 flex items-center gap-2 text-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Open to opportunities
                </p>
              </div>
            </Card>

            {/* Wrapper so the Luffy gag can sit on the form card's top edge. */}
            <div className="relative">
              <ContactFoodChase />
              <Card className="h-full">
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-foreground mb-1 block text-sm font-medium"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      className="border-border bg-background text-foreground focus:border-primary w-full rounded-lg border px-3 py-2 text-sm outline-none"
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
                    <label
                      htmlFor="email"
                      className="text-foreground mb-1 block text-sm font-medium"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      className="border-border bg-background text-foreground focus:border-primary w-full rounded-lg border px-3 py-2 text-sm outline-none"
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
                      className="text-foreground mb-1 block text-sm font-medium"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="border-border bg-background text-foreground focus:border-primary w-full rounded-lg border px-3 py-2 text-sm outline-none"
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

                  {/* Honeypot field - hidden from sighted/keyboard users, bots tend to fill every input. */}
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
                      Thanks - your message has been sent.
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
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
