import { notFound } from "next/navigation";
import BirthdayInvite from "@/components/invites/BirthdayInvite";
import DrinkingInvite from "@/components/invites/DrinkingInvite";
import { getCounts, getEvent } from "@/lib/db";
import { toPublicEvent } from "@/lib/publicEvent";

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

  if (event.theme === "drinking") {
    return <DrinkingInvite event={publicEvent} counts={counts} />;
  }
  return <BirthdayInvite event={publicEvent} counts={counts} />;
}
