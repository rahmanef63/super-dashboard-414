"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDocumentsContext } from "../context/documents-context"
import { DOCUMENT_TYPE_OPTIONS } from "../constants"
import { getRandomFileSize } from "../lib/documents-utils"
import type { Document } from "../types"

interface DocumentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document?: Document
  context?: {
    dashboardId: string
    workspaceId?: string
    menuId?: string
  }
}

type FormValues = {
  title: string
  description: string
  type: Document["type"]
  tags: string
}

export function DocumentFormDialog({ open, onOpenChange, document, context }: DocumentFormDialogProps) {
  const { addDocument, updateDocument } = useDocumentsContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!document

  const form = useForm<FormValues>({
    defaultValues: {
      title: document?.title || "",
      description: document?.description || "",
      type: document?.type || "pdf",
      tags: document?.tags?.join(", ") || "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)

    try {
      const documentData = {
        title: values.title,
        description: values.description,
        type: values.type,
        tags: values.tags
          ? values.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : undefined,
        size: document?.size || getRandomFileSize(),
        status: document?.status || "draft",
        url: document?.url || `https://example.com/documents/${Date.now()}`,
        thumbnail: document?.thumbnail,
      }

      if (isEditing && document) {
        await updateDocument(document.id, documentData)
      } else {
        await addDocument(documentData)
      }

      onOpenChange(false)
    } catch (error) {
      console.error("Error saving document:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Document" : "Upload Document"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Document title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Document description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DOCUMENT_TYPE_OPTIONS.slice(1).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tags separated by commas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEditing && (
              <FormItem>
                <FormLabel>File</FormLabel>
                <FormControl>
                  <Input type="file" disabled={isSubmitting} />
                </FormControl>
                <p className="text-xs text-muted-foreground">Upload a file (not functional in this demo)</p>
              </FormItem>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEditing ? "Update Document" : "Upload Document"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
