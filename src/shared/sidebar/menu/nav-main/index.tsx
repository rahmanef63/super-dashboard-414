"use client"

import { SidebarFeatureMenuLoader } from "./components/SidebarFeatureMenuLoader";
import { getAvailableFeatureManifests } from "@/shared/pages/feature-access";
import type { FeatureManifest } from "@/shared/pages/types/manifest";

// Dummy userPermissions and accessCheck for demonstration; replace with real logic
const userPermissions = {};
const accessCheck = (manifest: FeatureManifest, userPermissions: any) => {
  // TODO: Replace with actual permission logic
  return manifest.featureType === "static" || true;
};

interface NavMainProps {
  dashboardId: string;
  workspaceId?: string | null;
}

export function NavMain({ dashboardId, workspaceId }: NavMainProps) {
  const features = getAvailableFeatureManifests(userPermissions, accessCheck);
  const dynamicFeatures = features.filter(f => f.featureType === "dynamic");
  const staticFeatures = features.filter(f => f.featureType === "static");

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <SidebarFeatureMenuLoader features={dynamicFeatures} dashboardId={dashboardId} workspaceId={workspaceId} />
      </div>
      <div>
        <SidebarFeatureMenuLoader features={staticFeatures} dashboardId={dashboardId} workspaceId={workspaceId} />
      </div>
    </div>
  );
}

