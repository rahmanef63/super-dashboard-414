"use client"

import { useState, useEffect } from "react"
import { generateMockDocuments } from "../lib/documents-utils"
import type { Document, DocumentsContext } from "../types"

export function useDocumentsData(context: DocumentsContext) {
  const { dashboardId, workspaceId } = context
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true)
        // In a real app, this would be an API call
        // For now, we'll use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const mockDocuments = generateMockDocuments(dashboardId, workspaceId)
        setDocuments(mockDocuments)
        setError(null)
      } catch (err) {
        console.error("Error fetching documents:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch documents"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [dashboardId, workspaceId])

  const addDocument = async (document: Omit<Document, "id" | "createdAt" | "updatedAt">) => {
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newDocument: Document = {
        id: `doc-${Date.now()}`,
        ...document,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setDocuments((prevDocuments) => [newDocument, ...prevDocuments])
    } catch (err) {
      console.error("Error adding document:", err)
      throw err
    }
  }

  const updateDocument = async (id: string, documentUpdate: Partial<Document>) => {
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setDocuments((prevDocuments) =>
        prevDocuments.map((document) =>
          document.id === id
            ? {
                ...document,
                ...documentUpdate,
                updatedAt: new Date().toISOString(),
              }
            : document,
        ),
      )
    } catch (err) {
      console.error("Error updating document:", err)
      throw err
    }
  }

  const deleteDocument = async (id: string) => {
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setDocuments((prevDocuments) => prevDocuments.filter((document) => document.id !== id))
    } catch (err) {
      console.error("Error deleting document:", err)
      throw err
    }
  }

  return {
    documents,
    isLoading,
    error,
    addDocument,
    updateDocument,
    deleteDocument,
  }
}
