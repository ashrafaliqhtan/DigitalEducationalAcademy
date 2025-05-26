"use client"

import { useLanguage } from "@/contexts/language-context"

const partners = [
  {
    name: "UAE University",
    logo: "/placeholder.svg?height=60&width=120&text=UAE+Uni",
  },
  {
    name: "American University of Sharjah",
    logo: "/placeholder.svg?height=60&width=120&text=AUS",
  },
  {
    name: "Khalifa University",
    logo: "/placeholder.svg?height=60&width=120&text=KU",
  },
  {
    name: "Higher Colleges of Technology",
    logo: "/placeholder.svg?height=60&width=120&text=HCT",
  },
  {
    name: "Zayed University",
    logo: "/placeholder.svg?height=60&width=120&text=ZU",
  },
]

export default function Partners() {
  const { t } = useLanguage()

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t("partners.title")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t("partners.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
          {partners.map((partner) => (
            <div key={partner.name} className="flex items-center justify-center">
              <img
                src={partner.logo || "/placeholder.svg"}
                alt={partner.name}
                className="h-12 w-auto opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
