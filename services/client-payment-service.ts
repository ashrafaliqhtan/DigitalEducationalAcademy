import { createClient } from "@/lib/supabase/client"

export class ClientPaymentService {
  private supabase = createClient()

  async confirmPayment(paymentIntentId: string, courseId: string) {
    try {
      // This would typically call a server action or API route
      const response = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId,
          courseId,
        }),
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error confirming payment:", error)
      return { success: false, error: error instanceof Error ? error.message : "Payment confirmation failed" }
    }
  }

  async getPaymentHistory() {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()

      if (!user) {
        return { success: false, error: "Not authenticated" }
      }

      const { data: payments, error } = await this.supabase
        .from("payments")
        .select(`
          *,
          course:courses(id, title, slug, image)
        `)
        .eq("user_id", user.id)
        .order("payment_date", { ascending: false })

      if (error) throw error

      return { success: true, payments: payments || [] }
    } catch (error) {
      console.error("Error fetching payment history:", error)
      return { success: false, error: error instanceof Error ? error.message : "Failed to fetch payment history" }
    }
  }
}

export const clientPaymentService = new ClientPaymentService()
