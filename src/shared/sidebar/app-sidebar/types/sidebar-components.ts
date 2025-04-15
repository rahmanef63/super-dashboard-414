import type React from "react"
import type { LucideIcon } from "lucide-react"

export type SectionIconType =
  | "dashboard"
  | "workspace"
  | "system"
  | "user"
  | "settings"
  | "notification"
  | string
  | LucideIcon

export interface SidebarSectionProps {
  children: React.ReactNode
  title?: string
  icon?: SectionIconType
  className?: string
  showSeparator?: boolean
  id?: string
}

export interface CollapsibleSectionProps {
  children: React.ReactNode
  title: string
  icon?: SectionIconType
  defaultOpen?: boolean
  className?: string
  id?: string
}

export interface SidebarGroupLabelProps {
  children: React.ReactNode
  icon?: SectionIconType
  className?: string
}
