import { Settings, Users } from "lucide-react"
import { LayoutDashboard } from "lucide-react"

interface StaticMenuProps {
  isCollapsed: boolean
  showLabel?: boolean
}

export const StaticMenu = ({ isCollapsed, showLabel = true }: StaticMenuProps) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
          <LayoutDashboard className="h-4 w-4" />
          {!isCollapsed && showLabel && <div>Dashboard</div>}
        </div>
        <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
          <Users className="h-4 w-4" />
          {!isCollapsed && showLabel && <div>Users</div>}
        </div>
        <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
          <Settings className="h-4 w-4" />
          {!isCollapsed && showLabel && <div>Settings</div>}
        </div>
      </div>
    </>
  )
}
