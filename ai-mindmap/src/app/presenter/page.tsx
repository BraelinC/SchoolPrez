"use client";

import React from "react";
import dataJson from "@/data/tools.json";
import type { Mindmap } from "@/lib/types";
import { useUIState } from "@/lib/state";
import RadialCanvas from "@/components/RadialCanvas";

const stepOrder = [
  "center",
  "environments",
  "replit",
  "lovable",
  "vibecode",
  "pairprog",
  "codex",
  "claudecode",
  "cursor",
  "research",
  "chatgpt",
  "claude",
  "perplexity",
  "extras",
  "notebooklm",
  "ai_studio",
  "comet",
] as const;

type StepKey = typeof stepOrder[number];

export default function PresenterPage() {
  const mindmap = dataJson as Mindmap;
  const { setMode, selectCluster, selectTool } = useUIState();

  React.useEffect(() => {
    setMode("presenter");
  }, [setMode]);

  const [idx, setIdx] = React.useState(0);

  const goTo = React.useCallback(
    (key: StepKey) => {
      if (key === "center") {
        selectCluster(null);
        selectTool(null);
        return;
      }
      const cluster = mindmap.clusters.find((c) => c.id === key);
      if (cluster) {
        selectCluster(cluster.id);
        selectTool(null);
        return;
      }
      const anyCluster = mindmap.clusters.find((c) => c.nodes.some((n) => n.id === key));
      const tool = anyCluster?.nodes.find((n) => n.id === key);
      if (anyCluster && tool) {
        selectCluster(anyCluster.id);
        selectTool(tool.id);
      }
    },
    [mindmap, selectCluster, selectTool]
  );

  React.useEffect(() => {
    goTo(stepOrder[idx]);
  }, [idx, goTo]);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIdx((v) => Math.min(stepOrder.length - 1, v + 1));
      if (e.key === "ArrowLeft") setIdx((v) => Math.max(0, v - 1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="fixed right-4 bottom-4 z-50 flex items-center gap-2">
        <button
          onClick={() => setIdx((v) => Math.max(0, v - 1))}
          className="rounded-md bg-zinc-900/90 text-white px-3 py-2 text-sm font-semibold hover:bg-zinc-800 transition"
        >
          Prev
        </button>
        <button
          onClick={() => setIdx((v) => Math.min(stepOrder.length - 1, v + 1))}
          className="rounded-md bg-white text-black px-3 py-2 text-sm font-semibold hover:bg-zinc-200 transition"
        >
          Next
        </button>
      </div>
      <RadialCanvas />
    </div>
  );
}
