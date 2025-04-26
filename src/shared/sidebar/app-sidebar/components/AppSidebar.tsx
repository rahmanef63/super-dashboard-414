"use client";
import { usePathname } from "next/navigation";
import { getAvailableFeatureManifests } from "@/shared/pages/feature-access";
import { WorkspaceSwitcher } from "../../menu/nav-main/workspace-switcher";
import { useUserData } from "../../hooks/useUserData";
import type { AppSidebarProps } from "@/shared/sidebar/app-sidebar/types";
import { useWorkspace } from "@/shared/sidebar/menu/nav-main/workspace-switcher/context/workspace-context";
import { DashboardSwitcher } from "../../menu/dashboard-switcher";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, SidebarSeparator } from "@/components/ui/sidebar";
import { processMenuUsages } from "../lib/sidebar-utils";
import { NavUser } from "../../menu/nav-user";
import { NavMain } from "../../menu/nav-main";

export function AppSidebar({
	userDashboards,
	currentDashboard,
	workspaces,
	menuUsages,
	user,
	...props
}: AppSidebarProps) {
	console.log("[AppSidebar DEBUG] AppSidebar rendered");
	const pathname = usePathname();
	const { activeWorkspaceId } = useWorkspace();

	const userData = useUserData(user);
	// Dummy accessCheck and userPermissions for now
// TODO: Replace with real user permissions if/when available
const userPermissions: any[] = [];
const accessCheck = (manifest: any, perms: any) => true;
const allFeatures = getAvailableFeatureManifests(userPermissions, accessCheck);
const dashboardFeatures = allFeatures.filter(f => f.featureType === "static");
const workspaceFeatures = allFeatures.filter(f => f.featureType === "dynamic");

	const { dashboardNavItems: dynamicDashboardItems, workspaceNavItems: dynamicWorkspaceItems } = processMenuUsages(
		menuUsages,
		pathname,
		currentDashboard?.id ?? "",
		activeWorkspaceId ?? null
	);

	if (!currentDashboard) {
		const { DashboardPlaceholder } = require("./dashboard-placeholder");
		return (
			<Sidebar collapsible="icon" className="overflow-x-hidden" {...props}>
				<SidebarHeader>
					<DashboardSwitcher dashboard={undefined} />
				</SidebarHeader>
				<SidebarContent className="flex flex-col h-full overflow-x-hidden">
					<NavMain dashboardId={""} workspaceId={undefined} />
					<DashboardPlaceholder />
				</SidebarContent>
				<SidebarFooter>
					<NavUser />
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>
		);
	}

	const activeWorkspace = activeWorkspaceId
		? workspaces.find((w) => w.id === activeWorkspaceId)
		: null;

	return (
		<Sidebar collapsible="icon" className="overflow-x-hidden" {...props}>
			<SidebarHeader>
				<DashboardSwitcher dashboard={currentDashboard} />
				{workspaces.length > 0 && activeWorkspace && (
					<>
						<SidebarSeparator className="mx-2 my-2" />
						<WorkspaceSwitcher
							dashboardId={currentDashboard.id}
							workspaces={workspaces}
							currentWorkspace={activeWorkspace}
							activeWorkspaceId={activeWorkspaceId ?? undefined}
						/>
					</>
				)}
			</SidebarHeader>
			<SidebarContent className="flex flex-col justify-between h-full overflow-x-hidden">
				<NavMain dashboardId={currentDashboard.id} workspaceId={activeWorkspaceId ?? undefined} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
