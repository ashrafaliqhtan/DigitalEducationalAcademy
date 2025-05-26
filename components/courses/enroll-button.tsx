"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useLanguage } from "@/contexts/language-context"

interface EnrollButtonProps {
  courseId: string
  className?: string
}

export default function EnrollButton({ courseId, className = "" }: EnrollButtonProps) {
  const [isEnrolling, setIsEnrolling] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const { t } = useLanguage()

  const handleEnroll = async () => {
    if (!user) {
      // Redirect to sign in page
      router.push(`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    setIsEnrolling(true)

    try {
      const supabase = getSupabaseBrowserClient()

      // Check if already enrolled
      const { data: existingEnrollment } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle()

      if (existingEnrollment) {
        toast({
          title: t("courses.alreadyEnrolled"),
          description: t("courses.alreadyEnrolledDesc"),
        })
        router.push(`/courses/${existingEnrollment.course_slug}/learn`)
        return
      }

      // Get course details for the slug
      const { data: course } = await supabase.from("courses").select("slug, title").eq("id", courseId).single()

      if (!course) {
        throw new Error("Course not found")
      }

      // Create enrollment
      const { error: enrollmentError } = await supabase.from("enrollments").insert({
        user_id: user.id,
        course_id: courseId,
        course_slug: course.slug,
        status: "in_progress",
        progress: 0,
      })

      if (enrollmentError) throw enrollmentError

      // Update course enrollment count
      await supabase.rpc("increment_enrollment_count", { course_id: courseId })

      toast({
        title: t("courses.enrollmentSuccess"),
        description: t("courses.enrollmentSuccessDesc", { courseName: course.title }),
      })

      // Redirect to course learning page
      router.push(`/courses/${course.slug}/learn`)
    } catch (error) {
      console.error("Error enrolling in course:", error)
      toast({
        title: t("courses.enrollmentError"),
        description: t("courses.enrollmentErrorDesc"),
        variant: "destructive",
      })
    } finally {
      setIsEnrolling(false)
    }
  }

  return (
    <Button onClick={handleEnroll} disabled={isEnrolling} className={className}>
      {isEnrolling ? t("common.processing") : t("courses.enroll")}
    </Button>
  )
}
