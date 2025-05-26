"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function markLessonComplete(lessonId: string, courseId: string, courseSlug: string) {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "You must be logged in to track progress" }
  }

  try {
    // Get the enrollment
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single()

    if (!enrollment) {
      return { success: false, message: "You are not enrolled in this course" }
    }

    // Check if lesson progress already exists
    const { data: existingProgress } = await supabase
      .from("lesson_progress")
      .select("*")
      .eq("enrollment_id", enrollment.id)
      .eq("lesson_id", lessonId)
      .maybeSingle()

    if (existingProgress) {
      // Update existing progress
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
        last_watched: new Date().toISOString(),
      })

      if (error) throw error
    }

    // Update completed_lessons count in enrollment
    const { error: updateError } = await supabase
      .from("enrollments")
      .update({
        completed_lessons: enrollment.completed_lessons + 1,
        last_accessed: new Date().toISOString(),
        current_lesson_id: lessonId,
      })
      .eq("id", enrollment.id)

    if (updateError) throw updateError

    // Revalidate paths
    revalidatePath(`/courses/${courseSlug}/learn`)
    revalidatePath(`/dashboard`)

    return { success: true, message: "Lesson marked as complete" }
  } catch (error) {
    console.error("Error marking lesson complete:", error)
    return { success: false, message: "An error occurred while updating progress" }
  }
}

export async function updateLessonProgress(
  lessonId: string,
  courseId: string,
  courseSlug: string,
  watchedSeconds: number,
) {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "You must be logged in to track progress" }
  }

  try {
    // Get the enrollment
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single()

    if (!enrollment) {
      return { success: false, message: "You are not enrolled in this course" }
    }

    // Check if lesson progress already exists
    const { data: existingProgress } = await supabase
      .from("lesson_progress")
      .select("*")
      .eq("enrollment_id", enrollment.id)
      .eq("lesson_id", lessonId)
      .maybeSingle()

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
        completed: false,
        watched_seconds: watchedSeconds,
        last_watched: new Date().toISOString(),
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

    return { success: true }
  } catch (error) {
    console.error("Error updating lesson progress:", error)
    return { success: false, message: "An error occurred while updating progress" }
  }
}

export async function getLessonProgress(lessonId: string, courseId: string) {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "You must be logged in to view progress", progress: null }
  }

  try {
    // Get the enrollment
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single()

    if (!enrollment) {
      return { success: false, message: "You are not enrolled in this course", progress: null }
    }

    // Get lesson progress
    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("*")
      .eq("enrollment_id", enrollment.id)
      .eq("lesson_id", lessonId)
      .maybeSingle()

    return {
      success: true,
      progress: progress || { completed: false, watched_seconds: 0 },
    }
  } catch (error) {
    console.error("Error getting lesson progress:", error)
    return { success: false, message: "An error occurred while fetching progress", progress: null }
  }
}
