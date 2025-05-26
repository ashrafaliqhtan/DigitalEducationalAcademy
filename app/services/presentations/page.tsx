"use client"

import { PenTool } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import ServiceHeader from "@/components/services/service-header"
import PricingTable from "@/components/services/pricing-table"
import ExampleShowcase from "@/components/services/example-showcase"
import FAQSection from "@/components/services/faq-section"
import CTABanner from "@/components/services/cta-banner"
import { useLanguage } from "@/contexts/language-context"

export default function PresentationsPage() {
  const { t } = useLanguage()

  const pricingTiers = [
    {
      name: t("presentations.basic.name"),
      price: t("presentations.basic.price"),
      description: t("presentations.basic.description"),
      features: [
        t("presentations.basic.features.0"),
        t("presentations.basic.features.1"),
        t("presentations.basic.features.2"),
        t("presentations.basic.features.3"),
        t("presentations.basic.features.4"),
      ],
    },
    {
      name: t("presentations.professional.name"),
      price: t("presentations.professional.price"),
      description: t("presentations.professional.description"),
      features: [
        t("presentations.professional.features.0"),
        t("presentations.professional.features.1"),
        t("presentations.professional.features.2"),
        t("presentations.professional.features.3"),
        t("presentations.professional.features.4"),
        t("presentations.professional.features.5"),
      ],
      popular: true,
    },
    {
      name: t("presentations.premium.name"),
      price: t("presentations.premium.price"),
      description: t("presentations.premium.description"),
      features: [
        t("presentations.premium.features.0"),
        t("presentations.premium.features.1"),
        t("presentations.premium.features.2"),
        t("presentations.premium.features.3"),
        t("presentations.premium.features.4"),
        t("presentations.premium.features.5"),
        t("presentations.premium.features.6"),
        t("presentations.premium.features.7"),
      ],
    },
  ]

  const examples = [
    {
      id: "pitch-deck",
      title: t("presentations.example1.title"),
      description: t("presentations.example1.description"),
      image: "/placeholder.svg?height=400&width=600&text=Business+Pitch+Deck",
    },
    {
      id: "academic",
      title: t("presentations.example2.title"),
      description: t("presentations.example2.description"),
      image: "/placeholder.svg?height=400&width=600&text=Academic+Research+Presentation",
    },
    {
      id: "training",
      title: t("presentations.example3.title"),
      description: t("presentations.example3.description"),
      image: "/placeholder.svg?height=400&width=600&text=Corporate+Training+Materials",
    },
  ]

  const faqs = [
    {
      question: t("presentations.faq1.question"),
      answer: t("presentations.faq1.answer"),
    },
    {
      question: t("presentations.faq2.question"),
      answer: t("presentations.faq2.answer"),
    },
    {
      question: t("presentations.faq3.question"),
      answer: t("presentations.faq3.answer"),
    },
    {
      question: t("presentations.faq4.question"),
      answer: t("presentations.faq4.answer"),
    },
    {
      question: t("presentations.faq5.question"),
      answer: t("presentations.faq5.answer"),
    },
  ]

  return (
    <div>
      <ServiceHeader
        title={t("presentations.title")}
        description={t("presentations.description")}
        icon={<PenTool className="h-8 w-8 text-primary" />}
      />

      <div className="my-8">
        <p className="text-lg text-gray-700">{t("presentations.intro")}</p>
      </div>

      <Separator className="my-8" />

      <PricingTable tiers={pricingTiers} />

      <Separator className="my-8" />

      <ExampleShowcase examples={examples} />

      <Separator className="my-8" />

      <FAQSection faqs={faqs} />

      <CTABanner
        title={t("presentations.cta.title")}
        description={t("presentations.cta.description")}
        buttonText={t("presentations.cta.button")}
        buttonLink="/services/custom-requests"
      />
    </div>
  )
}
