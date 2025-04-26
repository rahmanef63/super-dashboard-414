"use client"

import { createContext, useContext } from "react"
import type { TasksContextType } from "../types"

// Create the context with a default value
export const TasksContext = createContext<TasksContextType | undefined>(undefined)

// Custom hook to use the tasks context
export function useTasksContext() {
  const context = useContext(TasksContext)
  if (context === undefined) {
    throw new Error("useTasksContext must be used within a TasksContext.Provider")
  }
  return context
}
