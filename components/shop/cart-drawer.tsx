"use client"

import Image from "next/image"
import Link from "next/link"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/language-context"
import { useShop } from "@/contexts/shop-context"

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Export as both named and default export to support both import styles
export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { t, language } = useLanguage()
  const { cart, updateQuantity, removeFromCart, cartTotal } = useShop()

  if (!cart || !cart.items) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {t("shop.cart")} ({cart.items.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {cart.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">{t("shop.emptyCart")}</h3>
              <p className="text-gray-500 mb-6">{t("shop.emptyCartDesc")}</p>
              <Button asChild onClick={() => onOpenChange(false)}>
                <Link href="/shop">{t("shop.continueShopping")}</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto py-4">
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          {language === "en" ? "$" : ""}
                          {item.price}
                          {language === "ar" ? " $" : ""}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFromCart(item.id)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span>{t("shop.subtotal")}</span>
                    <span className="font-medium">
                      {language === "en" ? "$" : ""}
                      {cartTotal.toFixed(2)}
                      {language === "ar" ? " $" : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t("shop.tax")}</span>
                    <span className="font-medium">
                      {language === "en" ? "$" : ""}
                      {(cartTotal * 0.05).toFixed(2)}
                      {language === "ar" ? " $" : ""}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{t("shop.total")}</span>
                    <span className="font-bold">
                      {language === "en" ? "$" : ""}
                      {(cartTotal * 1.05).toFixed(2)}
                      {language === "ar" ? " $" : ""}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button asChild className="w-full" onClick={() => onOpenChange(false)}>
                    <Link href="/shop/checkout">{t("shop.checkout")}</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                    <Link href="/shop">{t("shop.continueShopping")}</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Also export as default for compatibility
export default CartDrawer
