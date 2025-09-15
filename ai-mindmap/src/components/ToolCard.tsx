"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Cluster, Tool } from "@/lib/types";

function PricingPill({ tool }: { tool: Tool }) {
  const notes = tool.pricing.notes || "";
  const extractPrice = (text: string) => {
    // Find first money/range like ~$20–25 or $200 or 20–25
    const m = text.match(/(~?\$?\d+(?:[–-]\d+)?)(?:\s*(?:\/\s*)?mo)?/i);
    if (m) {
      const val = m[1].replace(/^~?/, (x) => (x ? "~" : ""));
      const normalized = val.startsWith("$") ? val : `$${val}`;
      return `${normalized}/mo`;
    }
    return "$20/mo"; // sensible default
  };
  const price = extractPrice(notes);
  let label = "";
  if (tool.pricing.free && !tool.pricing.paid) {
    label = "FREE";
  } else if (tool.pricing.paid) {
    label = price;
  }
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
  const markerClass =
    cluster.color === "emerald"
      ? "marker:text-emerald-300"
      : cluster.color === "sky"
      ? "marker:text-sky-300"
      : cluster.color === "violet"
      ? "marker:text-violet-300"
      : cluster.color === "amber"
      ? "marker:text-amber-300"
      : "marker:text-white/70";
  const textClass =
    cluster.color === "emerald"
      ? "text-emerald-200"
      : cluster.color === "sky"
      ? "text-sky-200"
      : cluster.color === "violet"
      ? "text-violet-200"
      : cluster.color === "amber"
      ? "text-amber-200"
      : "text-white";

  const defaultSignupMap: Record<string, string> = {
    replit: "https://replit.com",
    lovable: "https://lovable.dev",
    vibecode: "https://vibecodeapp.com",
    codex: "https://platform.openai.com/docs/models/codex",
    claudecode: "https://docs.anthropic.com/en/docs/claude-code/overview",
    cursor: "https://cursor.com",
    chatgpt: "https://chatgpt.com",
    claude: "https://claude.ai",
    perplexity: "https://www.perplexity.ai/join/p/paypal-subscription",
    notebooklm: "https://notebooklm.google.com",
    ai_studio: "https://aistudio.google.com",
    comet: "https://www.perplexity.ai/comet",
  };
  const tryUrl = tool.links?.signup || defaultSignupMap[tool.id] || tool.links?.site;

  // No logo in the ToolCard header per request
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed top-4 right-4 w-[380px] z-40"
      aria-live="polite"
    >
      <div className="rounded-2xl bg-zinc-950/90 backdrop-blur text-white border border-zinc-800 shadow-2xl p-4 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg md:text-xl font-semibold">{tool.name}</div>
            <div className="text-zinc-400 text-sm">{cluster.label}</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {tryUrl ? (
              <a
                href={tryUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-white text-black px-2.5 py-1.5 text-xs font-semibold hover:bg-zinc-200 transition shadow"
              >
                Try it
              </a>
            ) : null}
            <PricingPill tool={tool} />
          </div>
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
        </div>
        {tool.bullets && tool.bullets.filter((b) => !/^\s*pricing\s*:/i.test(b)).length > 0 && (
          <div className="mt-4">
            <ul className={`list-disc pl-5 space-y-1 text-sm md:text-base ${markerClass} ${textClass}`}>
              {tool.bullets
                .filter((b) => !/^\s*pricing\s*:/i.test(b))
                .map((b, i) => (
                  <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        )}
        {/* action buttons removed per request; click outside to close */}
      </div>
    </motion.div>
  );
}
