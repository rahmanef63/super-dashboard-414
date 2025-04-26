"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  Home,
  HelpCircle, // Import a fallback icon
  LayoutDashboard
  // Other icons are likely resolved via getIconByName now, but keep needed defaults
} from "lucide-react" // Assuming lucide-react is installed now
import {
  getMenuItemRelations,
  getMenuItemsForDashboard,
  getMenuItemsForWorkspace,
  getWorkspaceById,
  getDashboardById,
  getMenuItemPath,
  workspaceHasMenuItems,
} from "@/lib/data-service"
import { getIconByName } from "@/shared/icon-picker/utils"; // Import the utility
// Corrected import for TeamData - assuming it's defined here or in ../types
// If TeamData is not in ../types, define it here:
// interface TeamData { name: string; logo: React.ElementType; plan: string; }
// TODO: Move these to '@/types' for project-wide reuse
export type NavItem = { title: string; url: string; icon?: any; isActive: boolean; workspaceId?: string; items: NavItem[] };
export type UserData = { name: string; email: string; avatar: string };
export type WorkspaceData = { name: string; logo: any; plan: string };

import type { Dashboard, MenuItem, User } from "@/lib/data-service";

// Define TeamData locally if not exported from ../types
// interface TeamData {
//   name: string;
//   logo: React.ElementType; // Or specific icon type if needed
//   plan: string;
// }


// Hook to transform menu items into the format expected by NavMain
// Now expects menuItems to be fetched from the backend (see usage below)
export function useNavItems(menuItems: MenuItem[], pathname: string, dashboardId: string): NavItem[] {
  return React.useMemo(() => {
    try {
      // Ensure menuItems is an array
      if (!Array.isArray(menuItems)) {
          console.warn("[useNavItems] menuItems is not an array:", menuItems);
          return [];
      }

      console.log(`[useNavItems] Starting with ${menuItems.length} menu items for dashboard ${dashboardId}`)

      // Backend: menuItems should already be filtered for this dashboard
      if (!menuItems || menuItems.length === 0) {
        const DefaultIcon = getIconByName("LayoutDashboard") || HelpCircle;
        return [
          {
            title: "Dashboard",
            url: `/dashboard/${dashboardId}`,
            icon: DefaultIcon,
            isActive: pathname === `/dashboard/${dashboardId}`,
            items: [],
          },
        ];
      }

      return menuItems
        .filter((item) => !item.parent_id) // Only top-level items
        .map((item) => {
        const subItems = menuItems.filter((subItem) => subItem.parent_id === item.id);

        // --- Updated Icon Logic with fallback name ---
        const IconComponent = getIconByName(item.icon || item.name || 'HelpCircle') || HelpCircle;
        // --- End Updated Icon Logic ---

        const itemPath = item.path || getMenuItemPath(item, dashboardId);
        const isActive = pathname.includes(itemPath);

        return {
          title: item.name ?? 'Untitled Item', // Fallback for title
          url: itemPath,
          icon: IconComponent,
          isActive: isActive,
          items: subItems.map((subItem) => {
            const subItemPath = subItem.path || getMenuItemPath(subItem, dashboardId);
            const isSubItemActive = pathname.includes(subItemPath);

            return {
              title: subItem.name ?? 'Untitled SubItem',
              url: subItemPath,
              isActive: isSubItemActive,
              items: [], // Ensure NavItem typing
            };
          }),
        };
      });
    } catch (error) {
      console.error("[useNavItems] Error:", error)
      return []
    }
  }, [menuItems, pathname, dashboardId]);
}

