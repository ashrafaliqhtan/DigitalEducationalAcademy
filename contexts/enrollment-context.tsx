"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Tables } from "@/lib/supabase/types"
import { useToast } from "@/components/ui/use-toast"

export interface CourseWithDetails extends Tables<"courses"> {
  sections: (Tables<"sections"> & {
    lessons: Tables<"lessons">[]
  })[]
  instructors: Tables<"instructors">[]
  category?: Tables<"categories">
}

export interface EnrollmentWithProgress extends Tables<"enrollments"> {
  course: CourseWithDetails
  lesson_progress: Tables<"lesson_progress">[]
}

interface EnrollmentContextType {
  enrolledCourses: CourseWithDetails[]
  isLoading: boolean
  isEnrolled: (courseId: string) => boolean
  enrollInCourse: (courseId: string) => Promise<void>
  unenrollFromCourse: (courseId: string) => Promise<void>
  getCurrentLesson: (courseId: string) => { section: Tables<"sections">; lesson: Tables<"lessons"> } | null
  markLessonComplete: (courseId: string, lessonId: string) => Promise<void>
  markLessonIncomplete: (courseId: string, lessonId: string) => Promise<void>
  updateLessonProgress: (courseId: string, lessonId: string, watchedSeconds: number) => Promise<void>
  getLessonCompletion: (courseId: string, lessonId: string) => boolean
  getCourseCompletion: (courseId: string) => number // Percentage
  refreshEnrollments: () => Promise<void>
}

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined)

