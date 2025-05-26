import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import CoursePaymentForm from "@/components/payment/course-payment-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface CheckoutPageProps {
  params: {
    id: string
  }
}

export default async function CheckoutByIdPage({ params }: CheckoutPageProps) {
  const supabase = getSupabaseServerClient()
  const courseId = Number.parseInt(params.id)

  if (isNaN(courseId)) {
    notFound()
  }

  // Get course details by ID
  const { data: course, error } = await supabase.from("courses").select("*").eq("id", courseId).single()

  if (error || !course) {
    notFound()
  }

  // Check if course is free
  if (!course.price || course.price <= 0) {
    notFound()
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <Suspense fallback={<PaymentFormSkeleton />}>
          <CoursePaymentForm courseId={course.id} courseName={course.title} coursePrice={course.price} />
        </Suspense>
      </div>
    </div>
  )
}

function PaymentFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-8 w-3/4" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-full" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )
}
