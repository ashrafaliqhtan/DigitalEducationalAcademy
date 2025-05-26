"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function generateInvoice(paymentId: string, language: "en" | "ar" = "en") {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "You must be logged in to generate an invoice" }
  }

  try {
    // Get the payment details with course information
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select(
        `
        *,
        course:courses(id, title)
      `,
      )
      .eq("id", paymentId)
      .eq("user_id", user.id)
      .single()

    if (paymentError || !payment) {
      console.error("Error fetching payment:", paymentError)
      return { success: false, message: "Payment not found" }
    }

    // Get user profile for name
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Error fetching profile:", profileError)
    }

    // Generate invoice number (payment ID + timestamp)
    const invoiceNumber = `INV-${payment.id.toString().padStart(6, "0")}`

    // Update the payment record with invoice information
    await supabase
      .from("payments")
      .update({
        invoice_number: invoiceNumber,
      })
      .eq("id", paymentId)

    revalidatePath("/dashboard")

    return {
      success: true,
      invoiceNumber,
      invoiceData: {
        invoiceNumber,
        invoiceDate: new Date(payment.payment_date).toLocaleDateString(),
        customerName: profile?.full_name || user.email || "Customer",
        customerEmail: user.email || "",
        courseName: payment.course.title,
        coursePrice: payment.amount,
        paymentMethod: "Credit Card",
        paymentDate: new Date(payment.payment_date).toLocaleDateString(),
        companyName: language === "ar" ? "الأكاديمية التعليمية" : "Educational Academy",
        companyAddress:
          language === "ar" ? "123 شارع التعليم، المدينة، البلد" : "123 Education St, Learning City, LC 12345",
        companyEmail: "support@educationalacademy.com",
        companyPhone: "+1 (555) 123-4567",
      },
    }
  } catch (error) {
    console.error("Error generating invoice:", error)
    return { success: false, message: "An error occurred while generating the invoice" }
  }
}

export async function getInvoiceUrl(paymentId: string) {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "You must be logged in to access invoices" }
  }

  try {
    // Get the payment details
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("invoice_url, invoice_number")
      .eq("id", paymentId)
      .eq("user_id", user.id)
      .single()

    if (paymentError || !payment) {
      console.error("Error fetching payment:", paymentError)
      return { success: false, message: "Payment not found" }
    }

    if (!payment.invoice_number) {
      // Generate the invoice if it doesn't exist
      return await generateInvoice(paymentId)
    }

    return {
      success: true,
      invoiceNumber: payment.invoice_number,
      invoiceUrl: payment.invoice_url,
    }
  } catch (error) {
    console.error("Error getting invoice URL:", error)
    return { success: false, message: "An error occurred while retrieving the invoice" }
  }
}

export async function getInvoiceData(paymentId: string) {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "You must be logged in to view invoices" }
  }

  try {
    // Get payment details with course information
    const { data: payment, error } = await supabase
      .from("payments")
      .select(
        `
        *,
        course:courses(id, title, slug)
      `,
      )
      .eq("id", paymentId)
      .eq("user_id", user.id)
      .eq("status", "completed")
      .single()

    if (error || !payment) {
      console.error("Error fetching payment:", error)
      return { success: false, message: "Invoice not found" }
    }

    // Get user profile for name
    const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()

    // Generate invoice number if not exists
    let invoiceNumber = payment.invoice_number
    if (!invoiceNumber) {
      invoiceNumber = `INV-${payment.id.toString().padStart(6, "0")}`

      // Update the payment record with the invoice number
      await supabase.from("payments").update({ invoice_number: invoiceNumber }).eq("id", paymentId)
    }

    const invoiceData = {
      invoiceNumber,
      invoiceDate: new Date(payment.payment_date).toLocaleDateString(),
      dueDate: new Date(payment.payment_date).toLocaleDateString(),
      customerName: profile?.full_name || user.email || "Customer",
      customerEmail: user.email || "",
      courseName: payment.course?.title || "Course",
      coursePrice: payment.amount,
      paymentMethod: "Credit Card",
      paymentDate: new Date(payment.payment_date).toLocaleDateString(),
      companyName: "Educational Academy",
      companyAddress: "123 Education St, Learning City, LC 12345",
      companyEmail: "support@educationalacademy.com",
      companyPhone: "+1 (555) 123-4567",
    }

    return {
      success: true,
      invoiceData,
      payment,
    }
  } catch (error) {
    console.error("Error getting invoice data:", error)
    return { success: false, message: "An error occurred while fetching invoice data" }
  }
}
