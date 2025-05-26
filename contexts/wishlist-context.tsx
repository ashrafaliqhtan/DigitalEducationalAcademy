"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface WishlistItem {
  id: string
  user_id: string
  course_id: string
  created_at: string
}

interface WishlistContextType {
  wishlistItems: WishlistItem[] | null
  isLoading: boolean
  error: Error | null
  addToWishlist: (courseId: string) => Promise<void>
  removeFromWishlist: (courseId: string) => Promise<void>
  refreshWishlist: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistItems: null,
  isLoading: false,
  error: null,
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  refreshWishlist: async () => {},
})

export const useWishlist = () => useContext(WishlistContext)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()
  const supabase = getSupabaseBrowserClient()

  const fetchWishlist = async () => {
    if (!user) {
      setWishlistItems([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase.from("wishlist").select("*").eq("user_id", user.id)

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      setWishlistItems(data || [])
    } catch (err) {
      console.error("Error fetching wishlist:", err)
      setError(err instanceof Error ? err : new Error("Failed to fetch wishlist"))
      setWishlistItems([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [user])

  const addToWishlist = async (courseId: string) => {
    if (!user) {
      throw new Error("User must be logged in to add to wishlist")
    }

    try {
      const { error: insertError } = await supabase.from("wishlist").insert({
        user_id: user.id,
        course_id: courseId,
      })

      if (insertError) {
        throw new Error(insertError.message)
      }

      await fetchWishlist()
    } catch (err) {
      console.error("Error adding to wishlist:", err)
      throw err
    }
  }

  const removeFromWishlist = async (courseId: string) => {
    if (!user) {
      throw new Error("User must be logged in to remove from wishlist")
    }

    try {
      const { error: deleteError } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("course_id", courseId)

      if (deleteError) {
        throw new Error(deleteError.message)
      }

      await fetchWishlist()
    } catch (err) {
      console.error("Error removing from wishlist:", err)
      throw err
    }
  }

  const refreshWishlist = async () => {
    await fetchWishlist()
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isLoading,
        error,
        addToWishlist,
        removeFromWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}
