"use client"

import { Button } from "@/components/ui/button"
import { ResponsiveMenu } from "../responsive-menu"
import { useState } from "react"
import { User, Settings, LogOut, Bell, HelpCircle, ChevronDown } from "lucide-react"

export function MenuExample() {
  const [open, setOpen] = useState(false)

  const handleAction = (action: string) => {
    console.log(`Action: ${action}`)
    setOpen(false)
  }

  return (
    <ResponsiveMenu
      trigger={
        <Button variant="outline" className="flex items-center gap-2">
          User Menu
          <ChevronDown className="h-4 w-4" />
        </Button>
      }
      title="User Menu"
      open={open}
      onOpenChange={setOpen}
    >
      <div className="p-2 space-y-2">
        <Button variant="ghost" className="w-full justify-start" onClick={() => handleAction("profile")}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => handleAction("settings")}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => handleAction("notifications")}>
          <Bell className="mr-2 h-4 w-4" />
          Notifications
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => handleAction("help")}>
          <HelpCircle className="mr-2 h-4 w-4" />
          Help
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => handleAction("logout")}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </ResponsiveMenu>
  )
}
