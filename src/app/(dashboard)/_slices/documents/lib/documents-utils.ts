import type { Document, DocumentType } from "../types"
import { DOCUMENT_EXTENSIONS } from "../constants"

/**
 * Generates mock documents for testing
 */
export function generateMockDocuments(dashboardId: string, workspaceId?: string): Document[] {
  const count = Math.floor(Math.random() * 10) + 5 // 5-15 documents
  const documents: Document[] = []

  const types: DocumentType[] = ["pdf", "doc", "image", "spreadsheet", "presentation", "other"]

  const contextPrefix = workspaceId ? `${workspaceId} workspace` : `${dashboardId} dashboard`

  for (let i = 0; i < count; i++) {
    const createdDate = new Date()
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30)) // 0-30 days ago

    const type = types[Math.floor(Math.random() * types.length)]
    const extension = DOCUMENT_EXTENSIONS[type]

    documents.push({
      id: `doc-${i}-${Date.now()}`,
      title: `${contextPrefix} document ${i + 1}${extension}`,
      description: `This is a ${type} document for the ${contextPrefix}`,
      type,
      size: getRandomFileSize(), // Use the random size function
      url: `/documents/${dashboardId}/${type}-${i}${extension}`,
      createdAt: createdDate.toISOString(),
      updatedAt: createdDate.toISOString(),
      tags: ["sample", contextPrefix.split(" ")[0]],
    })
  }

  return documents
}

/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

/**
 * Format file size to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

/**
 * Get file icon based on document type
 */
export function getFileIcon(type: DocumentType): string {
  switch (type) {
    case "pdf":
      return "file-text"
    case "doc":
      return "file-text"
    case "image":
      return "image"
    case "spreadsheet":
      return "file-spreadsheet"
    case "presentation":
      return "file-presentation"
    default:
      return "file"
  }
}

/**
 * Get relative time string (e.g., "2 days ago")
 */
export function getRelativeTimeString(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()

  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"

  if (diffDays < 30) {
    return `${diffDays} days ago`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} ${months === 1 ? "month" : "months"} ago`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years} ${years === 1 ? "year" : "years"} ago`
  }
}

/**
 * Generates a random file size between 1KB and 10MB
 */
export function getRandomFileSize(): number {
  return Math.floor(Math.random() * (10 * 1024 * 1024 - 1024 + 1)) + 1024 // 1KB to 10MB
}
