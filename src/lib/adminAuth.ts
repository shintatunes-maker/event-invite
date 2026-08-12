import { timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";

export function isValidAnalyticsToken(token: string | null): boolean {
  const expected = process.env.ADMIN_ANALYTICS_TOKEN;
  if (!expected || !token) return false;

  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function getAnalyticsToken(req: NextRequest): string | null {
  const header = req.headers.get("x-analytics-token");
  if (header) return header;
  return req.nextUrl.searchParams.get("token");
}
