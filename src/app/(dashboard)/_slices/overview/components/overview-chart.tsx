import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface OverviewChartProps {
  data: {
    daily: Array<{ date: string; value: number }>
    weekly: Array<{ date: string; value: number }>
    monthly: Array<{ date: string; value: number }>
  }
  context: {
    dashboardId: string
    workspaceId?: string
  }
}

export function OverviewChart({ data, context }: OverviewChartProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
        <CardDescription>
          View performance metrics for {context.workspaceId ? "this workspace" : "all workspaces"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <TabsList className="mb-4">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="h-[300px] w-full">
            <div className="h-full w-full rounded-md border p-4">
              <div className="text-center text-sm text-muted-foreground">
                Chart would render here with daily data ({data.daily.length} data points)
              </div>
            </div>
          </TabsContent>
          <TabsContent value="weekly" className="h-[300px] w-full">
            <div className="h-full w-full rounded-md border p-4">
              <div className="text-center text-sm text-muted-foreground">
                Chart would render here with weekly data ({data.weekly.length} data points)
              </div>
            </div>
          </TabsContent>
          <TabsContent value="monthly" className="h-[300px] w-full">
            <div className="h-full w-full rounded-md border p-4">
              <div className="text-center text-sm text-muted-foreground">
                Chart would render here with monthly data ({data.monthly.length} data points)
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
