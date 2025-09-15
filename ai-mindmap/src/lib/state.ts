import { create } from "zustand";

export type UIMode = "overview" | "presenter";

export type UIState = {
  mode: UIMode;
  selectedClusterId: string | null;
  selectedToolId: string | null;
  centerCompare: boolean;
  setMode: (mode: UIMode) => void;
  reset: () => void;
  selectCluster: (clusterId: string | null) => void;
  selectTool: (toolId: string | null) => void;
  setCenterCompare: (on: boolean) => void;
};

export const useUIState = create<UIState>((set) => ({
  mode: "overview",
  selectedClusterId: null,
  selectedToolId: null,
  centerCompare: false,
  setMode: (mode) => set({ mode }),
  reset: () => set({ selectedClusterId: null, selectedToolId: null, centerCompare: false, mode: "overview" }),
  selectCluster: (clusterId) =>
    set((prev) => ({
      selectedClusterId: clusterId,
      selectedToolId: clusterId ? null : prev.selectedToolId,
      centerCompare: clusterId ? false : prev.centerCompare,
    })),
  selectTool: (toolId) => set({ selectedToolId: toolId }),
  setCenterCompare: (on) => set({ centerCompare: on }),
}));
