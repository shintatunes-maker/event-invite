import { NextRequest, NextResponse } from "next/server";
import { createEvent } from "@/lib/db";
import type { EventTheme } from "@/lib/types";

const THEMES: EventTheme[] = ["birthday", "drinking"];

export async function POST(req: NextRequest) {
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
    creatorId,
    rsvpDeadline,
  } = body as Record<string, unknown>;

  if (typeof theme !== "string" || !THEMES.includes(theme as EventTheme)) {
    return NextResponse.json({ error: "invalid theme" }, { status: 400 });
  }
  if (typeof title !== "string" || title.trim() === "") {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (typeof date !== "string" || date.trim() === "") {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }
  if (typeof time !== "string" || time.trim() === "") {
    return NextResponse.json({ error: "time is required" }, { status: 400 });
  }
  if (typeof location !== "string" || location.trim() === "") {
    return NextResponse.json(
      { error: "location is required" },
      { status: 400 },
    );
  }

  // The creation response is the only time the admin token is returned —
  // the client must persist the resulting manage URL itself.
  const event = await createEvent({
    theme: theme as EventTheme,
    title: title.trim(),
    date: date.trim(),
    time: time.trim(),
    location: location.trim(),
    description: typeof description === "string" ? description.trim() : "",
    organizerName:
      typeof organizerName === "string" ? organizerName.trim() : "",
    creatorId:
      typeof creatorId === "string" && creatorId.length <= 100
        ? creatorId
        : undefined,
    rsvpDeadline:
      typeof rsvpDeadline === "string" ? rsvpDeadline.trim() : undefined,
  });

  return NextResponse.json({ event }, { status: 201 });
}
