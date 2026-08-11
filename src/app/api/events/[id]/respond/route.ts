import { NextRequest, NextResponse } from "next/server";
import { addResponse } from "@/lib/db";
import type { RsvpStatus } from "@/lib/types";

const STATUSES: RsvpStatus[] = ["yes", "maybe", "no"];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const { name, status, comment } = body as Record<string, unknown>;

  if (typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  if (typeof status !== "string" || !STATUSES.includes(status as RsvpStatus)) {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }

  try {
    const { response, counts } = await addResponse(
      id,
      name.trim(),
      status as RsvpStatus,
      typeof comment === "string" ? comment.trim() : "",
    );
    return NextResponse.json({ response, counts }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "EVENT_NOT_FOUND") {
      return NextResponse.json({ error: "event not found" }, { status: 404 });
    }
    throw err;
  }
}
