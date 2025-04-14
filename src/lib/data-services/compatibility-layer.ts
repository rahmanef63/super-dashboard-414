import { cache } from "react";
// Assume user-service might have functions later, keep import but comment out uses for now
import * as userService from "./user-service";
// Import menu-service, assuming dashboard/workspace functions might be there or need separate handling
import * as menuService from "./menu-service";
// Import types from Prisma for mapping functions
import { Prisma } from "@prisma/client"; // Import Prisma namespace
import type {
    User as PrismaUser,
    Role as PrismaRole,
    Dashboard as PrismaDashboard,
    Workspace as PrismaWorkspace,
    MenuItem as PrismaMenuItem
    // JsonValue is not a direct export, use Prisma.JsonValue
} from "@prisma/client"; // Adjust path if needed

// Define or re-export necessary types for compatibility
// These interfaces represent the *legacy* structure expected by data-service.ts,
// informed by the fields available in the new Prisma schema.

export interface User {
    id: string;
    email: string; // from Prisma
    name: string; // from Prisma (used for legacy 'name')
    fullName?: string | null; // from Prisma
    username?: string | null; // from Prisma
    website?: string | null; // from Prisma
    // passwordHash: string | null; // Generally avoid exposing this
    originDomain?: string | null; // from Prisma
    stylePreference?: Prisma.JsonValue | null; // Corrected: Use Prisma.JsonValue
    roleId?: string | null; // from Prisma
    // Legacy fields not directly in Prisma User model (might need mapping/defaults)
    password_hash?: string | null; // Legacy name?
    status?: string; // Not in Prisma User, default needed? e.g., 'active'
    created_at?: string | Date; // map from Prisma createdAt
    updated_at?: string | Date; // map from Prisma updatedAt
    // Relations aren't typically flattened into the main legacy type unless needed
}

export interface Role {
    id: string;
    name: string; // from Prisma
    description?: string | null; // from Prisma
    createdById?: string | null; // from Prisma
    // Legacy fields
    created_at?: string | Date; // map from Prisma createdAt
    // Relations like users, dashboards, workspaces, permissions not flattened
}

// This might be a combination of User and Role info in the legacy system
export interface UserRole {
    userId: string;
    roleId: string;
    // Add other fields if the legacy UserRole had more than just IDs
}

export interface DashboardLegacy {
    id: string;
    name: string; // from Prisma Dashboard
    description?: string | null; // from Prisma Dashboard
    organizationId?: string | null; // from Prisma Dashboard
    owner_id?: string | null; // map from Prisma createdById
    created_at?: string | Date; // map from Prisma createdAt
    updated_at?: string | Date; // map from Prisma createdAt (as updatedAt missing)
    // Legacy fields requiring specific mapping logic or defaults
    workspace_ids?: string[]; // Needs population (e.g., from dashboard.workspaces relation)
    menu_ids?: string[]; // Needs population (e.g., from dashboard.menuUsages relation)
    workspace_visible_menu_ids?: string[]; // Needs custom logic/population
    icon?: string; // Default or map
    is_public?: boolean; // Default or map
    // Relations (assignments, workspaces, menuUsages, externalDomains) not flattened
}

export interface WorkspaceLegacy {
    id: string;
    name: string; // from Prisma Workspace
    description?: string | null; // from Prisma Workspace
    dashboard_id?: string; // map from Prisma dashboardId
    created_at?: string | Date; // map from Prisma createdAt
    updated_at?: string | Date; // map from Prisma createdAt (as updatedAt missing)
    // Legacy fields requiring specific mapping logic or defaults
    menu_ids?: string[]; // Needs population (e.g., from workspace.menuUsages relation)
    type?: string; // Default or map
    icon?: string; // Default or map
    owner_id?: string | null; // Default null or fetch owner if needed
    // Relations (assignments, menuUsages) not flattened
}

