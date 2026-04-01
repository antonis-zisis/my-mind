import type { Node, Edge } from '@xyflow/react';

export type NodeKind = 'project' | 'service';

export interface NodeData extends Record<string, unknown> {
  label: string;
  kind: NodeKind;
  description?: string;
  url?: string;
  tags?: string[];
  color?: string;
}

export type AppNode = Node<NodeData>;
export type AppEdge = Edge;

export interface SerializedNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
}

export interface SerializedEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

export interface DiagramDoc {
  nodes: SerializedNode[];
  edges: SerializedEdge[];
  updatedAt: number;
}
