import type React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth/_lib/auth";
import { redirect } from "next/navigation";
import { User as NextAuthUser } from "next-auth";
import { AppSidebar } from "@/shared/sidebar/app-sidebar";
import { WorkspaceProvider } from "@/shared/sidebar/menu/nav-main/workspace-switcher/context/workspace-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { type MenuItem } from "@/shared/sidebar/app-sidebar/types";
// Import necessary types from your data schema/prisma client if not already available globally
// Assuming types like Dashboard, Workspace, MenuItem, MenuUsage, User exist
// Ensure these types correctly include relations if needed (e.g., MenuUsage includes MenuItem)
import type { UIDashboard as Dashboard, Workspace, MenuUsage as PrismaMenuUsage, User as DataServiceUser, DashboardAssignmentWithDashboard } from "@/types"; // Use UIDashboard for UI
import { getAssignmentsForUser } from "@/lib/data-services/dashboard-assignment-service"; // Added for direct DB access

// Define a potentially populated MenuUsage type if your API returns nested data
type MenuUsage = PrismaMenuUsage & {
  menuItem?: MenuItem; // Assuming your fetch populates menuItem
};


// --- Hypothetical API Client Functions ---
// TODO: Implement these functions in '@/lib/api-client' or similar

async function fetchDashboardsForUser(userId: string): Promise<Dashboard[]> {
  // Real implementation: fetch dashboards assigned to the current user
  try {
    const response = await fetch("/api/dashboards", { method: "GET", credentials: "include" });
    if (!response.ok) {
      throw new Error("Failed to fetch dashboards");
    }
    const data = await response.json();
    // Ensure workspaces property exists on each dashboard (for UI compatibility)
    const dashboards = (data.dashboards || []).map((d: any) => ({ ...d, workspaces: d.workspaces ?? [] })) as Dashboard[];
    if (dashboards.length > 0) {
      console.log(`[fetchDashboardsForUser] Dashboards fetched from API:`, dashboards.map((d: Dashboard) => d.id || d.name));
    } else {
      console.log(`[fetchDashboardsForUser] No dashboards assigned to user or API returned empty.`);
    }
    return dashboards;
  } catch (err) {
    console.error("Error in fetchDashboardsForUser:", err);
    return [];
  }
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

	let fetchError: Error | null = null;
	try {
		// 1. Fetch all dashboards assigned to the user
		console.log(`[layout] Fetching dashboards for user: ${user.id}`);
		const assignments = await getAssignmentsForUser(user.id) as DashboardAssignmentWithDashboard[];
		userDashboards = assignments
			.filter(a => a.dashboard && typeof a.dashboard === 'object' && a.dashboard !== null)
			.map(a => ({
				...a.dashboard,
				workspaces: a.dashboard.workspaces ?? []
			}));

    if (userDashboards.length > 0) {
      console.log(`[layout] Dashboards successfully loaded from backend for user ${user.id}:`, userDashboards.map((d: Dashboard) => d.id || d.name));
    } else {
      console.warn(`[layout] No dashboards found for user ${user.id}. Displaying sidebar with error handling.`);
      return (
        <WorkspaceProvider>
          <SidebarProvider>
            <div className="flex h-screen w-full bg-background">
              <AppSidebar
                userDashboards={[]}
                currentDashboard={null}
                workspaces={[]}
                menuUsages={[]}
                user={{
                  id: user.id,
                  email: user.email ?? '',
                  name: user.name ?? 'User',
                  avatar: user.image ?? null,
                }}
              />
              <main className="flex flex-1 flex-col justify-center items-center gap-4 p-4 pt-0">
                <div className="flex flex-col items-center">
                  <h1 className="text-2xl font-bold">No Dashboards Found</h1>
                  <p className="mt-2">No dashboards have been assigned to your account. Please contact an administrator.</p>
                </div>
              </main>
            </div>
          </SidebarProvider>
        </WorkspaceProvider>
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
    if (!currentDashboard && userDashboards.length > 1) {
      currentDashboard = userDashboards[1];
      console.log(`[layout] Using the second available dashboard as default: ${currentDashboard.id}`);
    } else if (!currentDashboard && userDashboards.length > 0) {
      currentDashboard = userDashboards[0];
      console.log(`[layout] Using the first available dashboard as default: ${currentDashboard.id}`);
    }
    // Always ensure currentDashboard has workspaces
    if (currentDashboard) {
      currentDashboard = { ...currentDashboard, workspaces: currentDashboard.workspaces ?? [] };
    }

    // 3. Fetch Workspaces and Menu Usages for the determined Dashboard
    if (currentDashboard) {
      console.log(`[layout] Fetching workspaces and menu items for dashboard: ${currentDashboard.id}`);
      workspacesForCurrentDashboard = await fetchWorkspacesForDashboard(currentDashboard.id);
      menuUsagesForCurrentDashboard = await fetchMenuUsagesForDashboard(currentDashboard.id);
    } else {
      workspacesForCurrentDashboard = [];
      menuUsagesForCurrentDashboard = [];
    }
  } catch (error) {
    console.error("[layout] Error during data fetching:", error);
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Error loading dashboard data: {error instanceof Error ? error.message : 'Unknown error'}. Please try refreshing.</p>
      </div>
    );
  }

	console.log(`[layout] Data fetch complete: ${workspacesForCurrentDashboard.length} workspaces, ${menuUsagesForCurrentDashboard.length} menu usage records.`);
	console.log("[layout] Data fetch successful. Rendering WorkspaceProvider and children.");

	// Prepare user object for AppSidebar
	const sidebarUser: DataServiceUser = {
		id: user.id,
		email: user.email ?? '',
		name: user.name ?? 'User',
		avatar: user.image ?? null, // Map image (from SessionUser) to avatar
	};

	return (
		<WorkspaceProvider>
			<SidebarProvider>
				<div className="flex h-screen bg-background">
					{currentDashboard && (
						<AppSidebar
							userDashboards={userDashboards.map((dashboard: Dashboard) => ({ ...dashboard, workspaces: dashboard.workspaces ?? [] }))}
							currentDashboard={{ ...currentDashboard, workspaces: currentDashboard.workspaces ?? [] }}
							workspaces={workspacesForCurrentDashboard}
							menuUsages={menuUsagesForCurrentDashboard}
							user={sidebarUser}
						/>
					)}
					<main className="flex-1 overflow-auto p-4 md:p-6">
						{children}
					</main>
				</div>
			</SidebarProvider>
		</WorkspaceProvider>
	);
}
