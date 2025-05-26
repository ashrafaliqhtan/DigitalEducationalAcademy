import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"

interface CheckoutPageProps {
  params: {
    slug: string
  }
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const supabase = getSupabaseServerClient()

  // Get course details
  const { data: course, error } = await supabase.from("courses").select("id").eq("slug", params.slug).single()

  if (error || !course) {
    redirect("/courses")
  }

  // Redirect to the ID-based checkout page
  redirect(`/courses/id/${course.id}/checkout`)
}
