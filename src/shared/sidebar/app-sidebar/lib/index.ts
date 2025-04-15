import type { LucideIcon } from "lucide-react"
import { File } from "lucide-react"
import { MENU_ICON_MAP } from "@/src/shared/sidebar/nav-main/constants"
import { renderIcon } from "@/shared/icon-picker/utils"

// Helper to get icon for menu item
export const getIconForMenuItem = (title: string): LucideIcon => {
  try {
    // Try to find an exact match first
    if (MENU_ICON_MAP[title]) {
      return MENU_ICON_MAP[title]
    }

    // Try to find a case-insensitive match
    const lowerTitle = title.toLowerCase()
    for (const key in MENU_ICON_MAP) {
      if (key.toLowerCase() === lowerTitle) {
        return MENU_ICON_MAP[key]
      }
    }

    // Return default icon if no match found
    return MENU_ICON_MAP.default || File
  } catch (error) {
    // If there's an issue, handle it gracefully
    console.error("Error getting icon:", error)
    // Return a default icon
    return File
  }
}

// Helper to render an icon safely using the shared renderIcon function
export const renderMenuIcon = (iconName: string | LucideIcon | undefined, props?: any) => {
  return renderIcon(iconName, props)
}
