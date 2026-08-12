"use client";

import { useEffect, useState } from "react";
import { getCheckedItems, setItemChecked } from "@/lib/packingListState";

interface Props {
  eventId: string;
  items: string[];
  // Divider/border classes matching the surrounding card, since this
  // renders inside differently-themed invite pages.
  dividerClassName?: string;
}

// Invitee-facing packing checklist. Check state lives only in this
// browser's localStorage (see src/lib/packingListState.ts) — it's a
// personal to-do, not shared with the organizer or other participants.
export default function PackingList({ eventId, items, dividerClassName }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    setChecked(getCheckedItems(eventId));
  }, [eventId]);

  if (items.length === 0) return null;

  function toggle(item: string) {
    const next = !checked.has(item);
    setItemChecked(eventId, item, next);
    setChecked((prev) => {
      const copy = new Set(prev);
      if (next) {
        copy.add(item);
      } else {
        copy.delete(item);
      }
      return copy;
    });
  }

  return (
    <div className={`mt-4 pt-4 ${dividerClassName ?? ""}`}>
      <p className="text-sm font-semibold mb-2">🎒 持ち物リスト</p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item}>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={checked.has(item)}
                onChange={() => toggle(item)}
                className="h-4 w-4 rounded"
              />
              <span className={checked.has(item) ? "line-through opacity-60" : ""}>
                {item}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
