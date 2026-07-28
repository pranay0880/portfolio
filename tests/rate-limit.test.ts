import { describe, expect, it, vi, beforeEach } from "vitest";

const countMock = vi.fn();

vi.mock("@/lib/db", () => ({
  prisma: {
    contactSubmission: {
      count: (...args: unknown[]) => countMock(...args),
    },
  },
}));

const { isRateLimited } = await import("@/lib/rate-limit");

describe("isRateLimited", () => {
  beforeEach(() => {
    countMock.mockReset();
  });

  it("returns false when there is no IP address", async () => {
    const result = await isRateLimited(null);
    expect(result).toBe(false);
    expect(countMock).not.toHaveBeenCalled();
  });

  it("returns false when submissions are under the threshold", async () => {
    countMock.mockResolvedValue(2);
    const result = await isRateLimited("1.2.3.4");
    expect(result).toBe(false);
  });

  it("returns true when submissions have reached the threshold", async () => {
    countMock.mockResolvedValue(3);
    const result = await isRateLimited("1.2.3.4");
    expect(result).toBe(true);
  });

  it("queries within a trailing time window scoped to the IP", async () => {
    countMock.mockResolvedValue(0);
    await isRateLimited("1.2.3.4");

    const [args] = countMock.mock.calls[0] as [{ where: { ipAddress: string; createdAt: { gte: Date } } }];
    expect(args.where.ipAddress).toBe("1.2.3.4");
    expect(args.where.createdAt.gte).toBeInstanceOf(Date);
    expect(args.where.createdAt.gte.getTime()).toBeLessThan(Date.now());
  });
});
