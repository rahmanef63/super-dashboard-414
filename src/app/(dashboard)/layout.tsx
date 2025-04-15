import type React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/app/auth/_lib/auth";
import { redirect } from "next/navigation";
import { User as NextAuthUser } from "next-auth";
import { AppSidebar } from "@/src/shared/sidebar/app-sidebar";
import { WorkspaceProvider } from "@/src/shared/sidebar/menu/workspace-switcher/context/workspace-context";
import { SidebarProvider } from "@/components/ui/sidebar";

// Import necessary types from your data schema/prisma client if not already available globally
// Assuming types like Dashboard, Workspace, MenuItem, MenuUsage, User exist
// Ensure these types correctly include relations if needed (e.g., MenuUsage includes MenuItem)
import type { Dashboard, Workspace, MenuItem, MenuUsage as PrismaMenuUsage, User as DataServiceUser } from "@/types/types"; // Adjust path as needed

// Define a potentially populated MenuUsage type if your API returns nested data
type MenuUsage = PrismaMenuUsage & {
  menuItem?: MenuItem; // Assuming your fetch populates menuItem
};


// --- Hypothetical API Client Functions ---
// TODO: Implement these functions in '@/lib/api-client' or similar

async function fetchDashboardsForUser(userId: string): Promise<Dashboard[]> {
  console.warn(`fetchDashboardsForUser (User: ${userId}): Using placeholder data. Implement actual API call to /api/dashboards.`);
  // Example: Fetch dashboards assigned via DashboardAssignment
  // const response = await fetch('/api/dashboards'); // Needs user context
  // if (!response.ok) throw new Error('Failed to fetch dashboards');
  // const data = await response.json();
  // return data.dashboards || [];
  return []; // Replace with actual API call
}

async function fetchWorkspacesForDashboard(dashboardId: string): Promise<Workspace[]> {
   console.warn(`fetchWorkspacesForDashboard (Dashboard: ${dashboardId}): Using placeholder data. Implement actual API call to /api/dashboards/${dashboardId}/workspaces.`);
  // const response = await fetch(`/api/dashboards/${dashboardId}/workspaces`);
  // if (!response.ok) throw new Error(`Failed to fetch workspaces for dashboard ${dashboardId}`);
  // const data = await response.json();
  // return data.workspaces || [];
  return []; // Replace with actual API call
}

// Fetch MenuUsage records for a dashboard, potentially populating the related MenuItem
async function fetchMenuUsagesForDashboard(dashboardId: string): Promise<MenuUsage[]> {
   console.warn(`fetchMenuUsagesForDashboard (Dashboard: ${dashboardId}): Using placeholder data. Implement actual API call to /api/menu-usages?dashboardId=${dashboardId}&populate=menuItem.`);
  // const response = await fetch(`/api/menu-usages?dashboardId=${dashboardId}&populate=menuItem`);
  // if (!response.ok) throw new Error(`Failed to fetch menu items for dashboard ${dashboardId}`);
  // const data = await response.json();
  // return data.menuUsages || []; // Should return PopulatedMenuUsage[]
   return []; // Replace with actual API call
}

// --- End Hypothetical API Client Functions ---


// Interface matching NextAuth session user structure
interface SessionUser extends NextAuthUser {
	id: string;
	email: string | null | undefined;
    name: string | null | undefined;
    image?: string | null | undefined;
}

