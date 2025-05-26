"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { getInvoiceUrl } from "@/app/actions/invoice-actions"
import { FileText, Loader2 } from "lucide-react"

interface PaymentReceiptProps {
  paymentId: string
  courseTitle: string
  amount: number
  date: string
}

export default function PaymentReceipt({ paymentId, courseTitle, amount, date }: PaymentReceiptProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const { t, language } = useLanguage()

  const handleDownloadInvoice = async () => {
    setIsDownloading(true)
    try {
      const result = await getInvoiceUrl(paymentId)
      if (result.success && result.invoiceUrl) {
        window.open(result.invoiceUrl, "_blank")
      }
    } catch (error) {
      console.error("Error downloading invoice:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const formatPrice = (price: number) => {
    return language === "en" ? `$${price.toFixed(2)}` : `${price.toFixed(2)} $`
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return dateString
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t("payment.receiptTitle")}</CardTitle>
        <CardDescription>{t("payment.receiptDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("payment.course")}</span>
          <span className="font-medium">{courseTitle}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("payment.amount")}</span>
          <span className="font-medium">{formatPrice(amount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("payment.date")}</span>
          <span>{formatDate(date)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("payment.status")}</span>
          <span className="text-green-600 font-medium">{t("payment.statusCompleted")}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleDownloadInvoice} disabled={isDownloading}>
          {isDownloading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
          {t("payment.downloadInvoice")}
        </Button>
      </CardFooter>
    </Card>
  )
}
