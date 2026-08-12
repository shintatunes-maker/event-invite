import type { EventTheme } from "../types";
import type { ThemeCategoryId } from "./categories";

// Single source of truth for every invite theme's identity: which
// category it belongs to, its label/emoji/description, the colors used
// to render it in the theme picker, and its venue-search keyword. Add a
// new theme by adding an entry here (plus its EventTheme union member) —
// it will automatically show up in the picker and analytics. A dedicated
// invite page design (like BirthdayInvite/DrinkingInvite) is a separate,
// later step; until one exists a theme renders using the birthday page's
// layout as a fallback.
export interface ThemeDefinition {
  id: EventTheme;
  categoryId: ThemeCategoryId;
  label: string;
  emoji: string;
  description: string;
  colors: {
    // Gradient class shown as the swatch on the theme picker card.
    preview: string;
  };
  // Keyword used to build the "find a venue" search query (see
  // src/lib/venueSearch.ts) when the organizer leaves location blank.
  venueSearchKeyword: string;
}

export const THEME_REGISTRY: ThemeDefinition[] = [
  // ---- 飲み会・パーティー系 ----
  {
    id: "birthday",
    categoryId: "party",
    label: "誕生日会テーマ",
    emoji: "🎂",
    description: "ピンク×パープルの華やかなデザイン",
    colors: {
      preview: "bg-gradient-to-br from-pink-300 via-purple-200 to-yellow-100",
    },
    venueSearchKeyword: "パーティー 個室",
  },
  {
    id: "drinking",
    categoryId: "party",
    label: "飲み会テーマ",
    emoji: "🍻",
    description: "提灯モチーフの居酒屋風デザイン",
    colors: {
      preview: "bg-gradient-to-br from-neutral-800 via-red-950 to-neutral-900",
    },
    venueSearchKeyword: "居酒屋",
  },
  {
    id: "farewell",
    categoryId: "party",
    label: "歓送迎会テーマ",
    emoji: "💐",
    description: "ネイビー×ゴールドの、門出を祝う上品なデザイン",
    colors: {
      preview: "bg-gradient-to-br from-blue-950 via-slate-800 to-amber-400",
    },
    venueSearchKeyword: "宴会 個室",
  },
  {
    id: "ladies",
    categoryId: "party",
    label: "女子会・ランチ会テーマ",
    emoji: "☕",
    description: "ベージュ×テラコッタのカフェ風デザイン",
    colors: {
      preview: "bg-gradient-to-br from-amber-100 via-orange-200 to-orange-300",
    },
    venueSearchKeyword: "カフェ ランチ",
  },
  {
    id: "reunion",
    categoryId: "party",
    label: "同窓会テーマ",
    emoji: "📷",
    description: "セピア×紺の、懐かしさを感じる配色",
    colors: {
      preview: "bg-gradient-to-br from-yellow-200 via-amber-300 to-slate-800",
    },
    venueSearchKeyword: "宴会場",
  },
  {
    id: "housewarming",
    categoryId: "party",
    label: "引っ越し祝いテーマ",
    emoji: "🏠",
    description: "ライトブルー×白の、爽やかな新生活デザイン",
    colors: {
      preview: "bg-gradient-to-br from-sky-100 via-white to-sky-300",
    },
    venueSearchKeyword: "レストラン",
  },

  // ---- スポーツ・アクティビティ系 ----
  {
    id: "running",
    categoryId: "activity",
    label: "ランニング・マラソンテーマ",
    emoji: "🏃",
    description: "ビビッドなブルー×イエローのスポーティなデザイン",
    colors: {
      preview: "bg-gradient-to-br from-blue-500 via-blue-400 to-yellow-400",
    },
    venueSearchKeyword: "ランニングコース",
  },
  {
    id: "futsal",
    categoryId: "activity",
    label: "フットサル・スポーツ観戦テーマ",
    emoji: "⚽",
    description: "グリーン×白の躍動感あるデザイン",
    colors: {
      preview: "bg-gradient-to-br from-green-500 via-emerald-300 to-white",
    },
    venueSearchKeyword: "フットサルコート",
  },
  {
    id: "hiking",
    categoryId: "activity",
    label: "登山・ハイキングテーマ",
    emoji: "🥾",
    description: "カーキ×茶のアースカラーデザイン",
    colors: {
      preview: "bg-gradient-to-br from-lime-700 via-yellow-800 to-stone-700",
    },
    venueSearchKeyword: "登山口",
  },
  {
    id: "golf",
    categoryId: "activity",
    label: "ゴルフコンペテーマ",
    emoji: "⛳",
    description: "グリーン×ネイビーの上品なデザイン",
    colors: {
      preview: "bg-gradient-to-br from-emerald-600 via-green-700 to-blue-950",
    },
    venueSearchKeyword: "ゴルフ場",
  },
  {
    id: "bbq",
    categoryId: "activity",
    label: "BBQ・キャンプテーマ",
    emoji: "🔥",
    description: "焚き火を思わせるオレンジ×深緑のデザイン",
    colors: {
      preview: "bg-gradient-to-br from-orange-500 via-orange-600 to-green-900",
    },
    venueSearchKeyword: "バーベキュー場",
  },

  // ---- ウェルネス系 ----
  {
    id: "wellness",
    categoryId: "wellness",
    label: "ヨガ・ウェルネステーマ",
    emoji: "🧘",
    description: "パステルベージュ×白の、落ち着いた癒し系デザイン",
    colors: {
      preview: "bg-gradient-to-br from-orange-50 via-stone-100 to-white",
    },
    venueSearchKeyword: "ヨガスタジオ",
  },
];