export default async function DashboardLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { dashboard?: string }; // param is the dashboard ID
}) {
	console.log("[layout.tsx] --- Dashboard Layout: Checking Session ---");
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		console.log("[layout] No session.user found, redirecting to login.");
		const callbackPath = params.dashboard ? `/dashboard/${params.dashboard}` : '/dashboard';
		redirect(`/auth/login?redirectTo=${encodeURIComponent(callbackPath)}`);
	}

	const user = session.user as SessionUser;
	if (!user?.id) {
		console.error("[layout] Session User found, but ID property is MISSING!", user);
		redirect('/auth/login?error=MissingUserID');
	}

	console.log(`[layout] Session User ID Found: ${user.id}`);

	let userDashboards: Dashboard[] = [];
	let currentDashboard: Dashboard | null = null;
	let workspacesForCurrentDashboard: Workspace[] = [];
	let menuUsagesForCurrentDashboard: MenuUsage[] = []; // Includes MenuItem details

	try {
		// 1. Fetch all dashboards assigned to the user
		console.log(`[layout] Fetching dashboards for user: ${user.id}`);
		userDashboards = await fetchDashboardsForUser(user.id);
		console.log(`[layout] Found ${userDashboards.length} dashboards for user.`);

		if (userDashboards.length === 0) {
			console.warn(`[layout] No dashboards found for user ${user.id}. Cannot proceed.`);
            // Render an error state or redirect to a creation page
            return (
                <div className="flex items-center justify-center h-screen">
                    <p>No dashboards have been assigned to your account. Please contact an administrator.</p>
                </div>
            );
		}

		// 2. Determine the current dashboard
		const dashboardIdFromParams = params.dashboard;
		if (dashboardIdFromParams) {
			console.log(`[layout] Attempting to find dashboard with ID from params: ${dashboardIdFromParams}`);
			currentDashboard = userDashboards.find(d => d.id === dashboardIdFromParams) || null;
			if (!currentDashboard) {
				console.warn(`[layout] Dashboard ID ${dashboardIdFromParams} from params not found or not assigned to user. Falling back to default.`);
			}
		}

		// Fallback to the first dashboard if no valid one from params or params empty
		if (!currentDashboard) {
			currentDashboard = userDashboards[0];
			console.log(`[layout] Using the first available dashboard as default: ${currentDashboard.id}`);
            // Optional: Redirect to ensure URL matches the loaded dashboard
            // if (dashboardIdFromParams && dashboardIdFromParams !== currentDashboard.id) {
            //    redirect(`/dashboard/${currentDashboard.id}`);
            // }
		}


		// 3. Fetch Workspaces and Menu Usages for the determined Dashboard
		console.log(`[layout] Fetching workspaces and menu items for dashboard: ${currentDashboard.id}`);
		workspacesForCurrentDashboard = await fetchWorkspacesForDashboard(currentDashboard.id);
        menuUsagesForCurrentDashboard = await fetchMenuUsagesForDashboard(currentDashboard.id);

		console.log(`[layout] Data fetch complete: ${workspacesForCurrentDashboard.length} workspaces, ${menuUsagesForCurrentDashboard.length} menu usage records.`);

	} catch (error) {
		console.error("[layout] Error during data fetching:", error);
		return (
			<div className="flex items-center justify-center h-screen">
				<p>Error loading dashboard data: {error instanceof Error ? error.message : 'Unknown error'}. Please try refreshing.</p>
			</div>
		);
	}

	// ADDED CONSOLE LOG HERE
	console.log(`[layout] User ${user.email} is now viewing the dashboard: ${currentDashboard.id}`);

    // Prepare user object for AppSidebar
    // Adjust based on the actual definition of DataServiceUser and needs of AppSidebar
     const sidebarUser: DataServiceUser = {
        // Map relevant fields from session user
        id: user.id,
        email: user.email ?? '',
        name: user.name ?? 'User',
        image: user.image,
        // Add any other required fields from DataServiceUser, providing defaults if necessary
        // e.g., status: 'active',
        //       roleId: fetchedRoleId, // You might need to fetch the user's role separately
    };


	return (
		<WorkspaceProvider /* Pass initial state if needed */ >
			<SidebarProvider>
				<div className="flex h-screen bg-background">
					<AppSidebar
						userDashboards={userDashboards}
						currentDashboard={currentDashboard} // Pass the determined active dashboard
						workspaces={workspacesForCurrentDashboard}
						menuUsages={menuUsagesForCurrentDashboard} // Pass menu usage data
						user={sidebarUser}
					/>
					<main className="flex-1 overflow-auto p-4 md:p-6">
						{children}
					</main>
				</div>
			</SidebarProvider>
		</WorkspaceProvider>
	);
}
