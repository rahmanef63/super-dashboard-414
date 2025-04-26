"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, File, Table, BarChart2, ImageIcon, Download } from "lucide-react"
import { formatFileSize, formatDate } from "../lib/documents-utils"
import type { Document } from "../types"

interface DocumentPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: Document
}

export function DocumentPreviewDialog({ open, onOpenChange, document }: DocumentPreviewDialogProps) {
  const getDocumentIcon = () => {
    switch (document.type) {
      case "pdf":
        return <FileText className="h-12 w-12 text-red-500" />
      case "doc":
        return <File className="h-12 w-12 text-blue-500" />
      case "spreadsheet":
        return <Table className="h-12 w-12 text-green-500" />
      case "presentation":
        return <BarChart2 className="h-12 w-12 text-yellow-500" />
      case "image":
        return <ImageIcon className="h-12 w-12 text-purple-500" />
      default:
        return <File className="h-12 w-12 text-gray-500" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Document Preview</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-8">
          {document.type === "image" && document.thumbnail ? (
            <img
              src={document.thumbnail || "/placeholder.svg"}
              alt={document.title}
              className="max-h-[300px] object-contain mb-4"
            />
          ) : (
            <div className="flex flex-col items-center justify-center mb-4">
              {getDocumentIcon()}
              <div className="mt-4 p-8 border rounded-md bg-muted/50 text-center">
                <p className="text-muted-foreground">Preview not available for this document type</p>
              </div>
            </div>
          )}

          <div className="w-full mt-4">
            <h3 className="font-semibold text-lg">{document.title}</h3>

            {document.description && <p className="text-sm text-muted-foreground mt-2">{document.description}</p>}

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm font-medium">Type</p>
                <p className="text-sm text-muted-foreground">{document.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Size</p>
                <p className="text-sm text-muted-foreground">{formatFileSize(document.size)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">{formatDate(document.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Updated</p>
                <p className="text-sm text-muted-foreground">{formatDate(document.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={() => window.open(document.url, "_blank")}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
