"use client"

import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { DocumentFormDialog } from "./document-form-dialog"

interface DocumentsHeaderProps {
  context: {
    dashboardId: string
    workspaceId?: string
    menuId?: string
  }
  totalDocuments: number
}

export function DocumentsHeader({ context, totalDocuments }: DocumentsHeaderProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { dashboardId, workspaceId } = context

  const title = workspaceId ? `${workspaceId} Documents` : `${dashboardId} Documents`

  return (
    <div className="flex flex-col gap-2 mb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button onClick={() => setIsFormOpen(true)} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <div className="flex items-center text-sm text-muted-foreground">
        <span>
          {totalDocuments} document{totalDocuments !== 1 ? "s" : ""} available
        </span>
      </div>

      {isFormOpen && <DocumentFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} context={context} />}
    </div>
  )
}