export interface MenuItemLegacy {
    id: string;
    title: string; // from Prisma MenuItem
    name?: string; // Usually mapped from title in legacy system
    type: string; // from Prisma MenuItem
    icon?: string | null; // from Prisma MenuItem
    target?: string | null; // from Prisma MenuItem (maps to legacy 'path'/'url')
    path?: string | null; // Legacy field, map from target
    url?: string | null; // Legacy field, map from target
    globalContext?: boolean; // from Prisma MenuItem
    parentId?: string | null; // from Prisma MenuItem
    parent_id?: string | null; // Legacy field, map from parentId
    created_at?: string | Date; // map from Prisma createdAt
    updated_at?: string | Date; // map from Prisma createdAt (as updatedAt missing)
    description?: string; // Default empty or map if available
    // Relations (children, usages, permissions, dataSources, entries) not flattened by default
    // The 'items' field for children is handled in buildMenuTree mapping
}

// Represents the relationship table/concept in the legacy system
export interface MenuItemRelation {
    parent_id: string; // Legacy parent ID
    child_id: string; // Legacy child ID
}

// These seem unrelated to the provided Prisma schema - keep as simple placeholders
export interface CompanyEmployee { id: string; workspace_id: string; /* ... other fields */ }
export interface CompanyProject { id: string; workspace_id: string; /* ... other fields */ }
export interface FinanceRecord { id: string; workspace_id: string; /* ... other fields */ }

// Represents the mapping concept in the legacy system
export interface DashboardWorkspaceMenuMapping {
    dashboard_id: string;
    workspace_id: string;
    menu_id: string;
}


// --- Placeholder Data (Keep for now, but should be replaced by fetching/mapping) ---
export const users: User[] = [];
export const roles: Role[] = [];
export const userRoles: UserRole[] = [];

// ** ADDED A DUMMY DEFAULT DASHBOARD **
const defaultDashboard: DashboardLegacy = {
    id: "default-dashboard-1",
    name: "Default Dashboard",
    description: "The default fallback dashboard",
    organizationId: "org-default",
    owner_id: "user-system",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    workspace_ids: [], // Start with no workspaces
    menu_ids: [], // Start with no menus
    workspace_visible_menu_ids: [],
    icon: "home",
    is_public: true,
};

export const dashboards: DashboardLegacy[] = [defaultDashboard]; // Populate with the default

export const workspaces: WorkspaceLegacy[] = [];
export const menuItems: MenuItemLegacy[] = [];
export const menuItemRelations: MenuItemRelation[] = [];
export const companyEmployees: CompanyEmployee[] = [];
export const companyProjects: CompanyProject[] = [];
export const financeRecords: FinanceRecord[] = [];

// --- Compatibility Functions (Implement mapping logic here) ---

// User compatibility functions (Commented out as they don't exist in user-service)
// export const getUserById = userService.getUserById;
// export const getUserByEmail = userService.getUserByEmail;

// --- Mapping Functions ---

// Helper function to safely convert Date to ISO string or keep as Date
const formatLegacyDate = (date: Date | null | undefined): string | Date | undefined => {
    // Decide if legacy system needs ISO string or Date object
    return date ? date.toISOString() : undefined;
};

// Mapping function to convert from new schema (Prisma) to old schema format
export const mapUserToLegacyFormat = (user: PrismaUser): User => {
    return {
        id: user.id,
        email: user.email,
        name: user.name, // Map Prisma 'name' to legacy 'name'
        fullName: user.fullName,
        username: user.username,
        website: user.website,
        originDomain: user.originDomain,
        stylePreference: user.stylePreference,
        roleId: user.roleId,
        // Add defaults or logic for missing legacy fields
        status: 'active', // Example default
        created_at: formatLegacyDate(user.createdAt),
        updated_at: formatLegacyDate(user.updatedAt),
    };
};

export const mapRoleToLegacyFormat = (role: PrismaRole): Role => {
    return {
        id: role.id,
        name: role.name,
        description: role.description,
        createdById: role.createdById,
        created_at: formatLegacyDate(role.createdAt),
        // updated_at doesn't exist on Prisma Role
    };
};


