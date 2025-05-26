import CourseCardSkeleton from "./course-card-skeleton"

interface CourseGridSkeletonProps {
  count?: number
  variant?: "default" | "compact" | "featured"
}

export default function CourseGridSkeleton({ count = 8, variant = "default" }: CourseGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} variant={variant} />
      ))}
    </div>
  )
}
