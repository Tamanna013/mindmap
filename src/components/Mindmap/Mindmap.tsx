import React, { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import type {
  MindmapNode,
  MindmapData,
  NodePosition,
} from "../../types/mindmap";
import { Tooltip } from "./Tooltip";
import "./Mindmap.css";

interface MindmapProps {
  data: MindmapData;
  selectedNode: MindmapNode | null;
  collapsedNodes: Set<string>;
  drillPath: string[];
  onNodeSelect: (node: MindmapNode | null) => void;
  onCollapsedNodesChange: (collapsed: Set<string>) => void;
  onDataChange: (data: MindmapData) => void;
}

export const Mindmap: React.FC<MindmapProps> = ({
  data,
  selectedNode,
  collapsedNodes,
  drillPath,
  onNodeSelect,
  onCollapsedNodesChange,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<NodePosition, undefined> | null>(
    null
  );
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: string;
  } | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  const getCurrentRoot = useCallback(() => {
    let currentNode = data;
    for (const nodeId of drillPath) {
      const findNode = (node: MindmapNode): MindmapNode | null => {
        if (node.id === nodeId) return node;
        if (node.children) {
          for (const child of node.children) {
            const found = findNode(child);
            if (found) return found;
          }
        }
        return null;
      };
      const found = findNode(currentNode);
      if (found) currentNode = found;
    }
    return currentNode;
  }, [data, drillPath]);

  const getVisibleNodes = useCallback(
    (rootNode: MindmapNode): NodePosition[] => {
      const nodes: NodePosition[] = [];

      const traverse = (node: MindmapNode, depth = 0) => {
        nodes.push({
          ...node,
          depth,
          x: node.x || 0,
          y: node.y || 0,
          fx: depth === 0 ? dimensions.width / 2 : undefined,
          fy: depth === 0 ? dimensions.height / 2 : undefined,
        });

        if (!collapsedNodes.has(node.id) && node.children) {
          node.children.forEach((child) => traverse(child, depth + 1));
        }
      };

      traverse(rootNode);
      return nodes;
    },
    [collapsedNodes, dimensions]
  );

  const getVisibleLinks = useCallback(
    (nodes: NodePosition[]): Array<{ source: string; target: string }> => {
      const links: Array<{ source: string; target: string }> = [];
      const nodeMap = new Map(nodes.map((n) => [n.id, n]));

      const traverse = (node: MindmapNode) => {
        if (!collapsedNodes.has(node.id) && node.children) {
          node.children.forEach((child) => {
            if (nodeMap.has(child.id)) {
              links.push({ source: node.id, target: child.id });
            }
            traverse(child);
          });
        }
      };

      const currentRoot = getCurrentRoot();
      traverse(currentRoot);
      return links;
    },
    [collapsedNodes, getCurrentRoot]
  );

  const getNodeColor = (category: string, depth: number) => {
    const colorMap: Record<string, string> = {
      vitamins: "#4A90E2",
      dietary: "#7ED321",
      health: "#50E3C2",
      deficiency: "#F5A623",
      excess: "#D0021B",
      classification: "#9013FE",
      sources: "#FF6B35",
      default: "#B8E986",
    };

    if (depth === 0) return "#4A90E2";
    return colorMap[category] || colorMap.default;
  };

  const initializeVisualization = useCallback(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create grid pattern
    const defs = svg.append("defs");
    const pattern = defs
      .append("pattern")
      .attr("id", "grid")
      .attr("width", 40)
      .attr("height", 40)
      .attr("patternUnits", "userSpaceOnUse");

    pattern
      .append("path")
      .attr("d", "M 40 0 L 0 0 0 40")
      .attr("fill", "none")
      .attr("stroke", "#3A4A5C")
      .attr("stroke-width", 1)
      .attr("opacity", 0.3);

    svg
      .append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "url(#grid)");

    const container = svg.append("g").attr("class", "mindmap-container");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom);
    (svg.node() as any).__zoom__ = zoom;

    const currentRoot = getCurrentRoot();
    const nodes = getVisibleNodes(currentRoot);
    const links = getVisibleLinks(nodes);

    const simulation = d3
      .forceSimulation<NodePosition>(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(120)
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force(
        "center",
        d3.forceCenter(dimensions.width / 2, dimensions.height / 2)
      )
      .force("collision", d3.forceCollide().radius(50))
      .force(
        "radial",
        d3.forceRadial(
          (d: any) => d.depth * 150,
          dimensions.width / 2,
          dimensions.height / 2
        )
      );

    simulationRef.current = simulation;

    const linkSelection = container
      .selectAll(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke", "#5A6B7D")
      .attr("stroke-width", 2)
      .attr("opacity", 0.6);

    const nodeGroups = container
      .selectAll(".node-group")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node-group")
      .style("cursor", "pointer");

    nodeGroups
      .append("ellipse")
      .attr("class", "node")
      .attr("rx", (d) => {
        const textLength = d.title.length;
        return Math.max(40, textLength * 4 + 20);
      })
      .attr("ry", (d) => (d.depth === 0 ? 35 : 25))
      .attr("fill", (d) => getNodeColor(d.category || "default", d.depth))
      .attr("stroke", (d) =>
        selectedNode?.id === d.id ? "#FFD700" : "#ffffff"
      )
      .attr("stroke-width", (d) => (selectedNode?.id === d.id ? 3 : 1))
      .style("filter", (d) =>
        selectedNode?.id === d.id
          ? "drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))"
          : "none"
      );

    nodeGroups
      .append("text")
      .attr("class", "node-label")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .style("font-size", (d) => (d.depth === 0 ? "14px" : "12px"))
      .style("font-weight", (d) => (d.depth === 0 ? "bold" : "500"))
      .style("fill", "#ffffff")
      .style("pointer-events", "none")
      .text((d) => d.title);

    nodeGroups
      .on("mouseenter", (event, d) => {
        setTooltip({
          x: event.pageX,
          y: event.pageY,
          content: d.summary || d.title,
        });
      })
      .on("mouseleave", () => {
        setTooltip(null);
      })
      .on("click", (event, d) => {
        event.stopPropagation();

        if (event.detail === 2) {
          if (d.children && d.children.length > 0) {
            const newCollapsed = new Set(collapsedNodes);
            if (collapsedNodes.has(d.id)) {
              newCollapsed.delete(d.id);
            } else {
              newCollapsed.add(d.id);
            }
            onCollapsedNodesChange(newCollapsed);
          }
        } else {
          onNodeSelect(d);
        }
      });

    simulation.on("tick", () => {
      linkSelection
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeGroups.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    (svg.node() as any).fitToView = () => {
      const bounds = container.node()?.getBBox();
      if (bounds) {
        const fullWidth = dimensions.width;
        const fullHeight = dimensions.height;
        const width = bounds.width;
        const height = bounds.height;
        const midX = bounds.x + width / 2;
        const midY = bounds.y + height / 2;

        const scale = Math.min(fullWidth / width, fullHeight / height) * 0.8;
        const translate = [
          fullWidth / 2 - scale * midX,
          fullHeight / 2 - scale * midY,
        ];

        svg
          .transition()
          .duration(750)
          .call(
            zoom.transform,
            d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
          );
      }
    };
  }, [
    getCurrentRoot,
    getVisibleNodes,
    getVisibleLinks,
    selectedNode,
    collapsedNodes,
    onNodeSelect,
    onCollapsedNodesChange,
    dimensions,
  ]);

  useEffect(() => {
    const handleResize = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    initializeVisualization();
  }, [initializeVisualization]);

  useEffect(() => {
    const svg = svgRef.current;
    if (svg && (svg as any).fitToView) {
      (window as any).mindmapFitToView = (svg as any).fitToView;
    }
  }, []);

  return (
    <div className="mindmap-wrapper">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="mindmap-svg"
      />
      {tooltip && (
        <Tooltip x={tooltip.x} y={tooltip.y} content={tooltip.content} />
      )}
    </div>
  );
};