export const mapDashboardToLegacyFormat = (
    dashboard: PrismaDashboard,
    // Optionally pass related data needed for legacy fields
    relatedData?: { workspace_ids?: string[], menu_ids?: string[], workspace_visible_menu_ids?: string[] }
): DashboardLegacy => {
    return {
        id: dashboard.id,
        name: dashboard.name,
        description: dashboard.description,
        organizationId: dashboard.organizationId,
        owner_id: dashboard.createdById,
        created_at: formatLegacyDate(dashboard.createdAt),
        updated_at: formatLegacyDate(dashboard.createdAt), // No updatedAt in Prisma Dashboard
        // Map legacy fields from relatedData or add fetching logic
        workspace_ids: relatedData?.workspace_ids ?? [],
        menu_ids: relatedData?.menu_ids ?? [],
        workspace_visible_menu_ids: relatedData?.workspace_visible_menu_ids ?? [],
        // Add defaults
        icon: "dashboard",
        is_public: true,
    };
};

export const mapWorkspaceToLegacyFormat = (
    workspace: PrismaWorkspace,
    relatedData?: { menu_ids?: string[] }
): WorkspaceLegacy => {
    return {
        id: workspace.id,
        name: workspace.name,
        description: workspace.description,
        dashboard_id: workspace.dashboardId,
        created_at: formatLegacyDate(workspace.createdAt),
        updated_at: formatLegacyDate(workspace.createdAt), // No updatedAt in Prisma Workspace
        // Map legacy fields
        menu_ids: relatedData?.menu_ids ?? [],
        // Add defaults
        type: "DEFAULT",
        icon: "folder",
        owner_id: null, // Or fetch if needed
    };
};

export const mapMenuItemToLegacyFormat = (menuItem: PrismaMenuItem): MenuItemLegacy => {
    return {
        id: menuItem.id,
        title: menuItem.title,
        name: menuItem.title, // Map title to legacy 'name'
        type: menuItem.type,
        icon: menuItem.icon,
        target: menuItem.target,
        path: menuItem.target, // Map target to legacy 'path'
        url: menuItem.target, // Map target to legacy 'url'
        globalContext: menuItem.globalContext,
        parentId: menuItem.parentId,
        parent_id: menuItem.parentId, // Map parentId to legacy 'parent_id'
        created_at: formatLegacyDate(menuItem.createdAt),
        updated_at: formatLegacyDate(menuItem.createdAt), // No updatedAt in Prisma MenuItem
        description: "", // Default
    };
};

// --- Service Function Placeholders (Implement using Prisma via imported services) ---

export const getDashboardById = cache((id: string): DashboardLegacy | undefined => {
    console.warn("[Compatibility] getDashboardById is using dummy data");
    return dashboards.find(d => d.id === id);
});

export const getDashboards = cache((): DashboardLegacy[] => {
    console.warn("[Compatibility] getDashboards is using dummy data");
    return dashboards;
});

export const getWorkspaceById = cache((id: string): WorkspaceLegacy | undefined => {
    console.warn("[Compatibility] getWorkspaceById is using dummy data");
    return workspaces.find(w => w.id === id);
});

export const getWorkspacesForDashboard = cache((dashboardId: string): WorkspaceLegacy[] => {
    console.warn("[Compatibility] getWorkspacesForDashboard is using dummy data");
     const dashboard = dashboards.find(d => d.id === dashboardId);
     if (!dashboard || !dashboard.workspace_ids) return [];
     return workspaces.filter(w => dashboard.workspace_ids?.includes(w.id));
});

export const getMenuItemById = cache((id: string): MenuItemLegacy | undefined => {
    console.warn("[Compatibility] getMenuItemById is using dummy data");
     return menuItems.find(item => item.id === id);
});

export const getMenuItemsForDashboard = cache((dashboardId: string): MenuItemLegacy[] => {
     console.warn("[Compatibility] getMenuItemsForDashboard is using dummy data");
     const dashboard = dashboards.find(d => d.id === dashboardId);
     if (!dashboard || !dashboard.menu_ids) return [];
     return menuItems.filter(item => dashboard.menu_ids?.includes(item.id));
});

