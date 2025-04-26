// Utility to build menu URLs that preserve dashboard/workspace context
export function buildMenuUrl({
  dashboardId,
  workspaceId,
  slice,
}: {
  dashboardId?: string;
  workspaceId?: string;
  slice: string;
}) {
  if (dashboardId && workspaceId) {
    return `/dashboard/${dashboardId}/${workspaceId}/${slice}`;
  }
  if (dashboardId) {
    return `/dashboard/${dashboardId}/${slice}`;
  }
  return `/dashboard/${slice}`;
}
