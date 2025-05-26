"use client"

import { useEffect, useState } from "react"
import { getRelatedCourses } from "@/services/course-service"
import ModernCourseCard from "@/components/courses/modern-course-card"
import { useLanguage } from "@/contexts/language-context"

interface RelatedCoursesProps {
  courseId: string
  limit?: number
}

export default function RelatedCourses({ courseId, limit = 3 }: RelatedCoursesProps) {
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchRelatedCourses = async () => {
      try {
        const relatedCourses = await getRelatedCourses(courseId, limit)
        setCourses(relatedCourses)
      } catch (error) {
        console.error("Error fetching related courses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRelatedCourses()
  }, [courseId, limit])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="h-[350px] rounded-lg bg-muted animate-pulse"></div>
        ))}
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t("courses.noRelatedCourses")}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {courses.map((course) => (
        <ModernCourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
