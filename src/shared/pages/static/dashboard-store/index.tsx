import type { FeatureManifest } from "@/shared/pages/types/manifest";

import { LayoutDashboard } from "lucide-react";
// TODO: Replace with actual main component import
const DashboardStoreSlice = () => null;

export const manifest: FeatureManifest = {
  title: "Dashboard Store",
  url: "/dashboard-store",
  icon: LayoutDashboard,
  description: "Manage and view dashboards",
  featureType: "static",
};

export { DashboardStoreSlice };
export default DashboardStoreSlice;
