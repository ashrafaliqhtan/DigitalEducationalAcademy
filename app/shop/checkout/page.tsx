"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CreditCard, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useShop } from "@/contexts/shop-context"
import { useLanguage } from "@/contexts/language-context"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart } = useShop()
  const { t, language } = useLanguage()
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")

  if (cart.length === 0) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">{t("shop.emptyCart")}</h1>
        <p className="text-gray-600 mb-8">{t("shop.emptyCartCheckout")}</p>
        <Button asChild>
          <Link href="/shop">{t("shop.backToShop")}</Link>
        </Button>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Show success message
    toast({
      title: t("shop.orderSuccess"),
      description: t("shop.orderSuccessDesc"),
    })

    // Clear cart and redirect to download page
    clearCart()
    router.push("/shop/download")
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t("shop.checkout")}</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Billing Information */}
            <div className="rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">{t("shop.billingInformation")}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">{t("shop.firstName")}</Label>
                  <Input id="first-name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">{t("shop.lastName")}</Label>
                  <Input id="last-name" required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">{t("shop.email")}</Label>
                  <Input id="email" type="email" required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">{t("shop.address")}</Label>
                  <Input id="address" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">{t("shop.city")}</Label>
                  <Input id="city" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">{t("shop.country")}</Label>
                  <Input id="country" required />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">{t("shop.paymentMethod")}</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {t("shop.creditCard")}
                  </Label>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="card-number">{t("shop.cardNumber")}</Label>
                    <Input id="card-number" placeholder="0000 0000 0000 0000" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry">{t("shop.expiry")}</Label>
                    <Input id="expiry" placeholder="MM/YY" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">{t("shop.cvc")}</Label>
                    <Input id="cvc" placeholder="123" required />
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t("shop.processing") : t("shop.placeOrder")}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="rounded-lg border p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">{t("shop.orderSummary")}</h2>
            <ul className="space-y-4 mb-4">
              {cart.map((item) => (
                <li key={item.id} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500">
                        {language === "en" ? "$" : ""}
                        {item.price}
                        {language === "ar" ? " $" : ""}
                        {item.quantity > 1 && ` × ${item.quantity}`}
                      </p>
                      <p className="font-medium">
                        {language === "en" ? "$" : ""}
                        {(item.price * item.quantity).toFixed(2)}
                        {language === "ar" ? " $" : ""}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{t("shop.subtotal")}</span>
                <span className="font-medium">
                  {language === "en" ? "$" : ""}
                  {cartTotal.toFixed(2)}
                  {language === "ar" ? " $" : ""}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{t("shop.tax")}</span>
                <span className="font-medium">
                  {language === "en" ? "$" : ""}
                  {(cartTotal * 0.05).toFixed(2)}
                  {language === "ar" ? " $" : ""}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">{t("shop.total")}</span>
                <span className="text-lg font-bold">
                  {language === "en" ? "$" : ""}
                  {(cartTotal * 1.05).toFixed(2)}
                  {language === "ar" ? " $" : ""}
                </span>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
              <AlertCircle className="h-5 w-5" />
              <p>{t("shop.securePayment")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
