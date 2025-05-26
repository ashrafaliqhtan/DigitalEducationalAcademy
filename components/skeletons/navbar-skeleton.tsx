import { ShimmerSkeleton } from "@/components/ui/skeleton"

export default function NavbarSkeleton() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo skeleton */}
        <ShimmerSkeleton className="h-8 w-32" />

        {/* Desktop navigation skeleton */}
        <div className="hidden md:flex items-center space-x-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <ShimmerSkeleton key={i} className="h-4 w-16" />
          ))}
        </div>

        {/* Right side actions skeleton */}
        <div className="flex items-center space-x-4">
          <ShimmerSkeleton className="h-8 w-8 rounded-full" />
          <ShimmerSkeleton className="h-8 w-8 rounded-full" />
          <ShimmerSkeleton className="h-8 w-8 rounded-full" />
          <ShimmerSkeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>
    </nav>
  )
}
