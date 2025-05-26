"use client"

import Link from "next/link"
import { Code, FileText, PenTool, FileImage, FileQuestion } from "lucide-react"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

export default function ServicesPage() {
  const { t } = useLanguage()

  const services = [
    {
      title: t("services.programming") || "Programming",
      description: t("services.programming.desc") || "Professional programming and development services",
      icon: <Code className="h-8 w-8 text-primary" />,
      href: "/services/programming",
    },
    {
      title: t("services.research") || "Research",
      description: t("services.research.desc") || "Research methodology and academic writing support",
      icon: <FileText className="h-8 w-8 text-primary" />,
      href: "/services/research",
    },
    {
      title: t("services.presentations") || "Presentations",
      description: t("services.presentations.desc") || "Professional presentation design and creation",
      icon: <PenTool className="h-8 w-8 text-primary" />,
      href: "/services/presentations",
    },
    {
      title: t("services.templates") || "Templates",
      description: t("services.templates.desc") || "Ready-to-use templates for various academic purposes",
      icon: <FileImage className="h-8 w-8 text-primary" />,
      href: "/services/templates",
    },
    {
      title: t("services.custom") || "Custom Requests",
      description: t("services.custom.desc") || "Tailored solutions for your specific academic needs",
      icon: <FileQuestion className="h-8 w-8 text-primary" />,
      href: "/services/custom-requests",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{t("services.title") || "Our Services"}</h1>
        <p className="text-gray-600 max-w-3xl">
          {t("services.subtitle") || "Comprehensive educational solutions for all your needs"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <Card key={service.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">{service.icon}</div>
              <div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <p className="text-gray-600 mt-2">{service.description}</p>
              </div>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href={service.href}>{t("services.learnMore") || "Learn More"}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
