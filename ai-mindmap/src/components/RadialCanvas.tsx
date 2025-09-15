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
import ComparisonModal from "@/components/ComparisonModal";
import ToolImageModal from "@/components/ToolImageModal";
import ImageWithFallback from "@/components/ImageWithFallback";

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
  const radius = Math.max(100, Math.min(width, height) * 0.35);

  const mindmap = dataJson as Mindmap;
  const clusters = mindmap.clusters;

  const { selectedClusterId, selectedToolId, selectCluster, selectTool, centerCompare, setCenterCompare } = useUIState();
  const selectedCluster = clusters.find((c) => c.id === selectedClusterId) || null;
  const selectedTool = selectedCluster && selectedToolId ? (selectedCluster.nodes.find((n) => n.id === selectedToolId) as Tool) : null;
  const [showToolCard, setShowToolCard] = React.useState(false);
  const [showImageModal, setShowImageModal] = React.useState(false);
  const [imagesLoaded, setImagesLoaded] = React.useState(false);
  const [showCenterImages, setShowCenterImages] = React.useState(false);

  React.useEffect(() => {
    let imageTimer: ReturnType<typeof setTimeout> | null = null;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
    setShowToolCard(false);
    setShowImageModal(false);
    setImagesLoaded(false);

    if (selectedToolId) {
      imageTimer = setTimeout(() => setShowImageModal(true), 10);
      // Safety: if an image never loads, reveal the card after 2.5s
      fallbackTimer = setTimeout(() => setShowToolCard(true), 2500);
    }

    return () => {
      if (imageTimer) clearTimeout(imageTimer);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [selectedToolId]);

  React.useEffect(() => {
    if (imagesLoaded && selectedToolId) {
      setShowToolCard(true);
    }
  }, [imagesLoaded, selectedToolId]);

  const anchors = computeClusterAnchors(clusters.length, cx, cy, radius, -Math.PI / 2);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen">
      <HUD />
      {/* centered comparison only on second click */}
      {selectedCluster && centerCompare && !selectedToolId && (
        <ComparisonModal
          cluster={selectedCluster}
          onClose={() => setCenterCompare(false)}
        />
      )}
      {/* centered tool image modal over everything */}
      {selectedCluster && selectedTool && showImageModal && (
        <ToolImageModal cluster={selectedCluster} tool={selectedTool} onReady={() => setImagesLoaded(true)} />
      )}
      {/* center images modal */}
      <AnimatePresence>
        {showCenterImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
            onClick={() => setShowCenterImages(false)}
          >
            <div className="pointer-events-auto inline-block max-w-[70vw] max-h-[85vh] rounded-2xl bg-zinc-950/90 backdrop-blur border border-white/10 ring-1 ring-emerald-400/40 shadow-2xl p-3 md:p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["/logos/mobile-app-1", "/logos/mobile-app-2", "/logos/mobile-app-3"].map((base, i) => (
                  <div key={i} className="bg-zinc-900/60 rounded-xl border border-white/10 p-4 lg:p-6 flex items-center justify-center min-h-[40vh] lg:min-h-[50vh]">
                    <ImageWithFallback
                      bases={[base]}
                      alt={`AI Coding Guide ${i + 1}`}
                      className="block w-full h-auto max-h-[50vh] lg:max-h-[60vh] object-contain rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* My Journey panel positioned in top-right */}
            <div className="pointer-events-auto fixed top-4 right-4 w-[380px] bg-zinc-900/90 backdrop-blur rounded-xl border border-white/10 p-4 md:p-6 shadow-2xl">
              <div className="text-emerald-400 font-extrabold tracking-wide text-xl md:text-2xl font-mono">My Journey</div>
              <ul className="mt-2 list-disc list-inside text-zinc-200 text-sm md:text-base leading-7 space-y-1 font-mono marker:text-emerald-400">
                <li>8 months ago: started learning to code using ChatGPT lots of copy paste and trial/error.</li>
                <li>Hard lessons: burned time and money on dead ends; learned to use AI to my advantage now.</li>
                <li>Built something real: turned the idea into a meal sharing app (plans, recipes, community).</li>
                <li>Still in progress: improving weekly this is just the start.</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* center pulse */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <span className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 block w-40 h-40 rounded-full blur-3xl opacity-30 bg-emerald-500 animate-ping" />
        </div>
      </div>
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

      {/* center title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedClusterId ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-0 pointer-events-none"
      >
        <button
          onClick={() => {
            if (selectedClusterId) {
              selectCluster(null);
            } else {
              setShowCenterImages(!showCenterImages);
            }
          }}
          className="pointer-events-auto rounded-full px-8 py-6 bg-zinc-900/90 text-white backdrop-blur text-2xl md:text-4xl font-bold shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-[1.02] transition-all duration-200 border border-white/10"
        >
          {mindmap.title}
        </button>
      </motion.div>

      {/* dim + blur background when a cluster is selected or center images shown */}
      <AnimatePresence>
        {(selectedClusterId || showCenterImages) && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10"
            onClick={() => {
              if (showCenterImages) setShowCenterImages(false);
              else if (selectedToolId) selectTool(null);
              else if (centerCompare) setCenterCompare(false);
              else selectCluster(null);
            }}
            aria-hidden
          />
        )}
      </AnimatePresence>

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
            onClick={() => {
              if (!isSelected) {
                selectCluster(cluster.id);
              } else if (selectedToolId) {
                // If a tool card is open, clicking center closes it instead of toggling compare
                selectTool(null);
              } else {
                setCenterCompare(!centerCompare);
              }
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: faded ? 0.2 : 1, scale: isSelected ? 1.08 : 1 }}
            transition={isSelected ? { type: "spring", stiffness: 120, damping: 18 } : { duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 ${clusterColorToBg[cluster.color] ?? "bg-zinc-700"} text-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.15)] border border-white/10 ${isSelected ? "z-30 ring-4 ring-white/40" : "z-0"}`}
            style={{ left: x, top: y, width: 120, height: 120 }}
            aria-label={cluster.label}
          >
            {/* color halo */}
            <span className={`pointer-events-none absolute inset-0 rounded-full opacity-40 blur-2xl ${cluster.color === "emerald" ? "bg-emerald-200" : cluster.color === "sky" ? "bg-sky-200" : cluster.color === "violet" ? "bg-violet-200" : cluster.color === "amber" ? "bg-amber-200" : "bg-white/20"}`} />
            <span className={`block text-center text-lg font-semibold ${clusterColorToText[cluster.color] ?? "text-white"} drop-shadow`}></span>
            <span className="block text-center px-3 text-sm font-semibold leading-tight">
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
            onSelectTool={(tool) => {
              // ensure only one thing at a time
              if (centerCompare) setCenterCompare(false);
              selectTool(tool.id);
            }}
          />
        )}
      </AnimatePresence>

      {/* tool card */}
      <AnimatePresence>
        {selectedCluster && selectedTool && showToolCard && (
          <ToolCard
            cluster={selectedCluster}
            tool={selectedTool}
            onClose={() => selectTool(null)}
            onNext={() => {
              const idx = selectedCluster.nodes.findIndex((n) => n.id === selectedTool.id);
              const next = selectedCluster.nodes[(idx + 1) % selectedCluster.nodes.length];
              selectTool(next.id);
            }}
          />)
        }
      </AnimatePresence>

    </div>
  );
}
