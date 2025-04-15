// Import from shared icon picker instead of directly from lucide-react
import type { LucideIcon } from "lucide-react"
import {
  File,
  Home,
  Settings,
  Users,
  Calendar,
  FileText,
  BarChart,
  MessageSquare,
  Mail,
  Activity,
  Bell,
  Clock,
} from "lucide-react"

// Menu context types
export const MENU_CONTEXT = {
  DASHBOARD: "dashboard",
  WORKSPACE: "workspace",
}

// Direct icon map definition without relying on imports
export const MENU_ICON_MAP: Record<string, LucideIcon> = {
  default: File,
  Home: Home,
  Settings: Settings,
  Users: Users,
  Calendar: Calendar,
  FileText: FileText,
  BarChart: BarChart,
  MessageSquare: MessageSquare,
  Mail: Mail,
  Activity: Activity,
  Bell: Bell,
  Clock: Clock,
}

// Menu types to icon mappings with direct references
export const MENU_TYPE_ICONS = {
  home: Home,
  calendar: Calendar,
  settings: Settings,
  users: Users,
  documents: FileText,
  analytics: BarChart,
  messages: MessageSquare,
  mail: Mail,
}

// Map of menu IDs to slice names
export const MENU_TO_SLICE_MAP: Record<string, string> = {
  overview: "overview",
  calendar: "calendar",
  tasks: "tasks",
  analytics: "analytics",
  documents: "documents",
  // For all other menu items, use the generic menu slice
  default: "menu",
}

// Data source types for menu slices
export enum DataSource {
  ALL_WORKSPACES = "all_workspaces",
  SPECIFIC_WORKSPACE = "specific_workspace",
  DASHBOARD_ONLY = "dashboard_only",
}
