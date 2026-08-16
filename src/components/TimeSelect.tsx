"use client";

import { useEffect, useState } from "react";

interface Props {
  value: string; // "HH:mm" or ""
  onChange: (value: string) => void;
  className: string;
}

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => i);
const BASE_MINUTE_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function parseValue(value: string): [number | null, number | null] {
  if (!value) return [null, null];
  const [h, m] = value.split(":").map(Number);
  return [Number.isFinite(h) ? h : null, Number.isFinite(m) ? m : null];
}

// Native <input type="time"> is unreliable on iOS Safari: its picker wheel
// is well-documented to ignore the `step` attribute (always showing every
// minute), and the input can render at its own intrinsic size regardless
// of CSS width. Plain <select> elements sidestep both problems and let us
// only offer 5-minute increments directly.
export default function TimeSelect({ value, onChange, className }: Props) {
  const [parts, setParts] = useState<[number | null, number | null]>(() => parseValue(value));

  useEffect(() => {
    setParts(parseValue(value));
  }, [value]);

  const [h, m] = parts;
  // Keep an existing non-5-multiple minute (from an event saved before this
  // change) selectable rather than silently discarding it.
  const minuteOptions =
    m !== null && !BASE_MINUTE_OPTIONS.includes(m)
      ? [...BASE_MINUTE_OPTIONS, m].sort((a, b) => a - b)
      : BASE_MINUTE_OPTIONS;

  function update(nextH: number | null, nextM: number | null) {
    setParts([nextH, nextM]);
    if (nextH !== null && nextM !== null) {
      const pad = (n: number) => String(n).padStart(2, "0");
      onChange(`${pad(nextH)}:${pad(nextM)}`);
    } else {
      onChange("");
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <select
        value={h ?? ""}
        onChange={(e) => update(e.target.value === "" ? null : Number(e.target.value), m)}
        className={className}
      >
        <option value="">時</option>
        {HOUR_OPTIONS.map((hour) => (
          <option key={hour} value={hour}>
            {hour}時
          </option>
        ))}
      </select>
      <select
        value={m ?? ""}
        onChange={(e) => update(h, e.target.value === "" ? null : Number(e.target.value))}
        className={className}
      >
        <option value="">分</option>
        {minuteOptions.map((minute) => (
          <option key={minute} value={minute}>
            {String(minute).padStart(2, "0")}分
          </option>
        ))}
      </select>
    </div>
  );
}
