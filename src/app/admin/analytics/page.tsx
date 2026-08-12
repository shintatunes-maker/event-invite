"use client";

import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { THEME_OPTIONS } from "@/lib/themeOptions";
import type { AnalyticsSummary } from "@/lib/types";

const TOKEN_STORAGE_KEY = "event-invite:analytics-token";

export default function AnalyticsPage() {
  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(withToken: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/analytics", {
        headers: { "x-analytics-token": withToken },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          res.status === 401 ? "パスワードが違います" : data?.error ?? "読み込みに失敗しました",
        );
      }
      setSummary(data.summary);
      setToken(withToken);
      window.sessionStorage.setItem(TOKEN_STORAGE_KEY, withToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "読み込みに失敗しました");
      window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const saved = window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (saved) load(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    load(tokenInput.trim());
  }

  if (!token || !summary) {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-2xl bg-white shadow-sm p-8"
        >
          <h1 className="text-lg font-bold text-neutral-900 mb-1">
            利用状況ダッシュボード
          </h1>
          <p className="text-sm text-neutral-500 mb-4">
            自分専用の集計画面です。パスワードを入力してください
          </p>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="パスワード"
            className="w-full rounded-xl border border-neutral-300 px-4 py-2 outline-none focus:ring-2 focus:ring-neutral-400 mb-3"
          />
          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 text-white py-2.5 font-semibold hover:bg-neutral-700 transition disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "確認中..." : "表示する"}
          </button>
        </form>
      </main>
    );
  }

  const themeTotalRaw =
    summary.themeCounts.birthday + summary.themeCounts.drinking;
  const themeTotal = themeTotalRaw || 1;
  const responseTotal =
    summary.responseCounts.yes +
    summary.responseCounts.maybe +
    summary.responseCounts.no;

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold tracking-wide text-neutral-400 mb-1">
              自分専用ダッシュボード
            </p>
            <h1 className="text-2xl font-bold text-neutral-900">
              利用状況の集計
            </h1>
          </div>
          <button
            onClick={() => load(token)}
            className="rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition"
          >
            更新
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl bg-white shadow-sm p-6">
            <p className="text-xs font-semibold text-neutral-400 mb-1">
              累計イベント作成数
            </p>
            <p className="text-3xl font-extrabold text-neutral-900">
              {summary.totalEvents}
            </p>
          </div>
          <div className="rounded-2xl bg-white shadow-sm p-6">
            <p className="text-xs font-semibold text-neutral-400 mb-1">
              匿名IDのリピート率
            </p>
            <p className="text-3xl font-extrabold text-neutral-900">
              {(summary.repeatRate * 100).toFixed(0)}%
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              {summary.repeatCreators} / {summary.uniqueCreators} 人が複数回作成
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-sm p-6 mb-6">
          <p className="text-sm font-semibold text-neutral-700 mb-4">
            テーマ別の選択割合
          </p>
          <div className="space-y-3">
            {THEME_OPTIONS.map((opt) => {
              const count = summary.themeCounts[opt.value];
              const pct = Math.round((count / themeTotal) * 100);
              return (
                <div key={opt.value}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-neutral-700">
                      {opt.emoji} {opt.label}
                    </span>
                    <span className="text-neutral-500">
                      {count}件 ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className={`h-full ${opt.value === "birthday" ? "bg-pink-400" : "bg-neutral-700"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-sm p-6">
          <p className="text-sm font-semibold text-neutral-700 mb-4">
            回答数の合計(全イベント)
          </p>
          <div className="flex gap-4 mb-4">
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-pink-50 text-pink-700">
              🙆 参加 {summary.responseCounts.yes}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-amber-50 text-amber-700">
              🤔 未定 {summary.responseCounts.maybe}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-neutral-100 text-neutral-500">
              🙅 不参加 {summary.responseCounts.no}
            </span>
          </div>
          <p className="text-xs text-neutral-400">合計 {responseTotal} 件の回答</p>
        </div>
      </div>
    </main>
  );
}
