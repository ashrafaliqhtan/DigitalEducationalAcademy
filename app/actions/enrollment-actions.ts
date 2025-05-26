"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function enrollInCourse(courseId: string) {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "You must be logged in to enroll in a course" }
  }

  try {
    // Check if user is already enrolled
    const { data: existingEnrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single()

    if (existingEnrollment) {
      return { success: false, message: "You are already enrolled in this course" }
    }

    // Get course details to check if it's free
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("id, title, price")
      .eq("id", courseId)
      .single()

    if (courseError || !course) {
      return { success: false, message: "Course not found" }
    }

    // Only allow free enrollment for free courses
    if (course.price > 0) {
      return { success: false, message: "This course requires payment" }
    }

    // Enroll user in the course
    const { error: enrollError } = await supabase.from("enrollments").insert({
      user_id: user.id,
      course_id: courseId,
      enrolled_at: new Date().toISOString(),
      status: "active",
    })

    if (enrollError) {
      console.error("Error enrolling user:", enrollError)
      return { success: false, message: "Failed to enroll in course" }
    }

    revalidatePath("/dashboard")
    revalidatePath(`/courses/${courseId}`)

    return { success: true, message: "Successfully enrolled in course" }
  } catch (error) {
    console.error("Error enrolling in course:", error)
    return { success: false, message: "An error occurred while enrolling in the course" }
  }
}

export async function getEnrolledCourses() {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "You must be logged in to view enrolled courses" }
  }

  try {
    const { data: enrollments, error } = await supabase
      .from("enrollments")
      .select(
        `
        *,
        course:courses(*)
      `,
      )
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("enrolled_at", { ascending: false })

    if (error) {
      console.error("Error fetching enrolled courses:", error)
      return { success: false, message: "Failed to fetch enrolled courses" }
    }

    return { success: true, enrollments: enrollments || [] }
  } catch (error) {
    console.error("Error fetching enrolled courses:", error)
    return { success: false, message: "An error occurred while fetching enrolled courses" }
  }
}

export async function checkEnrollmentStatus(courseId: string) {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, isEnrolled: false, message: "You must be logged in" }
  }

  try {
    const { data: enrollment, error } = await supabase
      .from("enrollments")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error checking enrollment status:", error)
      return { success: false, isEnrolled: false, message: "Failed to check enrollment status" }
    }

    return {
      success: true,
      isEnrolled: !!enrollment && enrollment.status === "active",
      enrollment,
    }
  } catch (error) {
    console.error("Error checking enrollment status:", error)
    return { success: false, isEnrolled: false, message: "An error occurred while checking enrollment status" }
  }
}
