import { buildVenueSearchUrl } from "@/lib/venueSearch";
import type { EventTheme } from "@/lib/types";

interface Props {
  theme: EventTheme;
  area: string;
}

// Organizer-facing utility (shown on /create and /event/[id]/manage/edit)
// for finding a venue while the "場所" field is still blank. Not shown to
// invitees — see EventLocationMap for the invitee-facing map instead.
export default function VenueSearchButton({ theme, area }: Props) {
  const url = buildVenueSearchUrl(theme, area);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1.5 text-sm font-bold text-white shadow-sm hover:-translate-y-0.5 hover:bg-neutral-700 transition"
    >
      🔍 お店を探す
    </a>
  );
}
