import { formatEventDateShort, getRsvpDeadlineInfo } from "@/lib/format";
import { getThemeDefinition } from "@/lib/themes";
import type { EventTheme } from "@/lib/types";

interface Props {
  deadline: string;
  theme: EventTheme;
}

export default function RsvpDeadlineNotice({ deadline, theme }: Props) {
  const info = getRsvpDeadlineInfo(deadline);
  if (!info) return null;

  const { daysLeft, isPast, isUrgent } = info;
  const { mode, accentText } = getThemeDefinition(theme).colors;
  const isLight = mode === "light";

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
      ? isLight
        ? `bg-white/60 ${accentText} opacity-60`
        : `bg-neutral-800/60 ${accentText} opacity-60 border border-neutral-700/50`
      : isLight
        ? `bg-white/80 ${accentText}`
        : `bg-neutral-900/70 ${accentText} border border-white/10`;

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
