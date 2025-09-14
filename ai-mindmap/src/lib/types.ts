export type Tool = {
  id: string;
  name: string;
  tags: string[];
  pricing: { free: boolean; paid: boolean; notes?: string };
  links: { site: string };
  why_use: string;
  best_for: string;
};

export type Cluster = {
  id: string;
  label: string;
  color: "emerald" | "sky" | "violet" | "amber" | (string & {});
  nodes: Tool[];
};

export type Mindmap = {
  title: string;
  clusters: Cluster[];
};
