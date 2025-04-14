export interface TasksContext {
  dashboardId: string
  workspaceId?: string
  menuId?: string
  userId?: string
  [key: string]: any
}

export interface TasksSliceProps {
  context: TasksContext
}

export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled"
export type TaskPriority = "low" | "medium" | "high" | "urgent"

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
  tags?: string[]
}

export interface TaskFilters {
  status: TaskStatus | "all"
  priority: TaskPriority | "all"
  searchTerm: string
}

export interface TasksContextType {
  tasks: Task[]
  filters: TaskFilters
  setFilters: (filters: TaskFilters) => void
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<void>
  updateTask: (id: string, task: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTaskComplete: (id: string) => Promise<void>
}
