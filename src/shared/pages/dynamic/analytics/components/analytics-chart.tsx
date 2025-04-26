import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChartDataPoint, PerformanceDataPoint, TimePeriod } from "../types"

interface AnalyticsChartProps {
  chartData: ChartDataPoint[] | PerformanceDataPoint[]
  timePeriod: TimePeriod
  chartType: "line" | "bar"
}

export function AnalyticsChart({ chartData, timePeriod, chartType }: AnalyticsChartProps) {
  const isPerformanceData = "category" in (chartData[0] || {})

  const title = chartType === "line" ? "Performance Over Time" : "Performance By Category"

  const description =
    chartType === "line" ? `Showing data for the last ${timePeriod}` : "Comparing performance across categories"

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full flex items-center justify-center">
          {/* In a real app, this would be a chart component */}
          <div className="text-center text-muted-foreground">
            <p className="mb-2">
              {chartType === "line" ? "Line Chart" : "Bar Chart"} would render here with {chartData.length} data points
            </p>
            <p className="text-sm">
              Using {isPerformanceData ? "performance data by category" : `time-based data for ${timePeriod}`}
            </p>
            <div className="mt-4 p-4 border rounded-md">
              <pre className="text-xs text-left overflow-auto">
                {JSON.stringify(chartData.slice(0, 3), null, 2)}
                {chartData.length > 3 && "\n..."}
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
