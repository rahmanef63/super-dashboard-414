import type { UIDashboard  } from "@/types";
import { prisma } from "../prisma";

/**
 * Get all dashboards assigned to a specific user (with user assignments)
 * @param userId The ID of the user
 * @returns Array of dashboards assigned to the user
 */
export const getDashboardsForUser = async (userId: string): Promise<UIDashboard[]> => {
  // Fetch dashboard assignments for the user and include the dashboard details
  const assignments = await prisma.dashboardAssignment.findMany({
    where: { userId },
    include: { dashboard: true },
    orderBy: { createdAt: "desc" },
  });
  // Extract dashboards from assignments and map to UIDashboard structure
  return await Promise.all(
    assignments.map(async a => {
      const d = a.dashboard;
      // Fetch workspaces for this dashboard
      const workspaces = await prisma.workspace.findMany({ where: { dashboardId: d.id } });
      return {
        id: d.id,
        name: d.name,
        description: d.description ?? null,
        organizationId: d.organizationId ?? null,
        createdById: d.createdById ?? null,
        createdAt: d.createdAt,
        workspaces,
      };
    })
  );
};
