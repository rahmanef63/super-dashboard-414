import type { TimePeriod } from "../types"

export const DEFAULT_TIME_PERIOD: TimePeriod = "month"

export const TIME_PERIOD_OPTIONS = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Quarter", value: "quarter" },
  { label: "Year", value: "year" },
]

export const CHART_COLORS = [
  "rgba(59, 130, 246, 0.8)", // Blue
  "rgba(16, 185, 129, 0.8)", // Green
  "rgba(249, 115, 22, 0.8)", // Orange
  "rgba(139, 92, 246, 0.8)", // Purple
  "rgba(236, 72, 153, 0.8)", // Pink
  "rgba(234, 179, 8, 0.8)", // Yellow
]

export const CHART_BACKGROUND_COLORS = [
  "rgba(59, 130, 246, 0.2)", // Blue
  "rgba(16, 185, 129, 0.2)", // Green
  "rgba(249, 115, 22, 0.2)", // Orange
  "rgba(139, 92, 246, 0.2)", // Purple
  "rgba(236, 72, 153, 0.2)", // Pink
  "rgba(234, 179, 8, 0.2)", // Yellow
]

export const CATEGORIES = ["Traffic", "Conversion", "Revenue", "Engagement", "Retention"]
