import { Resend } from "resend";
import ContactNotification from "@/emails/ContactNotification";

type SendContactNotificationInput = {
  name: string;
  email: string;
  message: string;
};

export async function sendContactNotification(input: SendContactNotificationInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !from || !to) {
    throw new Error(
      "Email is not configured: set RESEND_API_KEY, CONTACT_FROM_EMAIL and CONTACT_TO_EMAIL.",
    );
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject: `New message from ${input.name}`,
    react: ContactNotification(input),
  });

  if (error) {
    throw new Error(error.message);
  }
}
