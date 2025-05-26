"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, BookOpen, Users, FileText, ShoppingBag, Star, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchResult {
  id: string
  type: "course" | "instructor" | "article" | "product"
  title: string
  description: string
  thumbnail?: string
  price?: number
  rating?: number
  category?: string
  level?: string
  instructor?: string
  url: string
}

interface SearchFilters {
  type: string[]
  category: string[]
  level: string[]
  priceRange: [number, number]
  rating: number
  duration: string
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedResult, setSelectedResult] = useState(-1)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    category: [],
    level: [],
    priceRange: [0, 500],
    rating: 0,
    duration: "all",
  })

  const debouncedQuery = useDebounce(query, 300)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // Mock search function - replace with real API
  const performSearch = async (searchQuery: string, searchFilters: SearchFilters) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const mockResults: SearchResult[] = [
      {
        id: "1",
        type: "course",
        title: "Advanced React Development",
        description: "Master React with hooks, context, and advanced patterns",
        thumbnail: "/placeholder.svg?height=60&width=80",
        price: 149.99,
        rating: 4.8,
        category: "Programming",
        level: "Advanced",
        instructor: "John Smith",
        url: "/courses/advanced-react",
      },
      {
        id: "2",
        type: "course",
        title: "UI/UX Design Fundamentals",
        description: "Learn the principles of user interface and experience design",
        thumbnail: "/placeholder.svg?height=60&width=80",
        price: 99.99,
        rating: 4.6,
        category: "Design",
        level: "Beginner",
        instructor: "Sarah Johnson",
        url: "/courses/ui-ux-fundamentals",
      },
      {
        id: "3",
        type: "instructor",
        title: "Dr. Ahmed Al-Farsi",
        description: "Professor of Computer Science with 15+ years experience",
        thumbnail: "/placeholder.svg?height=60&width=60",
        category: "Programming",
        url: "/instructors/ahmed-al-farsi",
      },
      {
        id: "4",
        type: "article",
        title: "Best Practices for Modern Web Development",
        description: "Essential guidelines for building scalable web applications",
        url: "/blog/modern-web-development",
      },
      {
        id: "5",
        type: "product",
        title: "Complete Web Development Toolkit",
        description: "Essential tools and resources for web developers",
        thumbnail: "/placeholder.svg?height=60&width=80",
        price: 29.99,
        rating: 4.5,
        url: "/shop/web-dev-toolkit",
      },
    ]

    // Apply filters
    const filteredResults = mockResults.filter((result) => {
      const matchesQuery =
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = searchFilters.type.length === 0 || searchFilters.type.includes(result.type)
      const matchesCategory =
        searchFilters.category.length === 0 || (result.category && searchFilters.category.includes(result.category))
      const matchesLevel =
        searchFilters.level.length === 0 || (result.level && searchFilters.level.includes(result.level))
      const matchesPrice =
        !result.price || (result.price >= searchFilters.priceRange[0] && result.price <= searchFilters.priceRange[1])
      const matchesRating = !result.rating || result.rating >= searchFilters.rating

      return matchesQuery && matchesType && matchesCategory && matchesLevel && matchesPrice && matchesRating
    })

    setResults(filteredResults)
    setIsLoading(false)
  }

  useEffect(() => {
    performSearch(debouncedQuery, filters)
  }, [debouncedQuery, filters])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen(true)
      }

      if (isOpen) {
        if (e.key === "Escape") {
          setIsOpen(false)
          setSelectedResult(-1)
        } else if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelectedResult((prev) => Math.min(prev + 1, results.length - 1))
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelectedResult((prev) => Math.max(prev - 1, -1))
        } else if (e.key === "Enter" && selectedResult >= 0) {
          e.preventDefault()
          router.push(results[selectedResult].url)
          setIsOpen(false)
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, results, selectedResult, router])

  const getResultIcon = (type: string) => {
    switch (type) {
      case "course":
        return <BookOpen className="h-4 w-4" />
      case "instructor":
        return <Users className="h-4 w-4" />
      case "article":
        return <FileText className="h-4 w-4" />
      case "product":
        return <ShoppingBag className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "course":
        return "bg-blue-100 text-blue-800"
      case "instructor":
        return "bg-green-100 text-green-800"
      case "article":
        return "bg-purple-100 text-purple-800"
      case "product":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative w-full max-w-sm justify-start text-muted-foreground">
          <Search className="mr-2 h-4 w-4" />
          Search courses, instructors...
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="sr-only">Global Search</DialogTitle>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Search for anything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-4"
                autoFocus
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(showFilters && "bg-muted")}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 border-r bg-muted/20 p-4">
              <ScrollArea className="h-full">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Content Type</h4>
                    <div className="space-y-2">
                      {["course", "instructor", "article", "product"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={filters.type.includes(type)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFilter("type", [...filters.type, type])
                              } else {
                                updateFilter(
                                  "type",
                                  filters.type.filter((t) => t !== type),
                                )
                              }
                            }}
                          />
                          <label htmlFor={type} className="text-sm capitalize">
                            {type}s
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Category</h4>
                    <div className="space-y-2">
                      {["Programming", "Design", "Marketing", "Business"].map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={filters.category.includes(category)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFilter("category", [...filters.category, category])
                              } else {
                                updateFilter(
                                  "category",
                                  filters.category.filter((c) => c !== category),
                                )
                              }
                            }}
                          />
                          <label htmlFor={category} className="text-sm">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Level</h4>
                    <div className="space-y-2">
                      {["Beginner", "Intermediate", "Advanced"].map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox
                            id={level}
                            checked={filters.level.includes(level)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFilter("level", [...filters.level, level])
                              } else {
                                updateFilter(
                                  "level",
                                  filters.level.filter((l) => l !== level),
                                )
                              }
                            }}
                          />
                          <label htmlFor={level} className="text-sm">
                            {level}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Price Range</h4>
                    <div className="space-y-3">
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => updateFilter("priceRange", value as [number, number])}
                        max={500}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${filters.priceRange[0]}</span>
                        <span>${filters.priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Minimum Rating</h4>
                    <Select
                      value={filters.rating.toString()}
                      onValueChange={(value) => updateFilter("rating", Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any Rating</SelectItem>
                        <SelectItem value="3">3+ Stars</SelectItem>
                        <SelectItem value="4">4+ Stars</SelectItem>
                        <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 bg-muted rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {results.map((result, index) => (
                    <Card
                      key={result.id}
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-muted/50",
                        selectedResult === index && "bg-muted",
                      )}
                      onClick={() => {
                        router.push(result.url)
                        setIsOpen(false)
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          {result.thumbnail && (
                            <img
                              src={result.thumbnail || "/placeholder.svg"}
                              alt={result.title}
                              className="w-16 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {getResultIcon(result.type)}
                              <Badge variant="outline" className={getTypeColor(result.type)}>
                                {result.type}
                              </Badge>
                              {result.category && <Badge variant="outline">{result.category}</Badge>}
                              {result.level && <Badge variant="outline">{result.level}</Badge>}
                            </div>
                            <h3 className="font-medium truncate">{result.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{result.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              {result.instructor && (
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {result.instructor}
                                </span>
                              )}
                              {result.rating && (
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  {result.rating}
                                </span>
                              )}
                              {result.price && <span className="font-medium text-foreground">${result.price}</span>}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : query ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Start searching</h3>
                <p className="text-muted-foreground">Find courses, instructors, articles, and more</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
