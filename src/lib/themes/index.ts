import type { EventTheme } from "../types";
import {
  THEME_CATEGORIES,
  type ThemeCategoryDefinition,
  type ThemeCategoryId,
} from "./categories";
import { THEME_REGISTRY, type ThemeDefinition } from "./registry";

export { THEME_CATEGORIES, THEME_REGISTRY };
export type { ThemeCategoryDefinition, ThemeCategoryId, ThemeDefinition };

export function getThemeDefinition(id: EventTheme): ThemeDefinition {
  const def = THEME_REGISTRY.find((t) => t.id === id);
  if (!def) throw new Error(`Unknown theme: ${id}`);
  return def;
}

export function getThemesByCategory(
  categoryId: ThemeCategoryId,
): ThemeDefinition[] {
  return THEME_REGISTRY.filter((t) => t.categoryId === categoryId);
}

export function getCategoryForTheme(
  themeId: EventTheme,
): ThemeCategoryDefinition {
  const def = getThemeDefinition(themeId);
  const category = THEME_CATEGORIES.find((c) => c.id === def.categoryId);
  if (!category) throw new Error(`Unknown category: ${def.categoryId}`);
  return category;
}

export interface CategoryWithThemes {
  category: ThemeCategoryDefinition;
  themes: ThemeDefinition[];
}

// Only categories that currently have at least one theme — keeps the
// picker from showing dead-end categories before themes are added to them.
export function getCategoriesWithThemes(): CategoryWithThemes[] {
  return THEME_CATEGORIES.map((category) => ({
    category,
    themes: getThemesByCategory(category.id),
  })).filter((entry) => entry.themes.length > 0);
}
