import { CATEGORIES } from "../constants"
import type { AnalyticsData, ChartDataPoint, DetailsDataItem, Metric, TimePeriod } from "../types"

/**
 * Generates mock analytics data for testing
 */
export function generateMockAnalyticsData(
  dashboardId: string,
  workspaceId?: string,
  timePeriod: TimePeriod = "month",
): AnalyticsData {
  const contextPrefix = workspaceId ? `${workspaceId} workspace` : `${dashboardId} dashboard`

  return {
    metrics: generateMetrics(contextPrefix),
    chartData: generateChartData(timePeriod),
    performanceData: generatePerformanceData(timePeriod),
    detailsData: generateDetailsData(timePeriod),
  }
}

/**
 * Generate mock metrics
 */
function generateMetrics(contextPrefix: string): Metric[] {
  return [
    {
      id: "visitors",
      name: "Total Visitors",
      value: Math.floor(Math.random() * 10000) + 1000,
      change: Math.floor(Math.random() * 30) - 10,
      changeType: Math.random() > 0.3 ? "increase" : "decrease",
      unit: "users",
      icon: "users",
    },
    {
      id: "conversion",
      name: "Conversion Rate",
      value: Math.random() * 10,
      change: Math.random() * 5 - 2,
      changeType: Math.random() > 0.5 ? "increase" : "decrease",
      unit: "%",
      icon: "percent",
    },
    {
      id: "revenue",
      name: "Revenue",
      value: Math.floor(Math.random() * 100000) + 10000,
      change: Math.floor(Math.random() * 20) - 5,
      changeType: Math.random() > 0.4 ? "increase" : "decrease",
      unit: "$",
      icon: "dollar-sign",
    },
    {
      id: "engagement",
      name: "Avg. Session",
      value: Math.floor(Math.random() * 300) + 60,
      change: Math.floor(Math.random() * 40) - 20,
      changeType: Math.random() > 0.5 ? "increase" : "decrease",
      unit: "sec",
      icon: "clock",
    },
  ]
}

/**
 * Generate chart data based on time period
 */
function generateChartData(timePeriod: TimePeriod): ChartDataPoint[] {
  const points: ChartDataPoint[] = []
  let count: number

  switch (timePeriod) {
    case "day":
      count = 24 // Hours in a day
      for (let i = 0; i < count; i++) {
        points.push({
          label: `${i}:00`,
          value: Math.floor(Math.random() * 1000) + 100,
          date: new Date(new Date().setHours(i, 0, 0, 0)).toISOString(),
        })
      }
      break

    case "week":
      count = 7 // Days in a week
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      for (let i = 0; i < count; i++) {
        const date = new Date()
        date.setDate(date.getDate() - date.getDay() + i)
        points.push({
          label: days[i],
          value: Math.floor(Math.random() * 5000) + 500,
          date: date.toISOString(),
        })
      }
      break

    case "month":
      count = 30 // Approx days in a month
      for (let i = 0; i < count; i++) {
        const date = new Date()
        date.setDate(date.getDate() - (count - i - 1))
        points.push({
          label: `${date.getDate()}`,
          value: Math.floor(Math.random() * 10000) + 1000,
          date: date.toISOString(),
        })
      }
      break

    case "quarter":
      count = 3 // Months in a quarter
      const currentMonth = new Date().getMonth()
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3
      for (let i = 0; i < count; i++) {
        const date = new Date()
        date.setMonth(quarterStartMonth + i, 1)
        points.push({
          label: date.toLocaleString("default", { month: "short" }),
          value: Math.floor(Math.random() * 50000) + 5000,
          date: date.toISOString(),
        })
      }
      break

    case "year":
      count = 12 // Months in a year
      for (let i = 0; i < count; i++) {
        const date = new Date()
        date.setMonth(i, 1)
        points.push({
          label: date.toLocaleString("default", { month: "short" }),
          value: Math.floor(Math.random() * 100000) + 10000,
          date: date.toISOString(),
        })
      }
      break
  }

  return points
}

/**
 * Generate performance data by category
 */
function generatePerformanceData(timePeriod: TimePeriod): ChartDataPoint[] {
  return CATEGORIES.map((category) => ({
    label: category,
    value: Math.floor(Math.random() * 100),
    category,
  }))
}

/**
 * Generate detailed data for tables
 */
function generateDetailsData(timePeriod: TimePeriod): DetailsDataItem[] {
  const items: DetailsDataItem[] = []
  const count = 20 // Number of rows

  for (let i = 0; i < count; i++) {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    items.push({
      id: `item-${i}`,
      name: `Item ${i + 1}`,
      value: Math.floor(Math.random() * 1000) + 100,
      change: Math.floor(Math.random() * 40) - 20,
      category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
      date: date.toISOString(),
    })
  }

  return items
}

/**
 * Format a number with a unit
 */
export function formatValue(value: number, unit?: string): string {
  if (unit === "%") {
    return `${value.toFixed(2)}${unit}`
  } else if (unit === "$") {
    return `${unit}${value.toLocaleString()}`
  } else if (unit) {
    return `${value.toLocaleString()} ${unit}`
  }

  return value.toLocaleString()
}

/**
 * Format a change value with a + or - sign
 */
export function formatChange(change: number): string {
  const sign = change > 0 ? "+" : ""
  return `${sign}${change.toFixed(2)}%`
}
