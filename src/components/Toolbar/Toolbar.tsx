import React from "react";
import "./Toolbar.css";

interface ToolbarProps {
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onDrillDown: () => void;
  onDrillUp: () => void;
  onAddNode: () => void;
  onDownload: () => void;
  canDrillDown: boolean;
  canDrillUp: boolean;
  canAddNode: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onExpandAll,
  onCollapseAll,
  onDrillDown,
  onDrillUp,
  onAddNode,
  onDownload,
  canDrillDown,
  canDrillUp,
  canAddNode,
}) => {
  const handleFitView = () => {
    if ((window as any).mindmapFitToView) {
      (window as any).mindmapFitToView();
    }
  };

  const handleFullDocumentation = () => {
    window.open("/documentation", "_blank");
  };

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button className="toolbar-button expand-all" onClick={onExpandAll}>
          <span className="button-icon">📂</span>
          Expand All
        </button>

        <button className="toolbar-button collapse-all" onClick={onCollapseAll}>
          <span className="button-icon">📁</span>
          Collapse All
        </button>

        <button
          className={`toolbar-button drill-down ${
            !canDrillDown ? "disabled" : ""
          }`}
          onClick={onDrillDown}
          disabled={!canDrillDown}
        >
          <span className="button-icon">⬇️</span>
          Drill Down
        </button>

        <button
          className={`toolbar-button drill-up ${!canDrillUp ? "disabled" : ""}`}
          onClick={onDrillUp}
          disabled={!canDrillUp}
        >
          <span className="button-icon">⬆️</span>
          Drill Up
        </button>

        <button className="toolbar-button fit-view" onClick={handleFitView}>
          <span className="button-icon">🎯</span>
          Fit View
        </button>

        <button
          className={`toolbar-button add-node ${!canAddNode ? "disabled" : ""}`}
          onClick={onAddNode}
          disabled={!canAddNode}
        >
          <span className="button-icon">➕</span>
          Add Node
        </button>

        <button
          className="toolbar-button documentation"
          onClick={handleFullDocumentation}
        >
          <span className="button-icon">📚</span>
          Full Documentation
        </button>
      </div>

      <div className="toolbar-group">
        <button className="toolbar-button download" onClick={onDownload}>
          <span className="button-icon">💾</span>
          Download
        </button>
      </div>
    </div>
  );
};
