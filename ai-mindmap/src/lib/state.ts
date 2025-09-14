import { create } from "zustand";

export type UIMode = "overview" | "presenter";

export type UIState = {
  mode: UIMode;
  selectedClusterId: string | null;
  selectedToolId: string | null;
  setMode: (mode: UIMode) => void;
  reset: () => void;
  selectCluster: (clusterId: string | null) => void;
  selectTool: (toolId: string | null) => void;
};

export const useUIState = create<UIState>((set) => ({
  mode: "overview",
  selectedClusterId: null,
  selectedToolId: null,
  setMode: (mode) => set({ mode }),
  reset: () => set({ selectedClusterId: null, selectedToolId: null, mode: "overview" }),
  selectCluster: (clusterId) =>
    set((prev) => ({
      selectedClusterId: clusterId,
      selectedToolId: clusterId ? null : prev.selectedToolId,
    })),
  selectTool: (toolId) => set({ selectedToolId: toolId }),
}));
