"use client"

import { useParams } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import ProductGrid from "@/components/shop/product-grid"
import { getProductsByCategory } from "@/data/shop-products"

export default function CategoryPage() {
  const params = useParams()
  const categoryId = params.category as string
  const products = getProductsByCategory(categoryId)
  const { t } = useLanguage()

  const getCategoryName = (id: string) => {
    switch (id) {
      case "cv-templates":
        return t("shop.categories.cvTemplates")
      case "presentations":
        return t("shop.categories.presentations")
      case "academic":
        return t("shop.categories.academic")
      case "business":
        return t("shop.categories.business")
      default:
        return id
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{getCategoryName(categoryId)}</h1>
        <p className="text-gray-600 max-w-3xl">{t("shop.categoryDescription")}</p>
      </div>

      <ProductGrid products={products} />
    </div>
  )
}
