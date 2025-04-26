import type { FeatureManifest } from "@/shared/pages/types/manifest";
import { Calendar } from "lucide-react";
// TODO: Replace with actual main component import
const CalendarSlice = () => null;

export const manifest: FeatureManifest = {
  title: "Calendar",
  url: "/calendar",
  icon: Calendar,
  description: "Manage your events and schedule",
  featureType: "static",
};

export { CalendarSlice };
export default CalendarSlice;