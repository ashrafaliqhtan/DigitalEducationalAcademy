"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Clock, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDebounce } from "@/hooks/use-debounce"
import { courseService } from "@/services/enhanced-course-service"
import { useNotificationHelpers } from "@/components/notifications/notification-system"
import { LoadingSpinner } from "@/components/loading/loading-manager"

interface SearchResult {
  id: string
  title: string
  description: string
  type: "course" | "product" | "service"
  category?: string
  price?: number
  rating?: number
  thumbnail?: string
}

interface SearchHistory {
  query: string
  timestamp: number
}

export function EnhancedSearch({
  placeholder = "Search courses, products, and services...",
  showHistory = true,
  onResultSelect,
}: {
  placeholder?: string
  showHistory?: boolean
  onResultSelect?: (result: SearchResult) => void
}) {
  const router = useRouter()
  const { error } = useNotificationHelpers()
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<SearchHistory[]>([])
  const [popularSearches] = useState([
    "Web Development",
    "Data Science",
    "UI/UX Design",
    "Academic Writing",
    "Research Methods",
  ])

  const debouncedQuery = useDebounce(query, 300)
  const searchRef = useRef<HTMLDivElement>(null)

  // Load search history from localStorage
  useEffect(() => {
    if (showHistory) {
      const savedHistory = localStorage.getItem("search-history")
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory))
        } catch (e) {
          console.error("Failed to parse search history:", e)
        }
      }
    }
  }, [showHistory])

  // Save search history to localStorage
  const saveToHistory = useCallback(
    (searchQuery: string) => {
      if (!showHistory || !searchQuery.trim()) return

      const newHistory = [
        { query: searchQuery, timestamp: Date.now() },
        ...history.filter((item) => item.query !== searchQuery),
      ].slice(0, 10) // Keep only last 10 searches

      setHistory(newHistory)
      localStorage.setItem("search-history", JSON.stringify(newHistory))
    },
    [history, showHistory],
  )

  // Perform search
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        // Search courses
        const courseResults = await courseService.searchCourses(searchQuery)

        if (courseResults.error) {
          error("Search Error", courseResults.error)
          return
        }

        // Transform course results
        const transformedResults: SearchResult[] = (courseResults.data || []).map((course) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          type: "course" as const,
          category: course.category?.name,
          price: course.price,
          rating: course.average_rating,
          thumbnail: course.thumbnail,
        }))

        setResults(transformedResults)
      } catch (err) {
        error("Search Failed", "An unexpected error occurred while searching")
        console.error("Search error:", err)
      } finally {
        setIsLoading(false)
      }
    },
    [error],
  )

  // Search when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery)
    } else {
      setResults([])
    }
  }, [debouncedQuery, performSearch])

  // Handle result selection
  const handleResultSelect = (result: SearchResult) => {
    saveToHistory(query)
    setIsOpen(false)
    setQuery("")

    if (onResultSelect) {
      onResultSelect(result)
    } else {
      // Default navigation
      switch (result.type) {
        case "course":
          router.push(`/courses/${result.id}`)
          break
        case "product":
          router.push(`/shop/product/${result.id}`)
          break
        case "service":
          router.push(`/services/${result.id}`)
          break
      }
    }
  }

  // Handle search submission
  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    saveToHistory(searchQuery)
    setIsOpen(false)
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(query)
            } else if (e.key === "Escape") {
              setIsOpen(false)
            }
          }}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("")
              setResults([])
            }}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <LoadingSpinner />
                <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
              </div>
            )}

            {!isLoading && query && results.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">No results found for "{query}"</div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="py-2">
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">Search Results</div>
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultSelect(result)}
                    className="w-full px-3 py-2 text-left hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {result.thumbnail && (
                        <img
                          src={result.thumbnail || "/placeholder.svg"}
                          alt={result.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{result.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{result.description}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {result.type}
                          </Badge>
                          {result.category && (
                            <Badge variant="secondary" className="text-xs">
                              {result.category}
                            </Badge>
                          )}
                          {result.price !== undefined && <span className="text-xs font-medium">${result.price}</span>}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!query && showHistory && (
              <div className="py-2">
                {history.length > 0 && (
                  <>
                    <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      Recent Searches
                    </div>
                    {history.slice(0, 5).map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(item.query)
                          handleSearch(item.query)
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-muted transition-colors text-sm"
                      >
                        {item.query}
                      </button>
                    ))}
                  </>
                )}

                <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b flex items-center gap-2">
                  <TrendingUp className="h-3 w-3" />
                  Popular Searches
                </div>
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(search)
                      handleSearch(search)
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-muted transition-colors text-sm"
                  >
                    {search}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
