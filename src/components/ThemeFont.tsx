interface Props {
  family: string;
}

// Loads a Google Font by family name via Google's own CSS endpoint, which
// splits the font into per-unicode-range chunks — the browser only fetches
// the ranges actually used by the rendered text, so this stays cheap even
// for large Japanese font files. React 19 hoists any <link>/<meta> element
// rendered anywhere in the tree into <head> automatically, so this can be
// dropped directly inside an invite page component.
export default function ThemeFont({ family }: Props) {
  const query = family.trim().replace(/\s+/g, "+");
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?family=${query}&display=swap`}
      />
    </>
  );
}