export const getMenuItemsForWorkspace = cache((workspaceId: string): MenuItemLegacy[] => {
    console.warn("[Compatibility] getMenuItemsForWorkspace is using dummy data");
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (!workspace || !workspace.menu_ids) return [];
    return menuItems.filter(item => workspace.menu_ids?.includes(item.id));
});


// Build menu tree (compatibility with existing function)
// This needs careful reimplementation based on how children are fetched in the new structure
interface LegacyMenuItemWithChildren extends MenuItemLegacy {
    items?: Omit<LegacyMenuItemWithChildren, 'items'>[]; // Simplified child structure for legacy format
}

export const buildMenuTree = (dashboardId: string): LegacyMenuItemWithChildren[] => {
    console.warn("[Compatibility] buildMenuTree is using dummy data and basic structure");

    const dashboardMenuItems = getMenuItemsForDashboard(dashboardId);
    const itemsById: { [key: string]: LegacyMenuItemWithChildren } = {};
    dashboardMenuItems.forEach(item => {
        itemsById[item.id] = { ...item, items: [] };
    });

    const tree: LegacyMenuItemWithChildren[] = [];
    dashboardMenuItems.forEach(item => {
        const currentItem = itemsById[item.id];
        if (item.parent_id && itemsById[item.parent_id]) {
            // Ensure items array exists on parent
            if (!itemsById[item.parent_id].items) {
                itemsById[item.parent_id].items = [];
            }
            // Add child (without its own 'items' to avoid deep nesting in this simplified legacy view)
            const { items, ...childWithoutItems } = currentItem;
            itemsById[item.parent_id].items?.push(childWithoutItems);
        } else {
            tree.push(currentItem); // Root item
        }
    });
    return tree;
};


// Helper function to convert icon string to component (placeholder)
function getIconComponent(iconName: string | null): string | null { // Return type could be more specific
    // This would be replaced with actual icon mapping logic
    // console.warn(`[Compatibility] Icon mapping needed for: ${iconName}`);
    return iconName; // Return name for now
}

// Placeholder for generateFullMapping - implement if needed
export const generateFullMapping = (): DashboardWorkspaceMenuMapping[] => {
    console.warn("[Compatibility] generateFullMapping needs implementation");
    return [];
}

// Make the placeholder data-fetching functions synchronous and wrap them with cache
// Note: Removed async/await as they are just returning dummy data now.
export const getWorkspaces = cache((): WorkspaceLegacy[] => {
    console.warn("[Compatibility] getWorkspaces is using dummy data");
    return workspaces;
});

export const getMenuItems = cache((): MenuItemLegacy[] => {
    console.warn("[Compatibility] getMenuItems is using dummy data");
    return menuItems;
});

export const getMenuItemRelations = cache((): MenuItemRelation[] => {
    console.warn("[Compatibility] getMenuItemRelations is using dummy data");
    return menuItemRelations;
});

// Ensure other dummy data functions are also wrapped if used by cached functions directly
export const getCompanyEmployees = cache((): CompanyEmployee[] => {
    console.warn("[Compatibility] getCompanyEmployees is using dummy data");
    return companyEmployees;
});

export const getCompanyProjects = cache((): CompanyProject[] => {
    console.warn("[Compatibility] getCompanyProjects is using dummy data");
    return companyProjects;
});

export const getFinanceRecords = cache((): FinanceRecord[] => {
    console.warn("[Compatibility] getFinanceRecords is using dummy data");
    return financeRecords;
});

export const getDashboardWorkspaceMenuMapping = cache((): DashboardWorkspaceMenuMapping[] => {
    console.warn("[Compatibility] getDashboardWorkspaceMenuMapping needs implementation or dummy data");
    return generateFullMapping(); // Which currently returns []
});


// Additional compatibility functions can be added as needed
