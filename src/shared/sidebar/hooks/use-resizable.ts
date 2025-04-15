"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface UseResizableOptions {
  defaultHeight: number
  minHeight: number
  maxHeight: number
  onResize?: (height: number) => void
}

export function useResizable({ defaultHeight, minHeight, maxHeight, onResize }: UseResizableOptions) {
  const [height, setHeight] = useState(defaultHeight)
  const [isDragging, setIsDragging] = useState(false)
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

  return {
    height,
    isDragging,
    handleMouseDown,
    handleTouchStart,
  }
}
