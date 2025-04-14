"use client"

import type React from "react"
import { useMediaQuery } from "./use-media-query"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export interface ResponsiveMenuProps {
  children: React.ReactNode
  trigger: React.ReactNode
  title?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  align?: "start" | "center" | "end"
  side?: "top" | "right" | "bottom" | "left"
  className?: string
}

export function ResponsiveMenu({
  children,
  trigger,
  title,
  open,
  onOpenChange,
  align = "end",
  side = "bottom",
  className,
}: ResponsiveMenuProps) {
  const { isMobile } = useMediaQuery()

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent side="bottom" className={className}>
          {title && (
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
            </SheetHeader>
          )}
          <div className="mt-4">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side} className={className}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
