"use client";

import {
  buildGoogleCalendarUrl,
  buildIcsContent,
  type CalendarEventInput,
} from "@/lib/calendar";

interface Props {
  event: CalendarEventInput;
}

const pillClass =
  "inline-flex items-center gap-1.5 rounded-full bg-white/90 text-neutral-800 px-3 py-1.5 text-sm font-semibold shadow-sm hover:-translate-y-0.5 hover:bg-white transition";

export default function AddToCalendarButton({ event }: Props) {
  function downloadIcs() {
    const ics = buildIcsContent(event);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title || "event"}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      <a
        href={buildGoogleCalendarUrl(event)}
        target="_blank"
        rel="noopener noreferrer"
        className={pillClass}
      >
        📅 Googleカレンダーに追加
      </a>
      <button type="button" onClick={downloadIcs} className={pillClass}>
        🗓️ カレンダーに追加(.ics)
      </button>
    </div>
  );
}
