import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { LanguageProvider } from "@/contexts/language-context"
import { ShopProvider } from "@/contexts/shop-context"
import { EnrollmentProvider } from "@/contexts/enrollment-context"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { NotificationProvider } from "@/components/notifications/notification-system"
import { LoadingProvider } from "@/components/loading/loading-manager"
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Educational Academy - Learn, Grow, Succeed",
  description:
    "Comprehensive educational platform offering courses, services, and resources for academic and professional growth.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <NotificationProvider>
              <LoadingProvider>
                <AuthProvider>
                  <LanguageProvider>
                    <ShopProvider>
                      <WishlistProvider>
                        <EnrollmentProvider>
                          {children}
                          <Toaster />
                        </EnrollmentProvider>
                      </WishlistProvider>
                    </ShopProvider>
                  </LanguageProvider>
                </AuthProvider>
              </LoadingProvider>
            </NotificationProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
