"use client"

import { useEffect } from "react"
import { useDevTools } from "../dev-tools-provider"

export function ConsoleLogger() {
  const { isOpen } = useDevTools()

  useEffect(() => {
    if (!isOpen) return

    // Log that the console logger is active
    console.log("🔍 Console Logger activated - all console output will be captured in the Dev Tools")

    // Test logs for demonstration
    setTimeout(() => {
      console.log("This is a standard log message")
      console.info("This is an info message with data", { user: "test", id: 123 })
      console.warn("This is a warning message")
      console.error("This is an error message", new Error("Test error"))
      console.debug("This is a debug message")
    }, 1000)
  }, [isOpen])

  return null // This is a utility component with no UI
}
