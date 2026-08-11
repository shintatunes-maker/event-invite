import { NextRequest } from "next/server";
import { getEvent } from "./db";
import type { EventRecord } from "./types";

export function getAdminToken(req: NextRequest): string | null {
  const header = req.headers.get("x-admin-token");
  if (header) return header;
  const query = req.nextUrl.searchParams.get("token");
  return query ?? null;
}

export async function requireEventAdmin(
  eventId: string,
  token: string | null,
): Promise<EventRecord | null> {
  if (!token) return null;
  const event = await getEvent(eventId);
  if (!event || event.adminToken !== token) return null;
  return event;
}
