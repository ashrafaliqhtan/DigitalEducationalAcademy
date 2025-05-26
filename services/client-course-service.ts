import { createClient } from "@/lib/supabase/client"

export interface Course {
  id: string
  title: string
  description: string
  slug: string
  image: string
  price: number
  level: string
  duration: string
  instructor: string
  category: string
  rating: number
  students: number
  lessons: number
  status: "published" | "draft"
  created_at: string
  updated_at: string
}

export class ClientCourseService {
  private supabase = createClient()

  async getCourses(filters?: {
    category?: string
    level?: string
    search?: string
    limit?: number
    offset?: number
  }) {
    try {
      let query = this.supabase.from("courses").select("*").eq("status", "published")

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

  async getCourseBySlug(slug: string) {
    try {
      const { data, error } = await this.supabase
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

  async getFeaturedCourses(limit = 6) {
    try {
      const { data, error } = await this.supabase
        .from("courses")
        .select("*")
        .eq("status", "published")
        .order("rating", { ascending: false })
        .limit(limit)

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error) {
      console.error("Error fetching featured courses:", error)
      return { success: false, error: error instanceof Error ? error.message : "Failed to fetch featured courses" }
    }
  }

  async searchCourses(query: string, limit = 10) {
    try {
      const { data, error } = await this.supabase
        .from("courses")
        .select("*")
        .eq("status", "published")
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,instructor.ilike.%${query}%`)
        .limit(limit)

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error) {
      console.error("Error searching courses:", error)
      return { success: false, error: error instanceof Error ? error.message : "Search failed" }
    }
  }
}

export const clientCourseService = new ClientCourseService()
