import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./high-contrast.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import ModernNavbar from "@/components/modern-navbar"
import ModernFooter from "@/components/modern-footer"
import { EnrollmentProvider } from "@/contexts/enrollment-context"
import { AuthProvider } from "@/contexts/auth-context"
import { LanguageProvider } from "@/contexts/language-context"
import { ShopProvider } from "@/contexts/shop-context"
import { WishlistProvider } from "@/contexts/wishlist-context"
import HighContrastToggle from "@/components/accessibility/high-contrast-toggle"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Educational Academy",
  description: "Learn new skills and advance your career with our online courses",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <LanguageProvider>
              <ShopProvider>
                <WishlistProvider>
                  <EnrollmentProvider>
                    <Suspense fallback={<div>Loading...</div>}>
                      <div className="flex flex-col min-h-screen">
                        <ModernNavbar />
                        <main className="flex-1">{children}</main>
                        <ModernFooter />
                      </div>
                    </Suspense>
                    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                      <HighContrastToggle />
                    </div>
                    <Toaster />
                  </EnrollmentProvider>
                </WishlistProvider>
              </ShopProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
