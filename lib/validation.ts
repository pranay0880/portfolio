import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.email("Enter a valid email address").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
  // Honeypot field: hidden from real users via CSS; bots that auto-fill every field will trip it.
  company: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
