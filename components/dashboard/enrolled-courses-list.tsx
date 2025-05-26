"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, BookOpen, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { formatDistanceToNow } from "date-fns"

interface EnrolledCoursesListProps {
  courses: any[]
}

export default function EnrolledCoursesList({ courses }: EnrolledCoursesListProps) {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")

  // Filter courses based on search query
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort courses: in-progress first, then by last accessed date
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    // First sort by progress (in-progress first)
    if (a.progress > 0 && a.progress < 100 && (b.progress === 0 || b.progress === 100)) {
      return -1
    }
    if (b.progress > 0 && b.progress < 100 && (a.progress === 0 || a.progress === 100)) {
      return 1
    }

    // Then sort by last accessed date
    return new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime()
  })

  if (courses.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/40 rounded-lg">
        <h3 className="text-xl font-medium mb-2">You haven't enrolled in any courses yet</h3>
        <p className="text-muted-foreground mb-6">Browse our courses and start learning today</p>
        <Button asChild>
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Enrolled Courses ({courses.length})</h2>
        <div className="w-full max-w-xs">
          <Input
            type="search"
            placeholder="Search your courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-8 bg-muted/40 rounded-lg">
          <p className="text-muted-foreground">No courses match your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sortedCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 relative">
                  <div className="aspect-video md:h-full relative">
                    <Image
                      src={course.thumbnail || "/placeholder.svg?height=200&width=350&text=Course"}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <CardContent className="flex-1 p-6">
                  <div className="flex flex-col h-full">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold">{course.title}</h3>
                        <span className="text-sm text-muted-foreground">
                          Last accessed {formatDistanceToNow(new Date(course.lastAccessed), { addSuffix: true })}
                        </span>
                      </div>

                      <p className="text-muted-foreground line-clamp-2 mb-4">{course.description}</p>

                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{Math.floor(course.duration / 60)}h total</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>
                            {course.sections?.reduce(
                              (total: number, section: any) => total + (section.lessons?.length || 0),
                              0,
                            ) || 0}{" "}
                            lessons
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Enrolled {formatDistanceToNow(new Date(course.enrolled_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2 mb-4" />

                      <div className="flex justify-between items-center">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/courses/${course.slug}`}>Course Details</Link>
                        </Button>
                        <Button asChild size="sm">
                          <Link href={`/courses/${course.slug}/learn?lesson=${course.currentLessonId}`}>
                            {course.progress === 0
                              ? "Start Learning"
                              : course.progress === 100
                                ? "Review Course"
                                : "Continue Learning"}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
