import { ShimmerSkeleton } from "@/components/ui/skeleton"

export default function HeroSkeleton() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background skeleton */}
      <div className="absolute inset-0">
        <ShimmerSkeleton className="w-full h-full" />
      </div>

      {/* Content skeleton */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Title skeleton */}
          <ShimmerSkeleton className="h-12 w-3/4 mx-auto mb-4" />
          <ShimmerSkeleton className="h-12 w-1/2 mx-auto" />

          {/* Subtitle skeleton */}
          <ShimmerSkeleton className="h-6 w-2/3 mx-auto mb-8" />

          {/* Buttons skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ShimmerSkeleton className="h-12 w-40" />
            <ShimmerSkeleton className="h-12 w-32" />
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center">
                <ShimmerSkeleton className="h-8 w-16 mx-auto mb-2" />
                <ShimmerSkeleton className="h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
