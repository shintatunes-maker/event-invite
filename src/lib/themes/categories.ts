// Category taxonomy for invite themes. Add new categories here as they're
// needed — the theme picker automatically shows any category that has at
// least one theme assigned to it (see getCategoriesWithThemes in ./index).
export type ThemeCategoryId = "party" | "activity" | "wellness";

export interface ThemeCategoryDefinition {
  id: ThemeCategoryId;
  label: string;
  description: string;
}

export const THEME_CATEGORIES: ThemeCategoryDefinition[] = [
  {
    id: "party",
    label: "飲み会・パーティー系",
    description: "飲み会や誕生日会など、賑やかに盛り上がるイベント向け",
  },
  {
    id: "activity",
    label: "スポーツ・アクティビティ系",
    description: "スポーツ観戦やアウトドアなど、体を動かすイベント向け",
  },
  {
    id: "wellness",
    label: "ウェルネス系",
    description:
      "ヨガや温泉など、リラックス系イベント向け(暫定カテゴリ。将来的に他カテゴリへ統合の可能性あり)",
  },
];
