"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Cluster, Tool } from "@/lib/types";

function PricingPill({ tool }: { tool: Tool }) {
  const label = tool.pricing.free && tool.pricing.paid
    ? "FREE & PRO"
    : tool.pricing.free
    ? "FREE"
    : tool.pricing.paid
    ? "PRO"
    : "";
  return (
    <span className="inline-block rounded-full px-2 py-1 text-xs font-semibold bg-zinc-800 text-white">
      {label}
    </span>
  );
}

export default function ToolCard({
  cluster,
  tool,
  onClose,
  onNext,
}: {
  cluster: Cluster;
  tool: Tool;
  onClose: () => void;
  onNext: () => void;
}) {
  const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE ?? "Sep 2025";
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-x-0 bottom-0 md:inset-auto md:right-4 md:top-4 md:bottom-4 md:w-[380px] z-40"
      aria-live="polite"
    >
      <div className="rounded-t-2xl md:rounded-2xl bg-zinc-950/90 backdrop-blur text-white border border-zinc-800 shadow-2xl p-4 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-lg md:text-xl font-semibold">{tool.name}</div>
            <div className="text-zinc-400 text-sm">{cluster.label}</div>
          </div>
          <PricingPill tool={tool} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {tool.tags.map((t) => (
            <span key={t} className="text-xs px-2 py-1 rounded-full bg-zinc-800/80">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 space-y-2 text-sm md:text-base leading-6">
          <p className="text-zinc-200">{tool.why_use}</p>
          <p className="text-zinc-400"><span className="font-semibold text-zinc-300">Best for:</span> {tool.best_for}</p>
          <p className="text-zinc-500 text-xs">Pricing notes: {tool.pricing.notes} — As of {buildDate}</p>
        </div>
        <div className="mt-5 flex gap-3">
          <a href={tool.links.site} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-md bg-white text-black px-3 py-2 text-sm font-semibold hover:bg-zinc-200 transition">
            Visit site
          </a>
          <button onClick={onNext} className="inline-flex items-center justify-center rounded-md bg-zinc-800 px-3 py-2 text-sm font-semibold hover:bg-zinc-700 transition">
            Next tool
          </button>
          <button onClick={onClose} className="ml-auto inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold hover:bg-zinc-800 transition">
            Back to cluster
          </button>
        </div>
      </div>
    </motion.div>
  );
}
