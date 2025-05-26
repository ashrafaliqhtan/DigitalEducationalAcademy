"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter, SortAsc, SortDesc, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { useLanguage } from "@/contexts/language-context"

interface SearchFilters {
  query: string
  category: string[]
  level: string[]
  duration: [number, number]
  price: [number, number]
  rating: number
  language: string[]
  instructor: string
  sortBy: string
  sortOrder: "asc" | "desc"
}

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void
  totalResults: number
}

export default function AdvancedSearch({ onFiltersChange, totalResults }: AdvancedSearchProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get("q") || "",
    category: searchParams.getAll("category") || [],
    level: searchParams.getAll("level") || [],
    duration: [0, 100],
    price: [0, 500],
    rating: 0,
    language: searchParams.getAll("lang") || [],
    instructor: searchParams.get("instructor") || "",
    sortBy: searchParams.get("sort") || "relevance",
    sortOrder: (searchParams.get("order") as "asc" | "desc") || "desc",
  })

  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const categories = [
    { value: "programming", label: t("courses.categories.programming") },
    { value: "research", label: t("courses.categories.research") },
    { value: "design", label: t("courses.categories.design") },
    { value: "writing", label: t("courses.categories.writing") },
    { value: "business", label: t("courses.categories.business") },
    { value: "marketing", label: t("courses.categories.marketing") },
  ]

  const levels = [
    { value: "beginner", label: t("courses.levels.beginner") },
    { value: "intermediate", label: t("courses.levels.intermediate") },
    { value: "advanced", label: t("courses.levels.advanced") },
  ]

  const languages = [
    { value: "en", label: "English" },
    { value: "ar", label: "العربية" },
    { value: "fr", label: "Français" },
    { value: "es", label: "Español" },
  ]

  const sortOptions = [
    { value: "relevance", label: t("search.sort.relevance") },
    { value: "newest", label: t("search.sort.newest") },
    { value: "oldest", label: t("search.sort.oldest") },
    { value: "price", label: t("search.sort.price") },
    { value: "rating", label: t("search.sort.rating") },
    { value: "popularity", label: t("search.sort.popularity") },
  ]

  useEffect(() => {
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const toggleArrayFilter = (key: "category" | "level" | "language", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((item) => item !== value) : [...prev[key], value],
    }))
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      category: [],
      level: [],
      duration: [0, 100],
      price: [0, 500],
      rating: 0,
      language: [],
      instructor: "",
      sortBy: "relevance",
      sortOrder: "desc",
    })
  }

  const hasActiveFilters =
    filters.category.length > 0 ||
    filters.level.length > 0 ||
    filters.language.length > 0 ||
    filters.rating > 0 ||
    filters.instructor !== ""

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search.placeholder")}
            value={filters.query}
            onChange={(e) => updateFilter("query", e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setIsFiltersOpen(!isFiltersOpen)} className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          {t("search.filters")}
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
              {filters.category.length +
                filters.level.length +
                filters.language.length +
                (filters.rating > 0 ? 1 : 0) +
                (filters.instructor ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </div>

      {/* Results Summary and Sort */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{t("search.resultsFound", { count: totalResults })}</p>
        <div className="flex items-center gap-2">
          <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateFilter("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc")}
          >
            {filters.sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.category.map((cat) => (
            <Badge key={cat} variant="secondary" className="gap-1">
              {categories.find((c) => c.value === cat)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter("category", cat)} />
            </Badge>
          ))}
          {filters.level.map((level) => (
            <Badge key={level} variant="secondary" className="gap-1">
              {levels.find((l) => l.value === level)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter("level", level)} />
            </Badge>
          ))}
          {filters.language.map((lang) => (
            <Badge key={lang} variant="secondary" className="gap-1">
              {languages.find((l) => l.value === lang)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter("language", lang)} />
            </Badge>
          ))}
          {filters.rating > 0 && (
            <Badge variant="secondary" className="gap-1">
              {t("search.rating")} {filters.rating}+
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("rating", 0)} />
            </Badge>
          )}
          {filters.instructor && (
            <Badge variant="secondary" className="gap-1">
              {t("search.instructor")}: {filters.instructor}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("instructor", "")} />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            {t("search.clearAll")}
          </Button>
        </div>
      )}

      {/* Advanced Filters */}
      <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <CollapsibleContent>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("search.advancedFilters")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Categories */}
                <div>
                  <h4 className="font-medium mb-3">{t("search.categories")}</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.value}
                          checked={filters.category.includes(category.value)}
                          onCheckedChange={() => toggleArrayFilter("category", category.value)}
                        />
                        <label htmlFor={category.value} className="text-sm">
                          {category.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Levels */}
                <div>
                  <h4 className="font-medium mb-3">{t("search.levels")}</h4>
                  <div className="space-y-2">
                    {levels.map((level) => (
                      <div key={level.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={level.value}
                          checked={filters.level.includes(level.value)}
                          onCheckedChange={() => toggleArrayFilter("level", level.value)}
                        />
                        <label htmlFor={level.value} className="text-sm">
                          {level.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h4 className="font-medium mb-3">{t("search.languages")}</h4>
                  <div className="space-y-2">
                    {languages.map((language) => (
                      <div key={language.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={language.value}
                          checked={filters.language.includes(language.value)}
                          onCheckedChange={() => toggleArrayFilter("language", language.value)}
                        />
                        <label htmlFor={language.value} className="text-sm">
                          {language.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Duration Range */}
                <div>
                  <h4 className="font-medium mb-3">
                    {t("search.duration")} ({filters.duration[0]}-{filters.duration[1]} {t("search.hours")})
                  </h4>
                  <Slider
                    value={filters.duration}
                    onValueChange={(value) => updateFilter("duration", value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-medium mb-3">
                    {t("search.price")} (${filters.price[0]}-${filters.price[1]})
                  </h4>
                  <Slider
                    value={filters.price}
                    onValueChange={(value) => updateFilter("price", value)}
                    max={500}
                    step={10}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Minimum Rating */}
                <div>
                  <h4 className="font-medium mb-3">{t("search.minimumRating")}</h4>
                  <Select
                    value={filters.rating.toString()}
                    onValueChange={(value) => updateFilter("rating", Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">{t("search.anyRating")}</SelectItem>
                      <SelectItem value="3">3+ {t("search.stars")}</SelectItem>
                      <SelectItem value="4">4+ {t("search.stars")}</SelectItem>
                      <SelectItem value="5">5 {t("search.stars")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Instructor */}
                <div>
                  <h4 className="font-medium mb-3">{t("search.instructor")}</h4>
                  <Input
                    placeholder={t("search.instructorPlaceholder")}
                    value={filters.instructor}
                    onChange={(e) => updateFilter("instructor", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
