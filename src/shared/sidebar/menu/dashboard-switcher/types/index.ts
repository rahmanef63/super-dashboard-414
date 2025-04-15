import type React from "react"
import type { Dashboard } from "@/lib/data-service"

export interface DashboardSwitcherProps {
  teams?: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
  dashboard?: Dashboard
}
