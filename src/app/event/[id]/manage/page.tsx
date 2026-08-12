"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { formatEventDate, formatEventOgDescription } from "@/lib/format";
import { saveOrganizerToken } from "@/lib/organizerTokens";
import { WATERMARK_REMOVAL_PRICE_JPY } from "@/lib/pricing";
import { canUseWebShare, shareInvite } from "@/lib/share";
import type { PublicEventRecord, ResponseRecord, RsvpCounts } from "@/lib/types";

const STATUS_STYLES: Record<
  string,
  { label: string; emoji: string; badge: string; pill: string }
> = {
  yes: {
    label: "参加",
    emoji: "🙆",
    badge: "bg-pink-50 text-pink-700",
    pill: "bg-pink-100 text-pink-700",
  },
  maybe: {
    label: "未定",
    emoji: "🤔",
    badge: "bg-amber-50 text-amber-700",
    pill: "bg-amber-100 text-amber-700",
  },
  no: {
    label: "不参加",
    emoji: "🙅",
    badge: "bg-neutral-100 text-neutral-500",
    pill: "bg-neutral-200 text-neutral-600",
  },
};

export default function ManagePage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const checkoutSessionId = searchParams.get("checkout_session_id");
  const checkoutCancelled = searchParams.get("checkout") === "cancelled";

  const [event, setEvent] = useState<PublicEventRecord | null>(null);
  const [responses, setResponses] = useState<ResponseRecord[]>([]);
  const [counts, setCounts] = useState<RsvpCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<{
    type: "success" | "info";
    text: string;
  } | null>(null);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(canUseWebShare());
  }, []);

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
      saveOrganizerToken(params.id, token);
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

  useEffect(() => {
    if (!token) return;

    function cleanUrl() {
      router.replace(`/event/${params.id}/manage?token=${token}`);
    }

    if (checkoutSessionId) {
      (async () => {
        try {
          const res = await fetch(
            `/api/events/${params.id}/checkout/confirm?session_id=${encodeURIComponent(checkoutSessionId)}`,
            { headers: { "x-admin-token": token } },
          );
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data?.error ?? "決済の確認に失敗しました");
          }
          if (data.paid) {
            setEvent(data.event);
            setCheckoutMessage({
              type: "success",
              text: "購入が完了しました。透かしが非表示になりました！",
            });
          } else {
            setCheckoutMessage({
              type: "info",
              text: "決済が完了していません。時間をおいて再度お試しください。",
            });
          }
        } catch (err) {
          setCheckoutMessage({
            type: "info",
            text: err instanceof Error ? err.message : "決済の確認に失敗しました",
          });
        } finally {
          cleanUrl();
        }
      })();
    } else if (checkoutCancelled) {
      setCheckoutMessage({ type: "info", text: "決済がキャンセルされました" });
      cleanUrl();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutSessionId, checkoutCancelled, token]);

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

  async function handlePurchase() {
    setPurchasing(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${params.id}/checkout`, {
        method: "POST",
        headers: { "x-admin-token": token },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "決済ページの作成に失敗しました");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "決済ページの作成に失敗しました");
      setPurchasing(false);
    }
  }

  async function handleShare() {
    if (!event || typeof window === "undefined") return;
    await shareInvite({
      title: event.title,
      text: formatEventOgDescription(event.date, event.time, event.location),
      url: `${window.location.origin}/event/${params.id}`,
    });
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
    <main className="relative min-h-screen overflow-hidden bg-neutral-50 px-4 py-10 sm:py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-pink-100/60 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-amber-100/50 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-2xl">
        <div className="mb-6">
          <p className="text-sm font-semibold tracking-wide text-neutral-400 mb-1">
            幹事管理画面
          </p>
          <h1 className="text-2xl font-bold text-neutral-900">{event.title}</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {formatEventDate(event.date)} {event.time}〜 ・ {event.location}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {canShare && (
            <button
              onClick={handleShare}
              className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md transition"
            >
              招待URLをシェア
            </button>
          )}
          <Link
            href={`/event/${params.id}`}
            target="_blank"
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition"
          >
            招待ページを見る
          </Link>
          <Link
            href={`/event/${params.id}/manage/edit?token=${token}`}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition"
          >
            イベント情報を編集
          </Link>
          {!confirmingDelete ? (
            <button
              onClick={() => setConfirmingDelete(true)}
              className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:bg-red-50 transition"
            >
              イベントを削除
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2">
              <span className="text-sm text-red-700">本当に削除しますか？</span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting && <Spinner className="h-3 w-3" />}
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

        {checkoutMessage && (
          <div
            className={`mb-4 rounded-xl px-4 py-3 text-sm font-semibold ${
              checkoutMessage.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-neutral-100 text-neutral-600 border border-neutral-200"
            }`}
          >
            {checkoutMessage.text}
          </div>
        )}

        {error && (
          <p className="mb-4 text-sm text-red-500">{error}</p>
        )}

        <div className="rounded-2xl bg-white shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{event.isPaid ? "💎" : "🔓"}</span>
              <div>
                <p className="text-sm font-semibold text-neutral-700">
                  プラン: {event.isPaid ? "有料(透かしなし)" : "無料(透かし表示中)"}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {event.isPaid
                    ? "ご購入ありがとうございます"
                    : "Stripeのテスト決済で購入できます(実際の課金は発生しません)"}
                </p>
              </div>
            </div>
            {event.isPaid ? (
              <span className="rounded-xl bg-green-50 border border-green-200 px-4 py-2 text-sm font-bold text-green-700">
                ✓ 購入済み
              </span>
            ) : (
              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md transition disabled:opacity-50 disabled:translate-y-0 bg-gradient-to-r from-amber-500 to-pink-500 hover:brightness-105"
              >
                {purchasing && <Spinner className="h-3.5 w-3.5" />}
                {purchasing
                  ? "決済ページを準備中..."
                  : `有料プランを購入する (¥${WATERMARK_REMOVAL_PRICE_JPY})`}
              </button>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {(["yes", "maybe", "no"] as const).map((status) => (
              <span
                key={status}
                className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_STYLES[status].badge}`}
              >
                {STATUS_STYLES[status].emoji} {STATUS_STYLES[status].label} {counts[status]}人
              </span>
            ))}
          </div>

          {responses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm text-neutral-400">まだ回答がありません</p>
            </div>
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
                  {responses.map((r, i) => (
                    <tr
                      key={r.id}
                      className={`border-b border-neutral-50 transition hover:bg-neutral-50 ${
                        i % 2 === 1 ? "bg-neutral-50/50" : ""
                      }`}
                    >
                      <td className="py-2.5 pr-3 font-semibold text-neutral-800">
                        {r.name}
                      </td>
                      <td className="py-2.5 pr-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[r.status]?.pill}`}
                        >
                          {STATUS_STYLES[r.status]?.emoji} {STATUS_STYLES[r.status]?.label}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3 text-neutral-500">
                        {r.comment || "-"}
                      </td>
                      <td className="py-2.5 text-neutral-400 whitespace-nowrap">
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
