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
  const [editedNode, setEditedNode] = useState<Partial<MindmapNode>>({});

  useEffect(() => {
    if (selectedNode) {
      setEditedNode({
        title: selectedNode.title,
        summary: selectedNode.summary,
        description: selectedNode.description,
      });
    }
    setEditMode(false);
  }, [selectedNode]);

  if (!selectedNode) return null;

  const handleSave = () => {
    onNodeUpdate(selectedNode.id, editedNode);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditedNode({
      title: selectedNode.title,
      summary: selectedNode.summary,
      description: selectedNode.description,
    });
    setEditMode(false);
  };

  return (
    <div className="side-panel">
      <div className="side-panel-header">
        <h3>Node Details</h3>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="side-panel-content">
        <div className="field-group">
          <label>Title</label>
          {editMode ? (
            <input
              type="text"
              value={editedNode.title || ""}
              onChange={(e) =>
                setEditedNode({ ...editedNode, title: e.target.value })
              }
              className="edit-input"
            />
          ) : (
            <div className="field-value">{selectedNode.title}</div>
          )}
        </div>

        <div className="field-group">
          <label>Summary</label>
          {editMode ? (
            <textarea
              value={editedNode.summary || ""}
              onChange={(e) =>
                setEditedNode({ ...editedNode, summary: e.target.value })
              }
              className="edit-textarea"
              rows={3}
            />
          ) : (
            <div className="field-value">
              {selectedNode.summary || "No summary available"}
            </div>
          )}
        </div>

        <div className="field-group">
          <label>Description</label>
          {editMode ? (
            <textarea
              value={editedNode.description || ""}
              onChange={(e) =>
                setEditedNode({ ...editedNode, description: e.target.value })
              }
              className="edit-textarea"
              rows={5}
            />
          ) : (
            <div className="field-value">
              {selectedNode.description || "No description available"}
            </div>
          )}
        </div>

        {selectedNode.metadata && (
          <div className="field-group">
            <label>Metadata</label>
            <div className="metadata-container">
              {Object.entries(selectedNode.metadata).map(([key, value]) => (
                <div key={key} className="metadata-item">
                  <span className="metadata-key">{key}:</span>
                  <span className="metadata-value">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="field-group">
          <label>Statistics</label>
          <div className="stats-container">
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

      <div className="side-panel-actions">
        {editMode ? (
          <>
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
            <button className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          <button className="edit-button" onClick={() => setEditMode(true)}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
};
