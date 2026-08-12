import { buildVenueSearchUrl } from "@/lib/venueSearch";
import type { EventTheme } from "@/lib/types";

interface Props {
  theme: EventTheme;
  area: string;
}

export default function VenueSearchButton({ theme, area }: Props) {
  const url = buildVenueSearchUrl(theme, area);
  const styles =
    theme === "birthday"
      ? "bg-purple-500 text-white hover:bg-purple-600"
      : "bg-amber-500 text-neutral-900 hover:bg-amber-400";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold shadow-sm hover:-translate-y-0.5 transition ${styles}`}
    >
      🔍 お店を探す
    </a>
  );
}
