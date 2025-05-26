"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/language-context"

interface CourseFilterProps {
  categories: { id: string; name: string }[]
  levels: { id: string; name: string }[]
}

export default function CourseFilter({ categories, levels }: CourseFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",") || [],
  )
  const [selectedLevels, setSelectedLevels] = useState<string[]>(searchParams.get("levels")?.split(",") || [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const toggleLevel = (levelId: string) => {
    setSelectedLevels((prev) => (prev.includes(levelId) ? prev.filter((id) => id !== levelId) : [...prev, levelId]))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (searchQuery) {
      params.set("q", searchQuery)
    }

    if (selectedCategories.length > 0) {
      params.set("categories", selectedCategories.join(","))
    }

    if (selectedLevels.length > 0) {
      params.set("levels", selectedLevels.join(","))
    }

    router.push(`/courses?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
    setSelectedLevels([])
    router.push("/courses")
  }

  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || selectedLevels.length > 0

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">{t("courses.filter.search")}</h3>
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="search"
            placeholder={t("courses.filter.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">{t("courses.filter.category")}</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <Label htmlFor={`category-${category.id}`} className="text-sm font-normal cursor-pointer">
                {t(`courses.categories.${category.id}`) || category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">{t("courses.filter.level")}</h3>
        <div className="space-y-2">
          {levels.map((level) => (
            <div key={level.id} className="flex items-center space-x-2">
              <Checkbox
                id={`level-${level.id}`}
                checked={selectedLevels.includes(level.id)}
                onCheckedChange={() => toggleLevel(level.id)}
              />
              <Label htmlFor={`level-${level.id}`} className="text-sm font-normal cursor-pointer">
                {t(`courses.levels.${level.id}`) || level.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          {t("courses.filter.clearFilters")}
        </Button>
      )}

      <Button onClick={applyFilters} className="w-full">
        {t("courses.filter.applyFilters")}
      </Button>
    </div>
  )
}
