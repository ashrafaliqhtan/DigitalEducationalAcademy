"use client"

import { useState, useEffect } from "react"
import CourseCard from "@/components/cards/course-card"
import CategorySelect from "@/components/filters/category-select"
import LevelSelect from "@/components/filters/level-select"
import SearchBar from "@/components/filters/search-bar"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { clientCourseService } from "@/services/client-course-service"

const CoursePage = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true)
      try {
        const result = await clientCourseService.getCourses({
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          level: selectedLevel !== "all" ? selectedLevel : undefined,
          search: searchQuery || undefined,
          limit: 12,
          offset: 0,
        })

        setCourses(result.data)
      } catch (error) {
        console.error("Failed to load courses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [selectedCategory, selectedLevel, searchQuery])

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-4">
        <CategorySelect onCategoryChange={setSelectedCategory} />
        <LevelSelect onLevelChange={setSelectedLevel} />
        <SearchBar onSearch={setSearchQuery} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      <Pagination totalPages={10} currentPage={1} />
    </div>
  )
}

export default CoursePage
