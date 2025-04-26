"use client"

import type React from "react"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDocumentsContext } from "../context/documents-context"
import { DOCUMENT_TYPE_OPTIONS } from "../constants"

export function DocumentsFilters() {
  const { filters, setFilters } = useDocumentsContext()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchTerm: e.target.value })
  }

  const handleTypeChange = (value: string) => {
    setFilters({
      ...filters,
      type: value as "all" | "pdf" | "doc" | "spreadsheet" | "presentation" | "image" | "other",
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search documents..."
          className="pl-8"
          value={filters.searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="flex gap-3">
        <Select value={filters.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Document Type" />
          </SelectTrigger>
          <SelectContent>
            {DOCUMENT_TYPE_OPTIONS.map((option) => (
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
