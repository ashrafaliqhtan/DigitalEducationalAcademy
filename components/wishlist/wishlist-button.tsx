"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useLanguage } from "@/contexts/language-context"

interface WishlistButtonProps {
  courseId: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export default function WishlistButton({ courseId, variant = "ghost", size = "icon" }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist()
  const { toast } = useToast()
  const { t } = useLanguage()

  useEffect(() => {
    if (wishlistItems) {
      setIsInWishlist(wishlistItems.some((item) => item.course_id === courseId))
    }
  }, [wishlistItems, courseId])

  const handleToggleWishlist = async () => {
    if (!user) {
      toast({
        title: t("wishlist.loginRequired"),
        description: t("wishlist.loginToAddToWishlist"),
      })
      return
    }

    setIsLoading(true)

    try {
      if (isInWishlist) {
        await removeFromWishlist(courseId)
        toast({
          title: t("wishlist.removedFromWishlist"),
          description: t("wishlist.courseRemovedFromWishlist"),
        })
      } else {
        await addToWishlist(courseId)
        toast({
          title: t("wishlist.addedToWishlist"),
          description: t("wishlist.courseAddedToWishlist"),
        })
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
      toast({
        title: t("wishlist.error"),
        description: t("wishlist.errorTogglingWishlist"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleWishlist}
      disabled={isLoading}
      aria-label={isInWishlist ? t("wishlist.removeFromWishlist") : t("wishlist.addToWishlist")}
      className="rounded-full"
    >
      <Heart className={`h-[1.2rem] w-[1.2rem] ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} />
    </Button>
  )
}
