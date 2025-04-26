// This is a critical file that needs to be fixed to properly handle workspace menu items

import { cache } from "react";

// Import types and data from the compatibility layer
// Use type imports for interfaces and standard imports for data/functions
import {
    // Data/Functions (placeholders)
    users as dummyUsers,
    roles as dummyRoles,
    userRoles as dummyUserRoles,
    dashboards as dummyDashboards,
    workspaces as dummyWorkspaces,
    menuItems as dummyMenuItems,
    menuItemRelations as dummyMenuItemRelations,
    companyEmployees as dummyCompanyEmployees,
    companyProjects as dummyCompanyProjects,
    financeRecords as dummyFinanceRecords,
    generateFullMapping,
} from "./data-services/compatibility-layer";

// Import legacy types using 'type' keyword
import type {
    User,
    Role,
    UserRole,
    DashboardLegacy as Dashboard, // Alias DashboardLegacy as Dashboard for local use
    WorkspaceLegacy as Workspace, // Alias WorkspaceLegacy as Workspace for local use
    MenuItemLegacy as MenuItem,   // Alias MenuItemLegacy as MenuItem for local use
    MenuItemRelation,
    CompanyEmployee,
    CompanyProject,
    FinanceRecord,
    DashboardWorkspaceMenuMapping,
} from "./data-services/compatibility-layer";

// Re-export types for use throughout the application using the aliased names
export type {
    User,
    Role,
    UserRole,
    Dashboard,
    Workspace,
    MenuItem,
    CompanyEmployee,
    CompanyProject,
    FinanceRecord,
    MenuItemRelation,
    DashboardWorkspaceMenuMapping,
};

// Potentially conflicting imports - keep commented out
// import { Dashboard as PrismaDashboard, Workspace as PrismaWorkspace, MenuItem as PrismaMenuItem } from "@prisma/client";
// import { Role as GenkitRole } from "genkit";
// import { User as NextAuthUser } from "next-auth";
// import { UserRole as SharedUserRole } from "../app/_shared/session/session-provider";


/**
 * API response types
 */
export type ApiResponse<T> = {
    data: T;
    meta?: {
        pagination?: {
            total: number;
            per_page: number;
            current_page: number;
            last_page: number;
        };
    };
};

/**
 * Data access functions with caching - Using compatibility types
 * These functions now return the aliased legacy types (Dashboard, Workspace, MenuItem)
 */

export const getUsers = cache((): User[] => {
    console.log("[data-service] getUsers called");
    return dummyUsers;
});

export const getRoles = cache((): Role[] => {
    console.log("[data-service] getRoles called");
    return dummyRoles;
});

export const getUserRoles = cache((): UserRole[] => {
    console.log("[data-service] getUserRoles called");
    return dummyUserRoles;
});

export const getDashboards = cache((): Dashboard[] => {
    console.log("[data-service] getDashboards called");
    // Returns dummyDashboards which has type DashboardLegacy[]
    // Aliased as Dashboard[] locally
    return dummyDashboards;
});

export const getWorkspaces = cache((): Workspace[] => {
    console.log("[data-service] getWorkspaces called");
     // Returns dummyWorkspaces which has type WorkspaceLegacy[]
    // Aliased as Workspace[] locally
    return dummyWorkspaces;
});

export const getMenuItems = cache((): MenuItem[] => {
    console.log("[data-service] getMenuItems called");
    // Returns dummyMenuItems which has type MenuItemLegacy[]
    // Aliased as MenuItem[] locally
    return dummyMenuItems;
});

export const getMenuItemRelations = cache((): MenuItemRelation[] => {
    console.log("[data-service] getMenuItemRelations called");
    return dummyMenuItemRelations;
});


/**
 * Helper functions to get data by ID
 */

export const getUserById = (id: string): User | undefined => {
    console.log(`[data-service] getUserById called with id: ${id}`);
    return getUsers().find((user) => user.id === id);
};

