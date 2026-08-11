"use client";

import { useState } from "react";
import Spinner from "@/components/Spinner";
import type { EventTheme, RsvpCounts, RsvpStatus } from "@/lib/types";

interface RsvpFormProps {
  eventId: string;
  theme: EventTheme;
  initialCounts: RsvpCounts;
}

const STATUS_OPTIONS: { value: RsvpStatus; label: string; emoji: string }[] = [
  { value: "yes", label: "参加", emoji: "🙆" },
  { value: "maybe", label: "未定", emoji: "🤔" },
  { value: "no", label: "不参加", emoji: "🙅" },
];

const THEME_STYLES: Record<
  EventTheme,
  {
    card: string;
    label: string;
    input: string;
    countBadge: (status: RsvpStatus) => string;
    selectedButton: (status: RsvpStatus) => string;
    unselectedButton: string;
    submitButton: string;
    error: string;
    success: string;
    link: string;
  }
> = {
  birthday: {
    card: "bg-white/90 text-purple-950",
    label: "text-purple-900",
    input:
      "bg-white border border-purple-200 text-purple-950 placeholder:text-purple-300 focus:border-pink-400 focus:ring-pink-300",
    countBadge: (status) =>
      status === "yes"
        ? "bg-pink-100 text-pink-700"
        : status === "maybe"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-purple-100 text-purple-700",
    selectedButton: (status) =>
      status === "yes"
        ? "bg-pink-500 text-white shadow-lg shadow-pink-300/50"
        : status === "maybe"
          ? "bg-yellow-400 text-white shadow-lg shadow-yellow-300/50"
          : "bg-purple-400 text-white shadow-lg shadow-purple-300/50",
    unselectedButton:
      "bg-white text-purple-500 border border-purple-200 hover:bg-purple-50",
    submitButton:
      "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90 disabled:opacity-50",
    error: "text-red-500",
    success: "text-purple-700",
    link: "text-pink-600 underline underline-offset-2",
  },
  drinking: {
    card: "bg-neutral-900/85 text-amber-50 border border-amber-800/50",
    label: "text-amber-200",
    input:
      "bg-neutral-800 border border-amber-700/60 text-amber-50 placeholder:text-neutral-500 focus:border-amber-400 focus:ring-amber-500",
    countBadge: (status) =>
      status === "yes"
        ? "bg-amber-500/20 text-amber-300"
        : status === "maybe"
          ? "bg-orange-500/20 text-orange-300"
          : "bg-neutral-700/50 text-neutral-300",
    selectedButton: (status) =>
      status === "yes"
        ? "bg-amber-500 text-neutral-900 shadow-lg shadow-amber-500/40"
        : status === "maybe"
          ? "bg-orange-500 text-neutral-900 shadow-lg shadow-orange-500/40"
          : "bg-neutral-500 text-neutral-900 shadow-lg shadow-neutral-500/40",
    unselectedButton:
      "bg-neutral-800 text-amber-100 border border-amber-700/40 hover:bg-neutral-700",
    submitButton:
      "bg-amber-500 text-neutral-900 font-bold hover:bg-amber-400 disabled:opacity-50",
    error: "text-red-400",
    success: "text-amber-300",
    link: "text-amber-300 underline underline-offset-2",
  },
};

export default function RsvpForm({
  eventId,
  theme,
  initialCounts,
}: RsvpFormProps) {
  const styles = THEME_STYLES[theme];
  const [name, setName] = useState("");
  const [status, setStatus] = useState<RsvpStatus | null>(null);
  const [comment, setComment] = useState("");
  const [counts, setCounts] = useState<RsvpCounts>(initialCounts);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedAs, setSubmittedAs] = useState<RsvpStatus | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (name.trim() === "") {
      setError("お名前を入力してください");
      return;
    }
    if (!status) {
      setError("参加/未定/不参加のいずれかを選択してください");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/events/${eventId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), status, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "送信に失敗しました");
      }
      setCounts(data.counts as RsvpCounts);
      setSubmittedAs(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={`rounded-3xl p-6 sm:p-8 shadow-xl ${styles.card}`}>
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {STATUS_OPTIONS.map((opt) => (
          <span
            key={opt.value}
            className={`px-3 py-1 rounded-full text-sm font-semibold ${styles.countBadge(
              opt.value,
            )}`}
          >
            {opt.emoji} {opt.label} {counts[opt.value]}人
          </span>
        ))}
      </div>

      {submittedAs ? (
        <div className="text-center py-4">
          <p className={`text-lg font-bold ${styles.success}`}>
            回答ありがとうございます！
            {STATUS_OPTIONS.find((o) => o.value === submittedAs)?.emoji}{" "}
            「{STATUS_OPTIONS.find((o) => o.value === submittedAs)?.label}」で
            送信しました
          </p>
          <button
            type="button"
            className={`mt-3 text-sm ${styles.link}`}
            onClick={() => setSubmittedAs(null)}
          >
            回答を変更する
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-semibold mb-1 ${styles.label}`}>
              お名前
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田 太郎"
              className={`w-full rounded-xl px-4 py-2 outline-none focus:ring-2 ${styles.input}`}
              maxLength={40}
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${styles.label}`}>
              出欠
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`rounded-xl py-3 text-sm font-bold transition hover:-translate-y-0.5 ${
                    status === opt.value
                      ? styles.selectedButton(opt.value)
                      : styles.unselectedButton
                  }`}
                >
                  <div className="text-xl">{opt.emoji}</div>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-1 ${styles.label}`}>
              ひとことメッセージ(任意)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="楽しみにしています!"
              rows={2}
              className={`w-full rounded-xl px-4 py-2 outline-none focus:ring-2 ${styles.input}`}
              maxLength={200}
            />
          </div>

          {error && <p className={`text-sm ${styles.error}`}>{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 font-bold shadow-md hover:-translate-y-0.5 hover:shadow-lg transition disabled:translate-y-0 ${styles.submitButton}`}
          >
            {submitting && <Spinner />}
            {submitting ? "送信中..." : "この内容で回答する"}
          </button>
        </form>
      )}
    </div>
  );
}
