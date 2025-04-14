import { LayoutDashboard, Folder, Settings, User, Bell, FileText, type LucideIcon } from "lucide-react"
import type { SectionIconType } from "../types/sidebar-components"

// Map of icon names to Lucide components
const SECTION_ICON_MAP: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  workspace: Folder,
  system: Settings,
  user: User,
  notification: Bell,
  settings: Settings,
  default: FileText,
}

/**
 * Get the icon component for a section
 */
export function getIconForSection(icon: SectionIconType): LucideIcon {
  if (typeof icon === "function") {
    return icon
  }

  return SECTION_ICON_MAP[icon] || SECTION_ICON_MAP.default
}

/**
 * Generate a unique ID for a sidebar section
 */
export function generateSectionId(prefix: string, suffix?: string): string {
  const uniquePart = Math.random().toString(36).substring(2, 9)
  return `${prefix}-${suffix || uniquePart}`
}
