"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import { usePathname, useParams, useRouter } from "next/navigation"

interface WorkspaceContextType {
  activeWorkspaceId: string | undefined
  setActiveWorkspaceId: (id: string | undefined) => void
  dashboardId: string | undefined
  isWorkspaceView: boolean
  goToDashboardHome: () => void
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider")
  }
  return context
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()

  // Extract dashboard and workspace IDs from URL params
  const dashboardId = typeof params.dashboard === "string" ? params.dashboard : undefined
  const workspaceIdFromUrl = typeof params.workspace === "string" ? params.workspace : undefined

  // State to track the active workspace
  const [activeWorkspaceId, setActiveWorkspaceIdState] = useState<string | undefined>(workspaceIdFromUrl)

  // Add this at the top of the component, after the useState declarations:
  const previousDashboardId = useRef<string | undefined>(dashboardId)

  // Determine if we're in a workspace view
  const isWorkspaceView = pathname.includes(`/dashboard/${dashboardId}/`) && !!workspaceIdFromUrl

  // Update state when URL params change
  useEffect(() => {
    if (workspaceIdFromUrl !== activeWorkspaceId) {
      console.log(
        `[workspace-context] URL workspace (${workspaceIdFromUrl}) differs from state (${activeWorkspaceId}), updating state`,
      )
      // Only update the state if the URL has a workspace ID
      // This prevents resetting the workspace when navigating to a dashboard page
      if (workspaceIdFromUrl) {
        setActiveWorkspaceIdState(workspaceIdFromUrl)
      }
    }
  }, [workspaceIdFromUrl, activeWorkspaceId])

  // Function to set active workspace and navigate if needed
  const setActiveWorkspaceId = (id: string | undefined) => {
    console.log(`[workspace-context] Setting active workspace: ${id}`)

    // Always update the state first
    setActiveWorkspaceIdState(id)

    // Store in localStorage immediately to ensure persistence
    if (dashboardId) {
      if (id) {
        localStorage.setItem(`dashboard:${dashboardId}:activeWorkspace`, id)
        console.log(`[workspace-context] Saved workspace ${id} for dashboard ${dashboardId} to localStorage`)
      } else {
        localStorage.removeItem(`dashboard:${dashboardId}:activeWorkspace`)
        console.log(`[workspace-context] Removed saved workspace for dashboard ${dashboardId} from localStorage`)
      }
    }

    // Navigate if needed
    if (dashboardId && id) {
      const newPath = `/dashboard/${dashboardId}/${id}`
      console.log(`[workspace-context] Navigating to: ${newPath}`)
      router.push(newPath)
    } else if (dashboardId && !id) {
      // If workspace is being unset, navigate to dashboard root
      const newPath = `/dashboard/${dashboardId}`
      console.log(`[workspace-context] Navigating to dashboard root: ${newPath}`)
      router.push(newPath)
    }
  }

  // Function to go directly to dashboard home
  const goToDashboardHome = () => {
    if (dashboardId) {
      // Clear the active workspace
      setActiveWorkspaceIdState(undefined)

      // Remove from localStorage
      localStorage.removeItem(`dashboard:${dashboardId}:activeWorkspace`)

      // Navigate to dashboard home
      const newPath = `/dashboard/${dashboardId}`
      console.log(`[workspace-context] Going to dashboard home: ${newPath}`)
      router.push(newPath)
    } else {
      // If no dashboard ID, go to dashboards list
      router.push("/dashboard")
    }
  }

  // Load saved workspace when dashboard changes
  useEffect(() => {
    if (dashboardId) {
      const savedWorkspace = localStorage.getItem(`dashboard:${dashboardId}:activeWorkspace`)
      console.log(
        `[workspace-context] Checking localStorage for dashboard ${dashboardId}, found: ${savedWorkspace || "none"}`,
      )

      if (savedWorkspace) {
        console.log(`[workspace-context] Found saved workspace ${savedWorkspace} for dashboard ${dashboardId}`)
        setActiveWorkspaceIdState(savedWorkspace)

        // If we're on the dashboard page and have a saved workspace, navigate to it
        if (pathname === `/dashboard/${dashboardId}` && !workspaceIdFromUrl) {
          console.log(`[workspace-context] Auto-navigating to saved workspace: ${savedWorkspace}`)
          router.push(`/dashboard/${dashboardId}/${savedWorkspace}`)
        }
      }
    }
  }, [dashboardId, workspaceIdFromUrl, pathname, router])

  // Fix the workspace context to properly clear when switching dashboards

  // Add this effect to detect dashboard changes and clear the workspace
  useEffect(() => {
    // If dashboard changes, clear the active workspace
    if (previousDashboardId.current && previousDashboardId.current !== dashboardId && dashboardId) {
      console.log(
        `[workspace-context] Dashboard changed from ${previousDashboardId.current} to ${dashboardId}, clearing workspace`,
      )
      setActiveWorkspaceIdState(undefined)

      // Remove the saved workspace for the previous dashboard
      localStorage.removeItem(`dashboard:${previousDashboardId.current}:activeWorkspace`)
    }

    // Update the previous dashboard ref
    if (dashboardId) {
      previousDashboardId.current = dashboardId
    }
  }, [dashboardId])

  return (
    <WorkspaceContext.Provider
      value={{
        activeWorkspaceId,
        setActiveWorkspaceId,
        dashboardId,
        isWorkspaceView,
        goToDashboardHome,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}
