"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function KeyboardNavigation() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input, textarea, etc.
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLSelectElement ||
        document.activeElement?.getAttribute("contenteditable") === "true"
      ) {
        return
      }

      // Alt + key shortcuts
      if (e.altKey) {
        switch (e.key) {
          case "h":
            // Go to home
            e.preventDefault()
            router.push("/")
            toast({
              title: "Navigation",
              description: "Navigating to Home page",
              duration: 1500,
            })
            break

          case "c":
            // Go to courses
            e.preventDefault()
            router.push("/courses")
            toast({
              title: "Navigation",
              description: "Navigating to Courses page",
              duration: 1500,
            })
            break

          case "p":
            // Go to profile
            e.preventDefault()
            router.push("/profile")
            toast({
              title: "Navigation",
              description: "Navigating to Profile page",
              duration: 1500,
            })
            break

          case "s":
            // Go to search
            e.preventDefault()
            // Focus search input
            const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
            if (searchInput) {
              searchInput.focus()
              toast({
                title: "Navigation",
                description: "Search focused",
                duration: 1500,
              })
            }
            break

          case "?":
            // Show keyboard shortcuts help
            e.preventDefault()
            toast({
              title: "Keyboard Shortcuts",
              description: "Alt+H: Home, Alt+C: Courses, Alt+P: Profile, Alt+S: Search, Alt+?: Help",
              duration: 5000,
            })
            break
        }
      }

      // Handle skip to content with Tab
      if (e.key === "Tab" && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
        const skipLink = document.getElementById("skip-to-content")
        if (skipLink && document.activeElement === document.body) {
          e.preventDefault()
          skipLink.focus()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [router, toast])

  return null
}
