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
    <main className="flex-1 flex flex-col items-center justify-center bg-neutral-50 px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <p className="text-sm font-semibold text-neutral-400 mb-2">
          幹事のためのイベント招待アプリ
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-4">
          招待ページを作って、
          <br />
          URLをシェアするだけ。
        </h1>
        <p className="text-neutral-500 mb-10 leading-relaxed">
          飲み会や誕生日会の招待ページを作成し、URLをLINEなどで共有できます。
          <br />
          招待された側はアプリ不要、リンクを開いて参加/未定/不参加を回答するだけです。
        </p>

        <div className="grid grid-cols-2 gap-3 mb-10">
          {THEMES.map((t) => (
            <div
              key={t.label}
              className="rounded-xl overflow-hidden border border-neutral-200"
            >
              <div className={`h-16 ${t.preview}`} />
              <div className="p-3 bg-white text-sm font-semibold text-neutral-800">
                {t.emoji} {t.label}
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/create"
          className="inline-block rounded-full bg-neutral-900 text-white px-8 py-3.5 font-bold hover:bg-neutral-700 transition"
        >
          イベント招待ページを作成する
        </Link>
      </div>
    </main>
  );
}
