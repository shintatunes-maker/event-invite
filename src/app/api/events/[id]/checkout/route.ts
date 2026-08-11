import { NextRequest, NextResponse } from "next/server";
import { getAdminToken, requireEventAdmin } from "@/lib/auth";
import {
  WATERMARK_REMOVAL_PRICE_JPY,
  WATERMARK_REMOVAL_PRODUCT_NAME,
} from "@/lib/pricing";
import { stripe } from "@/lib/stripe";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = getAdminToken(req);
  const admin = await requireEventAdmin(id, token);
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (admin.isPaid) {
    return NextResponse.json(
      { error: "already upgraded" },
      { status: 400 },
    );
  }

  const origin = req.nextUrl.origin;
  const manageUrl = `${origin}/event/${id}/manage?token=${encodeURIComponent(token!)}`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "jpy",
          product_data: { name: WATERMARK_REMOVAL_PRODUCT_NAME },
          unit_amount: WATERMARK_REMOVAL_PRICE_JPY,
        },
        quantity: 1,
      },
    ],
    success_url: `${manageUrl}&checkout_session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${manageUrl}&checkout=cancelled`,
    metadata: { eventId: id },
  });

  return NextResponse.json({ url: session.url });
}
