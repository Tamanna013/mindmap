import React, { useState, useEffect } from "react";
import type { MindmapData, MindmapNode } from "./types/mindmap";
import {
  loadMindmapData,
  saveMindmapData,
  exportMindmapData,
} from "./utils/dataLoader";
import "./App.css";
import { Toolbar } from "./components/Toolbar/Toolbar";
import { Mindmap } from "./components/Mindmap/Mindmap";
import { SidePanel } from "./components/Mindmap/SidePanel";

const App: React.FC = () => {
  const [data, setData] = useState<MindmapData | null>(null);
  const [selectedNode, setSelectedNode] = useState<MindmapNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [drillPath, setDrillPath] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const mindmapData = await loadMindmapData();
        setData(mindmapData);
      } catch (err) {
        setError("Failed to load mindmap data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDataChange = async (newData: MindmapData) => {
    setData(newData);
    try {
      await saveMindmapData(newData);
    } catch (err) {
      console.error("Failed to save data:", err);
    }
  };

  const handleNodeSelect = (node: MindmapNode | null) => {
    setSelectedNode(node);
  };

  const handleExpandAll = () => {
    setCollapsedNodes(new Set());
  };

  const handleCollapseAll = () => {
    if (!data) return;
    const allNodeIds = new Set<string>();

    const collectNodeIds = (node: MindmapNode) => {
      if (node.children && node.children.length > 0) {
        allNodeIds.add(node.id);
        node.children.forEach(collectNodeIds);
      }
    };

    collectNodeIds(data);
    setCollapsedNodes(allNodeIds);
  };

  const handleDrillDown = () => {
    if (
      selectedNode &&
      selectedNode.children &&
      selectedNode.children.length > 0
    ) {
      setDrillPath([...drillPath, selectedNode.id]);
      setSelectedNode(null);
    }
  };

  const handleDrillUp = () => {
    if (drillPath.length > 0) {
      setDrillPath(drillPath.slice(0, -1));
      setSelectedNode(null);
    }
  };

  const handleAddNode = () => {
    if (!selectedNode || !data) return;

    const newNode: MindmapNode = {
      id: `node-${Date.now()}`,
      title: "New Node",
      summary: "Click to edit this node",
      description: "Add your description here",
      category: "default",
      children: [],
      metadata: undefined,
    };

    const updateNodeRecursively = (node: MindmapNode): MindmapNode => {
      if (node.id === selectedNode.id) {
        return {
          ...node,
          children: [...(node.children || []), newNode],
        };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateNodeRecursively),
        };
      }
      return node;
    };

    const updatedData = updateNodeRecursively(data);
    handleDataChange(updatedData);
  };

  const handleDownload = () => {
    if (data) {
      exportMindmapData(data, "mindmap-export.json");
    }
  };

  const handleNodeUpdate = (nodeId: string, updates: Partial<MindmapNode>) => {
    if (!data) return;

    const updateNodeRecursively = (node: MindmapNode): MindmapNode => {
      if (node.id === nodeId) {
        return { ...node, ...updates };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateNodeRecursively),
        };
      }
      return node;
    };

    const updatedData = updateNodeRecursively(data);
    handleDataChange(updatedData);

    // Update selected node if it's the one being edited
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode({ ...selectedNode, ...updates });
    }
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading mindmap...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="app-error">
        <p>{error || "No data available"}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Toolbar
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        onDrillDown={handleDrillDown}
        onDrillUp={handleDrillUp}
        onAddNode={handleAddNode}
        canDrillDown={
          !!(
            selectedNode &&
            selectedNode.children &&
            selectedNode.children.length > 0
          )
        }
        canDrillUp={drillPath.length > 0}
        canAddNode={!!selectedNode}
        onDownload={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
      <div className="app-main">
        <Mindmap
          data={data}
          selectedNode={selectedNode}
          collapsedNodes={collapsedNodes}
          drillPath={drillPath}
          onNodeSelect={handleNodeSelect}
          onCollapsedNodesChange={setCollapsedNodes}
          onDataChange={handleDataChange}
        />
        <SidePanel
          selectedNode={selectedNode}
          onNodeUpdate={handleNodeUpdate}
          onClose={() => setSelectedNode(null)}
        />
      </div>
    </div>
  );
};

export default App;
