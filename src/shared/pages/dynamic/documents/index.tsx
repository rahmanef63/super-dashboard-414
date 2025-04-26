"use client"
import type { FeatureManifest } from "@/shared/pages/types/manifest";
import { FileText } from "lucide-react";

export const manifest: FeatureManifest = {
  title: "Documents",
  url: "/documents",
  icon: FileText,
  description: "Manage and view documents dynamically",
  featureType: "dynamic",
};


import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DocumentsHeader } from "./components/documents-header"
import { DocumentsList } from "./components/documents-list"
import { DocumentsFilters } from "./components/documents-filters"
import { DocumentsEmpty } from "./components/documents-empty"
import { useDocumentsData } from "./hooks/use-documents-data"
import { DocumentsContext } from "./context/documents-context"
import { DEFAULT_FILTER_STATE } from "./constants"
import type { DocumentsSliceProps } from "./types"

export default function DocumentsSlice({ context }: DocumentsSliceProps) {
  console.log(`[DocumentsSlice] Rendering with context:`, context)

  // Validate required context properties
  const hasDashboardId = !!context.dashboardId

  if (!hasDashboardId) {
    console.error("[DocumentsSlice] Missing required context.dashboardId")
  }

  const { dashboardId, workspaceId, menuId } = context
  console.log(
    `[DocumentsSlice] Using dashboardId: ${dashboardId}, workspaceId: ${workspaceId || "none"}, menuId: ${menuId || "none"}`,
  )

  const { documents, isLoading, error, addDocument, updateDocument, deleteDocument } = hasDashboardId
    ? useDocumentsData(context)
    : {
        documents: [],
        isLoading: false,
        error: null,
        addDocument: async () => {},
        updateDocument: async () => {},
        deleteDocument: async () => {},
      }
  const [filters, setFilters] = useState(DEFAULT_FILTER_STATE)
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null)

  // Log when data is loaded
  useEffect(() => {
    if (!isLoading && !error && hasDashboardId) {
      console.log(
        `[DocumentsSlice] Loaded ${documents.length} documents for ${workspaceId ? `workspace ${workspaceId}` : `dashboard ${dashboardId}`}`,
      )
    }
  }, [isLoading, error, documents, dashboardId, workspaceId, hasDashboardId])

  // Apply filters to documents
  const filteredDocuments = documents.filter((document) => {
    // Filter by type
    if (filters.type !== "all" && document.type !== filters.type) {
      return false
    }

    // Filter by search term
    if (filters.searchTerm && !document.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false
    }

    return true
  })

  if (!hasDashboardId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents Error</CardTitle>
          <CardDescription>Missing required context properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-md bg-destructive/10 text-destructive">
            <h3 className="font-semibold mb-2">Configuration Error</h3>
            <p>The Documents slice requires a dashboardId in the context.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    console.log(`[DocumentsSlice] Loading documents...`)
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent className="p-6">
          <Skeleton className="h-10 w-full mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    console.error(`[DocumentsSlice] Error loading documents:`, error)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents Error</CardTitle>
          <CardDescription>There was a problem loading the documents.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-md bg-destructive/10 text-destructive">
            <h3 className="font-semibold mb-2">Error loading documents</h3>
            <p>{error.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  console.log(
    `[DocumentsSlice] Rendering ${filteredDocuments.length} filtered documents out of ${documents.length} total documents`,
  )

  return (
    <DocumentsContext.Provider
      value={{
        documents: filteredDocuments,
        filters,
        setFilters,
        addDocument,
        updateDocument,
        deleteDocument,
        selectedDocumentId,
        setSelectedDocumentId,
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{workspaceId ? `${workspaceId} Documents` : `${dashboardId} Documents`}</CardTitle>
          <CardDescription>
            Manage your documents for {workspaceId ? `workspace ${workspaceId}` : `dashboard ${dashboardId}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <DocumentsHeader context={{ dashboardId, workspaceId, menuId }} totalDocuments={documents.length} />

          <DocumentsFilters />

          {filteredDocuments.length > 0 ? (
            <DocumentsList documents={filteredDocuments} />
          ) : (
            <DocumentsEmpty searchTerm={filters.searchTerm} />
          )}
        </CardContent>
      </Card>
    </DocumentsContext.Provider>
  )
}
