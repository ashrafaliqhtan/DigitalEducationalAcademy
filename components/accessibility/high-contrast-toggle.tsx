"use client"

import { useState, useEffect } from "react"
import { Sun, Moon, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function HighContrastToggle() {
  const { theme, setTheme } = useTheme()
  const [isHighContrast, setIsHighContrast] = useState(false)
  const [mounted, setMounted] = useState(false)

  // After mounting, we can safely access localStorage
  useEffect(() => {
    setMounted(true)
    const savedHighContrast = localStorage.getItem("high-contrast") === "true"
    setIsHighContrast(savedHighContrast)

    if (savedHighContrast) {
      document.documentElement.classList.add("high-contrast")
    }
  }, [])

  const toggleHighContrast = () => {
    const newValue = !isHighContrast
    setIsHighContrast(newValue)
    localStorage.setItem("high-contrast", String(newValue))

    if (newValue) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
          <Eye className="h-4 w-4" />
          <span className="sr-only">Toggle accessibility options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="h-4 w-4 mr-2" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="h-4 w-4 mr-2" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleHighContrast}>
          <Eye className="h-4 w-4 mr-2" />
          {isHighContrast ? "Disable" : "Enable"} High Contrast
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
