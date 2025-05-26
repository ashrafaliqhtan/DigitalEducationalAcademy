import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShimmerSkeleton } from "@/components/ui/skeleton"

export default function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <ShimmerSkeleton className="w-full h-full" />

        {/* Badge skeleton */}
        <div className="absolute top-2 left-2">
          <ShimmerSkeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Discount badge skeleton */}
        {Math.random() > 0.6 && (
          <div className="absolute top-2 right-2">
            <ShimmerSkeleton className="h-6 w-12 rounded-full" />
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Title skeleton */}
        <ShimmerSkeleton className="h-6 w-3/4 mb-2" />

        {/* Description skeleton */}
        <ShimmerSkeleton className="h-4 w-full mb-1" />
        <ShimmerSkeleton className="h-4 w-2/3 mb-3" />

        {/* Rating skeleton */}
        <div className="flex items-center gap-2 mb-3">
          <ShimmerSkeleton className="h-4 w-20" />
          <ShimmerSkeleton className="h-4 w-12" />
        </div>

        {/* Price skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShimmerSkeleton className="h-6 w-16" />
            {Math.random() > 0.5 && <ShimmerSkeleton className="h-4 w-12" />}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <ShimmerSkeleton className="h-10 w-full rounded-md" />
      </CardFooter>
    </Card>
  )
}
