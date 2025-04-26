"use client"

import type React from "react"
import { Suspense, useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import dynamic from "next/dynamic"
import { CalendarFallback } from "./calendar-fallback"
import { SliceLoaderFallback } from "./page-loader-fallback"

import type { SliceLoaderProps } from '@/types';

export function SliceLoader({ sliceName, context }: SliceLoaderProps) {
  const [SliceComponent, setSliceComponent] = useState<React.ComponentType<any> | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadSlice = async () => {
      try {
        console.log(`Attempting to load slice: ${sliceName}`);
        // Try to dynamically import from static first
        let DynamicSlice: React.ComponentType<any>;
        try {
          DynamicSlice = dynamic(() => import(`@/shared/pages/static/${sliceName}/index`), {
            loading: () => <Skeleton className="h-[400px] w-full" />,
            ssr: false,
          });
        } catch (staticErr) {
          // If not found, try dynamic folder
          try {
            DynamicSlice = dynamic(() => import(`@/shared/pages/dynamic/${sliceName}/index`), {
              loading: () => <Skeleton className="h-[400px] w-full" />,
              ssr: false,
            });
          } catch (dynamicErr) {
            throw new Error(`Slice '${sliceName}' not found in static or dynamic folders.`);
          }
        }
        setSliceComponent(() => (props: any) => <DynamicSlice {...props} context={context} />);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(`Failed to load slice: ${sliceName}`));
      }
    }

    loadSlice();
  }, [sliceName]);

  if (error) {
    return (
      <div className="p-4 rounded-md bg-destructive/10 text-destructive">
        <h3 className="font-semibold mb-2">Error loading slice</h3>
        <p>{error.message}</p>
        <p className="mt-2 text-sm">
          Make sure the slice exists at one of these locations:
          <ul className="list-disc pl-5 mt-1">
            <li>
              <code>src/@/shared/pages/static/{sliceName}/index.tsx</code>
            </li>
            <li>
              <code>src/shared/pages/dynamic/{sliceName}/index.tsx</code>
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
