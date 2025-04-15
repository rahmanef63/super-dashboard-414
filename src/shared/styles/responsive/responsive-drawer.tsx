"use client"

import type React from "react"
import { useMediaQuery } from "./use-media-query"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface ResponsiveDrawerProps {
  children: React.ReactNode
  trigger: React.ReactNode
  title: string
  description?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  side?: "left" | "right" | "top" | "bottom"
  className?: string
}

/**
 * ResponsiveDrawer component that renders as a Drawer on desktop and a Sheet on mobile
 */
export function ResponsiveDrawer({
  children,
  trigger,
  title,
  description,
  open,
  onOpenChange,
  side = "right",
  className,
}: ResponsiveDrawerProps) {
  const { isMobile } = useMediaQuery()

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent side={side === "top" || side === "bottom" ? "bottom" : side} className={className}>
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          <div className="mt-4">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className={className}>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className="p-4">{children}</div>
      </DrawerContent>
    </Drawer>
  )
}
