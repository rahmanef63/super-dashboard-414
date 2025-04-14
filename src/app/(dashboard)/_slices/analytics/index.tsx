"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { AnalyticsHeader } from "./components/analytics-header"
import { AnalyticsOverview } from "./components/analytics-overview"
import { AnalyticsChart } from "./components/analytics-chart"
import { AnalyticsTable } from "./components/analytics-table"
import { useAnalyticsData } from "./hooks/use-analytics-data"
import { DEFAULT_TIME_PERIOD } from "./constants"
import type { AnalyticsSliceProps, TimePeriod } from "./types"

interface SliceContext {
  dashboardId: string;     // Required
  workspaceId?: string;    // Optional
  menuId?: string;         // Optional
  userId?: string;         // Optional
  [key: string]: any;      // Additional properties
}

export default function AnalyticsSlice({ context }: AnalyticsSliceProps) {
  console.log(`[AnalyticsSlice] Rendering with context:`, context)

  // Validate required context properties
  const hasDashboardId = !!context.dashboardId // Determine if dashboardId exists
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(DEFAULT_TIME_PERIOD) // Initialize state unconditionally

  if (!hasDashboardId) {
    console.error("[AnalyticsSlice] Missing required context.dashboardId")
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics Error</CardTitle>
          <CardDescription>Missing required context properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-md bg-destructive/10 text-destructive">
            <h3 className="font-semibold mb-2">Configuration Error</h3>
            <p>The Analytics slice requires a dashboardId in the context.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { dashboardId, workspaceId, menuId } = context
  console.log(
    `[AnalyticsSlice] Using dashboardId: ${dashboardId}, workspaceId: ${workspaceId || "none"}, menuId: ${menuId || "none"}`,
  )

  const { data, isLoading, error } = useAnalyticsData(context, timePeriod)

  // Log when data is loaded
  useEffect(() => {
    if (!isLoading && !error) {
      console.log(
        `[AnalyticsSlice] Loaded analytics data for ${workspaceId ? `workspace ${workspaceId}` : `dashboard ${dashboardId}`}`,
      )
      console.log(`[AnalyticsSlice] Time period: ${timePeriod}, metrics count: ${data.metrics.length}`)
    }
  }, [isLoading, error, data, dashboardId, workspaceId, timePeriod])

  if (isLoading) {
    console.log(`[AnalyticsSlice] Loading analytics data...`)
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    console.error(`[AnalyticsSlice] Error loading analytics data:`, error)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics Error</CardTitle>
          <CardDescription>There was a problem loading the analytics data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-md bg-destructive/10 text-destructive">
            <h3 className="font-semibold mb-2">Error loading analytics data</h3>
            <p>{error.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  console.log(`[AnalyticsSlice] Rendering analytics with ${data.metrics.length} metrics`)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{workspaceId ? `${workspaceId} Analytics` : `${dashboardId} Analytics`}</CardTitle>
        <CardDescription>
          Analytics and insights for {workspaceId ? `workspace ${workspaceId}` : `dashboard ${dashboardId}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AnalyticsHeader context={context} timePeriod={timePeriod} onTimePeriodChange={setTimePeriod} />

        <Tabs defaultValue="overview" className="space-y-6 mt-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AnalyticsOverview metrics={data.metrics} />
            <AnalyticsChart chartData={data.chartData} timePeriod={timePeriod} chartType="line" />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <AnalyticsChart chartData={data.performanceData} timePeriod={timePeriod} chartType="bar" />
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <AnalyticsTable data={data.detailsData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
