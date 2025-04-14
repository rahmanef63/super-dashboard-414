"use client"

import { cn } from "@/lib/utils"
import { getIconForSection } from "../lib/sidebar-utils"
import type { SidebarGroupLabelProps } from "../types/sidebar-components"

export function SidebarGroupLabel({ children, icon, className }: SidebarGroupLabelProps) {
  const IconComponent = icon ? getIconForSection(icon) : null

  return (
    <h3
      className={cn(
        "px-4 text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider flex items-center gap-2",
        "opacity-100 transition-opacity duration-200 data-[collapsed=true]:opacity-0 data-[collapsed=true]:group-hover:opacity-100",
        className,
      )}
    >
      {IconComponent && <IconComponent className="h-4 w-4" />}
      <span className="truncate">{children}</span>
    </h3>
  )
}
