"use client"

import { useState, useEffect } from "react"
import type { OverviewContext, OverviewData } from "../types"
import { DEFAULT_OVERVIEW_DATA } from "../constants"

// This is a mock function that would be replaced with actual API calls
const fetchOverviewData = async (context: OverviewContext): Promise<OverviewData> => {
  // In a real app, this would be an API call
  console.log(
    `Fetching overview data for dashboard: ${context.dashboardId}, workspace: ${context.workspaceId || "none"}`,
  )

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return mock data based on context
  return {
    stats: {
      totalItems: Math.floor(Math.random() * 1000) + 100,
      activeUsers: Math.floor(Math.random() * 100) + 10,
      completedTasks: Math.floor(Math.random() * 50) + 5,
      revenue: Math.floor(Math.random() * 10000) + 1000,
    },
    chartData: {
      daily: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        value: Math.floor(Math.random() * 100),
      })),
      weekly: Array.from({ length: 4 }, (_, i) => ({
        date: `Week ${i + 1}`,
        value: Math.floor(Math.random() * 500),
      })),
      monthly: Array.from({ length: 12 }, (_, i) => ({
        date: new Date(2023, i, 1).toLocaleString("default", { month: "short" }),
        value: Math.floor(Math.random() * 2000),
      })),
    },
    activities: Array.from({ length: 5 }, (_, i) => ({
      id: `activity-${i}`,
      user: {
        name: ["John Doe", "Jane Smith", "Alice Johnson", "Bob Brown", "Carol White"][i],
        avatar: undefined,
      },
      action: ["created", "updated", "deleted", "commented on", "assigned"][i],
      target: ["a task", "a project", "a document", "a milestone", "a ticket"][i],
      timestamp: new Date(Date.now() - i * 3600 * 1000).toISOString(),
    })),
    tasks: Array.from({ length: 5 }, (_, i) => ({
      id: `task-${i}`,
      title: [
        "Complete project proposal",
        "Review client feedback",
        "Update documentation",
        "Prepare presentation",
        "Schedule team meeting",
      ][i],
      completed: i < 2,
      priority: ["high", "medium", "low", "medium", "high"][i] as "high" | "medium" | "low",
      dueDate: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
    })),
  }
}

export function useOverviewData(context: OverviewContext) {
  const [data, setData] = useState<OverviewData>(DEFAULT_OVERVIEW_DATA)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const overviewData = await fetchOverviewData(context)
        setData(overviewData)
        setError(null)
      } catch (err) {
        console.error("Error loading overview data:", err)
        setError(err instanceof Error ? err : new Error("Unknown error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [context])

  return { data, isLoading, error }
}
