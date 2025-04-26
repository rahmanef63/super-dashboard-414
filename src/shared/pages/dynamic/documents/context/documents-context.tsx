"use client"

import { createContext, useContext } from "react"
import type { DocumentsContextType } from "../types"

// Create the context with a default value
export const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined)

// Custom hook to use the documents context
export function useDocumentsContext() {
  const context = useContext(DocumentsContext)
  if (context === undefined) {
    throw new Error("useDocumentsContext must be used within a DocumentsContext.Provider")
  }
  return context
}
