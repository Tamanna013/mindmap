import React, { useState, useEffect } from "react";
import type { MindmapNode } from "../../types/mindmap";
import "./SidePanel.css";

interface SidePanelProps {
  selectedNode: MindmapNode | null;
  onNodeUpdate: (nodeId: string, updates: Partial<MindmapNode>) => void;
  onClose: () => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  selectedNode,
  onNodeUpdate,
  onClose,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editedSummary, setEditedSummary] = useState("");

  useEffect(() => {
    if (selectedNode) {
      setEditedSummary(selectedNode.summary || "");
    }
    setEditMode(false);
  }, [selectedNode]);

  if (!selectedNode) return null;

  const handleSave = () => {
    onNodeUpdate(selectedNode.id, { summary: editedSummary });
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditedSummary(selectedNode.summary || "");
    setEditMode(false);
  };

  const getBreadcrumb = () => {
    // Simple breadcrumb - in a real app, you'd track the full path
    return "Root";
  };

  return (
    <div className="side-panel">
      <div className="side-panel-header">
        <div className="header-content">
          <div className="header-icon">🌟</div>
          <div className="header-text">
            <h2>Architecture Documentation</h2>
            <p>Interactive component visualization</p>
          </div>
        </div>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="side-panel-content">
        <div className="breadcrumb">{getBreadcrumb()}</div>

        <div className="node-title">
          <h3>{selectedNode.title}</h3>
        </div>

        <div className="summary-section">
          <div className="summary-header">
            <span className="summary-label">SUMMARY:</span>
            {!editMode && (
              <button
                className="edit-icon-button"
                onClick={() => setEditMode(true)}
                title="Edit summary"
              >
                ✏️ Edit
              </button>
            )}
          </div>

          {editMode ? (
            <div className="edit-container">
              <textarea
                value={editedSummary}
                onChange={(e) => setEditedSummary(e.target.value)}
                className="summary-textarea"
                rows={6}
                placeholder="Enter summary..."
              />
              <div className="edit-actions">
                <button className="save-button" onClick={handleSave}>
                  Save
                </button>
                <button className="cancel-button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="summary-text">
              {selectedNode.summary ||
                "No summary available. Click Edit to add one."}
            </div>
          )}
        </div>

        {selectedNode.description && (
          <div className="description-section">
            <h4>Description</h4>
            <p>{selectedNode.description}</p>
          </div>
        )}

        <div className="node-stats">
          <div className="stat-item">
            <span className="stat-label">Category:</span>
            <span className="stat-value">
              {selectedNode.category || "Default"}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Children:</span>
            <span className="stat-value">
              {selectedNode.children?.length || 0}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Node ID:</span>
            <span className="stat-value">{selectedNode.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
