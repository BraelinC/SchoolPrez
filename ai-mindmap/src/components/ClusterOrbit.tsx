"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Cluster, Tool } from "@/lib/types";
import { computeOrbitPositions } from "@/lib/layout";

export default function ClusterOrbit({
  center,
  radius,
  cluster,
  onSelectTool,
}: {
  center: { x: number; y: number };
  radius: number;
  cluster: Cluster;
  onSelectTool: (tool: Tool) => void;
}) {
  const positions = computeOrbitPositions(
    cluster.nodes.length,
    center.x,
    center.y,
    Math.max(48, radius),
    -Math.PI / 2
  );

  return (
    <div className="pointer-events-none">
      {cluster.nodes.map((tool, i) => {
        const pos = positions[i];
        // No icon in orbit buttons per request
        return (
          <motion.button
            key={tool.id}
            className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-900/80 text-white px-3 py-2 shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:scale-105 transition z-20"
            style={{ left: pos.point.x, top: pos.point.y }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.25 }}
            onClick={() => onSelectTool(tool)}
          >
            <span className="block text-sm font-semibold leading-6">{tool.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