export function EnrollmentProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  const [enrollments, setEnrollments] = useState<EnrollmentWithProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Derived state
  const enrolledCourses = enrollments.map((enrollment) => enrollment.course)

  // Fetch enrollments when user changes
  useEffect(() => {
    if (user) {
      fetchEnrollments()
    } else {
      setEnrollments([])
      setIsLoading(false)
    }
  }, [user])

  const fetchEnrollments = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      // Fetch enrollments with course, sections, lessons, and progress
      const { data: enrollmentsData, error } = await supabase
        .from("enrollments")
        .select(`
          *,
          course:courses(
            *,
            category:categories(*),
            sections:sections(
              *,
              lessons:lessons(*)
            ),
            instructors:course_instructors(
              instructor:instructors(*)
            )
          ),
          lesson_progress:lesson_progress(*)
        `)
        .eq("user_id", user.id)
        .order("enrolled_at", { ascending: false })

      if (error) throw error

      // Transform the data to match our expected format
      const transformedEnrollments = enrollmentsData.map((enrollment) => {
        // Transform instructors from the nested format
        const instructors = enrollment.course.instructors.map((item: any) => item.instructor)

        return {
          ...enrollment,
          course: {
            ...enrollment.course,
            instructors,
          },
        } as EnrollmentWithProgress
      })

      setEnrollments(transformedEnrollments)
    } catch (error) {
      console.error("Error fetching enrollments:", error)
      toast({
        title: "Error",
        description: "Failed to load your enrolled courses",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshEnrollments = async () => {
    await fetchEnrollments()
  }

  const isEnrolled = (courseId: string): boolean => {
    return enrollments.some((enrollment) => enrollment.course_id === courseId)
  }

  const enrollInCourse = async (courseId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to enroll in courses",
        variant: "destructive",
      })
      return
    }

    if (isEnrolled(courseId)) return

    try {
      // Get the first lesson of the course
      const { data: sections, error: sectionsError } = await supabase
        .from("sections")
        .select("id")
        .eq("course_id", courseId)
        .order("position", { ascending: true })
        .limit(1)

      if (sectionsError) throw sectionsError
      if (!sections.length) throw new Error("No sections found for this course")

      const { data: lessons, error: lessonsError } = await supabase
        .from("lessons")
        .select("id")
        .eq("section_id", sections[0].id)
        .order("position", { ascending: true })
        .limit(1)

      if (lessonsError) throw lessonsError
      if (!lessons.length) throw new Error("No lessons found for this course")

      // Create enrollment
      const { data: enrollment, error: enrollmentError } = await supabase
        .from("enrollments")
        .insert({
          user_id: user.id,
          course_id: courseId,
          current_lesson_id: lessons[0].id,
        })
        .select()
        .single()

      if (enrollmentError) throw enrollmentError

      // Refresh enrollments
      await refreshEnrollments()

      toast({
        title: "Enrolled successfully",
        description: "You have been enrolled in the course",
      })
    } catch (error) {
      console.error("Error enrolling in course:", error)
      toast({
        title: "Enrollment failed",
        description: "There was an error enrolling in the course",
        variant: "destructive",
      })
    }
  }

  const unenrollFromCourse = async (courseId: string) => {
    if (!user) return

    try {
      const { error } = await supabase.from("enrollments").delete().eq("user_id", user.id).eq("course_id", courseId)

      if (error) throw error

      // Update local state
      setEnrollments((prev) => prev.filter((e) => e.course_id !== courseId))

      toast({
        title: "Unenrolled successfully",
        description: "You have been unenrolled from the course",
      })
    } catch (error) {
      console.error("Error unenrolling from course:", error)
      toast({
        title: "Unenrollment failed",
        description: "There was an error unenrolling from the course",
        variant: "destructive",
      })
    }
  }

  const getCurrentLesson = (courseId: string) => {
    const enrollment = enrollments.find((e) => e.course_id === courseId)
    if (!enrollment || !enrollment.current_lesson_id) return null

    // Find the current lesson in the course
    for (const section of enrollment.course.sections) {
      for (const lesson of section.lessons) {
        if (lesson.id === enrollment.current_lesson_id) {
          return { section, lesson }
        }
      }
    }

    // Default to first lesson if current lesson not found
    if (enrollment.course.sections.length > 0 && enrollment.course.sections[0].lessons.length > 0) {
      return {
        section: enrollment.course.sections[0],
        lesson: enrollment.course.sections[0].lessons[0],
      }
    }

    return null
  }

  const markLessonComplete = async (courseId: string, lessonId: string) => {
    if (!user) return

    try {
      const enrollment = enrollments.find((e) => e.course_id === courseId)
      if (!enrollment) throw new Error("Enrollment not found")

      // Check if lesson progress already exists
      const existingProgress = enrollment.lesson_progress.find((lp) => lp.lesson_id === lessonId)

      if (existingProgress) {
        // Update existing progress
        if (existingProgress.completed) return // Already completed

        const { error } = await supabase
          .from("lesson_progress")
          .update({
            completed: true,
            last_watched: new Date().toISOString(),
          })
          .eq("id", existingProgress.id)

        if (error) throw error
      } else {
        // Create new progress
        const { error } = await supabase.from("lesson_progress").insert({
          enrollment_id: enrollment.id,
          lesson_id: lessonId,
          completed: true,
          watched_seconds: 0,
        })

        if (error) throw error
      }

      // Update completed_lessons count in enrollment
      const { error: updateError } = await supabase
        .from("enrollments")
        .update({
          completed_lessons: enrollment.completed_lessons + 1,
          last_accessed: new Date().toISOString(),
        })
        .eq("id", enrollment.id)

      if (updateError) throw updateError

      // Refresh enrollments
      await refreshEnrollments()
    } catch (error) {
      console.error("Error marking lesson complete:", error)
      toast({
        title: "Error",
        description: "Failed to update lesson progress",
        variant: "destructive",
      })
    }
  }

  const markLessonIncomplete = async (courseId: string, lessonId: string) => {
    if (!user) return

    try {
      const enrollment = enrollments.find((e) => e.course_id === courseId)
      if (!enrollment) throw new Error("Enrollment not found")

      // Check if lesson progress exists
      const existingProgress = enrollment.lesson_progress.find((lp) => lp.lesson_id === lessonId)

      if (!existingProgress || !existingProgress.completed) return // Not completed yet

      // Update progress
      const { error } = await supabase
        .from("lesson_progress")
        .update({
          completed: false,
          last_watched: new Date().toISOString(),
        })
        .eq("id", existingProgress.id)

      if (error) throw error

      // Update completed_lessons count in enrollment
      const { error: updateError } = await supabase
        .from("enrollments")
        .update({
          completed_lessons: Math.max(0, enrollment.completed_lessons - 1),
          last_accessed: new Date().toISOString(),
        })
        .eq("id", enrollment.id)

      if (updateError) throw updateError

      // Refresh enrollments
      await refreshEnrollments()
    } catch (error) {
      console.error("Error marking lesson incomplete:", error)
      toast({
        title: "Error",
        description: "Failed to update lesson progress",
        variant: "destructive",
      })
    }
  }

  const updateLessonProgress = async (courseId: string, lessonId: string, watchedSeconds: number) => {
    if (!user) return

    try {
      const enrollment = enrollments.find((e) => e.course_id === courseId)
      if (!enrollment) throw new Error("Enrollment not found")

      // Check if lesson progress already exists
      const existingProgress = enrollment.lesson_progress.find((lp) => lp.lesson_id === lessonId)

      if (existingProgress) {
        // Update existing progress
        const { error } = await supabase
          .from("lesson_progress")
          .update({
            watched_seconds: watchedSeconds,
            last_watched: new Date().toISOString(),
          })
          .eq("id", existingProgress.id)

        if (error) throw error
      } else {
        // Create new progress
        const { error } = await supabase.from("lesson_progress").insert({
          enrollment_id: enrollment.id,
          lesson_id: lessonId,
          watched_seconds: watchedSeconds,
          completed: false,
        })

        if (error) throw error
      }

      // Update current_lesson_id in enrollment
      const { error: updateError } = await supabase
        .from("enrollments")
        .update({
          current_lesson_id: lessonId,
          last_accessed: new Date().toISOString(),
        })
        .eq("id", enrollment.id)

      if (updateError) throw updateError

      // No need to refresh all enrollments for this frequent update
      // Just update the local state
      setEnrollments((prev) =>
        prev.map((e) => {
          if (e.id !== enrollment.id) return e

          const updatedProgress = [...e.lesson_progress]
          const progressIndex = updatedProgress.findIndex((lp) => lp.lesson_id === lessonId)

          if (progressIndex >= 0) {
            updatedProgress[progressIndex] = {
              ...updatedProgress[progressIndex],
              watched_seconds: watchedSeconds,
              last_watched: new Date().toISOString(),
            }
          } else {
            updatedProgress.push({
              id: `temp-${Date.now()}`, // Temporary ID until refresh
              enrollment_id: e.id,
              lesson_id: lessonId,
              watched_seconds: watchedSeconds,
              completed: false,
              last_watched: new Date().toISOString(),
            } as Tables<"lesson_progress">)
          }

          return {
            ...e,
            current_lesson_id: lessonId,
            last_accessed: new Date().toISOString(),
            lesson_progress: updatedProgress,
          }
        }),
      )
    } catch (error) {
      console.error("Error updating lesson progress:", error)
      // Don't show toast for this frequent update
    }
  }

  const getLessonCompletion = (courseId: string, lessonId: string): boolean => {
    const enrollment = enrollments.find((e) => e.course_id === courseId)
    if (!enrollment) return false

    const progress = enrollment.lesson_progress.find((lp) => lp.lesson_id === lessonId)
    return progress?.completed || false
  }

  const getCourseCompletion = (courseId: string): number => {
    const enrollment = enrollments.find((e) => e.course_id === courseId)
    if (!enrollment) return 0

    // Count total lessons in the course
    const totalLessons = enrollment.course.sections.reduce((total, section) => total + section.lessons.length, 0)

    if (totalLessons === 0) return 0

    // Count completed lessons
    const completedLessons = enrollment.lesson_progress.filter((lp) => lp.completed).length

    return Math.round((completedLessons / totalLessons) * 100)
  }

  return (
    <EnrollmentContext.Provider
      value={{
        enrolledCourses,
        isLoading,
        isEnrolled,
        enrollInCourse,
        unenrollFromCourse,
        getCurrentLesson,
        markLessonComplete,
        markLessonIncomplete,
        updateLessonProgress,
        getLessonCompletion,
        getCourseCompletion,
        refreshEnrollments,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  )
}

export function useEnrollment() {
  const context = useContext(EnrollmentContext)
  if (context === undefined) {
    throw new Error("useEnrollment must be used within an EnrollmentProvider")
  }
  return context
}
