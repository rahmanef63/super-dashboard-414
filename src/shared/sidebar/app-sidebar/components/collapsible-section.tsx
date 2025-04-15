"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { getIconForSection } from "../lib/sidebar-utils"
import type { CollapsibleSectionProps } from "../types/sidebar-components"

export function CollapsibleSection({
  children,
  title,
  icon,
  defaultOpen = true,
  className,
  id,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const IconComponent = icon ? getIconForSection(icon) : null

  return (
    <div id={id} className={cn("sidebar-collapsible-section", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent/50 rounded-md"
      >
        <div className="flex items-center gap-2">
          {IconComponent && <IconComponent className="h-4 w-4" />}
          <span className="truncate">{title}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen ? "rotate-180" : "rotate-0")} />
      </button>
      <div className={cn("overflow-hidden transition-all duration-200", isOpen ? "max-h-96" : "max-h-0")}>
        {children}
      </div>
    </div>
  )
}
