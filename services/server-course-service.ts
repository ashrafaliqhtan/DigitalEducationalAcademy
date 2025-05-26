import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function getServerCourses(filters?: {
  category?: string
  level?: string
  search?: string
  limit?: number
  offset?: number
}) {
  try {
    const supabase = getSupabaseServerClient()

    let query = supabase.from("courses").select("*").eq("status", "published")

    if (filters?.category) {
      query = query.eq("category", filters.category)
    }

    if (filters?.level) {
      query = query.eq("level", filters.level)
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error fetching courses:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch courses" }
  }
}

export async function getServerCourseBySlug(slug: string) {
  try {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching course:", error)
    return { success: false, error: error instanceof Error ? error.message : "Course not found" }
  }
}
