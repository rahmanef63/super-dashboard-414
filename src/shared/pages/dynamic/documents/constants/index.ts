import type { DocumentFilters } from "../types"

export const DEFAULT_FILTER_STATE: DocumentFilters = {
  type: "all",
  searchTerm: "",
}

export const DOCUMENT_TYPE_OPTIONS = [
  { label: "All", value: "all" },
  { label: "PDF", value: "pdf" },
  { label: "Document", value: "doc" },
  { label: "Image", value: "image" },
  { label: "Spreadsheet", value: "spreadsheet" },
  { label: "Presentation", value: "presentation" },
  { label: "Other", value: "other" },
]

export const DOCUMENT_TYPE_COLORS = {
  pdf: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  doc: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  image: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  spreadsheet: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  presentation: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
}

export const DOCUMENT_TYPE_ICONS = {
  pdf: "file-text",
  doc: "file-text",
  image: "image",
  spreadsheet: "file-spreadsheet",
  presentation: "file-presentation",
  other: "file",
}

export const DOCUMENT_EXTENSIONS = {
  pdf: ".pdf",
  doc: ".docx",
  image: ".jpg",
  spreadsheet: ".xlsx",
  presentation: ".pptx",
  other: ".txt",
}
