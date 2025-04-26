import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

export interface Task {
  id: string
  title: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: string
}

export interface OverviewTasksProps {
  tasks: Task[]
  context: {
    dashboardId: string
    workspaceId?: string
  }
}

export function OverviewTasks({ tasks, context }: OverviewTasksProps) {
  return (
    <Card className="col-span-4 lg:col-span-2">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
        <CardDescription>
          Upcoming tasks for {context.workspaceId ? "this workspace" : "all workspaces"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-start gap-4">
              <Checkbox id={`task-${task.id}`} checked={task.completed} />
              <div className="flex-1 space-y-1">
                <label
                  htmlFor={`task-${task.id}`}
                  className={`text-sm font-medium leading-none ${task.completed ? "line-through text-muted-foreground" : ""}`}
                >
                  {task.title}
                </label>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "outline"
                    }
                    className="text-xs"
                  >
                    {task.priority}
                  </Badge>
                  {task.dueDate && (
                    <span className="text-xs text-muted-foreground">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
