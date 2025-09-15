"use client";

import React from "react";
import type { Cluster } from "@/lib/types";

export default function ComparisonStrip({ cluster }: { cluster: Cluster }) {
  const accent =
    cluster.color === "emerald"
      ? "border-emerald-400/40"
      : cluster.color === "sky"
      ? "border-sky-400/40"
      : cluster.color === "violet"
      ? "border-violet-400/40"
      : cluster.color === "amber"
      ? "border-amber-400/40"
      : "border-white/20";

  return (
    <div className="fixed left-4 right-4 top-16 z-40">
      <div className="flex items-start gap-4 overflow-x-auto pb-2 -mb-2 pr-1">
        {cluster.nodes.map((tool) => (
          <div
            key={tool.id}
            className={`shrink-0 w-[360px] rounded-xl bg-zinc-950/85 backdrop-blur border ${accent} text-zinc-200 p-4 shadow-lg`}
          >
            <div className="text-base font-semibold text-white truncate flex items-center gap-2" title={tool.name}>
              {(() => {
                const map: Record<string, string> = {
                  replit: "/logos/replit-logo.jpg",
                  lovable: "/logos/lovable-logo.jpg",
                  vibecode: "/logos/vibecode-logo.jpg",
                  cursor: "/logos/cursor-logo.jpg",
                  claudecode: "/logos/claude-logo.jpg",
                  claude: "/logos/claude-logo.jpg",
                  perplexity: "/logos/perplexity-logo.png",
                  comet: "/logos/perplexity-logo.png",
                  chatgpt: "/logos/chatgpt-logo.svg",
                  codex: "/logos/chatgpt-logo.svg",
                  notebooklm: "/logos/notebooklm-logo.jpg",
                  ai_studio: "/logos/ai_studio-logo.png",
                } as const;
                const id = tool.id as keyof typeof map;
                const src = map[id];
                const whiteBg = tool.id === "chatgpt" || tool.id === "codex";
                return src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" className={`w-6 h-6 object-contain ${whiteBg ? 'bg-white rounded-[4px] p-0.5' : ''}`} />
                ) : null;
              })()}
              <span>{tool.name}</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="rounded-md bg-zinc-900/70 p-3">
                <div className="text-sm font-semibold text-emerald-300">Pros</div>
                <ul className="mt-2 list-disc pl-5 marker:text-emerald-300 text-sm text-zinc-200 min-h-[36px] font-mono space-y-1">
                  {(tool.pros ?? []).length === 0 ? null : tool.pros!.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-md bg-zinc-900/70 p-3">
                <div className="text-sm font-semibold text-rose-300">Cons</div>
                <ul className="mt-2 list-disc pl-5 marker:text-rose-300 text-sm text-zinc-200 min-h-[36px] font-mono space-y-1">
                  {(tool.cons ?? []).length === 0 ? null : tool.cons!.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
