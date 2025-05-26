"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { confirmCoursePayment } from "@/app/actions/payment-actions"
import { CheckCircle, Loader2 } from "lucide-react"

export default function PaymentSuccessPage() {
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [courseId, setCourseId] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { t } = useLanguage()

  useEffect(() => {
    const verifyPayment = async () => {
      const paymentIntentId = searchParams.get("payment_intent_id")
      const courseId = searchParams.get("course_id")

      if (!paymentIntentId || !courseId) {
        setError(t("payment.missingParameters"))
        setIsProcessing(false)
        return
      }

      setCourseId(courseId)

      try {
        const result = await confirmCoursePayment(paymentIntentId, courseId)

        if (result.success) {
          toast({
            title: t("payment.success"),
            description: t("payment.successDesc"),
          })
        } else {
          setError(result.message || t("payment.verificationFailed"))
          toast({
            title: t("payment.error"),
            description: result.message || t("payment.verificationFailed"),
            variant: "destructive",
          })
        }
      } catch (err) {
        console.error("Payment verification error:", err)
        setError(t("payment.unexpectedError"))
        toast({
          title: t("payment.error"),
          description: t("payment.unexpectedError"),
          variant: "destructive",
        })
      } finally {
        setIsProcessing(false)
      }
    }

    verifyPayment()
  }, [searchParams, toast, t])

  const handleStartLearning = () => {
    if (courseId) {
      router.push(`/courses/${courseId}/learn`)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {!error && <CheckCircle className="h-6 w-6 text-green-500" />}
            {error ? t("payment.paymentIssue") : t("payment.paymentSuccess")}
          </CardTitle>
          <CardDescription>{error ? t("payment.paymentIssueDesc") : t("payment.paymentSuccessDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p>{t("payment.verifying")}</p>
            </div>
          ) : error ? (
            <div className="text-destructive">{error}</div>
          ) : (
            <div className="space-y-4">
              <p>{t("payment.enrollmentComplete")}</p>
              <p>{t("payment.accessCourse")}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            {t("common.dashboard")}
          </Button>
          {!error && <Button onClick={handleStartLearning}>{t("courses.startLearning")}</Button>}
        </CardFooter>
      </Card>
    </div>
  )
}
