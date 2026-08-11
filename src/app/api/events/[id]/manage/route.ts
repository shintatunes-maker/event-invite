import { NextRequest, NextResponse } from "next/server";
import { getCounts, getResponses } from "@/lib/db";
import { getAdminToken, requireEventAdmin } from "@/lib/auth";
import { toPublicEvent } from "@/lib/publicEvent";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const admin = await requireEventAdmin(id, getAdminToken(req));
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const [responses, counts] = await Promise.all([
    getResponses(id),
    getCounts(id),
  ]);

  return NextResponse.json({
    event: toPublicEvent(admin),
    responses,
    counts,
  });
}
