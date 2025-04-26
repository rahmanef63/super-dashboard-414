import { FileQuestion } from "lucide-react"

interface DocumentsEmptyProps {
  searchTerm?: string
}

export function DocumentsEmpty({ searchTerm }: DocumentsEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />

      {searchTerm ? (
        <>
          <h3 className="text-lg font-medium">No matching documents found</h3>
          <p className="text-sm text-muted-foreground mt-1">No documents match your search for "{searchTerm}"</p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-medium">No documents yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Upload your first document to get started</p>
        </>
      )}
    </div>
  )
}
