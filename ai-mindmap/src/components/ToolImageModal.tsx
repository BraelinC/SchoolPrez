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
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center pr-[25vw]">
      <div className="pointer-events-auto flex min-h-full w-full justify-center items-start overflow-y-auto py-[2vh] px-[2vw]">
        <div className="flex w-full max-w-[70vw] flex-col items-stretch gap-[1.5vh]">
          <div
            className={`rounded-2xl bg-zinc-950/90 backdrop-blur border border-white/10 ring-1 ${accent} shadow-2xl overflow-hidden`}
          >
            <div className="p-3 lg:p-[1vw]">
              {Array.isArray(tool.image) || tool.id === "codex" ? (
                <div className="flex flex-col lg:flex-row gap-[1vw]">
                  {(Array.isArray(tool.image) ? tool.image : ["/logos/codex-1.png", "/logos/codex-2.png"]).map((p, i) => (
                    <div
                      key={i}
                      className="bg-zinc-900/60 rounded-xl border border-white/10 p-[1vw] flex-1 flex items-center justify-center min-h-[35vh] lg:min-h-[40vh]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.startsWith("/") ? p : `/logos/${p}`}
                        alt={`${tool.name} ${i + 1}`}
                        className="block w-full h-auto max-h-[45vh] lg:max-h-[50vh] object-contain rounded-lg"
                        onLoad={() => onReady && onReady()}
                      />
                    </div>
                  ))}
                </div>
              ) : tool.id === "replit" ? (
                <div className="rounded-xl bg-zinc-900/60 border border-white/10 overflow-hidden">
                  <div className="relative w-full aspect-video">
                    <iframe
                      src="https://www.youtube.com/embed/TAXRZyGV1Dw?start=42"
                      title="Replit Tutorial Video"
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={() => onReady && onReady()}
                    />
                  </div>
                </div>
              ) : tool.id === "lovable" ? (
                <div className="rounded-xl bg-zinc-900/60 border border-white/10 overflow-hidden">
                  <div className="relative w-full aspect-video">
                    <iframe
                      src="https://www.youtube.com/embed/mOak_imYmqU"
                      title="Lovable Tutorial Video"
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={() => onReady && onReady()}
                    />
                  </div>
                </div>
              ) : tool.id === "claudecode" ? (
                <div className="rounded-xl bg-zinc-900/60 border border-white/10 overflow-hidden">
                  <div className="relative w-full aspect-video">
                    <iframe
                      src="https://www.youtube.com/embed/iYiuzAsWnHU"
                      title="Claude Code Tutorial Video"
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={() => onReady && onReady()}
                    />
                  </div>
                </div>
              ) : tool.id === "vibecode" ? (
                <div className="rounded-xl bg-zinc-900/60 border border-white/10 overflow-hidden">
                  <div className="relative w-full aspect-video">
                    <iframe
                      src="https://www.youtube.com/embed/s50dOsodoVQ"
                      title="Vibecode App Tutorial Video"
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={() => onReady && onReady()}
                    />
                  </div>
                </div>
              ) : tool.id === "cursor" ? (
                <div className="rounded-xl bg-zinc-900/60 border border-white/10 overflow-hidden">
                  <div className="relative w-full aspect-video">
                    <iframe
                      src="https://www.youtube.com/embed/2WnxKCFAXAM"
                      title="Cursor Tutorial Video"
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={() => onReady && onReady()}
                    />
                  </div>
                </div>
              ) : tool.id === "notebooklm" ? (
                <div className="rounded-xl bg-zinc-900/60 border border-white/10 overflow-hidden">
                  <div className="relative w-full aspect-video">
                    <iframe
                      src="https://www.youtube.com/embed/qbt-MFVvQQY"
                      title="NotebookLM Tutorial Video"
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={() => onReady && onReady()}
                    />
                  </div>
                </div>
              ) : tool.id === "comet" ? (
                <div className="rounded-xl bg-zinc-900/60 border border-white/10 overflow-hidden">
                  <div className="relative w-full aspect-video">
                    <iframe
                      src="https://www.youtube.com/embed/YeldJ4UezDQ"
                      title="Comet Tutorial Video"
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={() => onReady && onReady()}
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-zinc-900/60 p-[0.5vw] border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolved as string}
                    alt={tool.name}
                    className="block w-full h-auto object-contain rounded-lg"
                    onLoad={() => onReady && onReady()}
                  />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
