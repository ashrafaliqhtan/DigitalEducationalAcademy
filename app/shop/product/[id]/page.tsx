"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, Check, ShoppingCart, Download, FileText, Monitor, Smartphone } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { useShop } from "@/contexts/shop-context"
import ProductGrid from "@/components/shop/product-grid"
import { getProductById, getRelatedProducts } from "@/data/shop-products"

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  const product = getProductById(productId)
  const relatedProducts = getRelatedProducts(productId)

  const { t, language } = useLanguage()
  const { addToCart } = useShop()
  const { toast } = useToast()

  const [selectedImage, setSelectedImage] = useState(0)

  if (!product) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">{t("shop.productNotFound")}</h1>
        <p className="text-gray-600 mb-8">{t("shop.productNotFoundDesc")}</p>
        <Button asChild>
          <Link href="/shop">{t("shop.backToShop")}</Link>
        </Button>
      </div>
    )
  }

  const handleAddToCart = () => {
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
    <div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-white">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain"
            />
            {(product.bestSeller || product.new) && (
              <div className="absolute left-2 top-2">
                {product.bestSeller && (
                  <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                    {t("shop.bestSeller")}
                  </Badge>
                )}
                {product.new && !product.bestSeller && (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    {t("shop.new")}
                  </Badge>
                )}
              </div>
            )}
          </div>
          <div className="flex space-x-2 rtl:space-x-reverse">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`relative h-20 w-20 cursor-pointer overflow-hidden rounded-md border ${
                  selectedImage === index ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-500">
              {product.reviewCount} {t("shop.reviews")}
            </span>
          </div>

          <div className="mt-6">
            <div className="flex items-baseline gap-2">
              {product.discountPrice ? (
                <>
                  <span className="text-3xl font-bold text-gray-900">
                    {language === "en" ? "$" : ""}
                    {product.discountPrice}
                    {language === "ar" ? " $" : ""}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {language === "en" ? "$" : ""}
                    {product.price}
                    {language === "ar" ? " $" : ""}
                  </span>
                  <Badge variant="destructive" className="ml-2">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% {t("shop.off")}
                  </Badge>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  {language === "en" ? "$" : ""}
                  {product.price}
                  {language === "ar" ? " $" : ""}
                </span>
              )}
            </div>
          </div>

          <p className="mt-6 text-gray-700">{product.description}</p>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900">{t("shop.features")}</h3>
              <ul className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900">{t("shop.fileFormats")}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.fileFormat.map((format) => (
                  <Badge key={format} variant="outline">
                    <FileText className="mr-1 h-3 w-3" /> {format}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900">{t("shop.compatibleWith")}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.compatibleWith.map((software) => (
                  <Badge key={software} variant="outline">
                    {software.includes("Microsoft") ? (
                      <Monitor className="mr-1 h-3 w-3" />
                    ) : software.includes("Google") ? (
                      <Smartphone className="mr-1 h-3 w-3" />
                    ) : (
                      <FileText className="mr-1 h-3 w-3" />
                    )}
                    {software}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Download className="h-4 w-4" />
              <span>
                {t("shop.downloadSize")}: {product.downloadSize}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              {t("shop.addToCart")}
            </Button>
            <Button size="lg" variant="secondary" className="flex-1">
              <Download className="mr-2 h-5 w-5" />
              {t("shop.buyNow")}
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">{t("shop.description")}</TabsTrigger>
            <TabsTrigger value="reviews">{t("shop.reviews")}</TabsTrigger>
            <TabsTrigger value="faq">{t("shop.faq")}</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <p className="mb-4">{product.description}</p>
              <h3 className="text-lg font-medium mb-2">{t("shop.features")}</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index} className="mb-2">
                    {feature}
                  </li>
                ))}
              </ul>
              <h3 className="text-lg font-medium mb-2 mt-6">{t("shop.technicalDetails")}</h3>
              <ul>
                <li>
                  <strong>{t("shop.fileFormats")}:</strong> {product.fileFormat.join(", ")}
                </li>
                <li>
                  <strong>{t("shop.compatibleWith")}:</strong> {product.compatibleWith.join(", ")}
                </li>
                <li>
                  <strong>{t("shop.downloadSize")}:</strong> {product.downloadSize}
                </li>
                <li>
                  <strong>{t("shop.lastUpdated")}:</strong> {new Date(product.updatedAt).toLocaleDateString()}
                </li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <div className="text-center py-12">
              <p className="text-gray-500">{t("shop.reviewsComingSoon")}</p>
            </div>
          </TabsContent>
          <TabsContent value="faq" className="mt-6">
            <div className="text-center py-12">
              <p className="text-gray-500">{t("shop.faqComingSoon")}</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <Separator className="mb-8" />
          <h2 className="text-2xl font-bold mb-6">{t("shop.relatedProducts")}</h2>
          <ProductGrid products={relatedProducts} showFilters={false} />
        </div>
      )}
    </div>
  )
}
