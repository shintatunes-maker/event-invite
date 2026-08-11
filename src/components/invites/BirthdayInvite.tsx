import RsvpForm from "@/components/RsvpForm";
import Watermark from "@/components/Watermark";
import { formatEventDate } from "@/lib/format";
import type { PublicEventRecord, RsvpCounts } from "@/lib/types";

interface Props {
  event: PublicEventRecord;
  counts: RsvpCounts;
}

export default function BirthdayInvite({ event, counts }: Props) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-200 via-purple-100 to-yellow-100 px-4 py-10 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 text-4xl sm:text-5xl opacity-70 select-none"
      >
        <span className="absolute left-[6%] top-[8%]">🎈</span>
        <span className="absolute right-[8%] top-[14%]">🎉</span>
        <span className="absolute left-[12%] top-[70%]">🎂</span>
        <span className="absolute right-[10%] top-[65%]">🎁</span>
        <span className="absolute left-[45%] top-[4%] text-3xl">✨</span>
        <span className="absolute right-[20%] top-[85%] text-3xl">🎈</span>
      </div>

      <div className="relative mx-auto w-full max-w-md">
        <div className="text-center mb-6">
          <p className="text-sm font-bold tracking-wide text-purple-500">
            🎂 BIRTHDAY PARTY 招待状 🎂
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent leading-snug">
            {event.title}
          </h1>
          {event.organizerName && (
            <p className="mt-2 text-sm text-purple-600">
              幹事: {event.organizerName}
            </p>
          )}
        </div>

        <div className="rounded-3xl bg-white/80 backdrop-blur p-6 shadow-lg mb-6 text-purple-950">
          <dl className="space-y-3 text-sm sm:text-base">
            <div className="flex items-center gap-3">
              <dt className="text-xl">📅</dt>
              <dd className="font-semibold">
                {formatEventDate(event.date)} {event.time}〜
              </dd>
            </div>
            <div className="flex items-center gap-3">
              <dt className="text-xl">📍</dt>
              <dd className="font-semibold">{event.location}</dd>
            </div>
          </dl>
          {event.description && (
            <p className="mt-4 whitespace-pre-wrap text-sm text-purple-800 border-t border-purple-100 pt-4">
              {event.description}
            </p>
          )}
        </div>

        <RsvpForm eventId={event.id} theme="birthday" initialCounts={counts} />
      </div>

      {!event.isPaid && <Watermark />}
    </main>
  );
}
