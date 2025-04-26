import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import type { WorkspacePlaceholderProps } from "@/types";

export function WorkspacePlaceholder({ workspaceName, isLoading = true }: WorkspacePlaceholderProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">
        {isLoading ? <Skeleton className="h-8 w-64" /> : `Workspace: ${workspaceName}`}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{isLoading ? <Skeleton className="h-6 w-32" /> : `Menu ${i + 1}`}</CardTitle>
              <CardDescription>
                {isLoading ? <Skeleton className="h-4 w-48" /> : `Description for Menu ${i + 1}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (
                <p>Content for this menu will appear here.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
