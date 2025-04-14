"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TIME_PERIOD_OPTIONS } from "../constants"
import type { TimePeriod } from "../types"

interface AnalyticsHeaderProps {
  context: {
    dashboardId: string
    workspaceId?: string
    menuId?: string
  }
  timePeriod: TimePeriod
  onTimePeriodChange: (period: TimePeriod) => void
}

export function AnalyticsHeader({ context, timePeriod, onTimePeriodChange }: AnalyticsHeaderProps) {
  const { dashboardId, workspaceId } = context

  const title = workspaceId ? `${workspaceId} Analytics` : `${dashboardId} Analytics`

  const handleTimePeriodChange = (value: string) => {
    onTimePeriodChange(value as TimePeriod)
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">
          Analytics and insights for your {workspaceId ? "workspace" : "dashboard"}
        </p>
      </div>

      <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          {TIME_PERIOD_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
