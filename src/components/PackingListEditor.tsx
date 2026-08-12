"use client";

import { useState } from "react";
import { PACKING_ITEM_MAX_LENGTH, PACKING_LIST_MAX_ITEMS } from "@/lib/packingList";

interface Props {
  items: string[];
  onChange: (items: string[]) => void;
}

export default function PackingListEditor({ items, onChange }: Props) {
  const [draft, setDraft] = useState("");

  function addItem() {
    const trimmed = draft.trim();
    if (!trimmed || items.includes(trimmed) || items.length >= PACKING_LIST_MAX_ITEMS) {
      return;
    }
    onChange([...items, trimmed]);
    setDraft("");
  }

  function removeItem(item: string) {
    onChange(items.filter((i) => i !== item));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 pl-3 pr-2 py-1 text-sm text-neutral-700"
          >
            {item}
            <button
              type="button"
              onClick={() => removeItem(item)}
              aria-label={`${item}を削除`}
              className="text-neutral-400 hover:text-neutral-700"
            >
              ×
            </button>
          </span>
        ))}
        {items.length === 0 && (
          <span className="text-sm text-neutral-400">まだ項目がありません</span>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder="持ち物を入力してEnter"
          maxLength={PACKING_ITEM_MAX_LENGTH}
          className="flex-1 rounded-xl border border-neutral-300 px-4 py-2 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200 hover:border-neutral-400"
        />
        <button
          type="button"
          onClick={addItem}
          className="rounded-xl bg-neutral-900 text-white px-4 py-2 text-sm font-semibold hover:bg-neutral-700 transition"
        >
          追加
        </button>
      </div>
    </div>
  );
}
