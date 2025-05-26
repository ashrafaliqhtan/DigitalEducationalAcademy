//"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { createPaymentIntent, recordPayment, retrievePaymentIntent } from "@/lib/payment/stripe-service"
import { revalidatePath } from "next/cache"

export async function initiateCoursePayment(courseId: string) {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "You must be logged in to purchase a course" }
  }

  try {
    // Get the course details
    const { data: course, error: courseError } = await supabase.from("courses").select("*").eq("id", courseId).single()

    if (courseError || !course) {
      console.error("Error fetching course:", courseError)
      return { success: false, message: "Course not found" }
    }

    if (!course.price || course.price <= 0) {
      return { success: false, message: "This course is free and doesn't require payment" }
    }

    // Check if user is already enrolled
    const { data: existingEnrollment } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle()

    if (existingEnrollment) {
      return {
        success: true,
        message: "You are already enrolled in this course",
        alreadyEnrolled: true,
      }
    }

    // Create payment intent with Stripe
    const paymentResult = await createPaymentIntent(course.price, {
      courseId,
      userId: user.id,
      courseName: course.title,
      userEmail: user.email,
    })

    if (!paymentResult.success) {
      return { success: false, message: paymentResult.error }
    }

    // Record the pending payment in our database
    await recordPayment(user.id, paymentResult.paymentIntentId, course.price, courseId, "pending")

    return {
      success: true,
      clientSecret: paymentResult.clientSecret,
      paymentIntentId: paymentResult.paymentIntentId,
      amount: course.price,
      courseId: course.id,
      courseName: course.title,
    }
  } catch (error) {
    console.error("Error initiating course payment:", error)
    return { success: false, message: "An error occurred while processing your payment" }
  }
}

export async function confirmCoursePayment(paymentIntentId: string, courseId: string) {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "You must be logged in to confirm payment" }
  }

  try {
    // Verify the payment intent status
    const paymentResult = await retrievePaymentIntent(paymentIntentId)

    if (!paymentResult.success) {
      return { success: false, message: "Failed to retrieve payment information" }
    }

    const { paymentIntent } = paymentResult

    if (paymentIntent.status !== "succeeded") {
      return { success: false, message: `Payment not completed. Status: ${paymentIntent.status}` }
    }

    // Update the payment record
    await recordPayment(
      user.id,
      paymentIntentId,
      paymentIntent.amount / 100, // Convert from cents
      courseId,
      "completed",
    )

    // Enroll the user in the course
    const { error: enrollError } = await supabase.from("enrollments").insert({
      user_id: user.id,
      course_id: courseId,
      enrolled_at: new Date().toISOString(),
      status: "active",
    })

    if (enrollError) {
      console.error("Error enrolling user:", enrollError)
      return { success: false, message: "Payment successful but enrollment failed" }
    }

    // Revalidate relevant paths
    revalidatePath(`/courses/${courseId}`)
    revalidatePath("/dashboard")

    return {
      success: true,
      message: "Payment confirmed and enrollment successful",
    }
  } catch (error) {
    console.error("Error confirming course payment:", error)
    return { success: false, message: "An error occurred while confirming your payment" }
  }
}

export async function createCoursePayment(courseId: string, amount: number) {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "You must be logged in to make a payment" }
  }

  try {
    // Create payment intent with Stripe
    const paymentResult = await createPaymentIntent(amount, {
      courseId,
      userId: user.id,
    })

    if (!paymentResult.success) {
      return { success: false, message: paymentResult.error }
    }

    return {
      success: true,
      clientSecret: paymentResult.clientSecret,
      paymentIntentId: paymentResult.paymentIntentId,
    }
  } catch (error) {
    console.error("Error creating payment:", error)
    return { success: false, message: "An error occurred while creating the payment" }
  }
}

export async function confirmPayment(paymentIntentId: string, courseId: string) {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "You must be logged in to confirm payment" }
  }

  try {
    // Verify payment with Stripe
    const paymentResult = await retrievePaymentIntent(paymentIntentId)

    if (!paymentResult.success || paymentResult.paymentIntent.status !== "succeeded") {
      return { success: false, message: "Payment verification failed" }
    }

    const amount = paymentResult.paymentIntent.amount / 100 // Convert from cents

    // Record payment in database
    const recordResult = await recordPayment(user.id, paymentIntentId, amount, courseId, "completed")

    if (!recordResult.success) {
      return { success: false, message: recordResult.error }
    }

    // Enroll user in course
    const { error: enrollError } = await supabase.from("enrollments").insert({
      user_id: user.id,
      course_id: courseId,
      enrolled_at: new Date().toISOString(),
      status: "active",
    })

    if (enrollError) {
      console.error("Error enrolling user:", enrollError)
      return { success: false, message: "Payment successful but enrollment failed" }
    }

    revalidatePath("/dashboard")
    revalidatePath(`/courses/${courseId}`)

    return { success: true, message: "Payment confirmed and enrollment successful" }
  } catch (error) {
    console.error("Error confirming payment:", error)
    return { success: false, message: "An error occurred while confirming payment" }
  }
}

export async function getPaymentHistory() {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "You must be logged in to view payment history" }
  }

  try {
    const { data: payments, error } = await supabase
      .from("payments")
      .select(
        `
        *,
        course:courses(id, title, slug, image)
      `,
      )
      .eq("user_id", user.id)
      .order("payment_date", { ascending: false })

    if (error) {
      console.error("Error fetching payment history:", error)
      return { success: false, message: "Failed to fetch payment history" }
    }

    return { success: true, payments: payments || [] }
  } catch (error) {
    console.error("Error fetching payment history:", error)
    return { success: false, message: "An error occurred while fetching payment history" }
  }
}
