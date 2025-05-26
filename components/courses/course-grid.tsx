"use client"

import { useLanguage } from "@/contexts/language-context"
import ModernCourseCard from "@/components/courses/modern-course-card"
import CourseCardSkeleton from "@/components/skeletons/course-card-skeleton"

interface CourseGridProps {
  courses: any[]
  isLoading?: boolean
  showWishlist?: boolean
}

export default function CourseGrid({ courses, isLoading = false, showWishlist = true }: CourseGridProps) {
  const { t } = useLanguage()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">{t("courses.noCoursesFound")}</h3>
        <p className="text-muted-foreground">{t("courses.tryDifferentFilters")}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <ModernCourseCard key={course.id} course={course} showWishlist={showWishlist} />
      ))}
    </div>
  )
}
