"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarSliceProps {
  context: {
    dashboardId: string
    workspaceId?: string
    menuId: string
    userId?: string
  }
}

interface CalendarEvent {
  id: string
  title: string
  date: Date
  time?: string
  type: "meeting" | "deadline" | "reminder" | "personal"
  description?: string
}

import type { FeatureManifest } from "@/shared/pages/types/manifest";
import { Calendar } from "lucide-react";

export const manifest: FeatureManifest = {
  title: "Calendar (Dynamic)",
  url: "/dynamic/calendar",
  icon: Calendar,
  description: "Dynamic calendar feature",
  featureType: "dynamic",
};

export default function CalendarSlice({ context }: CalendarSliceProps) {
  const { dashboardId, workspaceId, userId } = context
  const [isLoading, setIsLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [error, setError] = useState<Error | null>(null)

  // Generate calendar data based on context
  useEffect(() => {
    const fetchCalendarData = async () => {
      setIsLoading(true)
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Generate mock events based on context
        const contextPrefix = workspaceId ? `Workspace ${workspaceId}` : `Dashboard ${dashboardId}`
        const mockEvents: CalendarEvent[] = []

        // Current month days
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        // Generate 5-10 random events for the current month
        const numEvents = Math.floor(Math.random() * 6) + 5
        const eventTypes: ("meeting" | "deadline" | "reminder" | "personal")[] = [
          "meeting",
          "deadline",
          "reminder",
          "personal",
        ]

        for (let i = 0; i < numEvents; i++) {
          const day = Math.floor(Math.random() * daysInMonth) + 1
          const eventDate = new Date(year, month, day)
          const hours = Math.floor(Math.random() * 12) + 8 // 8 AM to 8 PM
          const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)]
          const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]

          mockEvents.push({
            id: `event-${i}`,
            title: `${contextPrefix} ${eventType} ${i + 1}`,
            date: eventDate,
            time: `${hours}:${minutes.toString().padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`,
            type: eventType,
            description: `Description for ${eventType} ${i + 1} in ${contextPrefix}`,
          })
        }

        setEvents(mockEvents)
      } catch (err) {
        console.error("Error fetching calendar data:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch calendar data"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchCalendarData()
  }, [dashboardId, workspaceId, userId, currentDate])

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Calendar</CardTitle>
          <CardDescription>There was a problem loading the calendar data.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </CardContent>
      </Card>
    )
  }

  // Calendar rendering logic
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and total days
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Create calendar grid
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Group events by date
  const eventsByDate: Record<string, CalendarEvent[]> = {}
  events.forEach((event) => {
    const dateKey = event.date.getDate().toString()
    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = []
    }
    eventsByDate[dateKey].push(event)
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{workspaceId ? `${workspaceId} Calendar` : `${dashboardId} Calendar`}</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {monthNames[month]} {year}
            </span>
            <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          {workspaceId
            ? `Calendar for workspace ${workspaceId} in ${dashboardId} dashboard`
            : `Calendar for ${dashboardId} dashboard`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {dayNames.map((day) => (
            <div key={day} className="text-center font-medium text-sm py-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => (
            <div
              key={`day-${index}`}
              className={`min-h-[80px] p-1 border rounded-md ${day === null ? "bg-muted/20" : "hover:bg-muted/50"} ${
                day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()
                  ? "bg-primary/10 border-primary/30"
                  : ""
              }`}
            >
              {day !== null && (
                <>
                  <div className="text-right text-sm font-medium">{day}</div>
                  <div className="mt-1 space-y-1">
                    {eventsByDate[day.toString()]?.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded truncate ${
                          event.type === "meeting"
                            ? "bg-blue-100 dark:bg-blue-900/30"
                            : event.type === "deadline"
                              ? "bg-red-100 dark:bg-red-900/30"
                              : event.type === "reminder"
                                ? "bg-yellow-100 dark:bg-yellow-900/30"
                                : "bg-green-100 dark:bg-green-900/30"
                        }`}
                      >
                        {event.time && <span className="mr-1 font-medium">{event.time}</span>}
                        {event.title}
                      </div>
                    ))}
                    {eventsByDate[day.toString()]?.length > 2 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{eventsByDate[day.toString()].length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Events list */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Upcoming Events</h3>
          <div className="space-y-2">
            {events
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .slice(0, 5)
              .map((event) => (
                <div key={event.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50">
                  <Badge
                    variant={
                      event.type === "meeting"
                        ? "default"
                        : event.type === "deadline"
                          ? "destructive"
                          : event.type === "reminder"
                            ? "outline"
                            : "secondary"
                    }
                  >
                    {event.type}
                  </Badge>
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {event.date.toLocaleDateString()} {event.time}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
