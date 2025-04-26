import type { LucideIcon } from "lucide-react";

export interface FeatureManifest {
  title: string;
  url: string;
  icon?: string | LucideIcon;
  description?: string;
  featureType: "static" | "dynamic";
  // Add any other metadata or validation fields you need
}
