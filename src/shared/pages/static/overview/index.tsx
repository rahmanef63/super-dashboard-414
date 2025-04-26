import type { FeatureManifest } from "@/shared/pages/types/manifest";
import { BarChart2 } from "lucide-react";
// TODO: Replace with actual main component import
const OverviewSlice = () => null;

export const manifest: FeatureManifest = {
  title: "Overview",
  url: "/overview",
  icon: BarChart2,
  description: "Overview of your workspace and activity",
  featureType: "static",
};

export { OverviewSlice };
export default OverviewSlice;
