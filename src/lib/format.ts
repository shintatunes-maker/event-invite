export function formatEventDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export function formatEventTime(timeStr: string): string {
  return timeStr;
}

// Compact date without the year, for space-constrained UI like OGP text.
export function formatEventDateShort(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export function formatEventOgDescription(
  date: string,
  time: string,
  location: string,
): string {
  const when = `${formatEventDateShort(date)} ${time}〜`;
  return location.trim() ? `${when} / ${location.trim()}` : when;
}

export interface RsvpDeadlineInfo {
  daysLeft: number;
  isPast: boolean;
  isUrgent: boolean;
}

// `deadline` is treated as inclusive through the end of that calendar day.
export function getRsvpDeadlineInfo(
  deadline: string | null | undefined,
): RsvpDeadlineInfo | null {
  if (!deadline) return null;
  const deadlineDate = new Date(`${deadline}T00:00:00`);
  if (Number.isNaN(deadlineDate.getTime())) return null;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const daysLeft = Math.round(
    (deadlineDate.getTime() - startOfToday.getTime()) / 86_400_000,
  );

  return {
    daysLeft,
    isPast: daysLeft < 0,
    isUrgent: daysLeft === 0 || daysLeft === 1,
  };
}
