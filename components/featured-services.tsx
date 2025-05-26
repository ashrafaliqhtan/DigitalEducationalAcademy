"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Search, Presentation, FileText, Settings, ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const services = [
  {
    id: "programming",
    icon: Code,
    href: "/services/programming",
  },
  {
    id: "research",
    icon: Search,
    href: "/services/research",
  },
  {
    id: "presentations",
    icon: Presentation,
    href: "/services/presentations",
  },
  {
    id: "templates",
    icon: FileText,
    href: "/services/templates",
  },
  {
    id: "customRequests",
    icon: Settings,
    href: "/services/custom-requests",
  },
]

export default function FeaturedServices() {
  const { t } = useLanguage()

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t("services.title")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t("services.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Card key={service.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{t(`services.${service.id}`)}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{t(`services.${service.id}Desc`)}</CardDescription>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    <Link href={service.href}>
                      {t("common.view")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/services">
              {t("services.viewAll")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
