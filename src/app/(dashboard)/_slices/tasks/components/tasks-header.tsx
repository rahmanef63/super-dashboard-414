"use client"

import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { TaskFormDialog } from "./task-form-dialog"

interface TasksHeaderProps {
  context: {
    dashboardId: string
    workspaceId?: string
    menuId?: string
  }
  totalTasks: number
  completedTasks: number
}

export function TasksHeader({ context, totalTasks, completedTasks }: TasksHeaderProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { dashboardId, workspaceId } = context

  const title = workspaceId ? `${workspaceId} Tasks` : `${dashboardId} Tasks`

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="flex flex-col gap-2 mb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button onClick={() => setIsFormOpen(true)} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="flex items-center text-sm text-muted-foreground">
        <span>
          {completedTasks} of {totalTasks} tasks complete ({completionPercentage}%)
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full mt-2">
        <div className="h-full bg-primary rounded-full" style={{ width: `${completionPercentage}%` }} />
      </div>

      {isFormOpen && <TaskFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} context={context} />}
    </div>
  )
}
