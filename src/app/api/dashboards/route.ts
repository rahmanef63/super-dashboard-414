import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma";
import { getUserRoles } from "@/lib/data-services/user-service";
import { getToken } from "next-auth/jwt";

// GET /api/dashboards - Get all dashboards for the current user, or all if super admin
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log('[DEBUG] Token:', token);
    if (!token || !token.id) {
      console.log('[DEBUG] No valid token or user id in token.');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = token.id;
    console.log('[DEBUG] userId:', userId);

    // Check if user is super admin
    const roles = await getUserRoles(userId);
    console.log('[DEBUG] roles:', roles);
    const isSuperAdmin = roles.some(
      (r) => r.type === "system" && r.role && (r.role.name === "super_admin" || r.role.name === "Super Admin")
    );
    console.log('[DEBUG] isSuperAdmin:', isSuperAdmin);

    let dashboards;
    if (isSuperAdmin) {
      // Return all dashboards
      dashboards = await prisma.dashboard.findMany();
    } else {
      // Return only assigned dashboards
      const assignments = await prisma.dashboardAssignment.findMany({
        where: { userId },
        include: { dashboard: true },
      });
      dashboards = assignments.map((assignment) => assignment.dashboard);
    }

    return NextResponse.json({ dashboards });
  } catch (error) {
    console.error("Error fetching dashboards:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

// POST /api/dashboards - Create a new dashboard
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = token.id;

    const { name, description, organizationId } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Dashboard name is required" }, { status: 400 });
    }

    // Create the dashboard
    const dashboard = await prisma.dashboard.create({
      data: {
        name,
        description,
        organizationId,
        createdById: userId,
      },
    });

    // Assign the current user to the dashboard
    await prisma.dashboardAssignment.create({
      data: {
        dashboardId: dashboard.id,
        userId: userId,
      },
    });

    return NextResponse.json(dashboard, { status: 201 });
  } catch (error) {
    console.error("Error creating dashboard:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
