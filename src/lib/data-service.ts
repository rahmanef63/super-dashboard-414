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

export const getDashboardById = (id: string): Dashboard | undefined => {
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

export const getWorkspacesForDashboard = (dashboardId: string): Workspace[] => {
    console.log(`[data-service] getWorkspacesForDashboard called with dashboardId: ${dashboardId}`);
    const dashboard = getDashboardById(dashboardId);
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

export const getMenuItemsForDashboard = (dashboardId: string): MenuItem[] => {
    console.log(`[data-service] getMenuItemsForDashboard called with dashboardId: ${dashboardId}`);
    const dashboard = getDashboardById(dashboardId);
    if (!dashboard) return [];

    // Use menu_ids from the Dashboard (DashboardLegacy) type
    const menuIds = dashboard.menu_ids || [];
    return getMenuItems().filter((item) => menuIds.includes(item.id));
};

// Fixed version of getMenuItemsForWorkspace that properly logs and returns menu items
export const getMenuItemsForWorkspace = (workspaceId: string): MenuItem[] => {
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
export const getDashboardMenuItemsForWorkspaces = (dashboardId: string): MenuItem[] => {
    console.log(`[data-service] getDashboardMenuItemsForWorkspaces called with dashboardId: ${dashboardId}`);
    const dashboard = getDashboardById(dashboardId);
    if (!dashboard) return [];

    // Use workspace_visible_menu_ids from the Dashboard (DashboardLegacy) type
    const dashboardMenuIds = dashboard.workspace_visible_menu_ids || [];

    // If dashboard has no workspace-visible menu items, return empty array
    if (dashboardMenuIds.length === 0) {
        console.log(`[data-service] Dashboard ${dashboardId} has no workspace-visible menu items`);
        return [];
    }

    return getMenuItems().filter((item) => dashboardMenuIds.includes(item.id));
};

export const getAllMenuItemsForContext = (dashboardId: string, workspaceId?: string): MenuItem[] => {
    console.log(
        `[data-service] getAllMenuItemsForContext called with dashboardId: ${dashboardId}, workspaceId: ${workspaceId || "none"}`
    );

    // Get dashboard-level menu items
    const dashboardMenuItems = getMenuItemsForDashboard(dashboardId);

    // If no workspace specified, return only dashboard-level items
    if (!workspaceId) {
        return dashboardMenuItems;
    }

    // Get workspace-level menu items
    const workspaceMenuItems = getMenuItemsForWorkspace(workspaceId);

    // Combine and return all menu items (removing duplicates)
    const allMenus = [...dashboardMenuItems, ...workspaceMenuItems];
    const uniqueMenus = Array.from(new Map(allMenus.map((item) => [item.id, item])).values());

    return uniqueMenus;
};

// Simplified version that uses arrays for parent-child relationships
export const getChildMenuItems = (parentId: string): MenuItem[] => {
    console.log(`[data-service] getChildMenuItems called with parentId: ${parentId}`);

    // Use parentId or parent_id from MenuItem (MenuItemLegacy) type
    const directChildren = getMenuItems().filter((item: MenuItem) => item.parentId === parentId || item.parent_id === parentId);

    // Check the relations table
    const relationChildren = getMenuItemRelations()
        .filter((relation: MenuItemRelation) => relation.parent_id === parentId)
        .map((relation: MenuItemRelation) => getMenuItemById(relation.child_id))
        .filter((item): item is MenuItem => item !== undefined);

    // Combine both sets of children, removing duplicates
    const allChildren = [...directChildren, ...relationChildren];
    return Array.from(new Map(allChildren.map((item: MenuItem) => [item.id, item])).values());
};

export const getEmployeesForWorkspace = (workspaceId: string): CompanyEmployee[] => {
    console.log(`[data-service] getEmployeesForWorkspace called with workspaceId: ${workspaceId}`);
    return dummyCompanyEmployees.filter((employee: CompanyEmployee) => employee.workspace_id === workspaceId);
};

export const getProjectsForWorkspace = (workspaceId: string): CompanyProject[] => {
    console.log(`[data-service] getProjectsForWorkspace called with workspaceId: ${workspaceId}`);
    return dummyCompanyProjects.filter((project: CompanyProject) => project.workspace_id === workspaceId);
};

export const getFinanceRecordsForWorkspace = (workspaceId: string): FinanceRecord[] => {
    console.log(`[data-service] getFinanceRecordsForWorkspace called with workspaceId: ${workspaceId}`);
    return dummyFinanceRecords.filter((record: FinanceRecord) => record.workspace_id === workspaceId);
};


/**
 * Dashboard type helper functions
 */

// Check if a dashboard has workspaces
export const dashboardHasWorkspaces = (dashboardId: string): boolean => {
    const dashboard = getDashboardById(dashboardId);
    if (!dashboard) return false;
    return (dashboard.workspace_ids || []).length > 0;
};

// Check if a dashboard has menu items
export const dashboardHasMenuItems = (dashboardId: string): boolean => {
    const dashboard = getDashboardById(dashboardId);
    if (!dashboard) return false;
    return (dashboard.menu_ids || []).length > 0;
};

// Get the dashboard type
export const getDashboardType = (dashboardId: string): string => {
    const dashboard = getDashboardById(dashboardId);
    if (!dashboard) return "unknown";

    const hasWorkspaces = (dashboard.workspace_ids || []).length > 0;
    const hasMenuItems = (dashboard.menu_ids || []).length > 0;

    if (hasWorkspaces && hasMenuItems) return "full";
    if (hasWorkspaces) return "workspace-focused";
    if (hasMenuItems) return "menu-focused";
    return "minimal";
};

// Check if a workspace has menu items
export const workspaceHasMenuItems = (workspaceId: string): boolean => {
    const workspace = getWorkspaceById(workspaceId);
    if (!workspace) return false;
    return (workspace.menu_ids || []).length > 0;
};

// Get the workspace type
export const getWorkspaceType = (workspaceId: string): string => {
    const workspace = getWorkspaceById(workspaceId);
    if (!workspace) return "unknown";

    if (workspace.type) return workspace.type;

    const menuIds = workspace.menu_ids || [];
    if (menuIds.length > 5) return "Full-featured";
    if (menuIds.length > 2) return "Standard";
    if (menuIds.length > 0) return "Basic";
    return "Empty";
};


/**
 * Mapping functions
 */

export const getDashboardWorkspaceMenuMapping = cache((): DashboardWorkspaceMenuMapping[] => {
    console.log("[data-service] getDashboardWorkspaceMenuMapping called");
    return generateFullMapping();
});

export const getMappingForDashboard = (dashboardId: string): DashboardWorkspaceMenuMapping[] => {
    console.log(`[data-service] getMappingForDashboard called with dashboardId: ${dashboardId}`);
    return getDashboardWorkspaceMenuMapping().filter((mapping) => mapping.dashboard_id === dashboardId);
};

export const getMappingForWorkspace = (workspaceId: string): DashboardWorkspaceMenuMapping[] => {
    console.log(`[data-service] getMappingForWorkspace called with workspaceId: ${workspaceId}`);
    return getDashboardWorkspaceMenuMapping().filter((mapping) => mapping.workspace_id === workspaceId);
};

/**
 * Helper functions for building menu structures
 */

export const buildMenuTree = (dashboardId: string, workspaceId?: string): MenuItem[] => {
    console.log(
        `[data-service] buildMenuTree called with dashboardId: ${dashboardId}, workspaceId: ${workspaceId || "none"}`
    );

    const contextMenuItems = getAllMenuItemsForContext(dashboardId, workspaceId);

    // Find root menu items using parentId or parent_id from MenuItem (MenuItemLegacy)
    const rootItems = contextMenuItems.filter((item) => !item.parentId && !item.parent_id);

    return rootItems;
};

// Define the return type explicitly using the aliased MenuItem
interface MenuItemWithChildren extends MenuItem {
    children: MenuItem[];
}

export const getMenuItemsWithChildren = (dashboardId: string, workspaceId?: string): MenuItemWithChildren[] => {
    console.log(
        `[data-service] getMenuItemsWithChildren called with dashboardId: ${dashboardId}, workspaceId: ${workspaceId || "none"}`
    );
    const rootItems = buildMenuTree(dashboardId, workspaceId);

    return rootItems.map((rootItem) => {
        const children = getChildMenuItems(rootItem.id);
        return {
            ...rootItem,
            children,
        };
    });
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
 * User-related functions
 */

export const getCurrentUser = (): User | undefined => {
    console.log("[data-service] getCurrentUser called");
    const users = getUsers();
    return users[0];
};


/**
 * Mock API functions that simulate real API calls
 */

export async function fetchDashboards(): Promise<ApiResponse<Dashboard[]>> {
    console.log("[data-service] fetchDashboards called");
    await new Promise((resolve) => setTimeout(resolve, 500));
    const dashboardsData = getDashboards();
    return {
        data: dashboardsData,
        meta: {
            pagination: {
                total: dashboardsData.length,
                per_page: 10,
                current_page: 1,
                last_page: Math.ceil(dashboardsData.length / 10),
            },
        },
    };
}

export async function fetchDashboardById(id: string): Promise<ApiResponse<Dashboard>> {
    console.log(`[data-service] fetchDashboardById called with id: ${id}`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const dashboard = getDashboardById(id);
    if (!dashboard) {
        throw new Error(`Dashboard with id ${id} not found`);
    }
    return { data: dashboard };
}

export async function fetchMenuItemsForDashboard(dashboardId: string): Promise<ApiResponse<MenuItem[]>> {
    console.log(`[data-service] fetchMenuItemsForDashboard called with dashboardId: ${dashboardId}`);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const items = getMenuItemsForDashboard(dashboardId);
    return { data: items };
}

export async function fetchDashboardWorkspaceMenuMapping(): Promise<ApiResponse<DashboardWorkspaceMenuMapping[]>> {
    console.log("[data-service] fetchDashboardWorkspaceMenuMapping called");
    await new Promise((resolve) => setTimeout(resolve, 600));
    const mapping = getDashboardWorkspaceMenuMapping();
    return { data: mapping };
}
