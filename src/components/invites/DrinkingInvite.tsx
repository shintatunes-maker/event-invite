import AddToCalendarButton from "@/components/AddToCalendarButton";
import EventLocationMap from "@/components/EventLocationMap";
import OrganizerQuickLink from "@/components/OrganizerQuickLink";
import PackingList from "@/components/PackingList";
import RsvpDeadlineNotice from "@/components/RsvpDeadlineNotice";
import RsvpForm from "@/components/RsvpForm";
import ThemeFont from "@/components/ThemeFont";
import Watermark from "@/components/Watermark";
import { formatEventDate } from "@/lib/format";
import type { PublicEventRecord, RsvpCounts } from "@/lib/types";

const TITLE_FONT = "'RocknRoll One', sans-serif";

interface Props {
  event: PublicEventRecord;
  counts: RsvpCounts;
}

export default function DrinkingInvite({ event, counts }: Props) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-neutral-950 via-red-950 to-neutral-950 px-4 py-10 sm:py-16">
      <ThemeFont family="RocknRoll One" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 text-4xl sm:text-5xl opacity-60 select-none"
      >
        <span className="animate-gentle-sway absolute left-[6%] top-[8%] inline-block">
          🏮
        </span>
        <span className="animate-gentle-bob absolute right-[8%] top-[10%]">
          🍻
        </span>
        <span
          className="animate-gentle-bob absolute left-[10%] top-[72%]"
          style={{ animationDelay: "0.5s" }}
        >
          🍢
        </span>
        <span
          className="animate-gentle-bob absolute right-[10%] top-[68%]"
          style={{ animationDelay: "1s" }}
        >
          🍶
        </span>
        <span
          className="animate-gentle-bob absolute left-[45%] top-[85%] text-3xl"
          style={{ animationDelay: "1.5s" }}
        >
          🍺
        </span>
      </div>

      <div className="relative mx-auto w-full max-w-md">
        <div className="text-center mb-6">
          <p className="animate-fade-in-up text-sm font-bold tracking-widest text-amber-400">
            🍻 飲み会のお誘い 🍻
          </p>
          <h1
            className="animate-fade-in-up mt-2 text-3xl sm:text-4xl font-extrabold text-amber-50 leading-snug"
            style={{ animationDelay: "0.1s", fontFamily: TITLE_FONT }}
          >
            {event.title}
          </h1>
          {event.organizerName && (
            <p
              className="animate-fade-in-up mt-2 text-sm text-amber-300/80"
              style={{ animationDelay: "0.2s" }}
            >
              幹事: {event.organizerName}
            </p>
          )}
        </div>

        <div className="rounded-3xl bg-neutral-900/80 border border-amber-800/50 backdrop-blur p-6 shadow-lg mb-6 text-amber-50">
          <dl className="space-y-3 text-sm sm:text-base">
            <div className="flex items-center gap-3">
              <dt className="text-xl">📅</dt>
              <dd className="font-semibold">
                {formatEventDate(event.date)} {event.time}〜
              </dd>
            </div>
            <div className="flex items-center gap-3">
              <dt className="text-xl">📍</dt>
              <dd className="font-semibold">
                {event.location || "会場は未定です"}
              </dd>
            </div>
          </dl>
          <EventLocationMap location={event.location} />
          {event.description && (
            <p className="mt-4 whitespace-pre-wrap text-sm text-amber-100/90 border-t border-amber-800/40 pt-4">
              {event.description}
            </p>
          )}
          <PackingList
            eventId={event.id}
            items={event.packingList}
            dividerClassName="border-t border-amber-800/40"
          />
        </div>

        <AddToCalendarButton
          event={{
            id: event.id,
            title: event.title,
            date: event.date,
            time: event.time,
            location: event.location,
            description: event.description,
          }}
        />

        {event.rsvpDeadline && (
          <RsvpDeadlineNotice deadline={event.rsvpDeadline} theme="drinking" />
        )}

        <RsvpForm eventId={event.id} theme="drinking" initialCounts={counts} />
      </div>

      {!event.isPaid && <Watermark />}
      <OrganizerQuickLink eventId={event.id} />
    </main>
  );
}
