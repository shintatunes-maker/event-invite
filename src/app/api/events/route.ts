import { NextRequest, NextResponse } from "next/server";
import { createEvent } from "@/lib/db";
import { parsePackingListInput } from "@/lib/packingList";
import { THEME_REGISTRY } from "@/lib/themes";
import type { EventTheme } from "@/lib/types";

const THEMES: EventTheme[] = THEME_REGISTRY.map((t) => t.id);

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
    venueArea,
    packingList,
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
  if (location !== undefined && typeof location !== "string") {
    return NextResponse.json({ error: "invalid location" }, { status: 400 });
  }

  // Location is optional — when left blank the invite page shows a "find a
  // venue" search link instead (see src/lib/venueSearch.ts).
  // The creation response is the only time the admin token is returned —
  // the client must persist the resulting manage URL itself.
  const event = await createEvent({
    theme: theme as EventTheme,
    title: title.trim(),
    date: date.trim(),
    time: time.trim(),
    location: typeof location === "string" ? location.trim() : "",
    description: typeof description === "string" ? description.trim() : "",
    organizerName:
      typeof organizerName === "string" ? organizerName.trim() : "",
    creatorId:
      typeof creatorId === "string" && creatorId.length <= 100
        ? creatorId
        : undefined,
    rsvpDeadline:
      typeof rsvpDeadline === "string" ? rsvpDeadline.trim() : undefined,
    venueArea: typeof venueArea === "string" ? venueArea.trim() : undefined,
    packingList: parsePackingListInput(packingList),
  });

  return NextResponse.json({ event }, { status: 201 });
}
