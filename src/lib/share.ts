export function canUseWebShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

// Returns true if the share sheet was opened (regardless of whether the
// user actually picked an app), false if the browser doesn't support the
// Web Share API. Silently swallows the user cancelling the share sheet.
export async function shareInvite(params: {
  title: string;
  text?: string;
  url: string;
}): Promise<boolean> {
  if (!canUseWebShare()) return false;
  try {
    await navigator.share(params);
    return true;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return true;
    throw err;
  }
}
