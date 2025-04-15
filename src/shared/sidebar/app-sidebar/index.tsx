"use client";
import { usePathname } from "next/navigation";
import { NavUser } from "../nav-user";
import { WorkspaceSwitcher } from "../workspace-switcher";
import type { Workspace } from "@/types/types"; // Import from central types
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
	SidebarSeparator,
	SidebarGroupLabel,
} from "@/components/ui/sidebar";
// Remove old hooks if logic is handled inline or via a new hook
// import { useNavItems, useWorkspaceMenuItems, useUserData, useTeamsData } from "./hooks";
import { useUserData } from "./hooks/use-user-data"; // Keep if still used for user formatting

// Import updated props type and NavItem type
import type { AppSidebarProps, NavItem } from "./types";
import { DynamicMenu } from "../nav-main/components/dynamic-menu";
import { useWorkspace } from "@/src/shared/sidebar/workspace-switcher/context/workspace-context";
import { DashboardSwitcher } from "../dashboard-switcher";
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronRight, Activity, Settings, Bell, Home, LayoutDashboard, Icon as LucideIconComponent } from "lucide-react"; // Import Icon type alias
import type { LucideIcon } from "lucide-react"; // Keep for type usage
import { getIconByName } from "@/components/icons"; // Assuming a utility to get icon component by name


// Define icons locally for static/default items
const staticIcons: Record<string, LucideIcon> = {
	Home: Home,
	LayoutDashboard: LayoutDashboard,
	Activity: Activity,
	Settings: Settings,
	Bell: Bell,
};

// Helper function to transform MenuUsage[] to NavItem[]
const processMenuUsages = (
	menuUsages: AppSidebarProps['menuUsages'],
	pathname: string,
	currentDashboardId: string,
	activeWorkspaceId: string | null
): { dashboardNavItems: NavItem[], workspaceNavItems: NavItem[] } => {

	const dashboardNavItems: NavItem[] = [];
	const workspaceNavItems: NavItem[] = [];

	if (!Array.isArray(menuUsages)) {
		console.warn("[processMenuUsages] menuUsages is not an array:", menuUsages);
		return { dashboardNavItems, workspaceNavItems };
	}

	menuUsages.forEach(usage => {
		// Skip if menuItem is not populated or essential data is missing
		if (!usage.menuItem || !usage.menuItem.title || !usage.menuItem.target) {
            console.warn("[processMenuUsages] Skipping invalid menu usage:", usage);
			return;
		}

		const { title, target, icon: iconName, type } = usage.menuItem;
		const IconComponent = iconName ? getIconByName(iconName) : undefined; // Get icon component dynamically
		const isWorkspaceItem = usage.workspaceId !== null;
		const baseHref = `/dashboard/${currentDashboardId}`;
		const workspaceHrefPart = isWorkspaceItem ? `/${usage.workspaceId}` : '';
		// Construct URL based on target and type (adjust logic as needed)
        // Simple example: treat target as slug
		const url = `${baseHref}${workspaceHrefPart}/${target}`;
        // More complex example if type dictates URL structure:
        // const url = type === 'page' ? `${baseHref}${workspaceHrefPart}/${target}` : `${baseHref}${workspaceHrefPart}?slice=${target}`;

		const navItem: NavItem = {
			title: title,
			url: url,
			icon: IconComponent || staticIcons.LayoutDashboard, // Fallback icon
			isActive: pathname.startsWith(url), // Simple active check, refine if needed
			workspaceId: usage.workspaceId, // Keep track of context
			items: [], // Assuming no sub-items from seed for now
		};

		if (isWorkspaceItem) {
            // Only add if it belongs to the currently active workspace
            if (usage.workspaceId === activeWorkspaceId) {
			    workspaceNavItems.push(navItem);
            }
		} else {
			dashboardNavItems.push(navItem);
		}
	});

    // Sort items by orderIndex if available
    dashboardNavItems.sort((a, b) => (menuUsages.find(u => u.menuItem?.title === a.title && u.workspaceId === null)?.orderIndex ?? 0) - (menuUsages.find(u => u.menuItem?.title === b.title && u.workspaceId === null)?.orderIndex ?? 0));
    workspaceNavItems.sort((a, b) => (menuUsages.find(u => u.menuItem?.title === a.title && u.workspaceId === activeWorkspaceId)?.orderIndex ?? 0) - (menuUsages.find(u => u.menuItem?.title === b.title && u.workspaceId === activeWorkspaceId)?.orderIndex ?? 0));


	return { dashboardNavItems, workspaceNavItems };
};


