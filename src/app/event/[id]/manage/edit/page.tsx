"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { THEME_OPTIONS } from "@/lib/themeOptions";
import type { EventTheme } from "@/lib/types";

export default function EditEventPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [theme, setTheme] = useState<EventTheme>("birthday");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [organizerName, setOrganizerName] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await fetch(`/api/events/${params.id}/manage`, {
          headers: { "x-admin-token": token },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            res.status === 401
              ? "この管理URLは無効です(トークンが一致しません)"
              : data?.error ?? "読み込みに失敗しました",
          );
        }
        const event = data.event;
        setTheme(event.theme);
        setTitle(event.title);
        setDate(event.date);
        setTime(event.time);
        setLocation(event.location);
        setDescription(event.description);
        setOrganizerName(event.organizerName);
      } catch (err) {
        setLoadError(
          err instanceof Error ? err.message : "読み込みに失敗しました",
        );
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !date || !time || !location.trim()) {
      setError("イベント名・日付・時間・場所は必須です");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/events/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
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
        throw new Error(data?.error ?? "更新に失敗しました");
      }
      router.push(`/event/${params.id}/manage?token=${token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <p className="text-neutral-500">読み込み中...</p>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-md p-8 text-center">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="text-neutral-700">{loadError}</p>
          <Link href="/" className="mt-4 inline-block text-sm text-neutral-500 underline">
            トップに戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-8">
          <Link
            href={`/event/${params.id}/manage?token=${token}`}
            className="text-sm text-neutral-500 hover:underline"
          >
            ← 管理画面に戻る
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-neutral-900">
            イベント情報を編集
          </h1>
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
                  className={`text-left rounded-xl border-2 overflow-hidden transition ${
                    theme === opt.value
                      ? "border-neutral-900"
                      : "border-transparent"
                  }`}
                >
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
              className="w-full rounded-xl border border-neutral-300 px-4 py-2 outline-none focus:ring-2 focus:ring-neutral-400"
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
                className="w-full rounded-xl border border-neutral-300 px-4 py-2 outline-none focus:ring-2 focus:ring-neutral-400"
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
                className="w-full rounded-xl border border-neutral-300 px-4 py-2 outline-none focus:ring-2 focus:ring-neutral-400"
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
              className="w-full rounded-xl border border-neutral-300 px-4 py-2 outline-none focus:ring-2 focus:ring-neutral-400"
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
              className="w-full rounded-xl border border-neutral-300 px-4 py-2 outline-none focus:ring-2 focus:ring-neutral-400"
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
              className="w-full rounded-xl border border-neutral-300 px-4 py-2 outline-none focus:ring-2 focus:ring-neutral-400"
              maxLength={500}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-neutral-900 text-white py-3 font-bold hover:bg-neutral-700 transition disabled:opacity-50"
          >
            {submitting ? "保存中..." : "変更を保存する"}
          </button>
        </form>
      </div>
    </main>
  );
}
