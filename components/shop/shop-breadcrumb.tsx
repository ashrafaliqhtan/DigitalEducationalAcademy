"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function ShopBreadcrumb() {
  const pathname = usePathname()
  const { t, direction } = useLanguage()

  const getProductName = () => {
    // This would normally extract the product name from the URL or fetch it
    // For now, we'll just return a placeholder if we're on a product page
    if (pathname.includes("/shop/product/")) {
      const segments = pathname.split("/")
      const productId = segments[segments.length - 1]
      return `Product ${productId}`
    }
    return null
  }

  const getProductCategory = () => {
    if (pathname.includes("/shop/category/")) {
      const segments = pathname.split("/")
      const category = segments[segments.length - 1]

      switch (category) {
        case "cv-templates":
          return t("shop.categories.cvTemplates")
        case "presentations":
          return t("shop.categories.presentations")
        case "academic":
          return t("shop.categories.academic")
        case "business":
          return t("shop.categories.business")
        default:
          return category
      }
    }
    return null
  }

  const isProductPage = pathname.includes("/shop/product/")
  const isCategoryPage = pathname.includes("/shop/category/")
  const productName = isProductPage ? getProductName() : null
  const categoryName = getProductCategory()

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            {t("nav.home")}
          </Link>
        </li>
        <li className="flex items-center">
          <ChevronRight className={`h-4 w-4 text-gray-400 ${direction === "rtl" ? "rtl-mirror" : ""}`} />
          <Link
            href="/shop"
            className={`${isProductPage || isCategoryPage ? "text-gray-500" : "text-gray-900 font-medium"} hover:text-gray-700 ml-2 rtl:mr-2 rtl:ml-0`}
          >
            {t("nav.shop")}
          </Link>
        </li>
        {isCategoryPage && categoryName && (
          <li className="flex items-center">
            <ChevronRight className={`h-4 w-4 text-gray-400 ${direction === "rtl" ? "rtl-mirror" : ""}`} />
            <span className="text-gray-900 font-medium ml-2 rtl:mr-2 rtl:ml-0">{categoryName}</span>
          </li>
        )}
        {isProductPage && (
          <>
            {categoryName && (
              <li className="flex items-center">
                <ChevronRight className={`h-4 w-4 text-gray-400 ${direction === "rtl" ? "rtl-mirror" : ""}`} />
                <Link
                  href={`/shop/category/${pathname.split("/")[3]}`}
                  className="text-gray-500 hover:text-gray-700 ml-2 rtl:mr-2 rtl:ml-0"
                >
                  {categoryName}
                </Link>
              </li>
            )}
            <li className="flex items-center">
              <ChevronRight className={`h-4 w-4 text-gray-400 ${direction === "rtl" ? "rtl-mirror" : ""}`} />
              <span className="text-gray-900 font-medium ml-2 rtl:mr-2 rtl:ml-0">{productName}</span>
            </li>
          </>
        )}
      </ol>
    </nav>
  )
}
