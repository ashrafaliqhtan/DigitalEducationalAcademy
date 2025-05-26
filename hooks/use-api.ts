"use client"

import { useState, useEffect, useCallback } from "react"
import { useNotificationHelpers } from "@/components/notifications/notification-system"
import { useLoading } from "@/components/loading/loading-manager"

interface APIResponse<T> {
  data: T | null
  error: string | null
  loading: boolean
  refetch: () => Promise<void>
}

interface APIOptions {
  immediate?: boolean
  loadingKey?: string
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
  showErrorNotification?: boolean
}

export function useAPI<T>(
  fetcher: () => Promise<{ data: T | null; error: string | null }>,
  options: APIOptions = {},
): APIResponse<T> {
  const { immediate = true, loadingKey, onSuccess, onError, showErrorNotification = true } = options

  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { error: showError } = useNotificationHelpers()
  const { setLoading: setGlobalLoading } = useLoading()

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      if (loadingKey) {
        setGlobalLoading(loadingKey, true)
      }

      const result = await fetcher()

      if (result.error) {
        setError(result.error)
        if (showErrorNotification) {
          showError("Error", result.error)
        }
        onError?.(result.error)
      } else {
        setData(result.data)
        setError(null)
        onSuccess?.(result.data)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      if (showErrorNotification) {
        showError("Error", errorMessage)
      }
      onError?.(errorMessage)
    } finally {
      setLoading(false)
      if (loadingKey) {
        setGlobalLoading(loadingKey, false)
      }
    }
  }, [fetcher, loadingKey, onSuccess, onError, showErrorNotification, showError, setGlobalLoading])

  useEffect(() => {
    if (immediate) {
      fetchData()
    }
  }, [immediate, fetchData])

  return {
    data,
    error,
    loading,
    refetch: fetchData,
  }
}

// Specialized hooks for common operations
export function useCourses(filters?: any) {
  return useAPI(
    () => import("@/services/enhanced-course-service").then(({ courseService }) => courseService.getCourses(filters)),
    { loadingKey: "courses" },
  )
}

export function useCourse(slug: string) {
  return useAPI(
    () => import("@/services/enhanced-course-service").then(({ courseService }) => courseService.getCourseBySlug(slug)),
    { loadingKey: `course-${slug}` },
  )
}

// Mutation hook for API calls that modify data
export function useMutation<T, P = any>(
  mutationFn: (params: P) => Promise<{ data: T | null; error: string | null }>,
  options: {
    onSuccess?: (data: T) => void
    onError?: (error: string) => void
    showSuccessNotification?: boolean
    showErrorNotification?: boolean
    loadingKey?: string
  } = {},
) {
  const [loading, setLoading] = useState(false)
  const { success, error: showError } = useNotificationHelpers()
  const { setLoading: setGlobalLoading } = useLoading()

  const mutate = useCallback(
    async (params: P) => {
      try {
        setLoading(true)
        if (options.loadingKey) {
          setGlobalLoading(options.loadingKey, true)
        }

        const result = await mutationFn(params)

        if (result.error) {
          if (options.showErrorNotification !== false) {
            showError("Error", result.error)
          }
          options.onError?.(result.error)
          return { success: false, error: result.error }
        } else {
          if (options.showSuccessNotification) {
            success("Success", "Operation completed successfully")
          }
          options.onSuccess?.(result.data!)
          return { success: true, data: result.data }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
        if (options.showErrorNotification !== false) {
          showError("Error", errorMessage)
        }
        options.onError?.(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setLoading(false)
        if (options.loadingKey) {
          setGlobalLoading(options.loadingKey, false)
        }
      }
    },
    [mutationFn, options, showError, success, setGlobalLoading],
  )

  return {
    mutate,
    loading,
  }
}
