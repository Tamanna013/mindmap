export interface MindmapNode {
  metadata: any;
  id: string;
  title: string;
  summary?: string;
  description?: string;
  category?: string;
  children?: MindmapNode[];
  x?: number;
  y?: number;
}

export interface NodePosition extends MindmapNode {
  depth: number;
  x: number;
  y: number;
  fx?: number;
  fy?: number;
}

export type MindmapData = MindmapNode;
