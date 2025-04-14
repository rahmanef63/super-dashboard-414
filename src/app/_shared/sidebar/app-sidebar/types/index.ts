import type React from "react";
// Ensure types point to the correct source, e.g., @/types/types or prisma client directly
// Assuming these types are defined in a central place like @/types/types
import type { Dashboard, Workspace, MenuItem, User as DataServiceUser, MenuUsage as PrismaMenuUsage } from "@/types/types";
import { type Sidebar } from "@/components/ui/sidebar";
import type { LucideIcon } from "lucide-react";

// Define the populated MenuUsage type consistent with layout
type MenuUsage = PrismaMenuUsage & {
  menuItem?: MenuItem; // Assuming your fetch populates menuItem
};

// Update props to match what's passed from DashboardLayout
export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userDashboards: Dashboard[];   // List of all dashboards for the user
  currentDashboard: Dashboard; // The currently active dashboard
  workspaces: Workspace[];     // Workspaces for the current dashboard
  menuUsages: MenuUsage[];     // MenuUsage records for the current dashboard (potentially populated)
  user: DataServiceUser;       // User data (ensure type matches layout's sidebarUser)
  // activeWorkspaceId is no longer needed here if context handles it solely
}

// Keep NavItem as is for now, it's the target structure for DynamicMenu
export interface NavItem {
  title: string;
  url: string;
  icon?: string | LucideIcon;
  isActive?: boolean;
  workspaceId?: string | null; // Allow null for dashboard-level items
  items?: {
    title: string;
    url: string;
    isActive?: boolean;
    workspaceId?: string | null; // Allow null
  }[];
}

// Keep other types if they are still used elsewhere
export interface DashboardData {
  dashboard?: string;
  name: string;
  logo: React.ElementType;
  plan: string;
}

export interface UserData {
  name: string;
  email: string;
  avatar?: string | null; // Allow null/undefined avatar
}
