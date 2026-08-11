import type { EventTheme } from "./types";

export const THEME_OPTIONS: {
  value: EventTheme;
  label: string;
  emoji: string;
  desc: string;
  preview: string;
}[] = [
  {
    value: "birthday",
    label: "誕生日会テーマ",
    emoji: "🎂",
    desc: "ピンク×パープルの華やかなデザイン",
    preview: "bg-gradient-to-br from-pink-300 via-purple-200 to-yellow-100",
  },
  {
    value: "drinking",
    label: "飲み会テーマ",
    emoji: "🍻",
    desc: "提灯モチーフの居酒屋風デザイン",
    preview: "bg-gradient-to-br from-neutral-800 via-red-950 to-neutral-900",
  },
];
