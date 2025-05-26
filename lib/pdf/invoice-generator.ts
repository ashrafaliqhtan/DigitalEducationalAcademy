import jsPDF from "jspdf"

export interface InvoiceData {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  customerName: string
  customerEmail: string
  courseName: string
  coursePrice: number
  paymentMethod: string
  paymentDate: string
  companyName: string
  companyAddress: string
  companyEmail: string
  companyPhone: string
}

export function generateInvoicePDF(invoiceData: InvoiceData): jsPDF {
  const doc = new jsPDF()

  // Set font
  doc.setFont("helvetica")

  // Header
  doc.setFontSize(24)
  doc.setTextColor(40, 40, 40)
  doc.text(invoiceData.companyName, 20, 30)

  doc.setFontSize(16)
  doc.setTextColor(100, 100, 100)
  doc.text("INVOICE", 150, 30)

  // Company details
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  doc.text(invoiceData.companyAddress, 20, 45)
  doc.text(`Email: ${invoiceData.companyEmail}`, 20, 55)
  doc.text(`Phone: ${invoiceData.companyPhone}`, 20, 65)

  // Invoice details
  doc.setFontSize(10)
  doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, 150, 45)
  doc.text(`Date: ${invoiceData.invoiceDate}`, 150, 55)
  doc.text(`Due Date: ${invoiceData.dueDate}`, 150, 65)

  // Customer details
  doc.setFontSize(12)
  doc.setTextColor(40, 40, 40)
  doc.text("Bill To:", 20, 90)

  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  doc.text(invoiceData.customerName, 20, 105)
  doc.text(invoiceData.customerEmail, 20, 115)

  // Line separator
  doc.setDrawColor(200, 200, 200)
  doc.line(20, 130, 190, 130)

  // Table header
  doc.setFontSize(10)
  doc.setTextColor(40, 40, 40)
  doc.text("Description", 20, 145)
  doc.text("Amount", 150, 145)

  // Table content
  doc.setTextColor(80, 80, 80)
  doc.text(`Course: ${invoiceData.courseName}`, 20, 160)
  doc.text(`$${invoiceData.coursePrice.toFixed(2)}`, 150, 160)

  // Line separator
  doc.line(20, 170, 190, 170)

  // Total
  doc.setFontSize(12)
  doc.setTextColor(40, 40, 40)
  doc.text("Total:", 120, 185)
  doc.text(`$${invoiceData.coursePrice.toFixed(2)}`, 150, 185)

  // Payment details
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  doc.text("Payment Details:", 20, 210)
  doc.text(`Payment Method: ${invoiceData.paymentMethod}`, 20, 220)
  doc.text(`Payment Date: ${invoiceData.paymentDate}`, 20, 230)
  doc.text("Status: Paid", 20, 240)

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(120, 120, 120)
  doc.text("Thank you for your purchase!", 20, 270)
  doc.text("This is a computer-generated invoice.", 20, 280)

  return doc
}

export function downloadInvoicePDF(invoiceData: InvoiceData): void {
  const doc = generateInvoicePDF(invoiceData)
  doc.save(`invoice-${invoiceData.invoiceNumber}.pdf`)
}
