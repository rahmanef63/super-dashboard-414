"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useTasksContext } from "../context/tasks-context"
import { TaskFormDialog } from "./task-form-dialog"
import { TASK_PRIORITY_COLORS, TASK_STATUS_COLORS } from "../constants"
import { getDueDateMessage, isTaskOverdue } from "../lib/tasks-utils"
import type { Task } from "../types"

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const { toggleTaskComplete, deleteTask } = useTasksContext()
  const isCompleted = task.status === "completed"
  const isOverdue = isTaskOverdue(task)

  const handleToggleComplete = () => {
    toggleTaskComplete(task.id)
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(task.id)
    }
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-md border",
        isCompleted ? "bg-muted/50" : "bg-card",
        isOverdue && !isCompleted ? "border-red-300" : "border-border",
      )}
    >
      <Checkbox checked={isCompleted} onCheckedChange={handleToggleComplete} className="mt-1" />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className={cn("font-medium text-sm", isCompleted && "line-through text-muted-foreground")}>
            {task.title}
          </h3>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className={cn("text-xs", TASK_PRIORITY_COLORS[task.priority])}>
              {task.priority}
            </Badge>

            <Badge variant="outline" className={cn("text-xs", TASK_STATUS_COLORS[task.status])}>
              {task.status.replace("_", " ")}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {task.description && (
          <p className={cn("text-sm text-muted-foreground mt-1", isCompleted && "line-through")}>{task.description}</p>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {task.dueDate && (
            <span
              className={cn(
                "text-xs",
                isOverdue && !isCompleted ? "text-destructive font-medium" : "text-muted-foreground",
              )}
            >
              {getDueDateMessage(task)}
            </span>
          )}

          {task.tags && task.tags.length > 0 && (
            <div className="flex gap-1">
              {task.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {isEditing && <TaskFormDialog open={isEditing} onOpenChange={setIsEditing} task={task} />}
    </div>
  )
}
