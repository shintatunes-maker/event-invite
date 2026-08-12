import { getThemeDefinition } from "./themes";
import type { EventTheme } from "./types";

// ---------------------------------------------------------------------
// "お店を探す" link, shown on the invite page when the organizer leaves
// 場所 (location) blank. Everything about the destination lives here —
// swap this to your real affiliate search URL (e.g. a Hot Pepper Gourmet
// affiliate link with your sitecd/tracking params) and nothing else in
// the app needs to change. Per-theme search keywords live on each theme's
// entry in src/lib/themes/registry.ts (venueSearchKeyword).
//
// Defaults to a Google Maps search because it works out of the box with
// no API key or affiliate account. We could not confirm Hot Pepper
// Gourmet's live keyword-search query format (their homepage search box
// is JS/autocomplete-driven, not a plain link), so treat this default as
// a placeholder to replace once you have a real affiliate search URL.
// ---------------------------------------------------------------------

const VENUE_SEARCH_SERVICE_NAME = "近くのお店";

export function getVenueSearchServiceName(): string {
  return VENUE_SEARCH_SERVICE_NAME;
}

export function buildVenueSearchUrl(theme: EventTheme, area: string): string {
  const keyword = getThemeDefinition(theme).venueSearchKeyword;
  const query = area.trim() ? `${keyword} ${area.trim()}` : keyword;

  // Replace this line with your real search URL builder, e.g.:
  // return `https://www.hotpepper.jp/CSP/...&sitecd=YOUR_AFFILIATE_ID&kw=${encodeURIComponent(query)}`;
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
}
