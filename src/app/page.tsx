import Link from "next/link";

const THEMES = [
  {
    emoji: "🎂",
    label: "誕生日会テーマ",
    preview: "bg-gradient-to-br from-pink-300 via-purple-200 to-yellow-100",
  },
  {
    emoji: "🍻",
    label: "飲み会テーマ",
    preview: "bg-gradient-to-br from-neutral-800 via-red-950 to-neutral-900",
  },
];

export default function Home() {
  return (
    <main className="relative flex-1 flex flex-col items-center justify-center overflow-hidden bg-neutral-50 px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 select-none"
      >
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-pink-200/60 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-amber-200/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-purple-200/50 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg text-center">
        <p className="text-sm font-semibold tracking-wide text-neutral-400 mb-2">
          幹事のためのイベント招待アプリ
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-4 leading-tight">
          招待ページを作って、
          <br />
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 bg-clip-text text-transparent">
            URLをシェアするだけ。
          </span>
        </h1>
        <p className="text-neutral-500 mb-10 leading-relaxed">
          飲み会や誕生日会の招待ページを作成し、URLをLINEなどで共有できます。
          <br />
          招待された側はアプリ不要、リンクを開いて参加/未定/不参加を回答するだけです。
        </p>

        <div className="grid grid-cols-2 gap-4 mb-10">
          {THEMES.map((t) => (
            <div
              key={t.label}
              className="group rounded-2xl overflow-hidden border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`h-20 ${t.preview} transition group-hover:brightness-105`} />
              <div className="p-3 text-sm font-semibold text-neutral-800">
                {t.emoji} {t.label}
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/create"
          className="inline-block rounded-full bg-gradient-to-r from-neutral-900 to-neutral-700 text-white px-8 py-3.5 font-bold shadow-lg shadow-neutral-900/20 hover:shadow-xl hover:shadow-neutral-900/30 hover:-translate-y-0.5 transition"
        >
          イベント招待ページを作成する
        </Link>
      </div>
    </main>
  );
}
