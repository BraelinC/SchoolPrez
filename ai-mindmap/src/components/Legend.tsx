"use client";

import React from "react";
import type { Cluster } from "@/lib/types";

const colorSwatch: Record<string, string> = {
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
};

export default function Legend({ clusters }: { clusters: Cluster[] }) {
  return (
    <div className="rounded-xl bg-zinc-950/70 backdrop-blur border border-zinc-800 p-3 text-white">
      <div className="text-xs font-semibold mb-2">Legend</div>
      <div className="grid grid-cols-2 gap-2 min-w-[220px]">
        {clusters.map((c) => (
          <div key={c.id} className="flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full ${colorSwatch[c.color] ?? "bg-zinc-600"}`} />
            <span className="text-sm">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
