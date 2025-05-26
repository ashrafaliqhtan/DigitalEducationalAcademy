"use client"

import Image from "next/image"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"

export interface Example {
  id: string
  title: string
  description: string
  image: string
}

interface ExampleShowcaseProps {
  examples: Example[]
}

export default function ExampleShowcase({ examples }: ExampleShowcaseProps) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState(examples[0]?.id || "")

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">{t("service.examples")}</h2>
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full flex overflow-x-auto mb-6">
          {examples.map((example) => (
            <TabsTrigger key={example.id} value={example.id} className="flex-1">
              {example.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {examples.map((example) => (
          <TabsContent key={example.id} value={example.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-video rounded-lg overflow-hidden border shadow-sm">
                <Image src={example.image || "/placeholder.svg"} alt={example.title} fill className="object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">{example.title}</h3>
                <p className="text-gray-700">{example.description}</p>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
