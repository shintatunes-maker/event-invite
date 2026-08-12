import type { EventTheme } from "../types";
import type { ThemeCategoryId } from "./categories";

// Single source of truth for every invite theme's identity: which
// category it belongs to, its label/emoji/description, the colors used
// to render it (both the theme picker swatch and the actual invite page),
// and its venue-search keyword. Add a new theme by adding an entry here
// (plus its EventTheme union member) — it will automatically show up in
// the picker, analytics, and the invite page with its own colors/icon.
// birthday/drinking additionally have bespoke, hand-built invite page
// designs (BirthdayInvite/DrinkingInvite); every other theme renders via
// GenericInvite, which is fully driven by the `colors` fields below.
export interface ThemeDefinition {
  id: EventTheme;
  categoryId: ThemeCategoryId;
  label: string;
  emoji: string;
  description: string;
  colors: {
    // Gradient class shown as the swatch on the theme picker card, and
    // reused as the GenericInvite page background.
    preview: string;
    // Whether GenericInvite should use its light (dark text on a light
    // card) or dark (light text on a dark card) template for this theme.
    mode: "light" | "dark";
    // Literal Tailwind text-color class for the badge/title accent.
    // Must be a full class name (not composed at runtime) so Tailwind's
    // scanner picks it up.
    accentText: string;
    // Google Fonts family name (exact spelling, spaces not underscores)
    // used for the invite page title/badge — see src/components/ThemeFont.tsx.
    fontFamily: string;
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
      mode: "light",
      accentText: "text-purple-600",
      fontFamily: "Hachi Maru Pop",
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
      mode: "dark",
      accentText: "text-amber-400",
      fontFamily: "RocknRoll One",
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
      mode: "dark",
      accentText: "text-amber-300",
      fontFamily: "Shippori Mincho",
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
      mode: "light",
      accentText: "text-orange-600",
      fontFamily: "Kosugi Maru",
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
      mode: "light",
      accentText: "text-slate-700",
      fontFamily: "Zen Old Mincho",
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
      mode: "light",
      accentText: "text-sky-600",
      fontFamily: "Zen Maru Gothic",
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
      mode: "light",
      accentText: "text-blue-700",
      fontFamily: "Train One",
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
      mode: "light",
      accentText: "text-green-700",
      fontFamily: "Dela Gothic One",
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
      mode: "dark",
      accentText: "text-lime-200",
      fontFamily: "Kiwi Maru",
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
      mode: "dark",
      accentText: "text-emerald-300",
      fontFamily: "Zen Antique",
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
      mode: "dark",
      accentText: "text-orange-300",
      fontFamily: "Yusei Magic",
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
      mode: "light",
      accentText: "text-orange-500",
      fontFamily: "Kaisei Decol",
    },
    venueSearchKeyword: "ヨガスタジオ",
  },
];