// This function seems unrelated to the main data flow and might need its own type
export function getDemoUserById(userId: string) {
    // In a real app, this would fetch from the database
    return {
        id: userId,
        full_name: "Demo User", // Note: legacy User type doesn't have full_name
        email: "user@example.com",
        role: "admin", // Note: legacy User type doesn't have role like this
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
}

export const getRoleById = (id: string): Role | undefined => {
    console.log(`[data-service] getRoleById called with id: ${id}`);
    return getRoles().find((role) => role.id === id);
};

export const getDashboardById = async (id: string): Promise<Dashboard | undefined> => {
    console.log(`[data-service] getDashboardById called with id: ${id}`);
    const dashboard = getDashboards().find((dashboard) => dashboard.id === id);
    if (!dashboard) {
        console.log(`[data-service] Dashboard not found with id: ${id}`);
        console.log(
            `[data-service] Available dashboards: ${getDashboards()
                .map((d: Dashboard) => d.id) // Type d is now the aliased Dashboard (DashboardLegacy)
                .join(", ")}`
        );
    }
    return dashboard;
};

export const getWorkspaceById = (id: string): Workspace | undefined => {
    console.log(`[data-service] getWorkspaceById called with id: ${id}`);
    const workspace = getWorkspaces().find((workspace) => workspace.id === id);
    if (!workspace) {
        console.log(`[data-service] Workspace not found with id: ${id}`);
        console.log(
            `[data-service] Available workspaces: ${getWorkspaces()
                .map((w: Workspace) => w.id) // Type w is now the aliased Workspace (WorkspaceLegacy)
                .join(", ")}`
        );
    }
    return workspace;
};

export const getMenuItemById = (id: string): MenuItem | undefined => {
    console.log(`[data-service] getMenuItemById called with id: ${id}`);
    return getMenuItems().find((item) => item.id === id);
};

/**
 * Helper functions to get related data
 */

export const getWorkspacesForDashboard = async (dashboardId: string): Promise<Workspace[]> => {
    console.log(`[data-service] getWorkspacesForDashboard called with dashboardId: ${dashboardId}`);
    const dashboard = await getDashboardById(dashboardId);
    if (!dashboard) {
        console.log(`[data-service] Dashboard not found for ID: ${dashboardId}, returning empty workspaces array`);
        return [];
    }

    // Use workspace_ids from the Dashboard (DashboardLegacy) type
    const workspaceIds = dashboard.workspace_ids || [];
    console.log(`[data-service] Looking for workspaces with IDs: ${workspaceIds.join(", ")}`);

    const result = getWorkspaces().filter((workspace) => workspaceIds.includes(workspace.id));
    console.log(`[data-service] Found ${result.length} workspaces for dashboard ${dashboardId}`);

    return result;
};

export const getMenuItemsForDashboard = async (dashboardId: string): Promise<MenuItem[]> => {
    console.log(`[data-service] getMenuItemsForDashboard called with dashboardId: ${dashboardId}`);
    const dashboard = await getDashboardById(dashboardId);
    if (!dashboard) return [];

    // Use menu_ids from the Dashboard (DashboardLegacy) type
    const menuIds = dashboard.menu_ids || [];
    return getMenuItems().filter((item) => menuIds.includes(item.id));
};

// Fixed version of getMenuItemsForWorkspace that properly logs and returns menu items
export const getMenuItemsForWorkspace = async (workspaceId: string): Promise<MenuItem[]> => {
    console.log(`[data-service] getMenuItemsForWorkspace called with workspaceId: ${workspaceId}`);
    const workspace = getWorkspaceById(workspaceId);
    if (!workspace) {
        console.log(`[data-service] Workspace not found: ${workspaceId}`);
        return [];
    }

    // Use menu_ids from the Workspace (WorkspaceLegacy) type
    const menuIds = workspace.menu_ids || [];
    console.log(`[data-service] Workspace ${workspaceId} has menu_ids: ${menuIds.join(", ") || "none"}`);

    if (menuIds.length === 0) {
        console.log(`[data-service] Workspace ${workspaceId} has no menu items`);
        return [];
    }

    // Get the menu items that match the workspace's menu_ids
    const workspaceMenuItems = getMenuItems().filter((item) => menuIds.includes(item.id));
    console.log(`[data-service] Found ${workspaceMenuItems.length} menu items for workspace ${workspaceId}`);

    // Log each menu item for debugging - use 'title' or 'name' from MenuItem (MenuItemLegacy)
    workspaceMenuItems.forEach((item: MenuItem) => {
        const itemName = item.title ?? item.name ?? item.id; // Use fields from MenuItemLegacy
        console.log(`[data-service] Workspace menu item: ${item.id} (${itemName})`);
    });
    
    return workspaceMenuItems;
};

// Function to get dashboard menu items that should be visible in workspaces
export const getDashboardMenuItemsForWorkspaces = async (dashboardId: string): Promise<MenuItem[]> => {
    console.log(`[data-service] getDashboardMenuItemsForWorkspaces called with dashboardId: ${dashboardId}`);
    const dashboard = await getDashboardById(dashboardId);
    if (!dashboard) return [];

    // Use workspace_visible_menu_ids from the Dashboard type
    const menuIds = dashboard.workspace_visible_menu_ids || [];
    return getMenuItems().filter((item) => menuIds.includes(item.id));
};

export const getAllMenuItemsForContext = async (dashboardId: string, workspaceId?: string): Promise<MenuItem[]> => {
    console.log(`[data-service] getAllMenuItemsForContext called with dashboardId: ${dashboardId}, workspaceId: ${workspaceId || 'none'}`);
    
    if (workspaceId) {
        // If we have a workspace ID, we need to get menu items for both the dashboard and workspace
        const dashboardMenuItems = await getMenuItemsForDashboard(dashboardId);
        const workspaceMenuItems = await getMenuItemsForWorkspace(workspaceId);
        const dashboardMenuItemsForWorkspaces = await getDashboardMenuItemsForWorkspaces(dashboardId);
        
        // Combine all menu items and remove duplicates
        const allMenuItems = [...dashboardMenuItems, ...workspaceMenuItems, ...dashboardMenuItemsForWorkspaces];
        return allMenuItems.filter((item, index, self) => 
            index === self.findIndex((t) => t.id === item.id)
        );
    } else {
        // If we only have a dashboard ID, just get menu items for the dashboard
        return await getMenuItemsForDashboard(dashboardId);
    }
};

// Check if a dashboard has workspaces
export const dashboardHasWorkspaces = async (dashboardId: string): Promise<boolean> => {
    console.log(`[data-service] dashboardHasWorkspaces called with dashboardId: ${dashboardId}`);
    const dashboard = await getDashboardById(dashboardId);
    return (dashboard?.workspace_ids?.length ?? 0) > 0;
};

// Get the dashboard type
export const getDashboardType = async (dashboardId: string): Promise<string> => {
    console.log(`[data-service] getDashboardType called with dashboardId: ${dashboardId}`);
    const dashboard = await getDashboardById(dashboardId);
    if (!dashboard) return "unknown";

    const hasWorkspaces = await dashboardHasWorkspaces(dashboardId);
    const hasMenuItems = (dashboard.menu_ids?.length ?? 0) > 0;

    if (hasWorkspaces && hasMenuItems) return "full";
    if (hasWorkspaces) return "workspace-only";
    if (hasMenuItems) return "menu-only";
    return "empty";
};

// Helper functions for building menu structures
export const buildMenuTree = async (dashboardId: string, workspaceId?: string): Promise<MenuItem[]> => {
    console.log(`[data-service] buildMenuTree called with dashboardId: ${dashboardId}, workspaceId: ${workspaceId || 'none'}`);
    const allMenuItems = await getAllMenuItemsForContext(dashboardId, workspaceId);
    
    // Filter to only top-level items (those with no parent or parent_id is empty)
    const topLevelItems = allMenuItems.filter(item => !item.parent_id);
    
    // Sort by order if available (using a safe approach since order might not exist)
    return topLevelItems.sort((a, b) => ((a as any).order || 0) - ((b as any).order || 0));
};

interface MenuItemWithChildren extends MenuItem {
    children: MenuItem[];
}

export const getMenuItemsWithChildren = async (dashboardId: string, workspaceId?: string): Promise<MenuItemWithChildren[]> => {
    console.log(`[data-service] getMenuItemsWithChildren called with dashboardId: ${dashboardId}, workspaceId: ${workspaceId || 'none'}`);
    const allMenuItems = await getAllMenuItemsForContext(dashboardId, workspaceId);
    
    // First, get all top-level items
    const topLevelItems = allMenuItems.filter(item => !item.parent_id);
    
    // Then, for each top-level item, find its children
    return topLevelItems.map(item => {
        const children = allMenuItems.filter(child => child.parent_id === item.id);
        return {
            ...item,
            children: children.sort((a, b) => ((a as any).order || 0) - ((b as any).order || 0)),
        };
    }).sort((a, b) => ((a as any).order || 0) - ((b as any).order || 0));
};

/**
 * Dynamic path generation for menu items
 */
export const getMenuItemPath = (menuItem: MenuItem, dashboardId: string, workspaceId?: string): string => {
  console.log(
    `[data-service] getMenuItemPath called for menuItem: ${menuItem.id}, dashboardId: ${dashboardId}, workspaceId: ${workspaceId || "none"}`
  );

  let path = `/dashboard/${dashboardId}`;

  if (workspaceId) {
    path += `/${workspaceId}`;
  }

  path += `/${menuItem.id}`; // Assuming menuItem.id is the slug/identifier

  return path;
};

/**
 * Workspace helper functions
 */
export const workspaceHasMenuItems = (workspaceId: string): boolean => {
  console.log(`[data-service] workspaceHasMenuItems called with workspaceId: ${workspaceId}`);
  const workspace = getWorkspaceById(workspaceId);
  if (!workspace) return false;
  return (workspace.menu_ids || []).length > 0;
};

// Get the workspace type
export const getWorkspaceType = (workspaceId: string): string => {
  console.log(`[data-service] getWorkspaceType called with workspaceId: ${workspaceId}`);
  const workspace = getWorkspaceById(workspaceId);
  if (!workspace) return "unknown";

  if (workspace.type) return workspace.type;

  const menuIds = workspace.menu_ids || [];
  if (menuIds.length > 5) return "Full-featured";
  if (menuIds.length > 2) return "Standard";
  if (menuIds.length > 0) return "Basic";
  return "Empty";
};

// ... (rest of the code remains the same)
