const STORAGE_KEY = "event-invite:anon-id";

// A random ID generated and stored in the browser — not tied to a name,
// email, or any other personal information. Used only to see whether the
// same browser has created more than one event (repeat usage), for the
// owner-only analytics summary.
export function getOrCreateAnonId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    return "";
  }
}
