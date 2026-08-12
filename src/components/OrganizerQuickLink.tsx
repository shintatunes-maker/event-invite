"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrganizerToken } from "@/lib/organizerTokens";

interface Props {
  eventId: string;
}

// Shown only in the browser of whoever created (or has previously opened
// the manage page for) this event — see src/lib/organizerTokens.ts. Every
// other visitor sees nothing, since the token only ever exists in that
// one browser's localStorage.
export default function OrganizerQuickLink({ eventId }: Props) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getOrganizerToken(eventId));
  }, [eventId]);

  if (!token) return null;

  return (
    <Link
      href={`/event/${eventId}/manage?token=${token}`}
      className="fixed bottom-3 right-3 z-30 flex items-center gap-1.5 rounded-full bg-neutral-900/90 backdrop-blur px-3 py-2 text-xs font-semibold text-white shadow-lg hover:bg-neutral-800 hover:-translate-y-0.5 transition"
    >
      🔧 管理画面へ
    </Link>
  );
}
