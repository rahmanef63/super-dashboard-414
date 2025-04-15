import { Folder } from "lucide-react"

export function WorkspaceIcon() {
  return (
    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
      <Folder className="size-4" />
    </div>
  )
}
