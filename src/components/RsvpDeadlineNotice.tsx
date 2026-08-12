import { formatEventDateShort, getRsvpDeadlineInfo } from "@/lib/format";
import type { EventTheme } from "@/lib/types";

interface Props {
  deadline: string;
  theme: EventTheme;
}

export default function RsvpDeadlineNotice({ deadline, theme }: Props) {
  const info = getRsvpDeadlineInfo(deadline);
  if (!info) return null;

  const { daysLeft, isPast, isUrgent } = info;

  let text: string;
  if (isPast) {
    text = "回答期限は過ぎています";
  } else if (daysLeft === 0) {
    text = "⚠️ 本日が回答期限です";
  } else if (daysLeft === 1) {
    text = "⚠️ 回答期限まであと1日";
  } else {
    text = `📅 回答期限まであと${daysLeft}日`;
  }

  const styles = isUrgent
    ? "bg-red-500 text-white shadow-md shadow-red-300/50"
    : isPast
      ? theme === "birthday"
        ? "bg-white/60 text-purple-400"
        : "bg-neutral-800/60 text-neutral-400 border border-neutral-700/50"
      : theme === "birthday"
        ? "bg-white/80 text-purple-700"
        : "bg-neutral-900/70 text-amber-200 border border-amber-800/40";

  return (
    <div
      className={`mb-6 rounded-2xl px-4 py-2.5 text-center text-sm font-bold ${styles}`}
    >
      {text}
      {!isPast && (
        <span className="ml-1.5 font-normal opacity-80">
          ({formatEventDateShort(deadline)}まで)
        </span>
      )}
    </div>
  );
}
