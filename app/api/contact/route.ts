import { NextResponse, type NextRequest } from "next/server";
import { getSubmissions } from "@/lib/db";
import { contactFormSchema } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/email";

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

  const submissions = await getSubmissions();
  const { insertedId } = await submissions.insertOne({
    name,
    email,
    message,
    ipAddress,
    userAgent,
    status: "RECEIVED",
    createdAt: new Date(),
  });

  try {
    await sendContactNotification({ name, email, message });
    await submissions.updateOne({ _id: insertedId }, { $set: { status: "EMAIL_SENT" } });
  } catch {
    await submissions.updateOne({ _id: insertedId }, { $set: { status: "EMAIL_FAILED" } });

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
