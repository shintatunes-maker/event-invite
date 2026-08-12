import { ImageResponse } from "next/og";
import { getEvent } from "@/lib/db";
import { formatEventOgDescription } from "@/lib/format";
import { getThemeDefinition } from "@/lib/themes";
import type { EventTheme } from "@/lib/types";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// next/og renders via Satori, which needs plain CSS values (not Tailwind
// classes), so each theme gets its own small hex palette here — chosen to
// match its registry entry's gradient/mode (see src/lib/themes/registry.ts)
// rather than reusing the Tailwind class strings directly.
interface OgStyle {
  gradient: string;
  badge: string;
  title: string;
  subtitle: string;
  footer: string;
}

const OG_STYLES: Record<EventTheme, OgStyle> = {
  birthday: {
    gradient: "linear-gradient(135deg, #f9a8d4 0%, #d8b4fe 50%, #fef08a 100%)",
    badge: "#a21caf",
    title: "#581c87",
    subtitle: "#701a75",
    footer: "#a855f7",
  },
  drinking: {
    gradient: "linear-gradient(135deg, #171717 0%, #450a0a 55%, #171717 100%)",
    badge: "#fbbf24",
    title: "#fef3c7",
    subtitle: "#fde68a",
    footer: "#a3a3a3",
  },
  farewell: {
    gradient: "linear-gradient(135deg, #172554 0%, #1e293b 55%, #d97706 100%)",
    badge: "#fcd34d",
    title: "#fef9c3",
    subtitle: "#fde68a",
    footer: "#cbd5e1",
  },
  ladies: {
    gradient: "linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fdba74 100%)",
    badge: "#ea580c",
    title: "#7c2d12",
    subtitle: "#9a3412",
    footer: "#c2410c",
  },
  reunion: {
    gradient: "linear-gradient(135deg, #fef08a 0%, #fcd34d 50%, #334155 100%)",
    badge: "#334155",
    title: "#1e293b",
    subtitle: "#475569",
    footer: "#64748b",
  },
  housewarming: {
    gradient: "linear-gradient(135deg, #e0f2fe 0%, #ffffff 50%, #7dd3fc 100%)",
    badge: "#0284c7",
    title: "#0c4a6e",
    subtitle: "#0369a1",
    footer: "#38bdf8",
  },
  running: {
    gradient: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #facc15 100%)",
    badge: "#fef9c3",
    title: "#ffffff",
    subtitle: "#eff6ff",
    footer: "#dbeafe",
  },
  futsal: {
    gradient: "linear-gradient(135deg, #22c55e 0%, #6ee7b7 50%, #ffffff 100%)",
    badge: "#14532d",
    title: "#ffffff",
    subtitle: "#f0fdf4",
    footer: "#dcfce7",
  },
  hiking: {
    gradient: "linear-gradient(135deg, #4d7c0f 0%, #854d0e 50%, #44403c 100%)",
    badge: "#fde68a",
    title: "#fefce8",
    subtitle: "#fef3c7",
    footer: "#d6d3d1",
  },
  golf: {
    gradient: "linear-gradient(135deg, #059669 0%, #15803d 50%, #172554 100%)",
    badge: "#6ee7b7",
    title: "#ecfdf5",
    subtitle: "#d1fae5",
    footer: "#a7f3d0",
  },
  bbq: {
    gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #14532d 100%)",
    badge: "#fed7aa",
    title: "#fff7ed",
    subtitle: "#ffedd5",
    footer: "#fdba74",
  },
  wellness: {
    gradient: "linear-gradient(135deg, #fff7ed 0%, #f5f5f4 50%, #ffffff 100%)",
    badge: "#c2410c",
    title: "#292524",
    subtitle: "#57534e",
    footer: "#a8a29e",
  },
};

const OLD_BROWSER_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36";

// Google Fonts serves .ttf (Satori-compatible) instead of .woff2 when asked
// with an old browser UA, and `text=` limits the response to only the
// glyphs actually used, keeping the fetch small. `weight` is omitted for
// theme display fonts, most of which only ship a single (non-700) weight.
async function loadGoogleFontTTF(
  family: string,
  text: string,
  weight?: number,
): Promise<ArrayBuffer | null> {
  try {
    const familyParam = weight ? `${family}:wght@${weight}` : family;
    const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(familyParam)}&text=${encodeURIComponent(text)}`;
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

  const def = event ? getThemeDefinition(event.theme) : null;
  const style = OG_STYLES[event?.theme ?? "birthday"];
  const title = event?.title ?? "イベント招待";
  const subtitle = event
    ? formatEventOgDescription(event.date, event.time, event.location)
    : "幹事のためのイベント招待アプリ";
  const badge = def ? `${def.emoji} ${def.label}` : "🎉 イベント招待";
  const themeFontFamily = def?.colors.fontFamily;

  const [bodyFontData, themeFontData] = await Promise.all([
    loadGoogleFontTTF("Noto Sans JP", subtitle + "イベント招待", 700),
    themeFontFamily ? loadGoogleFontTTF(themeFontFamily, badge + title) : null,
  ]);

  const fonts: {
    name: string;
    data: ArrayBuffer;
    style: "normal";
    weight: 400 | 700;
  }[] = [];
  if (bodyFontData) {
    fonts.push({ name: "Noto Sans JP", data: bodyFontData, style: "normal", weight: 700 });
  }
  if (themeFontFamily && themeFontData) {
    fonts.push({ name: themeFontFamily, data: themeFontData, style: "normal", weight: 400 });
  }

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
          background: style.gradient,
          fontFamily: bodyFontData ? "Noto Sans JP" : undefined,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: 2,
            color: style.badge,
            marginBottom: 28,
            fontFamily: themeFontData ? themeFontFamily : undefined,
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
            color: style.title,
            lineHeight: 1.3,
            fontFamily: themeFontData ? themeFontFamily : undefined,
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
            color: style.subtitle,
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
            color: style.footer,
            opacity: 0.7,
          }}
        >
          イベント招待
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
      emoji: "twemoji",
    },
  );
}
