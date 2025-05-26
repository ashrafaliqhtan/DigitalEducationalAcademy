"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, BookOpen, BarChart, CheckCircle, Lock, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"

interface CourseCurriculumProps {
  course: any
  showPreviewButton?: boolean
  currentLessonId?: string
}

export default function CourseCurriculum({
  course,
  showPreviewButton = false,
  currentLessonId,
}: CourseCurriculumProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const { t } = useLanguage()

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  // Initialize all sections as expanded if there's a current lesson
  useState(() => {
    if (currentLessonId && course.sections) {
      const initialExpandedState: Record<string, boolean> = {}
      course.sections.forEach((section: any) => {
        const hasCurrentLesson = section.lessons.some((lesson: any) => lesson.id === currentLessonId)
        if (hasCurrentLesson) {
          initialExpandedState[section.id] = true
        }
      })
      setExpandedSections(initialExpandedState)
    }
  })

  if (!course.sections || course.sections.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">{t("courses.curriculumComingSoon")}</h3>
        <p className="text-muted-foreground">{t("courses.curriculumBeingPrepared")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {course.sections.map((section: any) => (
        <div key={section.id} className="border rounded-lg overflow-hidden">
          <button
            className="w-full bg-muted px-4 py-3 flex items-center justify-between hover:bg-muted/80 transition-colors"
            onClick={() => toggleSection(section.id)}
          >
            <div>
              <h3 className="font-medium text-left">{section.title}</h3>
              <p className="text-sm text-muted-foreground text-left">
                {section.lessons.length} {t("courses.lessons")}
              </p>
            </div>
            {expandedSections[section.id] ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          {expandedSections[section.id] && (
            <div className="divide-y">
              {section.lessons.map((lesson: any) => (
                <div
                  key={lesson.id}
                  className={`px-4 py-3 flex items-center justify-between ${
                    currentLessonId === lesson.id ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {lesson.type === "video" ? (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Play className="h-4 w-4 text-primary" />
                      </div>
                    ) : lesson.type === "quiz" ? (
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <BarChart className="h-4 w-4 text-orange-500" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{lesson.title}</p>
                      <p className="text-sm text-muted-foreground">{lesson.duration || "10 min"}</p>
                    </div>
                  </div>

                  {showPreviewButton ? (
                    lesson.is_preview ? (
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/courses/${course.slug}/preview?lesson=${lesson.id}`}>{t("courses.preview")}</Link>
                      </Button>
                    ) : (
                      <Badge variant="outline">
                        <Lock className="h-3 w-3 mr-1" /> {t("courses.locked")}
                      </Badge>
                    )
                  ) : (
                    <Button
                      size="sm"
                      variant={currentLessonId === lesson.id ? "default" : "ghost"}
                      asChild
                      className={currentLessonId === lesson.id ? "pointer-events-none" : ""}
                    >
                      <Link href={`/courses/${course.slug}/learn?lesson=${lesson.id}`}>
                        {currentLessonId === lesson.id
                          ? t("courses.current")
                          : lesson.type === "quiz"
                            ? t("courses.takeQuiz")
                            : t("courses.start")}
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
