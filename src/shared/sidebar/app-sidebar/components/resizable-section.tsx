"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import type { ResizableSectionProps } from "../../../dev-tools/resizable"

export function ResizableSection({
  children,
  defaultHeight = 200,
  minHeight = 100,
  maxHeight = 500,
  className,
  id,
  onResize,
}: ResizableSectionProps) {
  const [height, setHeight] = useState(defaultHeight)
  const [isDragging, setIsDragging] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef<number>(0)
  const startHeightRef = useRef<number>(0)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
    startYRef.current = e.clientY
    startHeightRef.current = height
    document.body.style.cursor = "ns-resize"
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
    startYRef.current = e.touches[0].clientY
    startHeightRef.current = height
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const delta = e.clientY - startYRef.current
      const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeightRef.current + delta))
      setHeight(newHeight)

      if (onResize) {
        onResize(newHeight)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return

      const delta = e.touches[0].clientY - startYRef.current
      const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeightRef.current + delta))
      setHeight(newHeight)

      if (onResize) {
        onResize(newHeight)
      }
    }

    const handleEnd = () => {
      setIsDragging(false)
      document.body.style.cursor = ""
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("touchmove", handleTouchMove)
      document.addEventListener("mouseup", handleEnd)
      document.addEventListener("touchend", handleEnd)
      document.addEventListener("touchcancel", handleEnd)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("mouseup", handleEnd)
      document.removeEventListener("touchend", handleEnd)
      document.removeEventListener("touchcancel", handleEnd)
      document.body.style.cursor = ""
    }
  }, [isDragging, minHeight, maxHeight, onResize])

  return (
    <div ref={sectionRef} id={id} className={cn("relative", className)} style={{ height: `${height}px` }}>
      {children}
      <div
        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-transparent hover:bg-primary/10"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      />
    </div>
  )
}
