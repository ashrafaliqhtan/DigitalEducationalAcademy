"use client"

import { FileText } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import ServiceHeader from "@/components/services/service-header"
import PricingTable from "@/components/services/pricing-table"
import ExampleShowcase from "@/components/services/example-showcase"
import FAQSection from "@/components/services/faq-section"
import CTABanner from "@/components/services/cta-banner"
import { useLanguage } from "@/contexts/language-context"

export default function ResearchPage() {
  const { t } = useLanguage()

  const pricingTiers = [
    {
      name: t("research.basic.name"),
      price: t("research.basic.price"),
      description: t("research.basic.description"),
      features: [
        t("research.basic.features.0"),
        t("research.basic.features.1"),
        t("research.basic.features.2"),
        t("research.basic.features.3"),
        t("research.basic.features.4"),
      ],
    },
    {
      name: t("research.advanced.name"),
      price: t("research.advanced.price"),
      description: t("research.advanced.description"),
      features: [
        t("research.advanced.features.0"),
        t("research.advanced.features.1"),
        t("research.advanced.features.2"),
        t("research.advanced.features.3"),
        t("research.advanced.features.4"),
        t("research.advanced.features.5"),
      ],
      popular: true,
    },
    {
      name: t("research.expert.name"),
      price: t("research.expert.price"),
      description: t("research.expert.description"),
      features: [
        t("research.expert.features.0"),
        t("research.expert.features.1"),
        t("research.expert.features.2"),
        t("research.expert.features.3"),
        t("research.expert.features.4"),
        t("research.expert.features.5"),
        t("research.expert.features.6"),
      ],
    },
  ]

  const examples = [
    {
      id: "literature-review",
      title: t("research.example1.title"),
      description: t("research.example1.description"),
      image: "/placeholder.svg?height=400&width=600&text=Literature+Review",
    },
    {
      id: "case-study",
      title: t("research.example2.title"),
      description: t("research.example2.description"),
      image: "/placeholder.svg?height=400&width=600&text=Case+Study+Analysis",
    },
    {
      id: "thesis",
      title: t("research.example3.title"),
      description: t("research.example3.description"),
      image: "/placeholder.svg?height=400&width=600&text=Research+Thesis",
    },
  ]

  const faqs = [
    {
      question: t("research.faq1.question"),
      answer: t("research.faq1.answer"),
    },
    {
      question: t("research.faq2.question"),
      answer: t("research.faq2.answer"),
    },
    {
      question: t("research.faq3.question"),
      answer: t("research.faq3.answer"),
    },
    {
      question: t("research.faq4.question"),
      answer: t("research.faq4.answer"),
    },
    {
      question: t("research.faq5.question"),
      answer: t("research.faq5.answer"),
    },
  ]

  return (
    <div>
      <ServiceHeader
        title={t("research.title")}
        description={t("research.description")}
        icon={<FileText className="h-8 w-8 text-primary" />}
      />

      <div className="my-8">
        <p className="text-lg text-gray-700">{t("research.intro")}</p>
      </div>

      <Separator className="my-8" />

      <PricingTable tiers={pricingTiers} />

      <Separator className="my-8" />

      <ExampleShowcase examples={examples} />

      <Separator className="my-8" />

      <FAQSection faqs={faqs} />

      <CTABanner
        title={t("research.cta.title")}
        description={t("research.cta.description")}
        buttonText={t("research.cta.button")}
        buttonLink="/services/custom-requests"
      />
    </div>
  )
}
