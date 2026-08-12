// Fixed (non-random) piece configs — randomizing at render time would
// cause a server/client hydration mismatch since this renders inside a
// server component tree.
const PIECES: {
  left: string;
  delay: number;
  duration: number;
  drift: number;
  color: string;
}[] = [
  { left: "4%", delay: 0, duration: 5.5, drift: 18, color: "bg-pink-400" },
  { left: "12%", delay: 1.8, duration: 6.2, drift: -14, color: "bg-yellow-300" },
  { left: "20%", delay: 0.6, duration: 5.8, drift: 22, color: "bg-purple-400" },
  { left: "30%", delay: 2.4, duration: 6.6, drift: -10, color: "bg-pink-300" },
  { left: "40%", delay: 1.1, duration: 5.4, drift: 16, color: "bg-amber-300" },
  { left: "50%", delay: 3.0, duration: 6.0, drift: -20, color: "bg-purple-300" },
  { left: "60%", delay: 0.3, duration: 5.9, drift: 12, color: "bg-pink-400" },
  { left: "70%", delay: 2.0, duration: 6.4, drift: -16, color: "bg-yellow-300" },
  { left: "80%", delay: 1.5, duration: 5.6, drift: 20, color: "bg-purple-400" },
  { left: "88%", delay: 0.9, duration: 6.1, drift: -12, color: "bg-pink-300" },
  { left: "95%", delay: 2.7, duration: 5.7, drift: 14, color: "bg-amber-300" },
  { left: "55%", delay: 3.6, duration: 6.3, drift: -18, color: "bg-pink-400" },
];

export default function Confetti() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 h-[480px] w-full overflow-hidden select-none"
    >
      {PIECES.map((p, i) => (
        <span
          key={i}
          className={`absolute top-0 h-2.5 w-1.5 rounded-sm ${p.color} animate-confetti-fall`}
          style={{
            left: p.left,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ["--confetti-drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
