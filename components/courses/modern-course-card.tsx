"use client"

import Link from "next/link"
import Image from "next/image"
import { Clock, BookOpen, Users, Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import WishlistButton from "@/components/wishlist/wishlist-button"
import { useLanguage } from "@/contexts/language-context"

interface ModernCourseCardProps {
  course: any
  showWishlist?: boolean
}

export default function ModernCourseCard({ course, showWishlist = true }: ModernCourseCardProps) {
  const { t, language } = useLanguage()

  // Format course duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins > 0 ? `${mins}m` : ""}`
  }

  // Calculate total lessons
  const totalLessons =
    course.sections?.reduce((total: number, section: any) => {
      return total + (section.lessons?.length || 0)
    }, 0) || 0

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md">
      <div className="relative">
        <Link href={`/courses/${course.slug}`}>
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={course.thumbnail || "/placeholder.svg?height=200&width=400"}
              alt={course.title}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {course.is_featured && (
            <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600">
              {t("courses.featured")}
            </Badge>
          )}
          {course.is_new && (
            <Badge variant="secondary" className="bg-green-500 hover:bg-green-600">
              {t("courses.new")}
            </Badge>
          )}
        </div>

        {/* Wishlist button */}
        {showWishlist && (
          <div className="absolute top-2 right-2">
            <WishlistButton courseId={course.id} />
          </div>
        )}
      </div>

      <CardContent className="p-4 flex-grow">
        <div className="mb-2">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {course.category?.name || course.level}
          </Badge>
        </div>

        <Link href={`/courses/${course.slug}`} className="hover:underline">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
        </Link>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{course.description}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(course.duration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>
              {totalLessons} {t("courses.lessons")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= (course.rating || 4.5) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm">
            {course.rating || 4.5} ({course.rating_count || 0})
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto">
        <div className="w-full flex items-center justify-between">
          <div className="font-bold">
            {course.price === 0 ? (
              t("courses.free")
            ) : course.discount_price ? (
              <div className="flex items-center gap-2">
                <span>
                  {language === "en" ? "$" : ""}
                  {course.discount_price}
                  {language === "ar" ? " $" : ""}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {language === "en" ? "$" : ""}
                  {course.price}
                  {language === "ar" ? " $" : ""}
                </span>
              </div>
            ) : (
              <>
                {language === "en" ? "$" : ""}
                {course.price}
                {language === "ar" ? " $" : ""}
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{course.enrollment_count || 0}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
