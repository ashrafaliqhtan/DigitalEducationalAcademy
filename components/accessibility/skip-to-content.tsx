"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function SkipToContent() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Button
      id="skip-to-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
      onClick={() => {
        // Find the main content area
        const mainContent = document.querySelector("main")
        if (mainContent) {
          // Set tabindex to make it focusable
          mainContent.setAttribute("tabindex", "-1")
          mainContent.focus()
          // Remove tabindex after focus
          setTimeout(() => {
            mainContent.removeAttribute("tabindex")
          }, 1000)
        }
      }}
    >
      Skip to content
    </Button>
  )
}
