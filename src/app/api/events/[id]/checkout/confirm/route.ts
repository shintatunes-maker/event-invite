import { NextRequest, NextResponse } from "next/server";
import { setEventPaidStatus } from "@/lib/db";
import { getAdminToken, requireEventAdmin } from "@/lib/auth";
import { toPublicEvent } from "@/lib/publicEvent";
import { stripe } from "@/lib/stripe";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const admin = await requireEventAdmin(id, getAdminToken(req));
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.metadata?.eventId !== id) {
    return NextResponse.json({ error: "session does not match event" }, { status: 400 });
  }

  if (session.payment_status !== "paid") {
    return NextResponse.json({
      paid: false,
      status: session.payment_status,
      event: toPublicEvent(admin),
    });
  }

  const updated = await setEventPaidStatus(id, true);
  return NextResponse.json({ paid: true, event: toPublicEvent(updated!) });
}
