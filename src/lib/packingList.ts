export const PACKING_ITEM_MAX_LENGTH = 30;
export const PACKING_LIST_MAX_ITEMS = 20;

// Normalizes a packingList value coming from an API request body: keeps
// only non-empty strings, trims them, and caps length/count so a bad
// client can't write unbounded data. Returns undefined (meaning "leave
// unchanged") when the input isn't an array at all.
export function parsePackingListInput(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && item.length <= PACKING_ITEM_MAX_LENGTH)
    .slice(0, PACKING_LIST_MAX_ITEMS);
}

export function packingListsEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}
