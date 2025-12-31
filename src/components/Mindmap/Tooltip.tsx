import React from "react";
import "./Tooltip.css";

interface TooltipProps {
  x: number;
  y: number;
  content: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ x, y, content }) => {
  return (
    <div
      className="mindmap-tooltip"
      style={{
        left: x + 10,
        top: y - 10,
      }}
    >
      {content}
    </div>
  );
};
