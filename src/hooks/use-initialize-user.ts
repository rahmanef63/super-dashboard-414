"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/src/shared/providers/session-provider"
import { useToast } from "@/components/ui/use-toast"

export function useInitializeUser() {
  const { session } = useSession()
  const { toast } = useToast()
  const [isInitialized, setIsInitialized] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)

  useEffect(() => {
    const checkAndInitializeUser = async () => {
      if (!session.userId || isInitialized || isInitializing) return

      setIsInitializing(true)

      try {
        // Check if the user already has dashboards
        const res = await fetch("/api/user/dashboards")
        const data = await res.json()

        if (data.success && data.dashboards && data.dashboards.length > 0) {
          setIsInitialized(true)
          return
        }

        // Initialize user data
        const initRes = await fetch("/api/user/initialize", {
          method: "POST",
        })

        const initData = await initRes.json()

        if (initData.success) {
          toast({
            title: "Welcome!",
            description: "Your dashboard has been set up successfully.",
          })
          setIsInitialized(true)
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to set up your dashboard. Please try again later.",
          })
        }
      } catch (error) {
        console.error("Error initializing user:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred while setting up your dashboard.",
        })
      } finally {
        setIsInitializing(false)
      }
    }

    checkAndInitializeUser()
  }, [session.userId, isInitialized, isInitializing, toast])

  return { isInitialized, isInitializing }
}
