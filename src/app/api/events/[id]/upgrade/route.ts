import { NextRequest, NextResponse } from "next/server";
import { setEventPaidStatus } from "@/lib/db";
import { getAdminToken, requireEventAdmin } from "@/lib/auth";
import { toPublicEvent } from "@/lib/publicEvent";

// Demo-only endpoint: flips the isPaid flag without processing any real
// payment. A production version would verify a payment provider webhook
// (e.g. Stripe) before calling setEventPaidStatus.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const admin = await requireEventAdmin(id, getAdminToken(req));
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const isPaid = (body as { isPaid?: unknown }).isPaid !== false;

  const updated = await setEventPaidStatus(id, isPaid);
  return NextResponse.json({ event: toPublicEvent(updated!) });
}
