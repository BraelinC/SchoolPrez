"use client";

import React from "react";
import type { Cluster } from "@/lib/types";

export default function ComparisonModal({ cluster, onClose }: { cluster: Cluster; onClose: () => void }) {
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
    <div
      className="fixed inset-0 z-40 flex items-center justify-center px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className={`w-full max-w-[95rem] rounded-2xl bg-zinc-950/90 backdrop-blur border ${accent} p-6 md:p-8 shadow-2xl antialiased font-mono`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {cluster.nodes.map((tool) => (
            <div key={tool.id} className="rounded-xl bg-zinc-900/70 p-4 md:p-5 border border-white/10 flex flex-col">
              <div className="text-base md:text-lg font-semibold tracking-wide text-white mb-3 truncate flex items-center gap-3" title={tool.name}>
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
                    <img src={src} alt="" className={`w-8 h-8 md:w-9 md:h-9 object-contain ${whiteBg ? 'bg-white rounded-md p-0.5' : ''}`} />
                  ) : null;
                })()}
                <span>{tool.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 flex-1 items-stretch content-stretch">
                <div className="rounded-md bg-zinc-900/80 p-3 h-full">
                  <div className="text-sm md:text-base font-semibold tracking-wide text-emerald-300">Pros</div>
                  <ul className="mt-2 list-disc pl-5 marker:text-emerald-300 text-sm md:text-base leading-6 text-zinc-200 space-y-1.5 font-mono">
                    {(tool.pros ?? []).length === 0 ? null : tool.pros!.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
                <div className="rounded-md bg-zinc-900/80 p-3 h-full">
                  <div className="text-sm md:text-base font-semibold tracking-wide text-rose-300">Cons</div>
                  <ul className="mt-2 list-disc pl-5 marker:text-rose-300 text-sm md:text-base leading-6 text-zinc-200 space-y-1.5 font-mono">
                    {(tool.cons ?? []).length === 0 ? null : tool.cons!.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

