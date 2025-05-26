"use client"

import { Code } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import ServiceHeader from "@/components/services/service-header"
import PricingTable from "@/components/services/pricing-table"
import ExampleShowcase from "@/components/services/example-showcase"
import FAQSection from "@/components/services/faq-section"
import CTABanner from "@/components/services/cta-banner"
import { useLanguage } from "@/contexts/language-context"

export default function ProgrammingPage() {
  const { t, language } = useLanguage()

  const pricingTiers = [
    {
      name: t("programming.basic.name"),
      price: t("programming.basic.price"),
      description: t("programming.basic.description"),
      features: [
        t("programming.basic.features.0"),
        t("programming.basic.features.1"),
        t("programming.basic.features.2"),
        t("programming.basic.features.3"),
        t("programming.basic.features.4"),
      ],
    },
    {
      name: t("programming.standard.name"),
      price: t("programming.standard.price"),
      description: t("programming.standard.description"),
      features: [
        t("programming.standard.features.0"),
        t("programming.standard.features.1"),
        t("programming.standard.features.2"),
        t("programming.standard.features.3"),
        t("programming.standard.features.4"),
        t("programming.standard.features.5"),
      ],
      popular: true,
    },
    {
      name: t("programming.premium.name"),
      price: t("programming.premium.price"),
      description: t("programming.premium.description"),
      features: [
        t("programming.premium.features.0"),
        t("programming.premium.features.1"),
        t("programming.premium.features.2"),
        t("programming.premium.features.3"),
        t("programming.premium.features.4"),
        t("programming.premium.features.5"),
        t("programming.premium.features.6"),
      ],
    },
  ]

  const examples = [
    {
      id: "ecommerce",
      title: t("programming.example1.title"),
      description: t("programming.example1.description"),
      image: "/placeholder.svg?height=400&width=600&text=E-commerce+Platform",
    },
    {
      id: "student-system",
      title: t("programming.example2.title"),
      description: t("programming.example2.description"),
      image: "/placeholder.svg?height=400&width=600&text=Student+Management+System",
    },
    {
      id: "fitness-app",
      title: t("programming.example3.title"),
      description: t("programming.example3.description"),
      image: "/placeholder.svg?height=400&width=600&text=Mobile+Fitness+App",
    },
  ]

  const faqs = [
    {
      question: t("programming.faq1.question"),
      answer: t("programming.faq1.answer"),
    },
    {
      question: t("programming.faq2.question"),
      answer: t("programming.faq2.answer"),
    },
    {
      question: t("programming.faq3.question"),
      answer: t("programming.faq3.answer"),
    },
    {
      question: t("programming.faq4.question"),
      answer: t("programming.faq4.answer"),
    },
    {
      question: t("programming.faq5.question"),
      answer: t("programming.faq5.answer"),
    },
  ]

  return (
    <div>
      <ServiceHeader
        title={t("programming.title")}
        description={t("programming.description")}
        icon={<Code className="h-8 w-8 text-primary" />}
      />

      <div className="my-8">
        <p className="text-lg text-gray-700">{t("programming.intro")}</p>
      </div>

      <Separator className="my-8" />

      <PricingTable tiers={pricingTiers} />

      <Separator className="my-8" />

      <ExampleShowcase examples={examples} />

      <Separator className="my-8" />

      <FAQSection faqs={faqs} />

      <CTABanner
        title={t("programming.cta.title")}
        description={t("programming.cta.description")}
        buttonText={t("programming.cta.button")}
        buttonLink="/services/custom-requests"
      />
    </div>
  )
}
