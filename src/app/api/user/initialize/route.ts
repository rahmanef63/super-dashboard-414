import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/auth/_lib/auth"
import * as userService from "@/lib/data-services/user-service"
import * as organizationService from "@/lib/data-services/organization-service"
// import * as dashboardService from "@/lib/data-services/dashboard-service" // Removed: module does not exist
import * as menuService from "@/lib/data-services/menu-service"

export async function POST(req: NextRequest) {
  try {
    // Get the current user from the session
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Check if user already has organizations
    const existingOrgs = await organizationService.getOrganizationsForUser(userId)

    if (existingOrgs.length > 0) {
      return NextResponse.json({
        success: true,
        message: "User already initialized",
        data: {
          organizations: existingOrgs,
        },
      })
    }

    // Create a default organization for the user
    const organization = await organizationService.createOrganization({
      name: "My Organization",
      type: "COMPANY",
      plan: "FREE",
      createdById: userId,
    })

    if (!organization) {
      return NextResponse.json({ error: "Failed to create organization" }, { status: 500 })
    }

    // Create organization membership
    await organizationService.createOrganizationMembership({
      userId,
      organizationId: organization.id,
      status: "ACTIVE",
    })

    // Create a default dashboard (DISABLED: dashboardService not implemented)
    // const dashboard = await dashboardService.createDashboard({
    //   name: "My Dashboard",
    //   description: "Default dashboard",
    //   organizationId: organization.id,
    //   createdById: userId,
    // })
    //
    // if (!dashboard) {
    //   return NextResponse.json({ error: "Failed to create dashboard" }, { status: 500 })
    // }

    // Dashboard creation and workspace/menu association DISABLED: dashboardService not implemented
    // All dashboard-related features are currently disabled. Please implement dashboardService to enable this feature.
    const workspace1 = null;
    const workspace2 = null;
    const overviewMenuItem = null;
    const settingsMenuItem = null;

    // Log activity
    await userService.logUserActivity(
      userId,
      "USER_INITIALIZED",
      {
        organizationId: organization.id,
        // dashboardId: dashboard.id, // dashboard is not created
      }
    );

    return NextResponse.json({
      success: true,
      message: "User data initialized successfully (dashboard features disabled)",
      data: {
        organization,
        // dashboard, // dashboard is not created
        workspaces: [workspace1, workspace2].filter(Boolean),
      },
    })
  } catch (error) {
    console.error("Error initializing user data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
