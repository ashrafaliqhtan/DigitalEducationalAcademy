import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { retrievePaymentIntent } from "@/lib/payment/stripe-service"

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, courseId } = await request.json()
    const supabase = getSupabaseServerClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Verify payment with Stripe
    const paymentResult = await retrievePaymentIntent(paymentIntentId)

    if (!paymentResult.success || paymentResult.paymentIntent.status !== "succeeded") {
      return NextResponse.json({ success: false, message: "Payment verification failed" }, { status: 400 })
    }

    const amount = paymentResult.paymentIntent.amount / 100 // Convert from cents

    // Record payment in database
    const { error: paymentError } = await supabase.from("payments").upsert({
      user_id: user.id,
      payment_intent_id: paymentIntentId,
      amount,
      course_id: courseId,
      status: "completed",
      payment_date: new Date().toISOString(),
    })

    if (paymentError) {
      console.error("Error recording payment:", paymentError)
      return NextResponse.json({ success: false, message: "Failed to record payment" }, { status: 500 })
    }

    // Enroll user in course
    const { error: enrollError } = await supabase.from("enrollments").upsert({
      user_id: user.id,
      course_id: courseId,
      enrolled_at: new Date().toISOString(),
      status: "active",
    })

    if (enrollError) {
      console.error("Error enrolling user:", enrollError)
      return NextResponse.json({ success: false, message: "Payment successful but enrollment failed" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Payment confirmed and enrollment successful" })
  } catch (error) {
    console.error("Error confirming payment:", error)
    return NextResponse.json({ success: false, message: "An error occurred while confirming payment" }, { status: 500 })
  }
}
