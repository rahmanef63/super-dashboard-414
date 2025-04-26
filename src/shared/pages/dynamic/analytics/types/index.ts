export interface AnalyticsContext {
  dashboardId: string
  workspaceId?: string
  menuId?: string
  userId?: string
  [key: string]: any
}

export interface AnalyticsSliceProps {
  context: AnalyticsContext
}

export type TimePeriod = "day" | "week" | "month" | "quarter" | "year"
export type ChartType = "line" | "bar" | "pie" | "area"

export interface AnalyticsMetric {
  id: string
  name: string
  value: number
  change: number
  trend: "up" | "down" | "neutral"
  unit?: string
  formatter?: (value: number) => string
}

export interface ChartDataPoint {
  label: string
  value: number
  date?: string
  category?: string
}

export interface PerformanceDataPoint {
  label: string
  value: number
  category: string
}

export interface DetailsDataItem {
  id: string
  name: string
  value: number
  change: number
  category: string
  date: string
}

export interface AnalyticsData {
  metrics: AnalyticsMetric[]
  chartData: ChartDataPoint[]
  performanceData: PerformanceDataPoint[]
  detailsData: DetailsDataItem[]
}
