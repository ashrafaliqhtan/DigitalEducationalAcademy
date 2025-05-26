import { getSupabaseServerClient } from "@/lib/supabase/server"
import { generateInvoice } from "@/app/actions/invoice-actions"
import { redirect } from "next/navigation"

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Get the payment details
  const { data: payment } = await supabase
    .from("payments")
    .select("invoice_url")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  // If the invoice already exists, redirect to it
  if (payment?.invoice_url) {
    redirect(payment.invoice_url)
  }

  // Generate the invoice
  const result = await generateInvoice(params.id)

  if (result.success && result.invoiceUrl) {
    redirect(result.invoiceUrl)
  }

  // If we couldn't generate the invoice, redirect to dashboard
  redirect("/dashboard")
}
