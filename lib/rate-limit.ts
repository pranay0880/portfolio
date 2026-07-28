import { prisma } from "@/lib/db";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS_PER_WINDOW = 3;

export async function isRateLimited(ipAddress: string | null): Promise<boolean> {
  if (!ipAddress) return false;

  const count = await prisma.contactSubmission.count({
    where: {
      ipAddress,
      createdAt: { gte: new Date(Date.now() - WINDOW_MS) },
    },
  });

  return count >= MAX_SUBMISSIONS_PER_WINDOW;
}
