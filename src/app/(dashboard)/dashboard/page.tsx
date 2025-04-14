"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getDashboards } from "@/lib/data-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowRight, LayoutDashboard } from "lucide-react"
import Link from "next/link"

export default function DashboardHomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [dashboards, setDashboards] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDashboards = async () => {
      try {
        setIsLoading(true)
        // Get all available dashboards
        const availableDashboards = getDashboards()
        setDashboards(availableDashboards)

        // If there's only one dashboard, redirect to it automatically
        if (availableDashboards.length === 1) {
          router.push(`/dashboard/${availableDashboards[0].id}`)
        }
      } catch (err) {
        console.error("Error loading dashboards:", err)
        setError("Failed to load dashboards. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboards()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <h1 className="text-2xl font-bold">Loading Dashboards</h1>
          <p className="text-muted-foreground">Please wait while we prepare your dashboard experience...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4 text-center">
          <h1 className="text-2xl font-bold">Dashboard Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  // If we have multiple dashboards, show a selection screen
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Select a Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboards.map((dashboard) => (
          <Card key={dashboard.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-md bg-primary/10">
                  <LayoutDashboard className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>{dashboard.name}</CardTitle>
              </div>
              <CardDescription>{dashboard.description || `${dashboard.name} dashboard`}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                Created on {new Date(dashboard.created_at).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full group">
                <Link href={`/dashboard/${dashboard.id}`}>
                  Open Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
