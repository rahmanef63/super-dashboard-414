import React from 'react';

export interface Workspace {
  id: string;
  name: string;
  // ... other workspace properties
}

export interface Dashboard {
  id: string;
  name: string;
  workspaces: Workspace[];
  // ... other dashboard properties
}

export interface Page {
  id: string;
  name: string;
  type: "static" | "dynamic";
  component: React.ComponentType; // Or a way to dynamically load the component
  // ... other page properties, potentially specific to type (static/dynamic)
}
