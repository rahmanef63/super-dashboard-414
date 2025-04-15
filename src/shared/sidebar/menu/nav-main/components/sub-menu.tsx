"use client"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import type { NavItem } from "../../../app-sidebar/types"
import { renderIcon } from "@/shared/icon-picker/utils"

interface SubMenuProps {
  items: NavItem[]
  className?: string
  menuType?: "dashboard" | "workspace" | "system"
}

// Update the SubMenu component to better handle workspace items and collapsible state:
export function SubMenu({ items, className, menuType = "dashboard" }: SubMenuProps) {
  // Track open state for each menu item
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  // Toggle open state for a specific item
  const toggleItem = (title: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  // Get text color based on menu type
  const getTextColorClass = () => {
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

  // Initialize open state for active items on mount
  useEffect(() => {
    const initialOpenState: Record<string, boolean> = {}

    items.forEach((item) => {
      // Open items that are active or have active children
      const hasActiveChild = item.items?.some((subItem) => subItem.isActive) || false
      if (item.isActive || hasActiveChild) {
        initialOpenState[item.title] = true
      }
    })

    setOpenItems((prev) => ({ ...prev, ...initialOpenState }))
  }, [items])

  if (items.length === 0) return null

  return (
    <SidebarMenu className={className} data-menu-type={menuType}>
      {items.map((item) => {
        // Determine if this item should be open
        // Default to open if it's active or any of its children are active
        const hasActiveChild = item.items?.some((subItem) => subItem.isActive) || false
        const isOpen = openItems[item.title] ?? (item.isActive || hasActiveChild)
        const hasSubItems = item.items && item.items.length > 0

        // Apply color class based on menu type or if it's a workspace item
        const colorClass = item.workspaceId ? "text-orange-500" : getTextColorClass()

        return (
          <Collapsible
            key={item.title}
            open={isOpen}
            onOpenChange={() => toggleItem(item.title)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {hasSubItems ? (
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={item.isActive}
                    className={cn(
                      item.workspaceId ? "border-l-2 border-orange-500" : "",
                      "group-data-[collapsed=true]:justify-center", // Add this line to center icons when collapsed
                    )}
                  >
                    {item.icon && renderIcon(item.icon, { className: cn("flex-shrink-0", colorClass) })}
                    <span
                      className={cn(
                        "flex-1 truncate opacity-100 transition-opacity duration-200 data-[collapsed=true]:opacity-0 data-[collapsed=true]:group-hover:opacity-100",
                        colorClass,
                      )}
                    >
                      {item.title}
                    </span>
                    <ChevronDown
                      className={cn(
                        "ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180",
                        "group-data-[collapsed=true]:hidden", // Hide chevron when sidebar is collapsed
                        colorClass,
                      )}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              ) : (
                <Link href={item.url} passHref>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={item.isActive}
                    className={item.workspaceId ? "border-l-2 border-orange-500" : ""}
                  >
                    {item.icon && renderIcon(item.icon, { className: cn("flex-shrink-0", colorClass) })}
                    <span
                      className={cn(
                        "flex-1 truncate opacity-100 transition-opacity duration-200 data-[collapsed=true]:opacity-0 data-[collapsed=true]:group-hover:opacity-100",
                        colorClass,
                      )}
                    >
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                </Link>
              )}
              {hasSubItems && (
                <CollapsibleContent>
                  <SidebarMenuSub className="data-[collapsed=true]:hidden data-[collapsed=true]:group-hover:block">
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={subItem.isActive}
                          className={subItem.workspaceId ? "text-orange-500" : ""}
                        >
                          <Link href={subItem.url}>
                            <span
                              className={cn(
                                "truncate opacity-100 transition-opacity duration-200 data-[collapsed=true]:opacity-0 data-[collapsed=true]:group-hover:opacity-100",
                                colorClass,
                              )}
                            >
                              {subItem.title}
                            </span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        )
      })}
    </SidebarMenu>
  )
}
