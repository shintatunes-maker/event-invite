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
  return `${formatEventDateShort(date)} ${time}〜 / ${location}`;
}
