import type { FeatureManifest } from "@/shared/pages/types/manifest";
import { Settings } from "lucide-react";
// TODO: Replace with actual main component import
const SettingsSlice = () => null;

export const manifest: FeatureManifest = {
  title: "Settings",
  url: "/settings",
  icon: Settings,
  description: "Manage your application settings",
  featureType: "static",
};

export { manifest, SettingsSlice };
export default SettingsSlice;
