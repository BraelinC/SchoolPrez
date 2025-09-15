"use client";

import React from "react";
import type { Cluster, Tool } from "@/lib/types";
import { useFirstLoadableImage } from "@/lib/useFirstLoadableImage";

export default function ToolImageModal({
  cluster,
  tool,
  onReady,
}: {
  cluster: Cluster;
  tool: Tool;
  onReady?: () => void;
}) {
  const accent =
    cluster.color === "emerald"
      ? "ring-emerald-400/40"
      : cluster.color === "sky"
      ? "ring-sky-400/40"
      : cluster.color === "violet"
      ? "ring-violet-400/40"
      : cluster.color === "amber"
      ? "ring-amber-400/40"
      : "ring-white/20";

  // Preferred: explicit image path(s) on the tool data, or fall back to /logos/{id}.{ext}
  const exts = [".png", ".jpg", ".jpeg", ".webp", ".svg"];
  const explicitImages = Array.isArray(tool.image)
    ? (tool.image as string[])
    : tool.image
    ? [tool.image as string]
    : undefined;

  // normalize to absolute public paths if not already
  const normalizedExplicit = explicitImages?.map((p) => (p.startsWith("/") ? p : `/logos/${p}`));

  // derive fallback candidates from common names under /logos
  const nameKebab = tool.name.toLowerCase().replace(/\s+/g, "-");
  const nameTight = tool.name.toLowerCase().replace(/\s+/g, "");
  const fallbackBases = [`/logos/${tool.id}`, `/logos/${nameKebab}`, `/logos/${nameTight}`, `/logos/${tool.id}-1`];
  const fallbackCandidates = React.useMemo(() => {
    const list: string[] = [];
    for (const b of fallbackBases) for (const e of exts) list.push(`${b}${e}`);
    return list;
  }, [fallbackBases.join("|")]);

  const resolved = useFirstLoadableImage(
    normalizedExplicit && normalizedExplicit.length > 0
      ? normalizedExplicit
      : fallbackCandidates
  );

  // If probing and nothing resolved yet, don't render panel to avoid blank box
  if (resolved === undefined) return null; // probing
  if (resolved === null) return null; // nothing found

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center pr-[400px]">
      {/* Centered image panel sized to content */}
      <div className={`pointer-events-auto inline-block max-w-[90vw] max-h-[80vh] rounded-2xl bg-zinc-950/90 backdrop-blur border border-white/10 ring-1 ${accent} shadow-2xl p-3 md:p-4`}
      >
        {Array.isArray(tool.image) || tool.id === "codex" ? (
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {(Array.isArray(tool.image) ? tool.image : ["/logos/codex-1.png", "/logos/codex-2.png"]).map((p, i) => (
              <div key={i} className="bg-zinc-900/60 rounded-xl border border-white/10 p-4 lg:p-6 flex-1 flex items-center justify-center min-h-[40vh] lg:min-h-[50vh]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.startsWith("/") ? p : `/logos/${p}`}
                  alt={`${tool.name} ${i + 1}`}
                  className="block w-full h-auto max-h-[50vh] lg:max-h-[60vh] object-contain rounded-lg"
                  onLoad={() => onReady && onReady()}
                />
              </div>
            ))}
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolved as string}
            alt={tool.name}
            className="block w-auto h-auto max-w-[70vw] max-h-[70vh] object-contain rounded-xl bg-zinc-900/60 p-2 md:p-3 border border-white/10"
            onLoad={() => onReady && onReady()}
          />
        )}
      </div>
    </div>
  );
}

