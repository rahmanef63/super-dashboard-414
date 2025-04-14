export interface DocumentsContext {
  dashboardId: string
  workspaceId?: string
  menuId?: string
  userId?: string
  [key: string]: any
}

export interface DocumentsSliceProps {
  context: DocumentsContext
}

export type DocumentType = "pdf" | "doc" | "image" | "spreadsheet" | "presentation" | "other"
export type DocumentStatus = "draft" | "published" | "archived"

export interface Document {
  id: string
  title: string
  description?: string
  type: DocumentType
  status?: DocumentStatus
  size: number
  url: string
  thumbnail?: string
  createdAt: string
  updatedAt: string
  createdBy?: string
  tags?: string[]
}

export interface DocumentFilters {
  type: DocumentType | "all"
  searchTerm: string
}

export interface DocumentsContextType {
  documents: Document[]
  filters: DocumentFilters
  setFilters: (filters: DocumentFilters) => void
  addDocument: (document: Omit<Document, "id" | "createdAt" | "updatedAt">) => Promise<void>
  updateDocument: (id: string, document: Partial<Document>) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
  selectedDocumentId: string | null
  setSelectedDocumentId: (id: string | null) => void
}
