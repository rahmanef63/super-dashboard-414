"use client"
import type { FeatureManifest } from "@/shared/pages/types/manifest";
import { Eye } from "lucide-react";

export const manifest: FeatureManifest = {
  title: "Overview (Dynamic)",
  url: "/dynamic/overview",
  icon: Eye,
  description: "Dynamic overview feature",
  featureType: "dynamic",
};


import { useOverviewData } from "./hooks/use-overview-data"
import { OverviewStats } from "./components/overview-stats"
import { OverviewChart } from "./components/overview-chart"
import { OverviewRecentActivity } from "./components/overview-recent-activity"
import { OverviewTasks } from "./components/overview-tasks"
import type { OverviewContext } from "./types"
import { Skeleton } from "@/components/ui/skeleton"

export interface OverviewSliceProps {
  context: OverviewContext
}

export function OverviewSlice({ context }: OverviewSliceProps) {
  const { data, isLoading, error } = useOverviewData(context)

  if (error) {
    return (
      <div className="p-4 rounded-md bg-destructive/10 text-destructive">
        <h3 className="font-semibold mb-2">Error loading overview data</h3>
        <p>{error.message}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full" />
          ))}
        </div>
        <Skeleton className="h-[350px] w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <OverviewStats stats={data.stats} context={context} />
      <OverviewChart data={data.chartData} context={context} />
      <div className="grid gap-4 md:grid-cols-2">
        <OverviewRecentActivity activities={data.activities} context={context} />
        <OverviewTasks tasks={data.tasks} context={context} />
      </div>
    </div>
  )
}

// Export the slice for dynamic loading
export default OverviewSlice
