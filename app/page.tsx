import ModernHero from "@/components/modern-hero"
import FeaturedCourses from "@/components/featured-courses"
import FeaturedServices from "@/components/featured-services"
import Testimonials from "@/components/testimonials"
import Partners from "@/components/partners"
import CtaSection from "@/components/cta-section"
import Stats from "@/components/stats"

export default function HomePage() {
  return (
    <>
      <ModernHero />
      <Stats />
      <FeaturedCourses />
      <FeaturedServices />
      <Testimonials />
      <Partners />
      <CtaSection />
    </>
  )
}
