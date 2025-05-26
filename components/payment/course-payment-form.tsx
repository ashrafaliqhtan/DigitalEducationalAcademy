"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { initiateCoursePayment, confirmCoursePayment } from "@/app/actions/payment-actions"
import { Loader2 } from "lucide-react"

// Initialize Stripe outside of the component
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

interface CoursePaymentFormProps {
  courseId: string
  courseName: string
  coursePrice: number
}

export default function CoursePaymentForm({ courseId, courseName, coursePrice }: CoursePaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const setupPayment = async () => {
      setIsLoading(true)
      try {
        const result = await initiateCoursePayment(courseId)

        if (result.success) {
          if (result.alreadyEnrolled) {
            toast({
              title: t("courses.alreadyEnrolled"),
              description: t("courses.alreadyEnrolledDesc"),
            })
            router.push(`/courses/${courseId}/learn`)
            return
          }

          if (result.clientSecret) {
            setClientSecret(result.clientSecret)
            setPaymentIntentId(result.paymentIntentId)
          } else {
            // If no client secret but success, it means it's a free course
            toast({
              title: t("courses.enrollmentSuccess"),
              description: t("courses.enrollmentSuccessDesc", { courseName }),
            })
            router.push(`/courses/${courseId}/learn`)
          }
        } else {
          setError(result.message || t("payment.initializationFailed"))
          toast({
            title: t("payment.error"),
            description: result.message || t("payment.initializationFailed"),
            variant: "destructive",
          })
        }
      } catch (err) {
        console.error("Payment initialization error:", err)
        setError(t("payment.unexpectedError"))
        toast({
          title: t("payment.error"),
          description: t("payment.unexpectedError"),
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    setupPayment()
  }, [courseId, courseName, router, t, toast])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>{t("payment.initializing")}</p>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("payment.error")}</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.back()}>{t("common.goBack")}</Button>
        </CardFooter>
      </Card>
    )
  }

  if (!clientSecret) {
    return null
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm
        courseId={courseId}
        courseName={courseName}
        coursePrice={coursePrice}
        paymentIntentId={paymentIntentId!}
      />
    </Elements>
  )
}

function CheckoutForm({
  courseId,
  courseName,
  coursePrice,
  paymentIntentId,
}: {
  courseId: string
  courseName: string
  coursePrice: number
  paymentIntentId: string
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {
      // Complete payment with Stripe
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/courses/payment-success?course_id=${courseId}&payment_intent_id=${paymentIntentId}`,
        },
        redirect: "if_required",
      })

      if (result.error) {
        setMessage(result.error.message || t("payment.paymentFailed"))
        toast({
          title: t("payment.paymentFailed"),
          description: result.error.message,
          variant: "destructive",
        })
      } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        // Payment succeeded, confirm on our server
        const confirmResult = await confirmCoursePayment(paymentIntentId, courseId)

        if (confirmResult.success) {
          toast({
            title: t("payment.success"),
            description: t("payment.successDesc"),
          })
          router.push(`/courses/${courseId}/learn`)
        } else {
          setMessage(confirmResult.message || t("payment.confirmationFailed"))
          toast({
            title: t("payment.confirmationFailed"),
            description: confirmResult.message,
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Payment error:", error)
      setMessage(t("payment.unexpectedError"))
      toast({
        title: t("payment.error"),
        description: t("payment.unexpectedError"),
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatPrice = (price: number) => {
    return language === "en" ? `$${price.toFixed(2)}` : `${price.toFixed(2)} $`
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t("payment.checkoutTitle")}</CardTitle>
        <CardDescription>{t("payment.purchasingCourse", { courseName })}</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="payment-form" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <PaymentElement id="payment-element" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t("payment.coursePrice")}</span>
                <span>{formatPrice(coursePrice)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>{t("payment.total")}</span>
                <span>{formatPrice(coursePrice)}</span>
              </div>
            </div>

            <Button type="submit" disabled={isProcessing || !stripe || !elements} className="w-full" size="lg">
              {isProcessing ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("payment.processing")}
                </span>
              ) : (
                t("payment.payNow")
              )}
            </Button>

            {message && <div className="text-destructive text-sm mt-2">{message}</div>}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
