"use client"

import { useParams } from 'next/navigation'; // Import useParams
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useMenuContext } from "../hooks/use-menu-context"
import { getMenuItemDetails } from "../lib/menu-builder"
import { getDashboardById, getWorkspaceById } from "@/lib/data-service"

export function MenuBreadcrumb() {
  const params = useParams(); // Get route parameters
  const { dashboardId, workspaceId, menuId } = useMenuContext(); // Get IDs from context

  // Extract the dashboard slug from params, ensure it's a string
  const dashboardSlug = typeof params.dashboard === 'string' ? params.dashboard : null;

  // Get entity details using IDs from context (assuming context holds the canonical IDs)
  const dashboard = dashboardId ? getDashboardById(dashboardId) : null;
  const workspace = workspaceId ? getWorkspaceById(workspaceId) : null;
  const menuItem = menuId ? getMenuItemDetails(menuId) : null;

  // If no dashboard details found OR slug is missing, we might not be able to build the breadcrumb correctly
  if (!dashboard || !dashboardSlug) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {/* Use dashboardSlug for the URL */}
          <BreadcrumbLink href={`/dashboard/${dashboardSlug}`}>{dashboard.name}</BreadcrumbLink>
        </BreadcrumbItem>

        {workspace && workspaceId && ( // Ensure workspace and its ID exist
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
               {/* Use dashboardSlug and workspaceId for the URL */}
              <BreadcrumbLink href={`/dashboard/${dashboardSlug}/${workspaceId}`}>{workspace.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}

        {menuItem && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{menuItem.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
