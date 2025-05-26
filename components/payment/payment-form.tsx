"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Wallet, Building, Lock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"

interface PaymentItem {
  id: string
  name: string
  price: number
  type: "course" | "service" | "product"
}

interface PaymentFormProps {
  items: PaymentItem[]
  onPaymentSuccess: (paymentIntentId: string) => void
  onPaymentError: (error: string) => void
}

export default function PaymentForm({ items, onPaymentSuccess, onPaymentError }: PaymentFormProps) {
  const { t, language } = useLanguage()
  const { toast } = useToast()

  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  })
  const [billingAddress, setBillingAddress] = useState({
    email: "",
    country: "",
    city: "",
    address: "",
    postalCode: "",
  })

  const subtotal = items.reduce((sum, item) => sum + item.price, 0)
  const tax = subtotal * 0.05 // 5% tax
  const total = subtotal + tax

  const formatPrice = (price: number) => {
    return language === "en" ? `$${price.toFixed(2)}` : `${price.toFixed(2)} $`
  }

  const handleCardInputChange = (field: string, value: string) => {
    if (field === "number") {
      // Format card number with spaces
      value = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
      if (value.length > 19) return
    } else if (field === "expiry") {
      // Format expiry as MM/YY
      value = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2")
      if (value.length > 5) return
    } else if (field === "cvc") {
      // Only allow numbers for CVC
      value = value.replace(/\D/g, "")
      if (value.length > 4) return
    }

    setCardDetails((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!billingAddress.email || !billingAddress.country || !billingAddress.city) {
      toast({
        title: t("payment.validationError"),
        description: t("payment.fillRequiredFields"),
        variant: "destructive",
      })
      return false
    }

    if (paymentMethod === "card") {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc || !cardDetails.name) {
        toast({
          title: t("payment.validationError"),
          description: t("payment.fillCardDetails"),
          variant: "destructive",
        })
        return false
      }

      // Basic card number validation (should be 16 digits)
      const cardNumber = cardDetails.number.replace(/\s/g, "")
      if (cardNumber.length !== 16) {
        toast({
          title: t("payment.invalidCard"),
          description: t("payment.invalidCardNumber"),
          variant: "destructive",
        })
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // In a real app, you would integrate with Stripe or another payment processor
      // For demo purposes, we'll simulate a successful payment
      const mockPaymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      onPaymentSuccess(mockPaymentIntentId)

      toast({
        title: t("payment.success"),
        description: t("payment.successDesc"),
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("payment.genericError")
      onPaymentError(errorMessage)

      toast({
        title: t("payment.failed"),
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t("payment.securePayment")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Billing Information */}
            <div>
              <h3 className="font-medium mb-4">{t("payment.billingInformation")}</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="email">{t("payment.email")} *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={billingAddress.email}
                    onChange={(e) => setBillingAddress((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">{t("payment.country")} *</Label>
                    <Input
                      id="country"
                      value={billingAddress.country}
                      onChange={(e) => setBillingAddress((prev) => ({ ...prev, country: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">{t("payment.city")} *</Label>
                    <Input
                      id="city"
                      value={billingAddress.city}
                      onChange={(e) => setBillingAddress((prev) => ({ ...prev, city: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">{t("payment.address")}</Label>
                  <Input
                    id="address"
                    value={billingAddress.address}
                    onChange={(e) => setBillingAddress((prev) => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">{t("payment.postalCode")}</Label>
                  <Input
                    id="postalCode"
                    value={billingAddress.postalCode}
                    onChange={(e) => setBillingAddress((prev) => ({ ...prev, postalCode: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Method */}
            <div>
              <h3 className="font-medium mb-4">{t("payment.paymentMethod")}</h3>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-4 w-4" />
                    {t("payment.creditDebitCard")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                    <Wallet className="h-4 w-4" />
                    PayPal
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                    <Building className="h-4 w-4" />
                    {t("payment.bankTransfer")}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Card Details */}
            {paymentMethod === "card" && (
              <div>
                <h3 className="font-medium mb-4">{t("payment.cardDetails")}</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardName">{t("payment.cardholderName")} *</Label>
                    <Input
                      id="cardName"
                      value={cardDetails.name}
                      onChange={(e) => handleCardInputChange("name", e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardNumber">{t("payment.cardNumber")} *</Label>
                    <Input
                      id="cardNumber"
                      value={cardDetails.number}
                      onChange={(e) => handleCardInputChange("number", e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">{t("payment.expiry")} *</Label>
                      <Input
                        id="expiry"
                        value={cardDetails.expiry}
                        onChange={(e) => handleCardInputChange("expiry", e.target.value)}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvc">{t("payment.cvc")} *</Label>
                      <Input
                        id="cvc"
                        value={cardDetails.cvc}
                        onChange={(e) => handleCardInputChange("cvc", e.target.value)}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PayPal Message */}
            {paymentMethod === "paypal" && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 text-sm">{t("payment.paypalRedirect")}</p>
              </div>
            )}

            {/* Bank Transfer Message */}
            {paymentMethod === "bank" && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 text-sm">{t("payment.bankTransferInstructions")}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isProcessing} size="lg">
              {isProcessing ? t("payment.processing") : `${t("payment.payNow")} ${formatPrice(total)}`}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t("payment.orderSummary")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Items */}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-600 capitalize">{item.type}</p>
                </div>
                <span className="font-medium">{formatPrice(item.price)}</span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{t("payment.subtotal")}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("payment.tax")}</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>{t("payment.total")}</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 p-3 rounded-lg mt-6">
            <div className="flex items-center gap-2 text-green-800">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-medium">{t("payment.secureTransaction")}</span>
            </div>
            <p className="text-xs text-green-700 mt-1">{t("payment.securityNotice")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
