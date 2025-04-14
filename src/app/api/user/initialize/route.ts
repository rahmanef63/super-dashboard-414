import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import * as userService from "@/lib/data-services/user-service"
import * as organizationService from "@/lib/data-services/organization-service"
import * as dashboardService from "@/lib/data-services/dashboard-service"
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

    // Create a default dashboard
    const dashboard = await dashboardService.createDashboard({
      name: "My Dashboard",
      description: "Default dashboard",
      organizationId: organization.id,
      createdById: userId,
    })

    if (!dashboard) {
      return NextResponse.json({ error: "Failed to create dashboard" }, { status: 500 })
    }

    // Assign user to dashboard
    await dashboardService.assignUserToDashboard({
      userId,
      dashboardId: dashboard.id,
    })

    // Create default workspaces
    const workspace1 = await dashboardService.createWorkspace({
      name: "General",
      description: "General workspace",
      dashboardId: dashboard.id,
    })

    const workspace2 = await dashboardService.createWorkspace({
      name: "Projects",
      description: "Projects workspace",
      dashboardId: dashboard.id,
    })

    // Create default menu items
    const overviewMenuItem = await menuService.createMenuItem({
      title: "Overview",
      type: "MENU_ITEM",
      icon: "layout-dashboard",
      target: `/dashboard/${dashboard.id}/overview`,
    })

    const settingsMenuItem = await menuService.createMenuItem({
      title: "Settings",
      type: "MENU_ITEM",
      icon: "settings",
      target: `/dashboard/${dashboard.id}/settings`,
    })

    // Associate menu items with dashboard
    if (overviewMenuItem) {
      await menuService.associateMenuWithDashboard({
        menuId: overviewMenuItem.id,
        dashboardId: dashboard.id,
        orderIndex: 0,
      })
    }

    if (settingsMenuItem) {
      await menuService.associateMenuWithDashboard({
        menuId: settingsMenuItem.id,
        dashboardId: dashboard.id,
        orderIndex: 1,
      })
    }

    // Log activity
    await userService.logUserActivity({
      userId,
      action: "USER_INITIALIZED",
      metadata: {
        organizationId: organization.id,
        dashboardId: dashboard.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: "User data initialized successfully",
      data: {
        organization,
        dashboard,
        workspaces: [workspace1, workspace2].filter(Boolean),
      },
    })
  } catch (error) {
    console.error("Error initializing user data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
