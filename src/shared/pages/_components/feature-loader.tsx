"use client"

import React, { Suspense } from "react"
import { SliceLoaderFallback } from "./page-loader-fallback"

import type { FeatureLoaderProps } from '@/types';

export function FeatureLoader({ feature, context, params = {} }: FeatureLoaderProps) {
  const [Component, setComponent] = React.useState<React.ComponentType<any> | null>(null)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    const loadComponent = async () => {
      try {
        // Try to load from static first
        let module: any;
        try {
          module = await import(`../static/${feature}/index.tsx`);
        } catch (staticErr) {
          try {
            module = await import(`../dynamic/${feature}/index.tsx`);
          } catch (dynamicErr) {
            throw new Error(`Feature '${feature}' not found in static or dynamic folders.`);
          }
        }
        setComponent(() => module.default);
      } catch (err) {
        console.error(`Failed to load feature: ${feature}`, err);
        setError(err instanceof Error ? err : new Error(`Failed to load feature: ${feature}`));
      }
    };
    loadComponent();
  }, [feature]);

  if (error) {
    return (
      <SliceLoaderFallback sliceName={feature} context={context} />
    )
  }

  if (!Component) {
    return <SliceLoaderFallback sliceName={feature} context={context} />
  }

  return (
    <Suspense fallback={<SliceLoaderFallback sliceName={feature} context={context} />}>
      <Component {...context} {...params} />
    </Suspense>
  )
}
