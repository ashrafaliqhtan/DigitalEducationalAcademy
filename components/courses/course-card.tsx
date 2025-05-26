"use client"

import Link from "next/link"
import Image from "next/image"
import { Clock, Users, BookOpen, Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { useEnrollment } from "@/contexts/enrollment-context"
import type { CourseWithDetails } from "@/contexts/enrollment-context"

interface CourseCardProps {
  course: CourseWithDetails
}

export default function CourseCard({ course }: CourseCardProps) {
  const { t } = useLanguage()
  const { isEnrolled, getCourseCompletion } = useEnrollment()

  const enrolled = isEnrolled(course.id)
  const completion = enrolled ? getCourseCompletion(course.id) : 0

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={course.thumbnail || "/placeholder.svg?height=200&width=350&text=Course"}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {course.is_featured && (
          <Badge className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600">{t("courses.featured")}</Badge>
        )}
        {course.is_popular && !course.is_featured && (
          <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">{t("courses.popular")}</Badge>
        )}
        {course.is_new && !course.is_featured && !course.is_popular && (
          <Badge className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-600">{t("courses.new")}</Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{course.description}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}h</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>
              {course.sections.reduce((total, section) => total + section.lessons.length, 0)} {t("courses.lessons")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>250 {t("courses.students")}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(4.5) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">4.5</span>
          </div>
          <div className="text-right">
            {course.discount_price ? (
              <div className="flex items-center gap-1">
                <span className="font-bold text-lg">${course.discount_price}</span>
                <span className="text-sm text-gray-500 line-through">${course.price}</span>
              </div>
            ) : (
              <span className="font-bold text-lg">${course.price}</span>
            )}
          </div>
        </div>

        {enrolled && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span>{t("courses.progress")}</span>
              <span>{completion}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${completion}%` }} />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/courses/${course.slug}`}>{enrolled ? t("courses.continue") : t("courses.viewCourse")}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
