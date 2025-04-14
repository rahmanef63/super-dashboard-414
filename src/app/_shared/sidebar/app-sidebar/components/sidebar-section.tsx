"use client"

import { cn } from "@/lib/utils"
import { getIconForSection } from "../lib/sidebar-utils"
import type { SidebarSectionProps } from "../types/sidebar-components"

export function SidebarSection({ children, title, icon, className, showSeparator = true, id }: SidebarSectionProps) {
  const IconComponent = icon ? getIconForSection(icon) : null

  return (
    <div id={id} className={cn("sidebar-section", className)}>
      {title && (
        <h3 className="px-4 text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider flex items-center gap-2">
          {IconComponent && <IconComponent className="h-4 w-4" />}
          <span className="truncate">{title}</span>
        </h3>
      )}
      <div className="sidebar-section-content">{children}</div>
      {showSeparator && <div className="h-px bg-border/50 my-2 mx-2" />}
    </div>
  )
}
