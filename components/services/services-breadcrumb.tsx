"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function ServicesBreadcrumb() {
  const pathname = usePathname()
  const { t, direction } = useLanguage()

  const getServiceName = (path: string) => {
    const servicePath = path.split("/").pop()

    switch (servicePath) {
      case "programming":
        return t("services.programming")
      case "research":
        return t("services.research")
      case "presentations":
        return t("services.presentations")
      case "templates":
        return t("services.templates")
      case "custom-requests":
        return t("services.custom")
      default:
        return t("services.title")
    }
  }

  const isServicePage = pathname !== "/services"
  const serviceName = isServicePage ? getServiceName(pathname) : null

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
            href="/services"
            className={`${isServicePage ? "text-gray-500" : "text-gray-900 font-medium"} hover:text-gray-700 ml-2 rtl:mr-2 rtl:ml-0`}
          >
            {t("services.title")}
          </Link>
        </li>
        {isServicePage && (
          <li className="flex items-center">
            <ChevronRight className={`h-4 w-4 text-gray-400 ${direction === "rtl" ? "rtl-mirror" : ""}`} />
            <span className="text-gray-900 font-medium ml-2 rtl:mr-2 rtl:ml-0">{serviceName}</span>
          </li>
        )}
      </ol>
    </nav>
  )
}
