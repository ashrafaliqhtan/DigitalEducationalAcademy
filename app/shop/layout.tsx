import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import ShopBreadcrumb from "@/components/shop/shop-breadcrumb"

export const metadata: Metadata = {
  title: "Shop - Golfacadimic",
  description: "Browse and purchase digital templates and educational resources",
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>}>
        <ShopBreadcrumb />
      </Suspense>
      <div className="mt-8">{children}</div>
    </div>
  )
}
