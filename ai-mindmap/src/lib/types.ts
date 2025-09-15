export type Tool = {
  id: string;
  name: string;
  tags: string[];
  pricing: { free: boolean; paid: boolean; notes?: string };
  links: { site: string; signup?: string; docs?: string; student?: string };
  why_use: string;
  best_for: string;
  bullets?: string[];
  pros?: string[];
  cons?: string[];
  image?: string | string[]; // optional image path(s) from /public
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
