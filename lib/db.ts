import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

declare global {
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  // DATABASE_URL must be a plain postgres:// connection string here — this
  // adapter is the raw `pg` driver, not Prisma's own engine. If you're using
  // `prisma dev` locally, use the "TCP" URL from `prisma dev ls`, not the
  // `prisma+postgres://...api_key=...` one (that's engine-only and silently
  // disconnects when handed to `pg`).
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