// Update the useWorkspaceMenuItems hook
// Now expects menuItems to be fetched from the backend (see usage below)
export function useWorkspaceMenuItems(
  menuItems: MenuItem[],
  activeWorkspaceId: string | undefined,
  pathname: string,
  dashboardId: string,
): NavItem[] {
  return React.useMemo(() => {
    try {
      if (!activeWorkspaceId) {
        return [];
      }
      if (!menuItems || menuItems.length === 0) {
        const DefaultHomeIcon = getIconByName("Home") || HelpCircle;
        const DefaultOverviewIcon = getIconByName("LayoutDashboard") || HelpCircle;
        return [
          {
            title: "Workspace Home",
            url: `/dashboard/${dashboardId}/${activeWorkspaceId}`,
            icon: DefaultHomeIcon,
            isActive: pathname === `/dashboard/${dashboardId}/${activeWorkspaceId}`,
            workspaceId: activeWorkspaceId,
            items: [],
          },
          {
            title: "Workspace Overview",
            url: `/dashboard/${dashboardId}/${activeWorkspaceId}/overview`,
            icon: DefaultOverviewIcon,
            isActive: pathname.includes(`/dashboard/${dashboardId}/${activeWorkspaceId}/overview`),
            workspaceId: activeWorkspaceId,
            items: [],
          },
        ];
      }
      return menuItems
        .filter((item) => !item.parent_id)
        .map((item) => {
          const subItems = menuItems.filter((subItem: MenuItem) => subItem.parent_id === item.id);

          // --- Updated Icon Logic with fallback name ---
          const IconComponent = getIconByName(item.icon || item.name || 'HelpCircle') || HelpCircle;
          // --- End Updated Icon Logic ---

          const itemPath = item.path || getMenuItemPath(item, dashboardId, activeWorkspaceId);
          const isActive = pathname.includes(itemPath) || pathname.includes(`/dashboard/${dashboardId}/${activeWorkspaceId}/${item.id}`);

          return {
            title: item.name ?? 'Untitled Item', // Fallback for title
            url: itemPath,
            icon: IconComponent,
            isActive: isActive,
            workspaceId: activeWorkspaceId,
            items: subItems.map((subItem) => {
              const subItemPath = subItem.path || getMenuItemPath(subItem, dashboardId, activeWorkspaceId);
              const isSubItemActive = pathname.includes(subItemPath);

              return {
                title: subItem.name ?? 'Untitled SubItem',
                url: subItemPath,
                isActive: isSubItemActive,
                workspaceId: activeWorkspaceId,
                items: [], // Ensure NavItem typing
              };
            }),
          };
        });
    } catch (error) {
      console.error("[useWorkspaceMenuItems] Error:", error);
      return [];
    }
  }, [activeWorkspaceId, pathname, dashboardId]);
}

// Hook to create teams data for TeamSwitcher
// Ensure TeamData type matches expectation (either from import or local definition)
export function useTeamsData(dashboard: Dashboard): WorkspaceData[] {
  return React.useMemo(() => {
    try {
      // Ensure dashboard.name is a string
      const teamName = dashboard?.name ?? "Default Dashboard";
      return [
        {
          name: teamName,
          logo: GalleryVerticalEnd, // This might need getIconByName too if dynamic
          plan: "Active", // Assuming plan is static for now
        },
      ]
    } catch (error) {
      console.error("Error creating teams data:", error)
      // Provide a fallback TeamData object
      return [
        {
          name: "Fallback Team",
          logo: GalleryVerticalEnd,
          plan: "Unknown",
        },
      ]
    }
  }, [dashboard])
}


// Hook to create user data for NavUser
export function useUserData(user: User | undefined): UserData {
  // console.log("[useUserData] Received user:", user); // Already added
  return React.useMemo(() => {
    if (!user) {
      // console.warn("[useUserData] User object is undefined. Returning default data."); // Already added
      return {
        name: "Guest User",
        email: "guest@example.com",
        avatar: `/avatars/default.jpg`,
      };
    }
    try {
      const userName = user.name ?? "User Name Missing";
      const userEmail = user.email ?? "email@missing.com";

      // Corrected avatar logic: Use a known property or default. Assuming no 'image' property.
      // Check if user object from session might have 'picture' or 'avatar' standard OIDC claims
      const avatarUrl = (user as any).picture || (user as any).avatar || `/avatars/default.jpg`;

      return {
        name: userName,
        email: userEmail,
        avatar: avatarUrl, // Use corrected avatar logic
      };
    } catch (error) {
      console.error("[useUserData] Error processing user data:", error, "User data:", user);
      return {
        name: "Error User",
        email: "error@example.com",
        avatar: `/avatars/default.jpg`,
      };
    }
  }, [user]);
}
