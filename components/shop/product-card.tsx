"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { useShop } from "@/contexts/shop-context"
import type { Product } from "@/data/shop-products"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t, language } = useLanguage()
  const { addToCart } = useShop()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addToCart({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.images[0],
    })

    toast({
      title: t("shop.addedToCart"),
      description: product.name,
    })
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/shop/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {(product.bestSeller || product.new) && (
            <div className="absolute top-2 left-2">
              {product.bestSeller && (
                <Badge className="bg-yellow-500 hover:bg-yellow-600">{t("shop.bestSeller")}</Badge>
              )}
              {product.new && !product.bestSeller && (
                <Badge className="bg-green-500 hover:bg-green-600">{t("shop.new")}</Badge>
              )}
            </div>
          )}
          {product.discountPrice && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive">
                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% {t("shop.off")}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.discountPrice ? (
                <>
                  <span className="font-bold text-lg">
                    {language === "en" ? "$" : ""}
                    {product.discountPrice}
                    {language === "ar" ? " $" : ""}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {language === "en" ? "$" : ""}
                    {product.price}
                    {language === "ar" ? " $" : ""}
                  </span>
                </>
              ) : (
                <span className="font-bold text-lg">
                  {language === "en" ? "$" : ""}
                  {product.price}
                  {language === "ar" ? " $" : ""}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full gap-2">
          <ShoppingCart className="h-4 w-4" />
          {t("shop.addToCart")}
        </Button>
      </CardFooter>
    </Card>
  )
}
