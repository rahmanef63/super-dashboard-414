import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, Briefcase, DollarSign } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <CardDescription className="text-xs">
          {description}
          {trend && (
            <span className={trend.isPositive ? "text-green-500 ml-1" : "text-red-500 ml-1"}>
              {trend.isPositive ? "+" : "-"}
              {trend.value}%
            </span>
          )}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

export interface OverviewStatsProps {
  stats: {
    totalItems: number
    activeUsers: number
    completedTasks: number
    revenue: number
  }
  context: {
    dashboardId: string
    workspaceId?: string
  }
}

export function OverviewStats({ stats, context }: OverviewStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Items"
        value={stats.totalItems}
        description="Total items in this workspace"
        icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard
        title="Active Users"
        value={stats.activeUsers}
        description="Users active today"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: 5, isPositive: true }}
      />
      <StatCard
        title="Completed Tasks"
        value={stats.completedTasks}
        description="Tasks completed this week"
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: 3, isPositive: false }}
      />
      <StatCard
        title="Revenue"
        value={`$${stats.revenue.toLocaleString()}`}
        description="Revenue this month"
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: 8, isPositive: true }}
      />
    </div>
  )
}
