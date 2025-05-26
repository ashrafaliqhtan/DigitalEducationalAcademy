"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { useRouter } from "next/navigation"

export default function ModernHero() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-20 md:py-28">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-40 -left-20 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <motion.div className="max-w-xl" initial="hidden" animate="visible" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                  {t("hero.title")}
                </span>
              </h1>
            </motion.div>

            <motion.p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8" variants={itemVariants}>
              {t("hero.subtitle")}
            </motion.p>

            <motion.div variants={itemVariants}>
              <form onSubmit={handleSearch} className="flex w-full max-w-md mb-8">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={t("search.placeholder") || "Search for courses, services, and resources..."}
                    className="pl-10 h-12 rounded-l-md rounded-r-none border-r-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" className="h-12 rounded-l-none px-6">
                  {t("search.button") || "Search"}
                </Button>
              </form>
            </motion.div>

            <motion.div className="flex flex-wrap gap-4" variants={itemVariants}>
              <Button asChild size="lg">
                <Link href="/courses">{t("hero.cta") || "Explore Courses"}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/services">{t("hero.secondaryCta") || "Our Services"}</Link>
              </Button>
            </motion.div>

            <motion.div className="mt-8 flex items-center gap-4" variants={itemVariants}>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-white overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=40&width=40&text=${i}`}
                      alt="User"
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-semibold">2,500+</span>{" "}
                {t("stats.studentsJoined") || "students joined this month"}
              </div>
            </motion.div>
          </motion.div>

          {/* Image/illustration */}
          <motion.div
            className="relative h-[400px] md:h-[500px] lg:h-[600px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Image
              src="/placeholder.svg?height=600&width=600&text=Education+Illustration"
              alt="Education illustration"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
