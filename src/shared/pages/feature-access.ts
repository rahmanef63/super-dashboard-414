// Dynamically import all manifest files from static and dynamic subfolders
// NOTE: Use require.context for Webpack (Next.js <13) or adjust for your build tool.
// If using Vite or Next.js 13+ app directory, import.meta.glob is correct.
// Fallback to manual require if neither is available.

let staticManifestModules: Record<string, any> = {};
let dynamicManifestModules: Record<string, any> = {};

// NOTE: require.context is not available in this environment. Manually require each manifest module below. Add new ones as needed.
staticManifestModules = {
  './static/calendar/index.tsx': require('./static/calendar/index.tsx'),
  './static/dashboard-store/index.tsx': require('./static/dashboard-store/index.tsx'),
  './static/database-management/index.tsx': require('./static/database-management/index.tsx'),
  './static/home/index.tsx': require('./static/home/index.tsx'),
  './static/notifications/index.tsx': require('./static/notifications/index.tsx'),
  './static/overview/index.tsx': require('./static/overview/index.tsx'),
  './static/settings/index.tsx': require('./static/settings/index.tsx'),
};
dynamicManifestModules = {
  './dynamic/analytics/index.tsx': require('./dynamic/analytics/index.tsx'),
  './dynamic/calendar/index.tsx': require('./dynamic/calendar/index.tsx'),
  './dynamic/documents/index.tsx': require('./dynamic/documents/index.tsx'),
  './dynamic/menu/index.tsx': require('./dynamic/menu/index.tsx'),
  './dynamic/overview/index.tsx': require('./dynamic/overview/index.tsx'),
  './dynamic/tasks/index.tsx': require('./dynamic/tasks/index.tsx'),
};

function getManifestsFromModules(modules: Record<string, any>) {
  return Object.values(modules)
    .map((mod: any) => mod.manifest)
    .filter(Boolean);
}
import type { FeatureManifest } from "@/shared/pages/types/manifest";

/**
 * Returns all static features and dynamic features the user has access to.
 * @param userPermissions - an array or object representing user permissions
 * @param accessCheck - a function that determines if a user has access to a dynamic feature
 */
export function getAvailableFeatureManifests(
  userPermissions: any,
  accessCheck: (manifest: FeatureManifest, userPermissions: any) => boolean
): FeatureManifest[] {
  const staticFeatureManifests = getManifestsFromModules(staticManifestModules);
  const dynamicFeatureManifests = getManifestsFromModules(dynamicManifestModules);
  const accessibleDynamic = dynamicFeatureManifests.filter((manifest: any) => accessCheck(manifest, userPermissions));
  return [
    ...staticFeatureManifests,
    ...accessibleDynamic,
  ];
}

