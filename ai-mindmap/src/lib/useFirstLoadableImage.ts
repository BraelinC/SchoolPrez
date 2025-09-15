"use client";

import React from "react";

// Tries a list of candidate URLs in order. Returns:
// undefined while probing, string when one loads, null if none load.
export function useFirstLoadableImage(candidates: string[]) {
  const [src, setSrc] = React.useState<string | null | undefined>(undefined);

  React.useEffect(() => {
    let cancelled = false;
    setSrc(undefined);

    const tryOne = (url: string) =>
      new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (!cancelled) setSrc(url);
          resolve(true);
        };
        img.onerror = () => resolve(false);
        img.src = url;
      });

    (async () => {
      for (const url of candidates) {
        const ok = await tryOne(url);
        if (cancelled) return;
        if (ok) return; // src already set
      }
      if (!cancelled) setSrc(null);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(candidates)]);

  return src;
}

