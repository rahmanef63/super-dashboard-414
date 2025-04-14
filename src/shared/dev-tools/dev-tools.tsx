"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Settings } from "lucide-react"

import { useDevTools } from "./dev-tools-provider"
import { DevToolsCard } from "./components/dev-tools-card"
import { LayoutInspector } from "./components/layout-inspector"
import { SessionViewer } from "./components/session-viewer"
import { SettingsContent } from "./components/settings-content"
import { UserSwitcher } from "./components/user-switcher"

export function DevTools() {
  const { isOpen, toggleDevTools, isDarkMode, toggleDarkMode } = useDevTools()

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 rounded-full h-10 w-10 bg-background shadow-md"
        onClick={toggleDevTools}
      >
        <Settings className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <>
      <SettingsContent
        isOpen={isOpen}
        toggleDevTools={toggleDevTools}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <UserSwitcher />
      <LayoutInspector />
      <SessionViewer />
    </>
  )
}
