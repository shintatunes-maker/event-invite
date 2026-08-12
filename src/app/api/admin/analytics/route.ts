import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsToken, isValidAnalyticsToken } from "@/lib/adminAuth";
import { getAnalyticsSummary } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!isValidAnalyticsToken(getAnalyticsToken(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const summary = await getAnalyticsSummary();
  return NextResponse.json({ summary });
}
