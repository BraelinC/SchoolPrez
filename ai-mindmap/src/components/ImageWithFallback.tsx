"use client";

import React from "react";

export default function ImageWithFallback({
  bases,
  alt,
  className,
  onLoaded,
  onExhausted,
}: {
  bases: string[]; // e.g., ["/images/codex-1", "/images/codex-2"] without extension
  alt: string;
  className?: string;
  onLoaded?: () => void;
  onExhausted?: () => void;
}) {
  const exts = [".png", ".jpg", ".jpeg", ".webp", ".svg"];
  const candidates = React.useMemo(() => {
    const list: string[] = [];
    for (const b of bases) for (const e of exts) list.push(`${b}${e}`);
    return list;
  }, [bases]);

  const [idx, setIdx] = React.useState(0);
  const src = idx < candidates.length ? candidates[idx] : undefined;

  React.useEffect(() => {
    if (idx >= candidates.length) {
      onExhausted && onExhausted();
      if (typeof window !== "undefined") {
        // Helpful debug hint so you can see what paths were tried
        // without spamming the console repeatedly.
        console.warn("ImageWithFallback: no candidate image found", { candidates });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, candidates.length]);

  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onLoad={() => onLoaded && onLoaded()}
      onError={() => setIdx((i) => i + 1)}
      draggable={false}
    />
  );
}
