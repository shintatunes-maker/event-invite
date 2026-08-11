"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatEventDate } from "@/lib/format";
import type { PublicEventRecord, ResponseRecord, RsvpCounts } from "@/lib/types";

const STATUS_LABELS: Record<string, { label: string; emoji: string }> = {
  yes: { label: "参加", emoji: "🙆" },
  maybe: { label: "未定", emoji: "🤔" },
  no: { label: "不参加", emoji: "🙅" },
};

export default function ManagePage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [event, setEvent] = useState<PublicEventRecord | null>(null);
  const [responses, setResponses] = useState<ResponseRecord[]>([]);
  const [counts, setCounts] = useState<RsvpCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [togglingPaid, setTogglingPaid] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
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
      setEvent(data.event);
      setResponses(data.responses);
      setCounts(data.counts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, token]);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${params.id}`, {
        method: "DELETE",
        headers: { "x-admin-token": token },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "削除に失敗しました");
      }
      setDeleted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "削除に失敗しました");
    } finally {
      setDeleting(false);
    }
  }

  async function handleTogglePaid() {
    if (!event) return;
    setTogglingPaid(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${params.id}/upgrade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({ isPaid: !event.isPaid }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "更新に失敗しました");
      }
      setEvent(data.event);
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗しました");
    } finally {
      setTogglingPaid(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <p className="text-neutral-500">読み込み中...</p>
      </main>
    );
  }

  if (deleted) {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-md p-8 text-center">
          <p className="text-4xl mb-3">🗑️</p>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">
            イベントを削除しました
          </h1>
          <Link href="/create" className="text-sm text-neutral-600 underline">
            新しいイベントを作成する
          </Link>
        </div>
      </main>
    );
  }

  if (error && !event) {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-md p-8 text-center">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="text-neutral-700">{error}</p>
          <Link href="/" className="mt-4 inline-block text-sm text-neutral-500 underline">
            トップに戻る
          </Link>
        </div>
      </main>
    );
  }

  if (!event || !counts) return null;

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6">
          <p className="text-sm font-semibold text-neutral-400 mb-1">
            幹事管理画面
          </p>
          <h1 className="text-2xl font-bold text-neutral-900">{event.title}</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {formatEventDate(event.date)} {event.time}〜 ・ {event.location}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href={`/event/${params.id}`}
            target="_blank"
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
          >
            招待ページを見る
          </Link>
          <Link
            href={`/event/${params.id}/manage/edit?token=${token}`}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
          >
            イベント情報を編集
          </Link>
          {!confirmingDelete ? (
            <button
              onClick={() => setConfirmingDelete(true)}
              className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              イベントを削除
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2">
              <span className="text-sm text-red-700">本当に削除しますか？</span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "削除中..." : "削除する"}
              </button>
              <button
                onClick={() => setConfirmingDelete(false)}
                className="rounded-lg px-3 py-1 text-xs font-semibold text-neutral-500 hover:bg-neutral-100"
              >
                キャンセル
              </button>
            </div>
          )}
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-500">{error}</p>
        )}

        <div className="rounded-2xl bg-white shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm font-semibold text-neutral-700">
                プラン: {event.isPaid ? "有料(透かしなし)" : "無料(透かし表示中)"}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">
                ※デモ用の切り替えです。実際の決済連携は未実装です
              </p>
            </div>
            <button
              onClick={handleTogglePaid}
              disabled={togglingPaid}
              className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-bold text-white hover:bg-neutral-700 disabled:opacity-50"
            >
              {togglingPaid
                ? "更新中..."
                : event.isPaid
                  ? "無料プランに戻す(デモ)"
                  : "有料プランにアップグレード(デモ)"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-sm p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <span className="text-sm font-semibold text-pink-600">
              🙆 参加 {counts.yes}人
            </span>
            <span className="text-sm font-semibold text-yellow-600">
              🤔 未定 {counts.maybe}人
            </span>
            <span className="text-sm font-semibold text-neutral-500">
              🙅 不参加 {counts.no}人
            </span>
          </div>

          {responses.length === 0 ? (
            <p className="text-sm text-neutral-400">まだ回答がありません</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-400 border-b border-neutral-100">
                    <th className="py-2 pr-3 font-medium">名前</th>
                    <th className="py-2 pr-3 font-medium">出欠</th>
                    <th className="py-2 pr-3 font-medium">メッセージ</th>
                    <th className="py-2 font-medium">回答日時</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((r) => (
                    <tr key={r.id} className="border-b border-neutral-50">
                      <td className="py-2 pr-3 font-semibold text-neutral-800">
                        {r.name}
                      </td>
                      <td className="py-2 pr-3">
                        {STATUS_LABELS[r.status]?.emoji}{" "}
                        {STATUS_LABELS[r.status]?.label}
                      </td>
                      <td className="py-2 pr-3 text-neutral-500">
                        {r.comment || "-"}
                      </td>
                      <td className="py-2 text-neutral-400 whitespace-nowrap">
                        {new Date(r.createdAt).toLocaleString("ja-JP")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
