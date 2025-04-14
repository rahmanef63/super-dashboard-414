"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCcw, Home } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset?: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard error:", error)
  }, [error])

  const handleReset = () => {
    try {
      if (typeof reset === "function") {
        reset()
      } else {
        // Fallback if reset is not available
        router.refresh()
      }
    } catch (e) {
      console.error("Error during reset:", e)
      router.refresh()
    }
  }

  return (
    <div className="flex flex-1 p-6">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Dashboard Error</CardTitle>
          </div>
          <CardDescription>There was a problem loading the dashboard content.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Error details: {error.message || "Unknown error"}</p>
          <p className="text-sm text-muted-foreground">
            You can try refreshing the page or navigate to another section.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/dashboard" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              Dashboard Home
            </Link>
          </Button>
          <Button onClick={handleReset} className="gap-1">
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
