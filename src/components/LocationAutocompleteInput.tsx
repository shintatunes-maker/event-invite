"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className: string;
  maxLength?: number;
}

// @types/google.maps only declares the ambient `google` namespace, not a
// `Window.google` property, so we probe for it via `typeof` (safe even
// before the script tag below has run) instead of `window.google`.
function getGoogleMaps(): typeof google.maps | undefined {
  return typeof google !== "undefined" ? google.maps : undefined;
}

let scriptPromise: Promise<void> | null = null;

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (getGoogleMaps()?.places?.PlaceAutocompleteElement) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    // No `loading=async`: PlaceAutocompleteElement must exist by the time
    // `onload` fires, and `loading=async` defers Google's own internal
    // library init past that event, causing an intermittent race.
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Maps script failed to load"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

// PlaceAutocompleteElement renders its own internal input with its own
// padding, so the wrapper only needs the outer visual treatment (border,
// radius) — component padding utilities would double up with Google's.
function stripPadding(classes: string): string {
  return classes
    .split(/\s+/)
    .filter((c) => !/^p[xy]?-/.test(c))
    .join(" ");
}

// Autocompletes the "場所" field via the Google Places
// PlaceAutocompleteElement web component when
// NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is configured, so picking a suggestion
// fills the field automatically. Falls back to a plain text input if the
// key is missing or Google Maps fails to load/initialize — see
// src/components/EventLocationMap.tsx for the key-less display side of
// the map feature on the invite page.
export default function LocationAutocompleteInput({
  value,
  onChange,
  placeholder,
  className,
  maxLength,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<google.maps.places.PlaceAutocompleteElement | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [unavailable, setUnavailable] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey || !containerRef.current) return;

    let cancelled = false;
    let el: google.maps.places.PlaceAutocompleteElement | null = null;

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (cancelled || !containerRef.current) return;
        const PlaceAutocompleteElement = getGoogleMaps()?.places?.PlaceAutocompleteElement;
        if (!PlaceAutocompleteElement) {
          throw new Error("google.maps.places.PlaceAutocompleteElement unavailable");
        }

        el = new PlaceAutocompleteElement({});
        el.classList.add("w-full");
        if (placeholder) el.placeholder = placeholder;
        el.value = value;
        containerRef.current.appendChild(el);
        elementRef.current = el;

        el.addEventListener("input", () => {
          if (elementRef.current) onChangeRef.current(elementRef.current.value);
        });

        el.addEventListener("gmp-select", async (e) => {
          try {
            const { placePrediction } = e as unknown as {
              placePrediction: google.maps.places.PlacePrediction;
            };
            const place = placePrediction.toPlace();
            await place.fetchFields({ fields: ["displayName", "formattedAddress"] });
            const text = [place.displayName, place.formattedAddress]
              .filter((part): part is string => Boolean(part))
              .join(" ");
            if (text && elementRef.current) {
              elementRef.current.value = text;
              onChangeRef.current(text);
            }
          } catch {
            // Detail fetch failed; whatever the input already shows (from
            // the "input" listener above) is kept as-is.
          }
        });
      })
      .catch(() => {
        if (!cancelled) setUnavailable(true);
      });

    return () => {
      cancelled = true;
      el?.remove();
      elementRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  if (!apiKey || unavailable) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        maxLength={maxLength}
      />
    );
  }

  return <div ref={containerRef} className={stripPadding(className)} />;
}
