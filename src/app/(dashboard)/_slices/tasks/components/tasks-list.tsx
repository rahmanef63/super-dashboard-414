import { TaskItem } from "./task-item"
import type { Task } from "../types"

interface TasksListProps {
  tasks: Task[]
}

export function TasksList({ tasks }: TasksListProps) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  )
}
