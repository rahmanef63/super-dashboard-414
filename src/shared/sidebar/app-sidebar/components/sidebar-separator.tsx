"use client"

import { cn } from "@/lib/utils"

interface SidebarSeparatorProps {
  className?: string
  orientation?: "horizontal" | "vertical"
}

export function SidebarSeparator({ className, orientation = "horizontal" }: SidebarSeparatorProps) {
  return (
    <div
      className={cn(
        "bg-border/50",
        orientation === "horizontal" ? "h-px w-full my-2 mx-2" : "w-px h-full mx-2",
        className,
      )}
    />
  )
}
