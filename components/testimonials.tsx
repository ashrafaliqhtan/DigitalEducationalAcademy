"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const testimonials = [
  {
    id: 1,
    name: "Sarah Ahmed",
    role: "Computer Science Student",
    avatar: "/placeholder.svg?height=40&width=40&text=SA",
    content:
      "The programming courses here transformed my coding skills. The instructors are knowledgeable and the content is up-to-date with industry standards.",
    rating: 5,
  },
  {
    id: 2,
    name: "Mohammed Al-Rashid",
    role: "Graduate Student",
    avatar: "/placeholder.svg?height=40&width=40&text=MR",
    content:
      "Excellent research methodology course! It helped me structure my thesis properly and understand academic writing standards.",
    rating: 5,
  },
  {
    id: 3,
    name: "Fatima Hassan",
    role: "Business Student",
    avatar: "/placeholder.svg?height=40&width=40&text=FH",
    content:
      "The presentation design course was exactly what I needed. Now I can create professional presentations that impress my professors.",
    rating: 5,
  },
]

export default function Testimonials() {
  const { t } = useLanguage()

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t("testimonials.title")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t("testimonials.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
