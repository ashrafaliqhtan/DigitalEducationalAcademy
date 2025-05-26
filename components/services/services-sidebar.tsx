"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

export default function ServicesSidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const services = [
    {
      name: t("services.programming"),
      href: "/services/programming",
    },
    {
      name: t("services.research"),
      href: "/services/research",
    },
    {
      name: t("services.presentations"),
      href: "/services/presentations",
    },
    {
      name: t("services.templates"),
      href: "/services/templates",
    },
    {
      name: t("services.custom"),
      href: "/services/custom-requests",
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="font-medium text-lg mb-4">{t("services.title")}</h3>
      <nav className="space-y-1">
        {services.map((service) => (
          <Link
            key={service.href}
            href={service.href}
            className={cn(
              "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === service.href
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
            )}
          >
            {service.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}
