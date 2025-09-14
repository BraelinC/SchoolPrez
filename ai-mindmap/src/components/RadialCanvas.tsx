"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import dataJson from "@/data/tools.json";
import type { Mindmap, Cluster, Tool } from "@/lib/types";
import { computeClusterAnchors } from "@/lib/layout";
import { useUIState } from "@/lib/state";
import ClusterOrbit from "@/components/ClusterOrbit";
import ToolCard from "@/components/ToolCard";
import HUD from "@/components/HUD";
import Legend from "@/components/Legend";

const clusterColorToBg: Record<string, string> = {
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
};

const clusterColorToText: Record<string, string> = {
  emerald: "text-emerald-700",
  sky: "text-sky-700",
  violet: "text-violet-700",
  amber: "text-amber-700",
};

function useSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  React.useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        setSize({ width: cr.width, height: cr.height });
      }
    });
    ro.observe(el);
    setSize({ width: el.clientWidth, height: el.clientHeight });
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

export default function RadialCanvas() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width, height } = useSize(containerRef);
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.max(80, Math.min(width, height) * 0.28);

  const mindmap = dataJson as Mindmap;
  const clusters = mindmap.clusters;

  const { selectedClusterId, selectedToolId, selectCluster, selectTool } = useUIState();
  const selectedCluster = clusters.find((c) => c.id === selectedClusterId) || null;

  const anchors = computeClusterAnchors(clusters.length, cx, cy, radius, -Math.PI / 2);

  return (
    <div ref={containerRef} className="relative w-full h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] overflow-hidden">
      <HUD />
      {/* center pulse */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <span className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 block w-40 h-40 rounded-full blur-3xl opacity-30 bg-emerald-500 animate-ping" />
        </div>
      </div>
      {/* center title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
      >
        <button
          onClick={() => selectCluster(null)}
          className="rounded-full px-6 py-4 bg-zinc-900/70 text-white backdrop-blur text-3xl md:text-5xl font-bold shadow-[0_0_30px_rgba(255,255,255,0.08)] hover:scale-[1.02] transition"
        >
          {mindmap.title}
        </button>
      </motion.div>

      {/* subtle lines from center to clusters */}
      <svg className="absolute inset-0 pointer-events-none" width={width} height={height}>
        {anchors.map((a, i) => (
          <line
            key={`line-${i}`}
            x1={cx}
            y1={cy}
            x2={selectedClusterId === clusters[i].id ? cx : a.point.x}
            y2={selectedClusterId === clusters[i].id ? cy : a.point.y}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={1}
          />
        ))}
      </svg>

      {/* clusters */}
      {clusters.map((cluster: Cluster, i: number) => {
        const anchor = anchors[i];
        const isSelected = selectedClusterId === cluster.id;
        const x = isSelected ? cx : anchor.point.x;
        const y = isSelected ? cy : anchor.point.y;
        const faded = selectedClusterId && !isSelected;
        return (
          <motion.button
            key={cluster.id}
            onClick={() => selectCluster(cluster.id)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: faded ? 0.2 : 1, scale: isSelected ? 1.05 : 1 }}
            transition={isSelected ? { type: "spring", stiffness: 120, damping: 18 } : { duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 ${clusterColorToBg[cluster.color] ?? "bg-zinc-700"} text-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.15)]`}
            style={{ left: x, top: y, width: 140, height: 140 }}
            aria-label={cluster.label}
          >
            {/* color halo */}
            <span className={`pointer-events-none absolute inset-0 rounded-full opacity-40 blur-2xl ${cluster.color === "emerald" ? "bg-emerald-200" : cluster.color === "sky" ? "bg-sky-200" : cluster.color === "violet" ? "bg-violet-200" : cluster.color === "amber" ? "bg-amber-200" : "bg-white/20"}`} />
            <span className={`block text-center text-lg font-semibold ${clusterColorToText[cluster.color] ?? "text-white"} drop-shadow`}></span>
            <span className="block text-center px-4 text-lg font-semibold">
              {cluster.label}
            </span>
          </motion.button>
        );
      })}

      {/* orbit children when a cluster is selected */}
      <AnimatePresence>
        {selectedCluster && (
          <ClusterOrbit
            key={selectedCluster.id}
            center={{ x: cx, y: cy }}
            radius={radius * 0.55}
            cluster={selectedCluster}
            onSelectTool={(tool) => selectTool(tool.id)}
          />
        )}
      </AnimatePresence>

      {/* tool card */}
      <AnimatePresence>
        {selectedCluster && selectedToolId && (
          <ToolCard
            cluster={selectedCluster}
            tool={selectedCluster.nodes.find((n) => n.id === selectedToolId) as Tool}
            onClose={() => selectTool(null)}
            onNext={() => {
              const idx = selectedCluster.nodes.findIndex((n) => n.id === selectedToolId);
              const next = selectedCluster.nodes[(idx + 1) % selectedCluster.nodes.length];
              selectTool(next.id);
            }}
          />)
        }
      </AnimatePresence>

      <div className="absolute left-4 bottom-4">
        <Legend clusters={clusters} />
      </div>
    </div>
  );
}
