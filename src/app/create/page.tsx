"use client";

import Link from "next/link";
import { useState } from "react";
import Spinner from "@/components/Spinner";
import { THEME_OPTIONS } from "@/lib/themeOptions";
import type { EventTheme } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-neutral-300 px-4 py-2 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200 hover:border-neutral-400";

interface CreatedEvent {
  id: string;
  adminToken: string;
}

export default function CreatePage() {
  const [theme, setTheme] = useState<EventTheme>("birthday");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedEvent | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedManage, setCopiedManage] = useState(false);

  const shareUrl =
    created && typeof window !== "undefined"
      ? `${window.location.origin}/event/${created.id}`
      : "";
  const manageUrl =
    created && typeof window !== "undefined"
      ? `${window.location.origin}/event/${created.id}/manage?token=${created.adminToken}`
      : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !date || !time || !location.trim()) {
      setError("イベント名・日付・時間・場所は必須です");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme,
          title: title.trim(),
          date,
          time,
          location: location.trim(),
          description: description.trim(),
          organizerName: organizerName.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "作成に失敗しました");
      }
      setCreated({ id: data.event.id, adminToken: data.event.adminToken });
    } catch (err) {
      setError(err instanceof Error ? err.message : "作成に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setCreated(null);
    setTitle("");
    setDate("");
    setTime("");
    setLocation("");
    setDescription("");
    setOrganizerName("");
    setCopiedShare(false);
    setCopiedManage(false);
  }

  async function copyText(
    text: string,
    setCopied: (v: boolean) => void,
  ) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable; user can select the text manually
    }
  }

  if (created) {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-md p-8 text-center">
          <p className="text-4xl mb-3">✅</p>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">
            招待ページを作成しました
          </h1>
          <p className="text-sm text-neutral-500 mb-4">
            このURLをLINEなどで共有してください
          </p>

          <div className="rounded-xl bg-neutral-100 px-4 py-3 text-sm text-neutral-800 break-all mb-3">
            {shareUrl}
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <button
              onClick={() => copyText(shareUrl, setCopiedShare)}
              className="w-full rounded-xl bg-neutral-900 text-white py-2.5 font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition"
            >
              {copiedShare ? "コピーしました！" : "招待URLをコピー"}
            </button>
            <Link
              href={`/event/${created.id}`}
              target="_blank"
              className="w-full rounded-xl border border-neutral-300 py-2.5 font-semibold text-neutral-700 hover:bg-neutral-50 transition text-center"
            >
              招待ページを見る
            </Link>
          </div>

          <div className="text-left rounded-xl border border-amber-200 bg-amber-50 p-4 mb-6">
            <p className="text-xs font-bold text-amber-800 mb-1">
              🔑 幹事用 管理URL(重要・自分だけ保管してください)
            </p>
            <p className="text-xs text-amber-700 mb-2">
              回答者一覧の確認、イベントの編集・削除に使います。他の人には共有しないでください。このURLは今しか表示されません。
            </p>
            <div className="rounded-lg bg-white px-3 py-2 text-xs text-neutral-800 break-all mb-2 border border-amber-100">
              {manageUrl}
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => copyText(manageUrl, setCopiedManage)}
                className="w-full rounded-lg bg-amber-500 text-white py-2 text-sm font-semibold hover:bg-amber-600 transition"
              >
                {copiedManage ? "コピーしました！" : "管理URLをコピー"}
              </button>
              <Link
                href={`/event/${created.id}/manage?token=${created.adminToken}`}
                className="w-full rounded-lg border border-amber-300 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100 transition text-center"
              >
                管理画面を開く
              </Link>
            </div>
          </div>

          <button
            onClick={resetForm}
            className="text-sm text-neutral-500 underline underline-offset-2"
          >
            別のイベントを作成する
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-8">
          <Link href="/" className="text-sm text-neutral-500 hover:underline">
            ← トップに戻る
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-neutral-900">
            イベント招待ページを作成
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            必要事項を入力すると、共有用のURLが発行されます
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl bg-white shadow-sm p-6 sm:p-8"
        >
          <div>
            <span className="block text-sm font-semibold text-neutral-700 mb-2">
              テーマを選択
            </span>
            <div className="grid grid-cols-2 gap-3">
              {THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTheme(opt.value)}
                  className={`relative text-left rounded-xl border-2 overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md ${
                    theme === opt.value
                      ? "border-neutral-900 shadow-sm"
                      : "border-transparent"
                  }`}
                >
                  {theme === opt.value && (
                    <span className="absolute top-2 right-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[10px] text-white">
                      ✓
                    </span>
                  )}
                  <div className={`h-14 ${opt.preview}`} />
                  <div className="p-3 bg-white">
                    <p className="font-semibold text-sm text-neutral-900">
                      {opt.emoji} {opt.label}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">
              イベント名
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="〇〇さん誕生日会 / 忘年会"
              className={inputClass}
              maxLength={60}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">
                日付
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">
                時間
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">
              場所
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="居酒屋 〇〇 渋谷店"
              className={inputClass}
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">
              幹事名(任意)
            </label>
            <input
              type="text"
              value={organizerName}
              onChange={(e) => setOrganizerName(e.target.value)}
              placeholder="山田 太郎"
              className={inputClass}
              maxLength={40}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">
              説明・持ち物など(任意)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="会費3000円、プレゼント不要です"
              className={inputClass}
              maxLength={500}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-700 text-white py-3 font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50 disabled:translate-y-0 disabled:shadow-md"
          >
            {submitting && <Spinner />}
            {submitting ? "作成中..." : "招待ページを作成する"}
          </button>
        </form>
      </div>
    </main>
  );
}
