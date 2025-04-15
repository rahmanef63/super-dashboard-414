"use client"

import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar"
import { SubMenu } from "./sub-menu"
import { cn } from "@/lib/utils"
import type { NavItem } from "../../app-sidebar/types"

interface DynamicMenuProps {
  items: NavItem[]
  title?: string
  showLabel?: boolean
  emptyMessage?: string
  menuType?: "dashboard" | "workspace" | "system"
}

export function DynamicMenu({
  items,
  title,
  showLabel = true,
  emptyMessage = "No menu items available",
  menuType = "dashboard",
}: DynamicMenuProps) {
  // If there are no items to display, still render the group but with a message
  const hasItems = items && items.length > 0

  // Get text color based on menu type
  const getTitleColorClass = () => {
    switch (menuType) {
      case "dashboard":
        return "text-blue-500"
      case "workspace":
        return "text-orange-500"
      case "system":
        return "text-purple-500"
      default:
        return ""
    }
  }

  // Log the menu type and items for debugging
  console.log(`[DynamicMenu] Rendering menu type: ${menuType} with ${items.length} items`)
  if (menuType === "workspace") {
    console.log(
      "[DynamicMenu] Workspace menu items:",
      items.map((item) => item.title),
    )
  }

  // If no items and no label needed, don't render anything
  if (!hasItems && !showLabel && !title) {
    return null
  }

  // Ensure the DynamicMenu component handles empty states properly

  // Update the return statement to handle empty states better
  return (
    <SidebarGroup data-menu-type={menuType}>
      {showLabel && title && (
        <SidebarGroupLabel className="flex items-center justify-between">
          <span className={cn("truncate", getTitleColorClass())}>{title}</span>
          {hasItems && <span className="ml-2 text-xs text-muted-foreground">({items.length})</span>}
        </SidebarGroupLabel>
      )}
      {hasItems ? (
        <SubMenu items={items} menuType={menuType} />
      ) : (
        <div className={cn("px-3 py-2 text-xs italic text-muted-foreground", getTitleColorClass())}>{emptyMessage}</div>
      )}
    </SidebarGroup>
  )
}
