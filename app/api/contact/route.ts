import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { contactFormSchema } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/email";
import { trackEvent, trackException } from "@/lib/monitoring";

export const runtime = "nodejs";

function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() ?? null;
  return null;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const { name, email, message, company } = parsed.data;

  // Honeypot tripped: pretend success so bots don't learn to avoid the field.
  if (company) {
    return NextResponse.json({ ok: true });
  }

  const ipAddress = getClientIp(request);
  const userAgent = request.headers.get("user-agent");

  if (await isRateLimited(ipAddress)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 },
    );
  }

  const submission = await prisma.contactSubmission.create({
    data: { name, email, message, ipAddress, userAgent },
  });

  try {
    await sendContactNotification({ name, email, message });
    await prisma.contactSubmission.update({
      where: { id: submission.id },
      data: { status: "EMAIL_SENT" },
    });
    await trackEvent("contact_form_submitted", { submissionId: submission.id });
  } catch (error) {
    await prisma.contactSubmission.update({
      where: { id: submission.id },
      data: { status: "EMAIL_FAILED" },
    });
    await trackException(error, { submissionId: submission.id });

    return NextResponse.json(
      {
        error:
          "Your message was received but we couldn't send the notification email. We'll still see it.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
