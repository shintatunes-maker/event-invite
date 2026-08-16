"use client";

import { useEffect, useState } from "react";

interface Props {
  value: string; // "YYYY-MM-DD" or ""
  onChange: (value: string) => void;
  className: string;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 4 }, (_, i) => CURRENT_YEAR + i);
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function parseValue(value: string): [number, number, number] {
  if (!value) return [0, 0, 0];
  const [y, m, d] = value.split("-").map(Number);
  return [y || 0, m || 0, d || 0];
}

// Native <input type="date"> renders inconsistently on iOS Safari — it can
// ignore the CSS width of its container and render at its own intrinsic
// size, overflowing the surrounding card. Plain <select> elements don't
// have that problem, so this builds the same YYYY-MM-DD value from three
// selects instead.
export default function DateSelect({ value, onChange, className }: Props) {
  const [parts, setParts] = useState<[number, number, number]>(() => parseValue(value));

  useEffect(() => {
    setParts(parseValue(value));
  }, [value]);

  const [y, m, d] = parts;
  const dayCount = y && m ? daysInMonth(y, m) : 31;
  const dayOptions = Array.from({ length: dayCount }, (_, i) => i + 1);

  function update(nextY: number, nextM: number, nextD: number) {
    setParts([nextY, nextM, nextD]);
    if (nextY && nextM && nextD) {
      const clampedD = Math.min(nextD, daysInMonth(nextY, nextM));
      const pad = (n: number) => String(n).padStart(2, "0");
      onChange(`${nextY}-${pad(nextM)}-${pad(clampedD)}`);
    } else {
      onChange("");
    }
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      <select
        value={y || ""}
        onChange={(e) => update(Number(e.target.value), m, d)}
        className={className}
      >
        <option value="">年</option>
        {YEAR_OPTIONS.map((year) => (
          <option key={year} value={year}>
            {year}年
          </option>
        ))}
      </select>
      <select
        value={m || ""}
        onChange={(e) => update(y, Number(e.target.value), d)}
        className={className}
      >
        <option value="">月</option>
        {MONTH_OPTIONS.map((month) => (
          <option key={month} value={month}>
            {month}月
          </option>
        ))}
      </select>
      <select
        value={d || ""}
        onChange={(e) => update(y, m, Number(e.target.value))}
        className={className}
      >
        <option value="">日</option>
        {dayOptions.map((day) => (
          <option key={day} value={day}>
            {day}日
          </option>
        ))}
      </select>
    </div>
  );
}
