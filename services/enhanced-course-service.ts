import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/types"

type Course = Database["public"]["Tables"]["courses"]["Row"] & {
  category?: Database["public"]["Tables"]["categories"]["Row"]
  instructors?: Database["public"]["Tables"]["instructors"]["Row"][]
  sections?: (Database["public"]["Tables"]["sections"]["Row"] & {
    lessons?: Database["public"]["Tables"]["lessons"]["Row"][]
  })[]
}

interface CourseFilters {
  category?: string
  level?: string
  search?: string
  priceRange?: [number, number]
  rating?: number
  limit?: number
  offset?: number
}

interface ServiceResponse<T> {
  data: T | null
  error: string | null
  loading?: boolean
}

class CourseService {
  private supabase = getSupabaseBrowserClient()

  async getCourses(filters: CourseFilters = {}): Promise<ServiceResponse<Course[]>> {
    try {
      let query = this.supabase
        .from("courses")
        .select(`
          *,
          category:categories(*),
          instructors:course_instructors(
            instructor:instructors(*)
          ),
          sections:sections(
            *,
            lessons:lessons(*)
          )
        `)
        .eq("is_published", true)

      // Apply filters
      if (filters.category) {
        query = query.eq("category_id", filters.category)
      }

      if (filters.level) {
        query = query.eq("level", filters.level)
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      if (filters.priceRange) {
        query = query.gte("price", filters.priceRange[0]).lte("price", filters.priceRange[1])
      }

      if (filters.rating) {
        query = query.gte("average_rating", filters.rating)
      }

      // Pagination
      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching courses:", error)
        return { data: null, error: error.message }
      }

      // Transform the data to flatten instructors
      const transformedData = data?.map((course) => ({
        ...course,
        instructors: course.instructors?.map((item: any) => item.instructor) || [],
      })) as Course[]

      return { data: transformedData || [], error: null }
    } catch (error) {
      console.error("Unexpected error fetching courses:", error)
      return {
        data: null,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }
    }
  }

  async getCourseBySlug(slug: string): Promise<ServiceResponse<Course>> {
    try {
      const { data, error } = await this.supabase
        .from("courses")
        .select(`
          *,
          category:categories(*),
          instructors:course_instructors(
            instructor:instructors(*)
          ),
          sections:sections(
            *,
            lessons:lessons(*)
          )
        `)
        .eq("slug", slug)
        .eq("is_published", true)
        .single()

      if (error) {
        console.error("Error fetching course by slug:", error)
        return { data: null, error: error.message }
      }

      // Transform the data
      const transformedData = {
        ...data,
        instructors: data.instructors?.map((item: any) => item.instructor) || [],
      } as Course

      return { data: transformedData, error: null }
    } catch (error) {
      console.error("Unexpected error fetching course:", error)
      return {
        data: null,
        error: error instanceof Error ? error.message : "Course not found",
      }
    }
  }

  async getCourseById(id: string): Promise<ServiceResponse<Course>> {
    try {
      const { data, error } = await this.supabase
        .from("courses")
        .select(`
          *,
          category:categories(*),
          instructors:course_instructors(
            instructor:instructors(*)
          ),
          sections:sections(
            *,
            lessons:lessons(*)
          )
        `)
        .eq("id", id)
        .single()

      if (error) {
        console.error("Error fetching course by ID:", error)
        return { data: null, error: error.message }
      }

      const transformedData = {
        ...data,
        instructors: data.instructors?.map((item: any) => item.instructor) || [],
      } as Course

      return { data: transformedData, error: null }
    } catch (error) {
      console.error("Unexpected error fetching course:", error)
      return {
        data: null,
        error: error instanceof Error ? error.message : "Course not found",
      }
    }
  }

  async searchCourses(query: string): Promise<ServiceResponse<Course[]>> {
    return this.getCourses({ search: query, limit: 20 })
  }

  async getFeaturedCourses(limit = 4): Promise<ServiceResponse<Course[]>> {
    return this.getCourses({ limit })
  }

  async getPopularCourses(limit = 4): Promise<ServiceResponse<Course[]>> {
    try {
      const { data, error } = await this.supabase
        .from("courses")
        .select(`
          *,
          category:categories(*),
          instructors:course_instructors(
            instructor:instructors(*)
          )
        `)
        .eq("is_published", true)
        .order("enrollment_count", { ascending: false })
        .limit(limit)

      if (error) {
        return { data: null, error: error.message }
      }

      const transformedData = data?.map((course) => ({
        ...course,
        instructors: course.instructors?.map((item: any) => item.instructor) || [],
      })) as Course[]

      return { data: transformedData || [], error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Failed to fetch popular courses",
      }
    }
  }

  async getCategories(): Promise<ServiceResponse<Database["public"]["Tables"]["categories"]["Row"][]>> {
    try {
      const { data, error } = await this.supabase.from("categories").select("*").eq("is_active", true).order("name")

      if (error) {
        return { data: null, error: error.message }
      }

      return { data: data || [], error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Failed to fetch categories",
      }
    }
  }

  async getRelatedCourses(courseId: string, limit = 3): Promise<ServiceResponse<Course[]>> {
    try {
      // First get the current course to find its category
      const { data: currentCourse } = await this.supabase
        .from("courses")
        .select("category_id, tags")
        .eq("id", courseId)
        .single()

      if (!currentCourse) {
        return { data: [], error: null }
      }

      // Get courses in the same category
      const { data, error } = await this.supabase
        .from("courses")
        .select(`
          *,
          category:categories(*),
          instructors:course_instructors(
            instructor:instructors(*)
          )
        `)
        .eq("category_id", currentCourse.category_id)
        .neq("id", courseId)
        .eq("is_published", true)
        .limit(limit)

      if (error) {
        return { data: null, error: error.message }
      }

      const transformedData = data?.map((course) => ({
        ...course,
        instructors: course.instructors?.map((item: any) => item.instructor) || [],
      })) as Course[]

      return { data: transformedData || [], error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Failed to fetch related courses",
      }
    }
  }
}

// Create a singleton instance
export const courseService = new CourseService()

// Server-side functions
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const supabase = getSupabaseServerClient()

  try {
    const { data, error } = await supabase
      .from("courses")
      .select(`
        *,
        category:categories(*),
        instructors:course_instructors(
          instructor:instructors(*)
        ),
        sections:sections(
          *,
          lessons:lessons(*)
        )
      `)
      .eq("slug", slug)
      .eq("is_published", true)
      .single()

    if (error || !data) {
      return null
    }

    return {
      ...data,
      instructors: data.instructors?.map((item: any) => item.instructor) || [],
    } as Course
  } catch (error) {
    console.error("Error fetching course by slug:", error)
    return null
  }
}
