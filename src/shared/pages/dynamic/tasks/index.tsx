"use client"

import type { FeatureManifest } from "@/shared/pages/types/manifest";
import { ListChecks } from "lucide-react";

export const manifest: FeatureManifest = {
  title: "Tasks",
  url: "/tasks",
  icon: ListChecks,
  description: "Manage and track your tasks dynamically",
  featureType: "dynamic",
};



import { useState, useEffect, useMemo } from "react"
import { TasksList } from "./components/tasks-list"
import { TasksHeader } from "./components/tasks-header"
import { TasksFilters } from "./components/tasks-filters"
import { TasksEmpty } from "./components/tasks-empty"
import { useTasksData } from "./hooks/use-tasks-data"
import { TasksContext } from "./context/tasks-context"
import { DEFAULT_FILTER_STATE } from "./constants"
import type { TasksSliceProps } from "./types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function TasksSlice({ context }: TasksSliceProps) {
  console.log(`[TasksSlice] Rendering with context:`, context)

  // Validate required context properties
  if (!context.dashboardId) {
    console.error("[TasksSlice] Missing required context.dashboardId")
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasks Error</CardTitle>
          <CardDescription>Missing required context properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-md bg-destructive/10 text-destructive">
            <h3 className="font-semibold mb-2">Configuration Error</h3>
            <p>The Tasks slice requires a dashboardId in the context.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { dashboardId, workspaceId, menuId } = context
  console.log(
    `[TasksSlice] Using dashboardId: ${dashboardId}, workspaceId: ${workspaceId || "none"}, menuId: ${menuId || "none"}`,
  )

  const { tasks, isLoading, error, addTask, updateTask, deleteTask, toggleTaskComplete } = useTasksData(context)
  const [filters, setFilters] = useState(DEFAULT_FILTER_STATE)

  // Log when data is loaded
  useEffect(() => {
    if (!isLoading && !error) {
      console.log(
        `[TasksSlice] Loaded ${tasks.length} tasks for ${workspaceId ? `workspace ${workspaceId}` : `dashboard ${dashboardId}`}`,
      )
    }
  }, [isLoading, error, tasks, dashboardId, workspaceId])

  // Apply filters to tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filter by status
      if (filters.status !== "all" && task.status !== filters.status) {
        return false
      }

      // Filter by priority
      if (filters.priority !== "all" && task.priority !== filters.priority) {
        return false
      }

      // Filter by search term
      if (filters.searchTerm && !task.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false
      }

      return true
    })
  }, [tasks, filters])

  if (isLoading) {
    console.log(`[TasksSlice] Loading tasks...`)
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent className="p-6">
          <Skeleton className="h-10 w-full mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    console.error(`[TasksSlice] Error loading tasks:`, error)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasks Error</CardTitle>
          <CardDescription>There was a problem loading the tasks.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-md bg-destructive/10 text-destructive">
            <h3 className="font-semibold mb-2">Error loading tasks</h3>
            <p>{error.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  console.log(`[TasksSlice] Rendering ${filteredTasks.length} filtered tasks out of ${tasks.length} total tasks`)

  return (
    <TasksContext.Provider
      value={{ tasks: filteredTasks, filters, setFilters, addTask, updateTask, deleteTask, toggleTaskComplete }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{workspaceId ? `${workspaceId} Tasks` : `${dashboardId} Tasks`}</CardTitle>
          <CardDescription>
            Manage your tasks for {workspaceId ? `workspace ${workspaceId}` : `dashboard ${dashboardId}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <TasksHeader
            context={{ dashboardId, workspaceId, menuId }}
            totalTasks={tasks.length}
            completedTasks={tasks.filter((t) => t.status === "completed").length}
          />

          <TasksFilters />

          {filteredTasks.length > 0 ? (
            <TasksList tasks={filteredTasks} />
          ) : (
            <TasksEmpty searchTerm={filters.searchTerm} />
          )}
        </CardContent>
      </Card>
    </TasksContext.Provider>
  )
}
