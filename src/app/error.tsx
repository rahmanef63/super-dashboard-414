"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Home, RefreshCcw } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset?: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Don't log redirect "errors" as they're expected behavior
    if (error?.message !== "NEXT_REDIRECT") {
      console.error("[app/error.tsx] Error caught:", error)
    }
  }, [error])

  const handleReset = () => {
    try {
      if (typeof reset === "function") {
        reset()
      } else {
        // Fallback if reset is not a function
        console.log("Reset function not available, using router.refresh() instead")
        router.refresh()
      }
    } catch (e) {
      console.error("Error during reset:", e)
      // Ultimate fallback - redirect to home
      router.push("/")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong!</h2>
        <p className="text-muted-foreground mb-6">
          {error?.message && error.message !== "NEXT_REDIRECT" ? error.message : "An unexpected error occurred"}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-between">
          <Button variant="outline" asChild>
            <Link href="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button onClick={handleReset} className="gap-1">
            <RefreshCcw className="h-4 w-4" />
            Try again
          </Button>
        </div>
      </div>
    </div>
  )
}
