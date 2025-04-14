"use client"

import React, { Suspense } from "react"
import { SliceLoaderFallback } from "./slice-loader-fallback"

interface FeatureLoaderProps {
  feature: string
  dashboardId?: string
  workspaceId?: string
  menuId?: string
  params?: Record<string, any>
}

export function FeatureLoader({ feature, dashboardId, workspaceId, menuId, params = {} }: FeatureLoaderProps) {
  const [Component, setComponent] = React.useState<React.ComponentType<any> | null>(null)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    const loadComponent = async () => {
      try {
        // Dynamically import the feature component
        const module = await import(`../_static/${feature}/index`)
        setComponent(() => module.default)
      } catch (err) {
        console.error(`Failed to load feature: ${feature}`, err)
        setError(err instanceof Error ? err : new Error(`Failed to load feature: ${feature}`))
      }
    }

    loadComponent()
  }, [feature])

  if (error) {
    return (
      <div className="p-6 bg-destructive/10 rounded-lg">
        <h3 className="text-lg font-medium text-destructive mb-2">Error Loading Feature</h3>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    )
  }

  if (!Component) {
    return <SliceLoaderFallback />
  }

  return (
    <Suspense fallback={<SliceLoaderFallback />}>
      <Component dashboardId={dashboardId} workspaceId={workspaceId} menuId={menuId} {...params} />
    </Suspense>
  )
}
