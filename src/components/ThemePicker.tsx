"use client";

import { useState } from "react";
import { getCategoriesWithThemes, getCategoryForTheme } from "@/lib/themes";
import type { ThemeCategoryId } from "@/lib/themes";
import type { EventTheme } from "@/lib/types";

interface Props {
  value: EventTheme;
  onChange: (theme: EventTheme) => void;
}

export default function ThemePicker({ value, onChange }: Props) {
  const categoriesWithThemes = getCategoriesWithThemes();
  const [categoryId, setCategoryId] = useState<ThemeCategoryId>(
    () => getCategoryForTheme(value).id,
  );

  const activeCategory =
    categoriesWithThemes.find((c) => c.category.id === categoryId) ??
    categoriesWithThemes[0];

  function handleSelectCategory(entry: (typeof categoriesWithThemes)[number]) {
    setCategoryId(entry.category.id);
    if (!entry.themes.some((t) => t.id === value)) {
      onChange(entry.themes[0].id);
    }
  }

  return (
    <div>
      <span className="block text-sm font-semibold text-neutral-700 mb-2">
        カテゴリを選択
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        {categoriesWithThemes.map((entry) => (
          <button
            key={entry.category.id}
            type="button"
            onClick={() => handleSelectCategory(entry)}
            className={`text-left rounded-xl border-2 px-3 py-2.5 transition hover:-translate-y-0.5 hover:shadow-sm ${
              activeCategory?.category.id === entry.category.id
                ? "border-neutral-900 bg-neutral-50"
                : "border-neutral-200"
            }`}
          >
            <p className="font-semibold text-sm text-neutral-900">
              {entry.category.label}
            </p>
            <p className="text-xs text-neutral-500 mt-0.5">
              {entry.themes.length}種類のテーマ
            </p>
          </button>
        ))}
      </div>

      <span className="block text-sm font-semibold text-neutral-700 mb-2">
        テーマを選択
      </span>
      <div className="grid grid-cols-2 gap-3">
        {activeCategory?.themes.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`relative text-left rounded-xl border-2 overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md ${
              value === t.id
                ? "border-neutral-900 shadow-sm"
                : "border-transparent"
            }`}
          >
            {value === t.id && (
              <span className="absolute top-2 right-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[10px] text-white">
                ✓
              </span>
            )}
            <div className={`h-14 ${t.colors.preview}`} />
            <div className="p-3 bg-white">
              <p className="font-semibold text-sm text-neutral-900">
                {t.emoji} {t.label}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                {t.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
