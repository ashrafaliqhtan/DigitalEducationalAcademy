"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                {t("hero.title")}
              </h1>
              <p className="text-xl text-gray-600 lg:text-2xl">{t("hero.subtitle")}</p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href="/courses">
                  {t("hero.getStarted")}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/services">
                  <Play className="h-5 w-5" />
                  {t("hero.learnMore")}
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">5000+</div>
                <div className="text-sm text-gray-600">{t("stats.studentsHelped")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-600">{t("stats.satisfactionRate")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-sm text-gray-600">{t("courses.title")}</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-square max-w-lg overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
              <div className="relative z-10 flex h-full flex-col items-center justify-center space-y-6">
                <div className="rounded-full bg-white p-6 shadow-lg">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900">Start Learning Today</h3>
                  <p className="text-gray-600">Join our community of learners</p>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-yellow-200 opacity-60"></div>
            <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-pink-200 opacity-40"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
