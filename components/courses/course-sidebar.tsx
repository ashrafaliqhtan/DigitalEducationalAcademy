"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, ChevronDown, ChevronUp, type LucideIcon, PlayCircle, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface CourseSidebarProps {
  sections: any[]
  currentLessonId: string
  courseSlug: string
}

export default function CourseSidebar({ sections, currentLessonId, courseSlug }: CourseSidebarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    // Initialize with all sections open
    sections.reduce((acc, section) => {
      acc[section.id] = true
      return acc
    }, {}),
  )

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const getLessonIcon = (type: string): LucideIcon => {
    switch (type) {
      case "video":
        return PlayCircle
      case "quiz":
        return FileText
      case "assignment":
        return FileText
      default:
        return PlayCircle
    }
  }

  return (
    <div className="hidden md:block w-80 border-r bg-background h-full">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Course Content</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {sections.map((section) => (
              <div key={section.id} className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-between font-medium"
                  onClick={() => toggleSection(section.id)}
                >
                  <span className="truncate">{section.title}</span>
                  {openSections[section.id] ? (
                    <ChevronUp className="h-4 w-4 shrink-0 opacity-50" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  )}
                </Button>

                {openSections[section.id] && (
                  <div className="pl-4 space-y-1">
                    {section.lessons.map((lesson: any) => {
                      const LessonIcon = getLessonIcon(lesson.type || "video")
                      const isActive = lesson.id === currentLessonId

                      return (
                        <Button
                          key={lesson.id}
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn("w-full justify-start gap-2 font-normal", isActive && "bg-muted font-medium")}
                        >
                          <Link href={`/courses/${courseSlug}/learn?lesson=${lesson.id}`}>
                            <LessonIcon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{lesson.title}</span>
                            {lesson.completed && <CheckCircle className="h-4 w-4 shrink-0 text-primary ml-auto" />}
                          </Link>
                        </Button>
                      )
                    })}
                  </div>
                )}

                <Separator className="my-2" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
