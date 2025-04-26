"use client"

import { useState, useEffect } from "react"
import { generateMockTasks } from "../lib/tasks-utils"
import type { Task, TasksContext } from "../types"

export function useTasksData(context: TasksContext) {
  const { dashboardId, workspaceId } = context
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true)
        // In a real app, this would be an API call
        // For now, we'll use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const mockTasks = generateMockTasks(dashboardId, workspaceId)
        setTasks(mockTasks)
        setError(null)
      } catch (err) {
        console.error("Error fetching tasks:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch tasks"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [dashboardId, workspaceId])

  const addTask = async (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newTask: Task = {
        id: `task-${Date.now()}`,
        ...task,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setTasks((prevTasks) => [newTask, ...prevTasks])
    } catch (err) {
      console.error("Error adding task:", err)
      throw err
    }
  }

  const updateTask = async (id: string, taskUpdate: Partial<Task>) => {
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id
            ? {
                ...task,
                ...taskUpdate,
                updatedAt: new Date().toISOString(),
              }
            : task,
        ),
      )
    } catch (err) {
      console.error("Error updating task:", err)
      throw err
    }
  }

  const deleteTask = async (id: string) => {
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
    } catch (err) {
      console.error("Error deleting task:", err)
      throw err
    }
  }

  const toggleTaskComplete = async (id: string) => {
    try {
      const task = tasks.find((t) => t.id === id)
      if (!task) return

      const newStatus = task.status === "completed" ? "pending" : "completed"
      await updateTask(id, { status: newStatus })
    } catch (err) {
      console.error("Error toggling task completion:", err)
      throw err
    }
  }

  return {
    tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
  }
}
