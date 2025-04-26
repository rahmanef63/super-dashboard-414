import { ClipboardList } from "lucide-react"

interface TasksEmptyProps {
  searchTerm?: string
}

export function TasksEmpty({ searchTerm }: TasksEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />

      {searchTerm ? (
        <>
          <h3 className="text-lg font-medium">No matching tasks found</h3>
          <p className="text-sm text-muted-foreground mt-1">No tasks match your search for "{searchTerm}"</p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-medium">No tasks yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Create your first task to get started</p>
        </>
      )}
    </div>
  )
}
