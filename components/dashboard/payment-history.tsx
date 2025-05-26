"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Download, Receipt } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { getPaymentHistory } from "@/app/actions/payment-actions"
import { getInvoiceData } from "@/app/actions/invoice-actions"
import { downloadInvoicePDF } from "@/lib/pdf/invoice-generator"

interface Payment {
  id: string
  amount: number
  status: string
  payment_date: string
  invoice_number?: string
  course: {
    id: string
    title: string
    slug: string
  }
}

export default function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null)
  const { t, language } = useLanguage()
  const { toast } = useToast()

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const result = await getPaymentHistory()
        if (result.success) {
          setPayments(result.payments)
        } else {
          toast({
            title: t("payment.error"),
            description: result.message,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching payment history:", error)
        toast({
          title: t("payment.error"),
          description: t("payment.fetchError"),
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayments()
  }, [t, toast])

  const handleDownloadInvoice = async (paymentId: string) => {
    setDownloadingInvoice(paymentId)
    try {
      const result = await getInvoiceData(paymentId)

      if (result.success && result.invoiceData) {
        downloadInvoicePDF(result.invoiceData)
        toast({
          title: t("invoice.downloadSuccess"),
          description: t("invoice.downloadSuccessDesc"),
        })
      } else {
        toast({
          title: t("invoice.downloadError"),
          description: result.message || t("invoice.downloadErrorDesc"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error downloading invoice:", error)
      toast({
        title: t("invoice.downloadError"),
        description: t("invoice.downloadErrorDesc"),
        variant: "destructive",
      })
    } finally {
      setDownloadingInvoice(null)
    }
  }

  const formatPrice = (price: number) => {
    return language === "en" ? `$${price.toFixed(2)}` : `${price.toFixed(2)} $`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === "en" ? "en-US" : "ar-SA")
  }

  if (isLoading) {
    return <PaymentHistorySkeleton />
  }

  if (payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            {t("payment.history")}
          </CardTitle>
          <CardDescription>{t("payment.historyDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">{t("payment.noPayments")}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          {t("payment.history")}
        </CardTitle>
        <CardDescription>{t("payment.historyDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium">{payment.course.title}</h4>
                <p className="text-sm text-muted-foreground">{formatDate(payment.payment_date)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                    {t(`payment.status.${payment.status}`)}
                  </Badge>
                  <span className="font-medium">{formatPrice(payment.amount)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {payment.status === "completed" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadInvoice(payment.id)}
                    disabled={downloadingInvoice === payment.id}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {downloadingInvoice === payment.id ? t("invoice.downloading") : t("invoice.download")}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function PaymentHistorySkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
