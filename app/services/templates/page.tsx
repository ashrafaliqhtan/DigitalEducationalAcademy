"use client"

import { FileImage } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import ServiceHeader from "@/components/services/service-header"
import PricingTable from "@/components/services/pricing-table"
import ExampleShowcase from "@/components/services/example-showcase"
import FAQSection from "@/components/services/faq-section"
import CTABanner from "@/components/services/cta-banner"
import { useLanguage } from "@/contexts/language-context"

export default function TemplatesPage() {
  const { t } = useLanguage()

  const pricingTiers = [
    {
      name: t("templates.basic.name"),
      price: t("templates.basic.price"),
      description: t("templates.basic.description"),
      features: [
        t("templates.basic.features.0"),
        t("templates.basic.features.1"),
        t("templates.basic.features.2"),
        t("templates.basic.features.3"),
        t("templates.basic.features.4"),
      ],
    },
    {
      name: t("templates.bundle.name"),
      price: t("templates.bundle.price"),
      description: t("templates.bundle.description"),
      features: [
        t("templates.bundle.features.0"),
        t("templates.bundle.features.1"),
        t("templates.bundle.features.2"),
        t("templates.bundle.features.3"),
        t("templates.bundle.features.4"),
        t("templates.bundle.features.5"),
      ],
      popular: true,
    },
    {
      name: t("templates.custom.name"),
      price: t("templates.custom.price"),
      description: t("templates.custom.description"),
      features: [
        t("templates.custom.features.0"),
        t("templates.custom.features.1"),
        t("templates.custom.features.2"),
        t("templates.custom.features.3"),
        t("templates.custom.features.4"),
        t("templates.custom.features.5"),
        t("templates.custom.features.6"),
      ],
    },
  ]

  const examples = [
    {
      id: "cv",
      title: t("templates.example1.title"),
      description: t("templates.example1.description"),
      image: "/placeholder.svg?height=400&width=600&text=CV+and+Cover+Letter",
    },
    {
      id: "portfolio",
      title: t("templates.example2.title"),
      description: t("templates.example2.description"),
      image: "/placeholder.svg?height=400&width=600&text=Academic+Portfolio",
    },
    {
      id: "proposal",
      title: t("templates.example3.title"),
      description: t("templates.example3.description"),
      image: "/placeholder.svg?height=400&width=600&text=Business+Proposal+Template",
    },
  ]

  const faqs = [
    {
      question: t("templates.faq1.question"),
      answer: t("templates.faq1.answer"),
    },
    {
      question: t("templates.faq2.question"),
      answer: t("templates.faq2.answer"),
    },
    {
      question: t("templates.faq3.question"),
      answer: t("templates.faq3.answer"),
    },
    {
      question: t("templates.faq4.question"),
      answer: t("templates.faq4.answer"),
    },
    {
      question: t("templates.faq5.question"),
      answer: t("templates.faq5.answer"),
    },
  ]

  return (
    <div>
      <ServiceHeader
        title={t("templates.title")}
        description={t("templates.description")}
        icon={<FileImage className="h-8 w-8 text-primary" />}
      />

      <div className="my-8">
        <p className="text-lg text-gray-700">{t("templates.intro")}</p>
      </div>

      <Separator className="my-8" />

      <PricingTable tiers={pricingTiers} />

      <Separator className="my-8" />

      <ExampleShowcase examples={examples} />

      <Separator className="my-8" />

      <FAQSection faqs={faqs} />

      <CTABanner
        title={t("templates.cta.title")}
        description={t("templates.cta.description")}
        buttonText={t("templates.cta.button")}
        buttonLink="/shop"
      />
    </div>
  )
}
