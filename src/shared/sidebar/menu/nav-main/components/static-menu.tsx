"use client"
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar"
import { SubMenu } from "./sub-menu"
import type { NavItem } from "../../../app-sidebar/types"

interface StaticMenuProps {
  items: NavItem[]
  title?: string
  showLabel?: boolean
  emptyMessage?: string
}

export function StaticMenu({
  items,
  title,
  showLabel = true,
  emptyMessage = "No menu items available",
}: StaticMenuProps) {
  if (items.length === 0) return null

  return (
    <SidebarGroup>
      {showLabel && title && (
        <SidebarGroupLabel className="opacity-100 transition-opacity duration-200 data-[collapsed=true]:opacity-0 data-[collapsed=true]:group-hover:opacity-100">
          {title}
        </SidebarGroupLabel>
      )}
      <SubMenu items={items} />
    </SidebarGroup>
  )
}
