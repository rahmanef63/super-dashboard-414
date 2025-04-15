"use client"

import { useState } from "react"

export function useMenuItemState() {
  // Track open state for each menu item
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  // Toggle open state for a specific item
  const toggleItem = (title: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return { openItems, toggleItem }
}