export function AppSidebar({
	userDashboards, // New prop
	currentDashboard, // New prop
	workspaces, // Prop remains, but now passed directly from layout
	menuUsages, // New prop replacing menuItems
	user, // Prop remains, ensure type consistency
	...props
}: AppSidebarProps) {
	const pathname = usePathname();
	const { activeWorkspaceId } = useWorkspace(); // Context provides active workspace ID

	// --- Input Data Logging ---
	// console.log("[AppSidebar] Received currentDashboard:", currentDashboard);
    // console.log("[AppSidebar] Received userDashboards count:", userDashboards?.length ?? 0);
	// console.log("[AppSidebar] Received workspaces count:", workspaces?.length ?? 0);
	// console.log("[AppSidebar] Received menuUsages count:", menuUsages?.length ?? 0);
    // console.log("[AppSidebar] Received user:", user);
    // console.log("[AppSidebar] Active workspace ID from context:", activeWorkspaceId);


	// --- Prepare User Data ---
	// Use hook if it performs necessary formatting/validation
	const userData = useUserData(user); // Hook should return { name, email, avatar }

	// --- Process Menu Usages ---
	const { dashboardNavItems: dynamicDashboardItems, workspaceNavItems: dynamicWorkspaceItems } = processMenuUsages(
		menuUsages,
		pathname,
		currentDashboard.id,
        activeWorkspaceId
	);

    // --- Combine Static/Default Items with Dynamic Items ---

	// Default/Static Dashboard Items (always shown for the current dashboard)
	const defaultDashboardItems: NavItem[] = [
		{
			title: "Dashboard Home", // Renamed for clarity
			url: `/dashboard/${currentDashboard.id}`,
			icon: staticIcons.Home,
			isActive: pathname === `/dashboard/${currentDashboard.id}`,
            workspaceId: null,
			items: [],
		},
		{
			title: "Overview", // Assuming an overview page exists
			url: `/dashboard/${currentDashboard.id}/overview`,
			icon: staticIcons.LayoutDashboard,
			isActive: pathname === `/dashboard/${currentDashboard.id}/overview`,
            workspaceId: null,
			items: [],
		},
        // Add other static dashboard items if needed
	];

    const combinedDashboardItems = [...defaultDashboardItems, ...dynamicDashboardItems];

	// System menu items (always shown)
	const systemMenuItems: NavItem[] = [
		// Keep previous system items or redefine as needed
		{
			title: "Notifications",
			url: `/dashboard/${currentDashboard.id}/notifications`,
			icon: staticIcons.Bell,
			isActive: pathname.includes(`/dashboard/${currentDashboard.id}/notifications`),
            workspaceId: null,
			items: [],
		},
        {
			title: "Settings",
			url: `/dashboard/${currentDashboard.id}/settings`,
			icon: staticIcons.Settings,
			isActive: pathname.includes(`/dashboard/${currentDashboard.id}/settings`),
            workspaceId: null,
			items: [],
		},
	];

	// --- Prepare Workspace Items ---
	const activeWorkspace = activeWorkspaceId
		? workspaces.find((w) => w.id === activeWorkspaceId)
		: null;

    // Default/Static Workspace Items (shown when a workspace is active)
    const defaultWorkspaceItems: NavItem[] = activeWorkspaceId ? [
        {
			title: "Workspace Home", // Renamed for clarity
			url: `/dashboard/${currentDashboard.id}/${activeWorkspaceId}`,
			icon: staticIcons.Home,
			isActive: pathname === `/dashboard/${currentDashboard.id}/${activeWorkspaceId}`,
            workspaceId: activeWorkspaceId,
			items: [],
		},
         {
			title: "Overview", // Assuming an overview page exists
			url: `/dashboard/${currentDashboard.id}/${activeWorkspaceId}/overview`,
			icon: staticIcons.LayoutDashboard,
			isActive: pathname === `/dashboard/${currentDashboard.id}/${activeWorkspaceId}/overview`,
            workspaceId: activeWorkspaceId,
			items: [],
		},
        // Add other static workspace items if needed
    ] : [];

    // Combine default and dynamic workspace items
    const combinedWorkspaceItems = [...defaultWorkspaceItems, ...dynamicWorkspaceItems];


	// --- Logging Derived State ---
	// console.log(`[AppSidebar] Combined Dashboard Items:`, combinedDashboardItems.map(i => i.title));
    // console.log(`[AppSidebar] Combined Workspace Items:`, combinedWorkspaceItems.map(i => i.title));


	// --- Render Logic ---
	return (
		<Sidebar collapsible="icon" className="overflow-x-hidden" {...props}>
			<SidebarHeader>
				{/* Pass ALL user dashboards and the CURRENT one */}
				<DashboardSwitcher
                    userDashboards={userDashboards}
                    currentDashboard={currentDashboard}
                />
				{/* Pass workspaces for the CURRENT dashboard */}
				{workspaces.length > 0 && (
					<>
						<SidebarSeparator className="mx-2 my-2" />
						<WorkspaceSwitcher
							dashboardId={currentDashboard.id}
							workspaces={workspaces}
							// activeWorkspaceId prop might be redundant if context is reliable
						/>
					</>
				)}
			</SidebarHeader>
			<SidebarContent className="flex flex-col justify-between h-full overflow-x-hidden">
				<div className="flex flex-col space-y-4">
					{/* Dashboard Menu */}
					<div>
						<Collapsible defaultOpen className="group">
							<CollapsibleTrigger className="w-full">
								<SidebarGroupLabel className="flex items-center justify-between cursor-pointer">
									<span className="text-blue-500">{`${currentDashboard.name ?? 'Dashboard'}`}</span>
									<ChevronRight
										className="h-4 w-4 text-blue-500 transition-transform duration-200 group-data-[state=open]:rotate-90"
									/>
								</SidebarGroupLabel>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<DynamicMenu
									items={combinedDashboardItems} // Use combined dashboard items
									showLabel={false}
									menuType="dashboard"
                                    emptyMessage="No specific dashboard items configured."
								/>
							</CollapsibleContent>
						</Collapsible>
					</div>

					{/* Workspace Menu */}
					{activeWorkspaceId && (
						<>
							<SidebarSeparator className="mx-2 my-2" />
							<div>
								<Collapsible defaultOpen className="group">
									<CollapsibleTrigger className="w-full">
										<SidebarGroupLabel className="text-orange-500 flex items-center justify-between cursor-pointer">
											<span>{activeWorkspace?.name ?? "Workspace"}</span>
											<div className="flex items-center">
												<ChevronRight
													className="h-4 w-4 text-orange-500 transition-transform duration-200 group-data-[state=open]:rotate-90"
												/>
											</div>
										</SidebarGroupLabel>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<DynamicMenu
											items={combinedWorkspaceItems} // Use combined workspace items
											showLabel={false}
											emptyMessage={dynamicWorkspaceItems.length === 0 ? "No specific workspace items configured." : undefined}
											menuType="workspace"
										/>
									</CollapsibleContent>
								</Collapsible>
							</div>
						</>
					)}
				</div>

				{/* System Menu */}
				<SidebarSeparator className="mx-2 my-2" />
				<div className="mt-auto pt-4">
					<Collapsible defaultOpen className="group">
						<CollapsibleTrigger className="w-full">
							<SidebarGroupLabel className="flex items-center justify-between cursor-pointer">
								<span className="text-purple-500">System</span>
								<ChevronRight
									className="h-4 w-4 text-purple-500 transition-transform duration-200 group-data-[state=open]:rotate-90"
								/>
							</SidebarGroupLabel>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<DynamicMenu
								items={systemMenuItems}
								showLabel={false}
								menuType="system"
							/>
						</CollapsibleContent>
					</Collapsible>
				</div>
			</SidebarContent>
			<SidebarFooter>
				{/* Pass formatted user data */}
				<NavUser
					name={userData.name}
					email={userData.email}
					avatar={userData.avatar}
					/>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
