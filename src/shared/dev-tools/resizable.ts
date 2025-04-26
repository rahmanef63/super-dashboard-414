import type React from "react"

export interface ResizableOptions {
  /**
   * Default size in pixels
   */
  defaultSize: number

  /**
   * Minimum size in pixels
   */
  minSize: number

  /**
   * Maximum size in pixels
   */
  maxSize: number

  /**
   * Direction of resizing
   */
  direction: "horizontal" | "vertical"

  /**
   * Callback when size changes
   */
  onSizeChange?: (size: number) => void
}

export interface ResizableState {
  /**
   * Current size in pixels
   */
  size: number

  /**
   * Whether the component is currently being resized
   */
  isResizing: boolean

  /**
   * Reference to the resizable container element
   */
  resizeContainerRef: React.RefObject<HTMLDivElement>

  /**
   * Handler for starting the resize operation
   */
  handleResizeStart: (e: React.MouseEvent | React.TouchEvent) => void
}

export interface ResizableSectionProps {
  children: React.ReactNode
  defaultHeight?: number
  minHeight?: number
  maxHeight?: number
  className?: string
  id?: string
  onResize?: (height: number) => void
}
