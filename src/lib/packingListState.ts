// Per-invitee "did I pack this" checkbox state, kept only in this
// browser's localStorage — never sent to the server or shared between
// participants. Keyed by event ID so different events don't collide.
const STORAGE_PREFIX = "packing-checked:";

function storageKey(eventId: string): string {
  return `${STORAGE_PREFIX}${eventId}`;
}

export function getCheckedItems(eventId: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(storageKey(eventId));
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function setItemChecked(
  eventId: string,
  item: string,
  checked: boolean,
): void {
  if (typeof window === "undefined") return;
  const current = getCheckedItems(eventId);
  if (checked) {
    current.add(item);
  } else {
    current.delete(item);
  }
  try {
    window.localStorage.setItem(
      storageKey(eventId),
      JSON.stringify([...current]),
    );
  } catch {
    // localStorage unavailable (private mode, quota); check state just
    // won't persist across reloads.
  }
}
