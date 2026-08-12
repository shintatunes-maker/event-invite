import AddToCalendarButton from "@/components/AddToCalendarButton";
import EventLocationMap from "@/components/EventLocationMap";
import OrganizerQuickLink from "@/components/OrganizerQuickLink";
import PackingList from "@/components/PackingList";
import RsvpDeadlineNotice from "@/components/RsvpDeadlineNotice";
import RsvpForm from "@/components/RsvpForm";
import ThemeFont from "@/components/ThemeFont";
import Watermark from "@/components/Watermark";
import { formatEventDate } from "@/lib/format";
import { getThemeDefinition } from "@/lib/themes";
import type { PublicEventRecord, RsvpCounts } from "@/lib/types";

interface Props {
  event: PublicEventRecord;
  counts: RsvpCounts;
}

// Renders every theme that doesn't have a bespoke design (BirthdayInvite /
// DrinkingInvite), fully driven by that theme's entry in
// src/lib/themes/registry.ts — background, badge/title accent, emoji, and
// light/dark card mode all come from the registry so a new theme just
// needs a registry entry to render correctly here.
export default function GenericInvite({ event, counts }: Props) {
  const def = getThemeDefinition(event.theme);
  const isDark = def.colors.mode === "dark";

  const cardClass = isDark
    ? "bg-neutral-900/80 border border-white/10 text-neutral-50"
    : "bg-white/85 text-neutral-900";
  const titleClass = isDark ? "text-neutral-50" : "text-neutral-900";
  const descriptionClass = isDark
    ? "text-neutral-200 border-t border-white/10"
    : "text-neutral-700 border-t border-black/10";
  const organizerClass = isDark ? "text-neutral-300" : "text-neutral-500";
  const titleFont = `'${def.colors.fontFamily}', sans-serif`;

  return (
    <main
      className={`relative min-h-screen overflow-hidden ${def.colors.preview} px-4 py-10 sm:py-16`}
    >
      <ThemeFont family={def.colors.fontFamily} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 text-4xl sm:text-5xl opacity-50 select-none"
      >
        <span className="absolute left-[6%] top-[8%]">{def.emoji}</span>
        <span className="absolute right-[8%] top-[14%]">{def.emoji}</span>
        <span className="absolute left-[12%] top-[70%]">{def.emoji}</span>
        <span className="absolute right-[10%] top-[65%]">{def.emoji}</span>
      </div>

      <div className="relative mx-auto w-full max-w-md">
        <div className="text-center mb-6">
          <p
            className={`animate-fade-in-up text-sm font-bold tracking-wide ${def.colors.accentText}`}
          >
            {def.emoji} {def.label} {def.emoji}
          </p>
          <h1
            className={`animate-fade-in-up mt-2 text-3xl sm:text-4xl font-extrabold leading-snug ${titleClass}`}
            style={{ animationDelay: "0.1s", fontFamily: titleFont }}
          >
            {event.title}
          </h1>
          {event.organizerName && (
            <p
              className={`animate-fade-in-up mt-2 text-sm ${organizerClass}`}
              style={{ animationDelay: "0.2s" }}
            >
              幹事: {event.organizerName}
            </p>
          )}
        </div>

        <div className={`rounded-3xl backdrop-blur p-6 shadow-lg mb-6 ${cardClass}`}>
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
            <p
              className={`mt-4 whitespace-pre-wrap text-sm pt-4 ${descriptionClass}`}
            >
              {event.description}
            </p>
          )}
          <PackingList
            eventId={event.id}
            items={event.packingList}
            dividerClassName={isDark ? "border-t border-white/10" : "border-t border-black/10"}
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
          <RsvpDeadlineNotice deadline={event.rsvpDeadline} theme={event.theme} />
        )}

        <RsvpForm eventId={event.id} theme={event.theme} initialCounts={counts} />
      </div>

      {!event.isPaid && <Watermark />}
      <OrganizerQuickLink eventId={event.id} />
    </main>
  );
}
