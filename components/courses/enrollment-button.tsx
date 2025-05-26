import { cn } from "@/lib/utils"
import type { Course } from "@prisma/client"
import { ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import type { FC } from "react"

interface EnrollmentButtonProps {
  course: Course
  price: number | null
  isEnrolled: boolean
  isLoading: boolean
}

const EnrollmentButton: FC<EnrollmentButtonProps> = ({ course, price, isEnrolled, isLoading }) => {
  const buttonClasses = "bg-sky-700 hover:bg-sky-600 text-white rounded-md py-2 px-4 transition"

  if (isLoading) {
    return (
      <button
        type="button"
        disabled
        className="flex items-center bg-sky-700 text-white rounded-md py-2 px-4 opacity-75 cursor-not-allowed"
      >
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </button>
    )
  }

  if (isEnrolled) {
    return (
      <Link href={`/courses/${course.id}`} className={cn(buttonClasses)}>
        Go to course
      </Link>
    )
  }

  if (!price || price === 0) {
    return (
      <Link href={`/courses/${course.id}`} className={cn(buttonClasses)}>
        Get started
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    )
  }

  return (
    <Link href={`/courses/id/${course.id}/checkout`} className={cn(buttonClasses)}>
      Enroll now for ${price}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  )
}

export default EnrollmentButton
