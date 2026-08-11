import { ImageResponse } from "next/og";
import { getEvent } from "@/lib/db";
import { formatEventOgDescription } from "@/lib/format";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const OLD_BROWSER_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36";

// Google Fonts serves .ttf (Satori-compatible) instead of .woff2 when asked
// with an old browser UA, and `text=` limits the response to only the
// glyphs actually used, keeping the fetch small.
async function loadNotoSansJP(text: string): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=${encodeURIComponent(text)}`;
    const cssRes = await fetch(cssUrl, {
      headers: { "User-Agent": OLD_BROWSER_USER_AGENT },
    });
    const css = await cssRes.text();
    const match = css.match(/src: url\(([^)]+)\)/);
    if (!match) return null;
    const fontRes = await fetch(match[1]);
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);

  const isDrinking = event?.theme === "drinking";
  const title = event?.title ?? "イベント招待";
  const subtitle = event
    ? formatEventOgDescription(event.date, event.time, event.location)
    : "幹事のためのイベント招待アプリ";
  const badge = isDrinking ? "🍻 飲み会のお誘い" : "🎂 BIRTHDAY PARTY 招待状";

  const fontData = await loadNotoSansJP(
    title + subtitle + badge + "イベント招待",
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 100px",
          background: isDrinking
            ? "linear-gradient(135deg, #171717 0%, #450a0a 55%, #171717 100%)"
            : "linear-gradient(135deg, #f9a8d4 0%, #d8b4fe 50%, #fef08a 100%)",
          fontFamily: fontData ? "Noto Sans JP" : undefined,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: 2,
            color: isDrinking ? "#fbbf24" : "#a21caf",
            marginBottom: 28,
          }}
        >
          {badge}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 700,
            textAlign: "center",
            color: isDrinking ? "#fef3c7" : "#581c87",
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            fontWeight: 700,
            marginTop: 36,
            color: isDrinking ? "#fde68a" : "#701a75",
            opacity: 0.85,
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 36,
            display: "flex",
            fontSize: 24,
            fontWeight: 700,
            color: isDrinking ? "#a3a3a3" : "#a855f7",
            opacity: 0.7,
          }}
        >
          イベント招待
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: "Noto Sans JP", data: fontData, style: "normal", weight: 700 }]
        : [],
      emoji: "twemoji",
    },
  );
}
