import type { FeatureManifest } from "@/shared/pages/types/manifest";
import { Bell } from "lucide-react";
// TODO: Replace with actual main component import
const NotificationsSlice = () => null;

export const manifest: FeatureManifest = {
  title: "Notifications",
  url: "/notifications",
  icon: Bell,
  description: "View your notifications and alerts",
  featureType: "static",
};

export { NotificationsSlice };
export default NotificationsSlice;
