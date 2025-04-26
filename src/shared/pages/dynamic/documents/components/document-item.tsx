"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, File, Table, BarChart2, ImageIcon, Download, Edit, Trash2, MoreHorizontal, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useDocumentsContext } from "../context/documents-context"
import { DocumentFormDialog } from "./document-form-dialog"
import { DocumentPreviewDialog } from "./document-preview-dialog"
import { DOCUMENT_TYPE_COLORS } from "../constants"
import { formatFileSize, formatDate } from "../lib/documents-utils"
import type { Document } from "../types"

interface DocumentItemProps {
  document: Document
}

export function DocumentItem({ document }: DocumentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const { deleteDocument } = useDocumentsContext()

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this document?")) {
      deleteDocument(document.id)
    }
  }

  const getDocumentIcon = () => {
    switch (document.type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "doc":
        return <File className="h-5 w-5 text-blue-500" />
      case "spreadsheet":
        return <Table className="h-5 w-5 text-green-500" />
      case "presentation":
        return <BarChart2 className="h-5 w-5 text-yellow-500" />
      case "image":
        return <ImageIcon className="h-5 w-5 text-purple-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-md border bg-card">
      <div className="flex-shrink-0 mt-1">{getDocumentIcon()}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-sm">{document.title}</h3>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className={cn("text-xs", DOCUMENT_TYPE_COLORS[document.type])}>
              {document.type}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsPreviewOpen(true)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(document.url, "_blank")}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {document.description && <p className="text-sm text-muted-foreground mt-1">{document.description}</p>}

        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-xs text-muted-foreground">{formatFileSize(document.size)}</span>
          <span className="text-xs text-muted-foreground">Updated {formatDate(document.updatedAt)}</span>

          {document.tags && document.tags.length > 0 && (
            <div className="flex gap-1">
              {document.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {isEditing && <DocumentFormDialog open={isEditing} onOpenChange={setIsEditing} document={document} />}

      {isPreviewOpen && (
        <DocumentPreviewDialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen} document={document} />
      )}
    </div>
  )
}
