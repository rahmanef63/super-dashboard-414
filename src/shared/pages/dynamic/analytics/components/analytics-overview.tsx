import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AnalyticsMetric } from "../types"

interface AnalyticsOverviewProps {
  metrics: AnalyticsMetric[]
}

export function AnalyticsOverview({ metrics }: AnalyticsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.id}>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-1.5">
              <span className="text-sm font-medium text-muted-foreground">{metric.name}</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {metric.formatter ? metric.formatter(metric.value) : metric.value}
                </span>
                <MetricTrend trend={metric.trend} change={metric.change} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

interface MetricTrendProps {
  trend: "up" | "down" | "neutral"
  change: number
}

function MetricTrend({ trend, change }: MetricTrendProps) {
  return (
    <div
      className={cn(
        "flex items-center text-xs font-medium",
        trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500",
      )}
    >
      {trend === "up" ? (
        <ArrowUp className="mr-1 h-3 w-3" />
      ) : trend === "down" ? (
        <ArrowDown className="mr-1 h-3 w-3" />
      ) : (
        <Minus className="mr-1 h-3 w-3" />
      )}
      <span>{Math.abs(change)}%</span>
    </div>
  )
}
