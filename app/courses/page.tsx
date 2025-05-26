"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import CourseGrid from "@/components/courses/course-grid"
import CourseFilter from "@/components/courses/course-filter"
import { getCourses, getCategories, getLevels } from "@/services/course-service"
import type { CourseWithDetails } from "@/contexts/enrollment-context"

export default function CoursesPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("all")
  const [courses, setCourses] = useState<CourseWithDetails[]>([])
  const [featuredCourses, setFeaturedCourses] = useState<CourseWithDetails[]>([])
  const [popularCourses, setPopularCourses] = useState<CourseWithDetails[]>([])
  const [newCourses, setNewCourses] = useState<CourseWithDetails[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [levels, setLevels] = useState<{ id: string; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch all courses
        const allCourses = await getCourses()
        setCourses(allCourses)

        // Fetch featured courses
        const featured = await getCourses({ featured: true, limit: 6 })
        setFeaturedCourses(featured)

        // Fetch popular courses
        const popular = await getCourses({ popular: true, limit: 8 })
        setPopularCourses(popular)

        // Fetch new courses
        const newCoursesData = await getCourses({ isNew: true, limit: 8 })
        setNewCourses(newCoursesData)

        // Fetch categories
        const categoriesData = await getCategories()
        setCategories(categoriesData)

        // Fetch levels
        const levelsData = await getLevels()
        setLevels(levelsData)
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{t("courses.browseTitle") || "Browse Courses"}</h1>
        <p className="text-gray-600 max-w-3xl">
          {t("courses.browseSubtitle") || "Expand your knowledge with our expert-led courses"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <CourseFilter categories={categories} levels={levels} />
        </div>

        <div className="md:col-span-3">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 flex flex-wrap h-auto">
              <TabsTrigger value="all">{t("courses.allCourses") || "All Courses"}</TabsTrigger>
              <TabsTrigger value="featured">{t("courses.featured") || "Featured"}</TabsTrigger>
              <TabsTrigger value="popular">{t("courses.mostPopular") || "Most Popular"}</TabsTrigger>
              <TabsTrigger value="new">{t("courses.newest") || "Newest"}</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {t(`courses.categories.${category.id}`) || category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all">
              <CourseGrid courses={courses} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="featured">
              <CourseGrid courses={featuredCourses} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="popular">
              <CourseGrid courses={popularCourses} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="new">
              <CourseGrid courses={newCourses} isLoading={isLoading} />
            </TabsContent>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <CourseGrid
                  courses={courses.filter((course) => course.category_id === category.id)}
                  isLoading={isLoading}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
