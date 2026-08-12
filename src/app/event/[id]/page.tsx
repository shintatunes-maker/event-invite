import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BirthdayInvite from "@/components/invites/BirthdayInvite";
import DrinkingInvite from "@/components/invites/DrinkingInvite";
import GenericInvite from "@/components/invites/GenericInvite";
import { getCounts, getEvent } from "@/lib/db";
import { formatEventOgDescription } from "@/lib/format";
import { toPublicEvent } from "@/lib/publicEvent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return { title: "イベントが見つかりません" };
  }

  const description = formatEventOgDescription(
    event.date,
    event.time,
    event.location,
  );

  return {
    title: event.title,
    description,
    openGraph: {
      title: event.title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  const counts = await getCounts(id);
  const publicEvent = toPublicEvent(event);

  if (event.theme === "birthday") {
    return <BirthdayInvite event={publicEvent} counts={counts} />;
  }
  if (event.theme === "drinking") {
    return <DrinkingInvite event={publicEvent} counts={counts} />;
  }
  return <GenericInvite event={publicEvent} counts={counts} />;
}
