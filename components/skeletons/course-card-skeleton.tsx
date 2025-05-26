import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShimmerSkeleton } from "@/components/ui/skeleton"

interface CourseCardSkeletonProps {
  variant?: "default" | "compact" | "featured"
}

export default function CourseCardSkeleton({ variant = "default" }: CourseCardSkeletonProps) {
  const isFeatured = variant === "featured"
  const isCompact = variant === "compact"

  return (
    <Card className={`overflow-hidden ${isFeatured ? "md:flex" : ""}`}>
      <div
        className={`relative overflow-hidden ${
          isFeatured ? "md:w-2/5 aspect-video md:aspect-auto" : "aspect-video"
        } ${isCompact ? "aspect-[4/3]" : ""}`}
      >
        <ShimmerSkeleton className="w-full h-full" />

        {/* Badge skeleton */}
        <div className="absolute top-2 left-2">
          <ShimmerSkeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Wishlist button skeleton */}
        <div className="absolute top-2 right-2">
          <ShimmerSkeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      <div className={`flex flex-col ${isFeatured ? "md:w-3/5" : ""}`}>
        <CardContent className={`p-4 ${isFeatured ? "md:p-6" : ""}`}>
          {/* Title skeleton */}
          <div className="mb-2">
            <ShimmerSkeleton className={`h-6 w-3/4 mb-2 ${isFeatured ? "h-7" : ""}`} />
            {!isCompact && <ShimmerSkeleton className="h-4 w-full mb-1" />}
            {!isCompact && <ShimmerSkeleton className="h-4 w-2/3" />}
          </div>

          {/* Stats skeleton */}
          <div className={`flex items-center gap-3 mb-3 ${isCompact ? "gap-2" : ""}`}>
            <ShimmerSkeleton className="h-4 w-12" />
            <ShimmerSkeleton className="h-4 w-16" />
            {!isCompact && <ShimmerSkeleton className="h-4 w-14" />}
          </div>

          {/* Rating and price skeleton */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <ShimmerSkeleton className="h-4 w-20" />
            </div>
            <ShimmerSkeleton className="h-6 w-16" />
          </div>

          {/* Progress bar skeleton (sometimes visible) */}
          {Math.random() > 0.7 && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <ShimmerSkeleton className="h-3 w-12" />
                <ShimmerSkeleton className="h-3 w-8" />
              </div>
              <ShimmerSkeleton className="h-2 w-full rounded-full" />
            </div>
          )}
        </CardContent>

        <CardFooter className={`p-4 pt-0 mt-auto ${isFeatured ? "md:p-6 md:pt-0" : ""}`}>
          <ShimmerSkeleton className="h-10 w-full rounded-md" />
        </CardFooter>
      </div>
    </Card>
  )
}
