const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

// Events are entered as JST local date/time by Japanese organizers (this
// app has no timezone field), so we treat "YYYY-MM-DD" + "HH:mm" as JST
// (UTC+9) and convert to a real UTC instant here.
function toUtcDate(date: string, time: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh, mm) - 9 * 60 * 60 * 1000);
}

function formatUtcCompact(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export interface CalendarEventInput {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export function buildGoogleCalendarUrl(event: CalendarEventInput): string {
  const start = toUtcDate(event.date, event.time);
  const end = new Date(start.getTime() + DEFAULT_DURATION_MS);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatUtcCompact(start)}/${formatUtcCompact(end)}`,
    location: event.location,
    details: event.description,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/[;,]/g, (m) => `\\${m}`)
    .replace(/\n/g, "\\n");
}

export function buildIcsContent(event: CalendarEventInput): string {
  const start = toUtcDate(event.date, event.time);
  const end = new Date(start.getTime() + DEFAULT_DURATION_MS);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//event-invite//JP",
    "BEGIN:VEVENT",
    `UID:${event.id}@event-invite`,
    `DTSTAMP:${formatUtcCompact(new Date())}`,
    `DTSTART:${formatUtcCompact(start)}`,
    `DTEND:${formatUtcCompact(end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    event.location ? `LOCATION:${escapeIcsText(event.location)}` : null,
    event.description ? `DESCRIPTION:${escapeIcsText(event.description)}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.filter((line): line is string => line !== null).join("\r\n");
}
