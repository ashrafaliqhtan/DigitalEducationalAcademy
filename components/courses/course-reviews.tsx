"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Star, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useLanguage } from "@/contexts/language-context"

interface CourseReviewsProps {
  courseId: string
}

interface Review {
  id: string
  user_id: string
  course_id: string
  rating: number
  comment: string
  created_at: string
  helpful_count: number
  not_helpful_count: number
  user_profile?: {
    full_name: string
    avatar_url: string
  }
}

export default function CourseReviews({ courseId }: CourseReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [userReview, setUserReview] = useState<Review | null>(null)
  const [newReviewText, setNewReviewText] = useState("")
  const [newRating, setNewRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [actualCourseId, setActualCourseId] = useState<string | null>(null)
  const [ratingStats, setRatingStats] = useState({
    average: 0,
    total: 0,
    distribution: [0, 0, 0, 0, 0],
  })
  const { user } = useAuth()
  const { toast } = useToast()
  const { t } = useLanguage()

  // First, get the actual UUID for the course if courseId is not a UUID
  useEffect(() => {
    const fetchCourseUUID = async () => {
      try {
        // Check if courseId is already a UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (uuidRegex.test(courseId)) {
          setActualCourseId(courseId)
          return
        }

        // If not a UUID, fetch the course from the database using the slug or numeric ID
        const supabase = getSupabaseBrowserClient()

        // Try to find the course by slug first
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("id")
          .or(`slug.eq.${courseId},id.eq.${courseId}`)
          .single()

        if (courseError) {
          console.error("Error fetching course:", courseError)
          setActualCourseId(null)
          return
        }

        if (courseData) {
          setActualCourseId(courseData.id)
        } else {
          console.error("Course not found:", courseId)
          setActualCourseId(null)
        }
      } catch (error) {
        console.error("Error in fetchCourseUUID:", error)
        setActualCourseId(null)
      }
    }

    fetchCourseUUID()
  }, [courseId])

  // Then fetch reviews once we have the actual course UUID
  useEffect(() => {
    const fetchReviews = async () => {
      if (!actualCourseId) return

      try {
        const supabase = getSupabaseBrowserClient()

        // Fetch reviews without trying to join with profiles
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select("*")
          .eq("course_id", actualCourseId)
          .order("created_at", { ascending: false })

        if (reviewsError) throw reviewsError

        // Check if user has already reviewed
        let userReviewData = null
        if (user) {
          const { data: userReviewResult } = await supabase
            .from("reviews")
            .select("*")
            .eq("course_id", actualCourseId)
            .eq("user_id", user.id)
            .maybeSingle()

          userReviewData = userReviewResult
          setUserReview(userReviewData)
        }

        // If we have reviews, fetch the user profiles separately
        if (reviewsData && reviewsData.length > 0) {
          // Get unique user IDs from reviews
          const userIds = [...new Set(reviewsData.map((review) => review.user_id))]

          // Fetch profiles for these users
          const { data: profilesData, error: profilesError } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url")
            .in("id", userIds)

          if (profilesError) {
            console.error("Error fetching profiles:", profilesError)
          } else if (profilesData) {
            // Create a map of user_id to profile data
            const profilesMap = profilesData.reduce(
              (acc, profile) => {
                acc[profile.id] = profile
                return acc
              },
              {} as Record<string, any>,
            )

            // Attach profile data to reviews
            const reviewsWithProfiles = reviewsData.map((review) => ({
              ...review,
              user_profile: profilesMap[review.user_id] || null,
            }))

            setReviews(reviewsWithProfiles)
          }

          // Calculate rating statistics
          const total = reviewsData.length
          const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0)
          const average = sum / total

          // Calculate distribution
          const distribution = [0, 0, 0, 0, 0]
          reviewsData.forEach((review) => {
            distribution[review.rating - 1]++
          })

          setRatingStats({
            average,
            total,
            distribution,
          })
        } else {
          setReviews([])
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (actualCourseId) {
      fetchReviews()
    } else if (actualCourseId === null) {
      // If we've determined there's no valid course ID, stop loading
      setIsLoading(false)
    }
  }, [actualCourseId, user])

  const handleSubmitReview = async () => {
    if (!actualCourseId) {
      toast({
        title: t("courses.reviews.errorSubmitting"),
        description: t("courses.reviews.courseNotFound"),
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: t("courses.reviews.loginRequired"),
        description: t("courses.reviews.loginToReview"),
        variant: "destructive",
      })
      return
    }

    if (newReviewText.trim() === "") {
      toast({
        title: t("courses.reviews.reviewRequired"),
        description: t("courses.reviews.pleaseEnterReview"),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const reviewData = {
        course_id: actualCourseId,
        user_id: user.id,
        rating: newRating,
        comment: newReviewText,
      }

      let result

      if (userReview) {
        // Update existing review
        result = await supabase.from("reviews").update(reviewData).eq("id", userReview.id).select()
      } else {
        // Insert new review
        result = await supabase.from("reviews").insert(reviewData).select()
      }

      if (result.error) throw result.error

      toast({
        title: userReview ? t("courses.reviews.reviewUpdated") : t("courses.reviews.reviewSubmitted"),
        description: t("courses.reviews.thankYouForReview"),
      })

      // Fetch the user's profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single()

      // Create the new review with profile data
      const newReviewWithProfile = {
        ...result.data[0],
        user_profile: profileData || null,
      }

      // Update the reviews state
      if (userReview) {
        setReviews(reviews.map((r) => (r.id === userReview.id ? newReviewWithProfile : r)))
      } else {
        setReviews([newReviewWithProfile, ...reviews])
      }

      setUserReview(result.data[0])
      setNewReviewText("")
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: t("courses.reviews.errorSubmitting"),
        description: t("courses.reviews.pleaseTryAgain"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-20 bg-muted rounded-lg"></div>
        <div className="h-40 bg-muted rounded-lg"></div>
        <div className="h-40 bg-muted rounded-lg"></div>
      </div>
    )
  }

  if (!actualCourseId) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h4 className="text-lg font-medium mb-2">{t("courses.reviews.courseNotFound")}</h4>
        <p className="text-muted-foreground">{t("courses.reviews.unableToLoadReviews")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 border rounded-lg bg-card">
        <div className="flex flex-col items-center justify-center">
          <div className="text-5xl font-bold mb-2">{ratingStats.average.toFixed(1)}</div>
          <div className="flex mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(ratingStats.average) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            {ratingStats.total} {t("courses.reviews.totalReviews")}
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const percentage =
              ratingStats.total > 0 ? (ratingStats.distribution[rating - 1] / ratingStats.total) * 100 : 0

            return (
              <div key={rating} className="flex items-center gap-2">
                <div className="flex items-center w-12">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="h-4 w-4 ml-1 text-yellow-400 fill-yellow-400" />
                </div>
                <Progress value={percentage} className="h-2 flex-1" />
                <div className="w-12 text-right text-sm text-muted-foreground">
                  {ratingStats.distribution[rating - 1]}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Write a Review */}
      {user && !userReview && (
        <div className="border rounded-lg p-6 bg-card">
          <h3 className="text-lg font-medium mb-4">{t("courses.reviews.writeReview")}</h3>

          <div className="mb-4">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-sm font-medium">{t("courses.reviews.rating")}:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setNewRating(star)} className="focus:outline-none">
                  <Star
                    className={`h-6 w-6 ${star <= newRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                </button>
              ))}
            </div>

            <Textarea
              placeholder={t("courses.reviews.shareYourExperience")}
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              rows={4}
              className="mb-4"
            />

            <Button onClick={handleSubmitReview} disabled={isSubmitting}>
              {isSubmitting ? t("common.submitting") : t("courses.reviews.submitReview")}
            </Button>
          </div>
        </div>
      )}

      {/* User's Existing Review */}
      {user && userReview && (
        <div className="border rounded-lg p-6 bg-card">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium">{t("courses.reviews.yourReview")}</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setNewRating(userReview.rating)
                setNewReviewText(userReview.comment)
                setUserReview(null)
              }}
            >
              {t("common.edit")}
            </Button>
          </div>

          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${star <= userReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-2">
              {new Date(userReview.created_at).toLocaleDateString()}
            </span>
          </div>

          <p>{userReview.comment}</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">{t("courses.reviews.studentReviews")}</h3>

        {reviews.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium mb-2">{t("courses.reviews.noReviewsYet")}</h4>
            <p className="text-muted-foreground">{t("courses.reviews.beFirstToReview")}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={review.user_profile?.avatar_url || ""}
                      alt={review.user_profile?.full_name || ""}
                    />
                    <AvatarFallback>{review.user_profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-medium">
                        {review.user_profile?.full_name || t("courses.reviews.anonymous")}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="mb-4">{review.comment}</p>

                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{review.helpful_count || 0}</span>
                      </button>
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        <ThumbsDown className="h-4 w-4" />
                        <span>{review.not_helpful_count || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
