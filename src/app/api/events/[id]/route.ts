import { NextRequest, NextResponse } from "next/server";
import { deleteEvent, getCounts, getEvent, updateEvent } from "@/lib/db";
import { getAdminToken, requireEventAdmin } from "@/lib/auth";
import { toPublicEvent } from "@/lib/publicEvent";
import { THEME_REGISTRY } from "@/lib/themes";
import type { EventTheme } from "@/lib/types";

const THEMES: EventTheme[] = THEME_REGISTRY.map((t) => t.id);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return NextResponse.json({ error: "event not found" }, { status: 404 });
  }

  const counts = await getCounts(id);
  return NextResponse.json({ event: toPublicEvent(event), counts });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const admin = await requireEventAdmin(id, getAdminToken(req));
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const {
    theme,
    title,
    date,
    time,
    location,
    description,
    organizerName,
    rsvpDeadline,
    venueArea,
  } = body as Record<string, unknown>;

  if (theme !== undefined && !THEMES.includes(theme as EventTheme)) {
    return NextResponse.json({ error: "invalid theme" }, { status: 400 });
  }
  if (title !== undefined && (typeof title !== "string" || !title.trim())) {
    return NextResponse.json({ error: "invalid title" }, { status: 400 });
  }
  if (date !== undefined && (typeof date !== "string" || !date.trim())) {
    return NextResponse.json({ error: "invalid date" }, { status: 400 });
  }
  if (time !== undefined && (typeof time !== "string" || !time.trim())) {
    return NextResponse.json({ error: "invalid time" }, { status: 400 });
  }
  if (location !== undefined && typeof location !== "string") {
    return NextResponse.json({ error: "invalid location" }, { status: 400 });
  }

  const updated = await updateEvent(id, {
    theme: theme as EventTheme | undefined,
    title: typeof title === "string" ? title.trim() : undefined,
    date: typeof date === "string" ? date.trim() : undefined,
    time: typeof time === "string" ? time.trim() : undefined,
    location: typeof location === "string" ? location.trim() : undefined,
    description:
      typeof description === "string" ? description.trim() : undefined,
    organizerName:
      typeof organizerName === "string" ? organizerName.trim() : undefined,
    rsvpDeadline:
      typeof rsvpDeadline === "string" ? rsvpDeadline.trim() : undefined,
    venueArea:
      typeof venueArea === "string" ? venueArea.trim() : undefined,
  });

  return NextResponse.json({ event: toPublicEvent(updated!) });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const admin = await requireEventAdmin(id, getAdminToken(req));
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  await deleteEvent(id);
  return NextResponse.json({ success: true });
}
