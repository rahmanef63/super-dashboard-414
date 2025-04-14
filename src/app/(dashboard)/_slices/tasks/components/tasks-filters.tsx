"use client"

import type React from "react"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTasksContext } from "../context/tasks-context"
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from "../constants"

export function TasksFilters() {
  const { filters, setFilters } = useTasksContext()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchTerm: e.target.value })
  }

  const handleStatusChange = (value: string) => {
    setFilters({
      ...filters,
      status: value as "all" | "pending" | "in_progress" | "completed" | "cancelled",
    })
  }

  const handlePriorityChange = (value: string) => {
    setFilters({
      ...filters,
      priority: value as "all" | "low" | "medium" | "high" | "urgent",
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search tasks..."
          className="pl-8"
          value={filters.searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="flex gap-3">
        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {TASK_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.priority} onValueChange={handlePriorityChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {TASK_PRIORITY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
