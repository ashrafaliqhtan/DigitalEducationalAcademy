"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"

export interface PricingTier {
  name: string
  price: string
  description: string
  features: string[]
  popular?: boolean
  buttonText?: string
}

interface PricingTableProps {
  tiers: PricingTier[]
}

export default function PricingTable({ tiers }: PricingTableProps) {
  const { t } = useLanguage()

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">{t("service.pricing")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <Card key={tier.name} className={`flex flex-col ${tier.popular ? "border-primary shadow-md" : ""}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                {tier.popular && <Badge variant="default">{t("service.mostPopular")}</Badge>}
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold">{tier.price}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">{tier.description}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="ml-2 rtl:mr-2 rtl:ml-0 text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">{tier.buttonText || t("service.orderNow")}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
