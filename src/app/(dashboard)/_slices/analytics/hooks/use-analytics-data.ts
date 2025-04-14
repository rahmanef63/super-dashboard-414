"use client"

import { useState, useEffect } from "react"
import { generateMockAnalyticsData } from "../lib/analytics-utils"
import type { AnalyticsContext, AnalyticsData, TimePeriod } from "../types"

export function useAnalyticsData(context: AnalyticsContext, timePeriod: TimePeriod) {
  const { dashboardId, workspaceId } = context
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true)
        // In a real app, this would be an API call
        // For now, we'll use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const mockData = generateMockAnalyticsData(dashboardId, workspaceId, timePeriod)
        setData(mockData)
        setError(null)
      } catch (err) {
        console.error("Error fetching analytics data:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch analytics data"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [dashboardId, workspaceId, timePeriod])

  return {
    data: data || {
      metrics: [],
      chartData: [],
      performanceData: [],
      detailsData: [],
    },
    isLoading,
    error,
  }
}
