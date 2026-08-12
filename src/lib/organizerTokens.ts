// Remembers which events *this browser* has an admin token for, so the
// invite page can offer a one-click link back to the manage screen for
// whoever created (or has previously opened the manage page for) the
// event — without ever exposing the token to anyone else. Nothing here
// is sent to the server; it only ever reads/writes this browser's own
// localStorage.
const STORAGE_KEY = "event-invite:organizer-tokens";
const MAX_ENTRIES = 100;

type TokenMap = Record<string, string>;

function readMap(): TokenMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TokenMap) : {};
  } catch {
    return {};
  }
}

export function saveOrganizerToken(eventId: string, adminToken: string): void {
  if (typeof window === "undefined") return;
  try {
    const map = readMap();
    map[eventId] = adminToken;

    const keys = Object.keys(map);
    if (keys.length > MAX_ENTRIES) {
      delete map[keys[0]];
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — not critical
  }
}

export function getOrganizerToken(eventId: string): string | null {
  return readMap()[eventId] ?? null;
}
