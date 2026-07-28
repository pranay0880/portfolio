"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Mail, XCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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
            title="Step through. Let's build something"
            description="Have a project in mind or just want to say hi? Fill out the form and I'll get back to you."
          />

          <div className="grid gap-8 md:grid-cols-[2fr_3fr]">
            <Card className="flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Direct contact</h3>
                <a
                  href={`mailto:${profile.email}`}
                  className="mt-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Mail size={16} />
                  {profile.email}
                </a>
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

                <Button type="submit" disabled={submitState === "submitting"}>
                  {submitState === "submitting" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : null}
                  Send message
                </Button>

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
