import { loadStripe } from "@stripe/stripe-js"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// Initialize Stripe
export const getStripe = async () => {
  const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!stripePublicKey) {
    throw new Error("Missing Stripe publishable key")
  }
  return await loadStripe(stripePublicKey)
}

// Server-side Stripe functions
export async function createPaymentIntent(amount: number, metadata: Record<string, any>) {
  // Import Stripe dynamically to avoid client-side issues
  const Stripe = (await import("stripe")).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
  })

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }
  } catch (error: any) {
    console.error("Error creating payment intent:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  // Import Stripe dynamically to avoid client-side issues
  const Stripe = (await import("stripe")).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
  })

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return {
      success: true,
      paymentIntent,
    }
  } catch (error: any) {
    console.error("Error retrieving payment intent:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

export async function recordPayment(
  userId: string,
  paymentIntentId: string,
  amount: number,
  courseId: string,
  status: string,
) {
  const supabase = getSupabaseServerClient()

  try {
    const { data, error } = await supabase.from("payments").insert({
      user_id: userId,
      payment_intent_id: paymentIntentId,
      amount,
      course_id: courseId,
      status,
      payment_date: new Date().toISOString(),
    })

    if (error) {
      console.error("Error recording payment:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Error recording payment:", error)
    return { success: false, error: error.message }
  }
}
