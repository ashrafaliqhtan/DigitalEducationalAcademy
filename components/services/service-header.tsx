"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

interface ServiceHeaderProps {
  title: string
  description: string
  icon: React.ReactNode
}

export default function ServiceHeader({ title, description, icon }: ServiceHeaderProps) {
  const { t } = useLanguage()

  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 md:p-8 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="bg-white p-3 rounded-full shadow-sm">{icon}</div>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-gray-600 max-w-3xl">{description}</p>
        </div>
        <Button size="lg">{t("service.requestNow")}</Button>
      </div>
    </div>
  )
}
