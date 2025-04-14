"use client"

import type React from "react"
import { Suspense, useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import dynamic from "next/dynamic"
import { CalendarFallback } from "./calendar-fallback"
import { SliceLoaderFallback } from "./slice-loader-fallback"

interface SliceLoaderProps {
  sliceName: string
  context: {
    dashboardId: string
    workspaceId?: string
    menuId?: string
    [key: string]: any
  }
}

export function SliceLoader({ sliceName, context }: SliceLoaderProps) {
  const [SliceComponent, setSliceComponent] = useState<React.ComponentType<any> | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadSlice = async () => {
      try {
        console.log(`Attempting to load slice: ${sliceName}`)

        // Use dynamic imports with next/dynamic for better reliability
        if (sliceName === "overview") {
          const DynamicOverviewSlice = dynamic(() => import("@/app/(dashboard)/_slices/overview"), {
            loading: () => <Skeleton className="h-[400px] w-full" />,
            ssr: false, // Disable SSR for dynamic components to avoid hydration issues
          })
          setSliceComponent(() => DynamicOverviewSlice)
          return
        }

        if (sliceName === "calendar") {
          const DynamicCalendarSlice = dynamic(() => import("@/app/(dashboard)/_slices/calendar"), {
            loading: () => <CalendarFallback />,
            ssr: false,
          })
          setSliceComponent(() => DynamicCalendarSlice)
          return
        }

        if (sliceName === "tasks") {
          console.log("Loading Tasks slice specifically")
          const DynamicTasksSlice = dynamic(() => import("@/app/(dashboard)/_slices/tasks"), {
            loading: () => <Skeleton className="h-[400px] w-full" />,
            ssr: false,
          })
          setSliceComponent(() => DynamicTasksSlice)
          return
        }

        if (sliceName === "analytics") {
          console.log("Loading Analytics slice specifically")
          const DynamicAnalyticsSlice = dynamic(() => import("@/app/(dashboard)/_slices/analytics"), {
            loading: () => <Skeleton className="h-[400px] w-full" />,
            ssr: false,
          })
          setSliceComponent(() => DynamicAnalyticsSlice)
          return
        }

        if (sliceName === "documents") {
          console.log("Loading Documents slice specifically")
          const DynamicDocumentsSlice = dynamic(() => import("@/app/(dashboard)/_slices/documents"), {
            loading: () => <Skeleton className="h-[400px] w-full" />,
            ssr: false,
          })
          setSliceComponent(() => DynamicDocumentsSlice)
          return
        }

        if (sliceName === "menu") {
          const DynamicMenuSlice = dynamic(() => import("@/app/(dashboard)/_slices/menu"), {
            loading: () => <Skeleton className="h-[400px] w-full" />,
            ssr: false,
          })
          setSliceComponent(() => DynamicMenuSlice)
          return
        }

        // For other slices, use a generic dynamic import with proper error handling
        try {
          const DynamicSlice = dynamic(() => import(`@/app/(dashboard)/_slices/${sliceName}`), {
            loading: () => <Skeleton className="h-[400px] w-full" />,
            ssr: false,
          })
          setSliceComponent(() => DynamicSlice)
        } catch (err) {
          console.error(`Error loading slice "${sliceName}":`, err)
          setError(err instanceof Error ? err : new Error(`Failed to load slice "${sliceName}"`))
        }
      } catch (err) {
        console.error(`Error loading slice "${sliceName}":`, err)
        setError(err instanceof Error ? err : new Error(`Failed to load slice "${sliceName}"`))
      }
    }

    loadSlice()
  }, [sliceName])

  if (error) {
    return (
      <div className="p-4 rounded-md bg-destructive/10 text-destructive">
        <h3 className="font-semibold mb-2">Error loading slice</h3>
        <p>{error.message}</p>
        <p className="mt-2 text-sm">
          Make sure the slice exists at:
          <ul className="list-disc pl-5 mt-1">
            <li>
              <code>app/(dashboard)/_slices/{sliceName}/index.tsx</code>
            </li>
          </ul>
        </p>
      </div>
    )
  }

  if (!SliceComponent) {
    return <SliceLoaderFallback sliceName={sliceName} context={context} />
  }

  return (
    <Suspense fallback={<SliceLoaderFallback sliceName={sliceName} context={context} />}>
      <SliceComponent context={context} />
    </Suspense>
  )
}
