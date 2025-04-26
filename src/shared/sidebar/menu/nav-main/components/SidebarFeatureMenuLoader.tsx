import React from "react";
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { SubMenu } from "./sub-menu";
import type { FeatureManifest } from "@/shared/pages/types/manifest";

interface SidebarFeatureMenuLoaderProps {
  features: FeatureManifest[];
  dashboardId: string;
  workspaceId?: string | null;
  showLabel?: boolean;
  title?: string;
  emptyMessage?: string;
}

export const SidebarFeatureMenuLoader: React.FC<SidebarFeatureMenuLoaderProps> = ({
  features,
  dashboardId,
  workspaceId,
  showLabel = true,
  title = "Features",
  emptyMessage = "No features available",
}) => {
  if (!features || features.length === 0) {
    return (
      <SidebarGroup>
        {showLabel && title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
        <div className="px-3 py-2 text-xs italic text-muted-foreground">{emptyMessage}</div>
      </SidebarGroup>
    );
  }

  // Group features by type for clarity
  const grouped = features.reduce<{ [key: string]: FeatureManifest[] }>((acc, feature) => {
    acc[feature.featureType] = acc[feature.featureType] || [];
    acc[feature.featureType].push(feature);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(grouped).map(([type, feats]) => (
        <SidebarGroup key={type}>
          <SidebarGroupLabel>{type === "static" ? "Main" : "Dynamic"} Features</SidebarGroupLabel>
          <SubMenu
            items={feats.map(f => {
              let url: string;
              let disabled = false;
              if (dashboardId) {
                url = `/dashboard/${dashboardId}` + (workspaceId ? `/${workspaceId}` : '') + (f.url.startsWith('/') ? f.url : `/${f.url}`);
              } else {
                url = '/dashboard';
                disabled = true; // Optional: only if SubMenu supports disabling
              }
              return {
                title: f.title,
                url,
                icon: f.icon,
                description: f.description,
                ...(disabled ? { disabled } : {})
              };
            })}
            menuType={type === "static" ? "system" : "dashboard"}
          />
        </SidebarGroup>
      ))}
    </>
  );
};

export default SidebarFeatureMenuLoader;
