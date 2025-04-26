import type { FeatureManifest } from "@/shared/pages/types/manifest";
import { Database } from "lucide-react";
// TODO: Replace with actual main component import
const DatabaseManagementSlice = () => null;

export const manifest: FeatureManifest = {
  title: "Database Management",
  url: "/database-management",
  icon: Database,
  description: "Manage your database tables and records",
  featureType: "static",
};

export { DatabaseManagementSlice };
export default DatabaseManagementSlice;
