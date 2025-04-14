"use client"

import { useState, useEffect } from "react"

interface WindowSize {
  width: number
  height: number
  breakpoint: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
}

// Tailwind breakpoints
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    breakpoint: "xs",
  })

  useEffect(() => {
    // Only execute this on the client
    if (typeof window === "undefined") return

    function getBreakpoint(width: number): "xs" | "sm" | "md" | "lg" | "xl" | "2xl" {
      if (width < breakpoints.sm) return "xs"
      if (width < breakpoints.md) return "sm"
      if (width < breakpoints.lg) return "md"
      if (width < breakpoints.xl) return "lg"
      if (width < breakpoints["2xl"]) return "xl"
      return "2xl"
    }

    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        breakpoint: getBreakpoint(window.innerWidth),
      })
    }

    // Set size at the first client-side load
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}
