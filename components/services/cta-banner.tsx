"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface CTABannerProps {
  title: string
  description: string
  buttonText: string
  buttonLink: string
}

export default function CTABanner({ title, description, buttonText, buttonLink }: CTABannerProps) {
  return (
    <div className="bg-primary text-white rounded-lg p-8 my-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="mb-6 text-primary-foreground/90">{description}</p>
        <Button asChild variant="secondary" size="lg">
          <Link href={buttonLink}>{buttonText}</Link>
        </Button>
      </div>
    </div>
  )
}
