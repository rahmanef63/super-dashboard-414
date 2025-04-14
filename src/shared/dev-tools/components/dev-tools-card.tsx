import React from "react";

interface DevToolsCardProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  initialPosition?: { x: number; y: number };
}

export function DevToolsCard({ title, children, onClose, initialPosition }: DevToolsCardProps) {
  // Placeholder implementation - needs the actual card logic, including dragging from useDevToolsCard hook
  // You might want to move the card styling and structure here from the original dev-tools.tsx
  // and use the useDevToolsCard hook for positioning and dragging.

  // Example basic structure:
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", position: "absolute", left: initialPosition?.x, top: initialPosition?.y, backgroundColor: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: "5px", marginBottom: "10px" }}>
        <h4>{title}</h4>
        {onClose && <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2em" }}>&times;</button>}
      </div>
      <div>{children}</div>
    </div>
  );
}
