import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { CourseWithDetails } from "@/contexts/enrollment-context"
import { getMockCourses, getMockCourseBySlug, getMockRelatedCourses, mockCategories } from "@/data/mock-courses"

// Flag to force using mock data (for development/preview)
const FORCE_MOCK_DATA = true

export async function getCourses(options?: {
  limit?: number
  category?: string
  level?: string
  featured?: boolean
  popular?: boolean
  isNew?: boolean
  search?: string
}) {
  // If we're forcing mock data, return it immediately
  if (FORCE_MOCK_DATA) {
    return getMockCourses(options)
  }

  try {
    const supabase = getSupabaseBrowserClient()

    let query = supabase
      .from("courses")
      .select(`
        *,
        categories!courses_category_id_fkey(*),
        sections(
          *,
          lessons(*)
        ),
        course_instructors(
          instructors(*)
        )
      `)
      .order("created_at", { ascending: false })

    // Apply filters
    if (options?.category) {
      query = query.eq("category_id", options.category)
    }

    if (options?.level) {
      query = query.eq("level", options.level)
    }

    if (options?.featured) {
      query = query.eq("is_featured", true)
    }

    if (options?.popular) {
      query = query.eq("is_popular", true)
    }

    if (options?.isNew) {
      query = query.eq("is_new", true)
    }

    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching courses:", error)
      // Fall back to mock data if there's an error
      return getMockCourses(options)
    }

    // Transform the data to match our expected format
    return data.map((course) => {
      // Transform instructors from the nested format
      const instructors = course.course_instructors?.map((item: any) => item.instructors) || []

      return {
        ...course,
        category: course.categories,
        instructors,
      } as CourseWithDetails
    })
  } catch (error) {
    console.error("Error in getCourses:", error)
    // Fall back to mock data if there's an exception
    return getMockCourses(options)
  }
}

export async function getCourseBySlug(slug: string) {
  // If we're forcing mock data, return it immediately
  if (FORCE_MOCK_DATA) {
    return getMockCourseBySlug(slug)
  }

  try {
    const supabase = getSupabaseBrowserClient()

    const { data, error } = await supabase
      .from("courses")
      .select(`
        *,
        categories!courses_category_id_fkey(*),
        sections(
          *,
          lessons(*)
        ),
        course_instructors(
          instructors(*)
        )
      `)
      .eq("slug", slug)
      .single()

    if (error) {
      console.error("Error fetching course:", error)
      // Fall back to mock data if there's an error
      return getMockCourseBySlug(slug)
    }

    // Transform instructors from the nested format
    const instructors = data.course_instructors?.map((item: any) => item.instructors) || []

    return {
      ...data,
      category: data.categories,
      instructors,
    } as CourseWithDetails
  } catch (error) {
    console.error("Error in getCourseBySlug:", error)
    // Fall back to mock data if there's an exception
    return getMockCourseBySlug(slug)
  }
}

export async function getRelatedCourses(courseId: string, limit = 3) {
  // If we're forcing mock data, return it immediately
  if (FORCE_MOCK_DATA) {
    return getMockRelatedCourses(courseId, limit)
  }

  try {
    const supabase = getSupabaseBrowserClient()

    // First get the current course to get its category
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("category_id, tags")
      .eq("id", courseId)
      .single()

    if (courseError) {
      console.error("Error fetching course for related courses:", courseError)
      // Fall back to mock data if there's an error
      return getMockRelatedCourses(courseId, limit)
    }

    // Get courses in the same category
    const { data: relatedCourses, error: relatedError } = await supabase
      .from("courses")
      .select(`
        *,
        categories!courses_category_id_fkey(*),
        sections(
          *,
          lessons(*)
        ),
        course_instructors(
          instructors(*)
        )
      `)
      .eq("category_id", course.category_id)
      .neq("id", courseId)
      .limit(limit)

    if (relatedError) {
      console.error("Error fetching related courses:", relatedError)
      // Fall back to mock data if there's an error
      return getMockRelatedCourses(courseId, limit)
    }

    // Transform the data
    return relatedCourses.map((course) => {
      const instructors = course.course_instructors?.map((item: any) => item.instructors) || []

      return {
        ...course,
        category: course.categories,
        instructors,
      } as CourseWithDetails
    })
  } catch (error) {
    console.error("Error in getRelatedCourses:", error)
    // Fall back to mock data if there's an exception
    return getMockRelatedCourses(courseId, limit)
  }
}

export async function getCategories() {
  // If we're forcing mock data, return it immediately
  if (FORCE_MOCK_DATA) {
    return mockCategories
  }

  try {
    const supabase = getSupabaseBrowserClient()

    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      console.error("Error fetching categories:", error)
      // Fall back to mock data if there's an error
      return mockCategories
    }

    return data
  } catch (error) {
    console.error("Error in getCategories:", error)
    // Fall back to mock data if there's an exception
    return mockCategories
  }
}

export async function getLevels() {
  return [
    { id: "beginner", name: "Beginner" },
    { id: "intermediate", name: "Intermediate" },
    { id: "advanced", name: "Advanced" },
    { id: "all-levels", name: "All Levels" },
  ]
}

// Server-side functions
export async function getCoursesServer(options?: {
  limit?: number
  category?: string
  level?: string
  featured?: boolean
  popular?: boolean
  isNew?: boolean
}) {
  // If we're forcing mock data, return it immediately
  if (FORCE_MOCK_DATA) {
    return getMockCourses(options)
  }

  try {
    const supabase = getSupabaseServerClient()

    let query = supabase
      .from("courses")
      .select(`
        *,
        categories!courses_category_id_fkey(*),
        sections(
          *,
          lessons(*)
        ),
        course_instructors(
          instructors(*)
        )
      `)
      .order("created_at", { ascending: false })

    // Apply filters
    if (options?.category) {
      query = query.eq("category_id", options.category)
    }

    if (options?.level) {
      query = query.eq("level", options.level)
    }

    if (options?.featured) {
      query = query.eq("is_featured", true)
    }

    if (options?.popular) {
      query = query.eq("is_popular", true)
    }

    if (options?.isNew) {
      query = query.eq("is_new", true)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching courses:", error)
      // Fall back to mock data if there's an error
      return getMockCourses(options)
    }

    // Transform the data to match our expected format
    return data.map((course) => {
      // Transform instructors from the nested format
      const instructors = course.course_instructors?.map((item: any) => item.instructors) || []

      return {
        ...course,
        category: course.categories,
        instructors,
      } as CourseWithDetails
    })
  } catch (error) {
    console.error("Error in getCoursesServer:", error)
    // Fall back to mock data if there's an exception
    return getMockCourses(options)
  }
}
