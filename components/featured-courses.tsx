"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import CourseCard from "@/components/courses/course-card"
import { getCourses } from "@/services/course-service"
import type { CourseWithDetails } from "@/contexts/enrollment-context"

export default function FeaturedCourses() {
  const { t } = useLanguage()
  const [courses, setCourses] = useState<CourseWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const featuredCourses = await getCourses({ featured: true, limit: 4 })
        setCourses(featuredCourses)
      } catch (error) {
        console.error("Error fetching featured courses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedCourses()
  }, [])

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t("courses.title")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("courses.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t("courses.title")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t("courses.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/courses">
              {t("courses.viewAll")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
