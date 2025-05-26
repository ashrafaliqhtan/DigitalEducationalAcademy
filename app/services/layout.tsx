import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import ServicesSidebar from "@/components/services/services-sidebar"
import ServicesBreadcrumb from "@/components/services/services-breadcrumb"

export const metadata: Metadata = {
  title: "Services - Golfacadimic",
  description: "Explore our comprehensive range of educational and digital services",
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>}>
        <ServicesBreadcrumb />
      </Suspense>
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <aside className="md:w-1/4 lg:w-1/5">
          <ServicesSidebar />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
