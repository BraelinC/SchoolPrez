"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUIState } from "@/lib/state";

export default function HUD() {
  const router = useRouter();
  const { selectedClusterId, selectedToolId, selectCluster, selectTool, reset, setMode } = useUIState();
  return (
    <div className="fixed left-4 right-4 top-4 z-40 flex items-center gap-2 justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (selectedToolId) selectTool(null);
            else if (selectedClusterId) selectCluster(null);
          }}
          className="rounded-md bg-zinc-900/80 text-white px-3 py-2 text-sm font-semibold hover:bg-zinc-800 transition disabled:opacity-40"
          disabled={!selectedClusterId && !selectedToolId}
        >
          Back
        </button>
        <button
          onClick={() => {
            reset();
          }}
          className="rounded-md bg-zinc-900/80 text-white px-3 py-2 text-sm font-semibold hover:bg-zinc-800 transition"
        >
          Reset
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setMode("presenter");
            router.push("/presenter");
          }}
          className="rounded-md bg-white text-black px-3 py-2 text-sm font-semibold hover:bg-zinc-200 transition"
        >
          Presenter
        </button>
      </div>
    </div>
  );
}
