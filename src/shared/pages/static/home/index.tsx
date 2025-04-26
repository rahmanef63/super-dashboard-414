import type { FeatureManifest } from "@/shared/pages/types/manifest";
import { Home } from "lucide-react";
// TODO: Replace with actual main component import
const HomeSlice = () => null;

export const manifest: FeatureManifest = {
  title: "Home",
  url: "/home",
  icon: Home,
  description: "Your dashboard home page",
  featureType: "static",
};

export { HomeSlice };
export default HomeSlice;
