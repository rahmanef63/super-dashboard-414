import type { Task } from "../types"

/**
 * Generates mock tasks for testing
 */
export function generateMockTasks(dashboardId: string, workspaceId?: string): Task[] {
  const count = Math.floor(Math.random() * 10) + 5 // 5-15 tasks
  const tasks: Task[] = []

  const statuses: Task["status"][] = ["pending", "in_progress", "completed", "cancelled"]
  const priorities: Task["priority"][] = ["low", "medium", "high", "urgent"]

  const contextPrefix = workspaceId ? `${workspaceId} workspace` : `${dashboardId} dashboard`

  for (let i = 0; i < count; i++) {
    const createdDate = new Date()
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30)) // 0-30 days ago

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 14)) // 0-14 days from now

    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const priority = priorities[Math.floor(Math.random() * priorities.length)]

    tasks.push({
      id: `task-${i}-${Date.now()}`,
      title: `${contextPrefix} task ${i + 1}`,
      description: `This is a ${priority} priority task for the ${contextPrefix}`,
      status,
      priority,
      dueDate: dueDate.toISOString(),
      createdAt: createdDate.toISOString(),
      updatedAt: createdDate.toISOString(),
      tags: ["sample", contextPrefix.split(" ")[0]],
    })
  }

  return tasks
}

/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

/**
 * Calculate if a task is overdue
 */
export function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate) return false

  const dueDate = new Date(task.dueDate)
  const today = new Date()

  // Reset time to compare just the dates
  today.setHours(0, 0, 0, 0)
  dueDate.setHours(0, 0, 0, 0)

  return dueDate < today && task.status !== "completed" && task.status !== "cancelled"
}

/**
 * Get a human-readable message about a task's due date
 */
export function getDueDateMessage(task: Task): string {
  if (!task.dueDate) return "No due date"

  const isOverdue = isTaskOverdue(task)
  const relativeTime = getRelativeTimeString(task.dueDate)

  if (isOverdue && task.status !== "completed" && task.status !== "cancelled") {
    return `Due ${relativeTime} (Overdue)`
  }

  return `Due ${relativeTime}`
}

/**
 * Get relative time string (e.g., "2 days ago", "in 3 days")
 */
export function getRelativeTimeString(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()

  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Tomorrow"
  if (diffDays === -1) return "Yesterday"

  if (diffDays > 0) {
    return `In ${diffDays} days`
  } else {
    return `${Math.abs(diffDays)} days ago`
  }
}
