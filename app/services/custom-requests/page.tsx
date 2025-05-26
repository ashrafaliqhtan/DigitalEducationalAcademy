"use client"

import { FileQuestion } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ServiceHeader from "@/components/services/service-header"
import ExampleShowcase from "@/components/services/example-showcase"
import FAQSection from "@/components/services/faq-section"
import CTABanner from "@/components/services/cta-banner"
import CustomRequestForm from "@/components/services/custom-request-form"
import { useLanguage } from "@/contexts/language-context"

export default function CustomRequestsPage() {
  const { t } = useLanguage()

  const processSteps = [
    {
      title: t("custom.process.step1.title"),
      description: t("custom.process.step1.description"),
    },
    {
      title: t("custom.process.step2.title"),
      description: t("custom.process.step2.description"),
    },
    {
      title: t("custom.process.step3.title"),
      description: t("custom.process.step3.description"),
    },
    {
      title: t("custom.process.step4.title"),
      description: t("custom.process.step4.description"),
    },
    {
      title: t("custom.process.step5.title"),
      description: t("custom.process.step5.description"),
    },
  ]

  const examples = [
    {
      id: "educational-software",
      title: t("custom.example1.title"),
      description: t("custom.example1.description"),
      image: "/placeholder.svg?height=400&width=600&text=Custom+Educational+Software",
    },
    {
      id: "thesis-package",
      title: t("custom.example2.title"),
      description: t("custom.example2.description"),
      image: "/placeholder.svg?height=400&width=600&text=Comprehensive+Thesis+Package",
    },
    {
      id: "training-program",
      title: t("custom.example3.title"),
      description: t("custom.example3.description"),
      image: "/placeholder.svg?height=400&width=600&text=Corporate+Training+Program",
    },
  ]

  const faqs = [
    {
      question: t("custom.faq1.question"),
      answer: t("custom.faq1.answer"),
    },
    {
      question: t("custom.faq2.question"),
      answer: t("custom.faq2.answer"),
    },
    {
      question: t("custom.faq3.question"),
      answer: t("custom.faq3.answer"),
    },
    {
      question: t("custom.faq4.question"),
      answer: t("custom.faq4.answer"),
    },
    {
      question: t("custom.faq5.question"),
      answer: t("custom.faq5.answer"),
    },
  ]

  return (
    <div>
      <ServiceHeader
        title={t("custom.title")}
        description={t("custom.description")}
        icon={<FileQuestion className="h-8 w-8 text-primary" />}
      />

      <div className="my-8">
        <p className="text-lg text-gray-700">{t("custom.intro")}</p>
      </div>

      <Separator className="my-8" />

      <div className="py-8">
        <h2 className="text-2xl font-bold mb-6">{t("custom.process.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processSteps.map((step, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold">
                    {index + 1}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      <ExampleShowcase examples={examples} />

      <Separator className="my-8" />

      <CustomRequestForm />

      <Separator className="my-8" />

      <FAQSection faqs={faqs} />

      <CTABanner
        title={t("custom.cta.title")}
        description={t("custom.cta.description")}
        buttonText={t("custom.cta.button")}
        buttonLink="#custom-request-form"
      />
    </div>
  )
}
