import { DocumentItem } from "./document-item"
import type { Document } from "../types"

interface DocumentsListProps {
  documents: Document[]
}

export function DocumentsList({ documents }: DocumentsListProps) {
  return (
    <div className="space-y-3">
      {documents.map((document) => (
        <DocumentItem key={document.id} document={document} />
      ))}
    </div>
  )
}
