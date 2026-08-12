"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LocationAutocompleteInput from "@/components/LocationAutocompleteInput";
import PackingListEditor from "@/components/PackingListEditor";
import Spinner from "@/components/Spinner";
import ThemePicker from "@/components/ThemePicker";
import VenueSearchButton from "@/components/VenueSearchButton";
import { packingListsEqual } from "@/lib/packingList";
import { getThemeDefinition } from "@/lib/themes";
import type { EventTheme } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-neutral-300 px-4 py-2 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200 hover:border-neutral-400";

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
  const [venueArea, setVenueArea] = useState("");
  const [rsvpDeadline, setRsvpDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [packingList, setPackingList] = useState<string[]>([]);

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
        setVenueArea(event.venueArea ?? "");
        setRsvpDeadline(event.rsvpDeadline ?? "");
        setDescription(event.description);
        setOrganizerName(event.organizerName);
        setPackingList(event.packingList ?? []);
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

  function handleThemeChange(nextTheme: EventTheme) {
    const wasDefault = packingListsEqual(
      packingList,
      getThemeDefinition(theme).defaultPackingList,
    );
    setTheme(nextTheme);
    if (wasDefault) {
      setPackingList(getThemeDefinition(nextTheme).defaultPackingList);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !date || !time) {
      setError("イベント名・日付・時間は必須です");
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
          venueArea: venueArea.trim(),
          description: description.trim(),
          organizerName: organizerName.trim(),
          rsvpDeadline,
          packingList,
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
        <div className="flex items-center gap-2 text-neutral-500">
          <Spinner />
          読み込み中...
        </div>
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
          <ThemePicker value={theme} onChange={handleThemeChange} />

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">
              イベント名
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
                step={600}
                className={inputClass}
              />
            </div>
          </div>

          {!location.trim() && (
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">
                エリア(任意)
              </label>
              <input
                type="text"
                value={venueArea}
                onChange={(e) => setVenueArea(e.target.value)}
                placeholder="渋谷"
                className={inputClass}
                maxLength={50}
              />
              <p className="mt-1 text-xs text-neutral-400 mb-2">
                下のボタンからお店を探して、決まったら下の「場所」欄に入力してください
              </p>
              <VenueSearchButton theme={theme} area={venueArea} />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">
              場所(任意)
            </label>
            <LocationAutocompleteInput
              value={location}
              onChange={setLocation}
              className={inputClass}
              maxLength={100}
            />
            <p className="mt-1 text-xs text-neutral-400">
              まだ決まっていない場合は空欄のままでOKです
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">
              回答期限(任意)
            </label>
            <input
              type="date"
              value={rsvpDeadline}
              onChange={(e) => setRsvpDeadline(e.target.value)}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-neutral-400">
              招待ページに「あと◯日」と表示されます。過ぎても回答はブロックされません
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">
              幹事名(任意)
            </label>
            <input
              type="text"
              value={organizerName}
              onChange={(e) => setOrganizerName(e.target.value)}
              className={inputClass}
              maxLength={40}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">
              持ち物リスト(任意)
            </label>
            <p className="mb-2 text-xs text-neutral-400">
              招待ページにチェックリストとして表示されます。自由に追加・削除できます
            </p>
            <PackingListEditor items={packingList} onChange={setPackingList} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">
              説明・持ち物など(任意)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
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
            {submitting ? "保存中..." : "変更を保存する"}
          </button>
        </form>
      </div>
    </main>
  );
}
