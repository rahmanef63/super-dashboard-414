export interface OverviewContext {
  dashboardId: string
  workspaceId?: string
  menuId?: string
}

export interface OverviewData {
  stats: {
    totalItems: number
    activeUsers: number
    completedTasks: number
    revenue: number
  }
  chartData: {
    daily: Array<{ date: string; value: number }>
    weekly: Array<{ date: string; value: number }>
    monthly: Array<{ date: string; value: number }>
  }
  activities: Array<{
    id: string
    user: {
      name: string
      avatar?: string
    }
    action: string
    target: string
    timestamp: string
  }>
  tasks: Array<{
    id: string
    title: string
    completed: boolean
    priority: "low" | "medium" | "high"
    dueDate?: string
  }>
}
