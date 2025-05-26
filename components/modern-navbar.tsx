"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ShoppingCart, Bell, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { useShop } from "@/contexts/shop-context"
import { useAuth } from "@/contexts/auth-context"
import LanguageSwitcher from "@/components/language-switcher"

export default function ModernNavbar() {
  const { t } = useLanguage()
  const { cartItems } = useShop()
  const { user, profile } = useAuth()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const mainNavItems = [
    { href: "/", label: t("nav.home") },
    {
      href: "/services",
      label: t("nav.services"),
      children: [
        { href: "/services/programming", label: t("services.programming") },
        { href: "/services/research", label: t("services.research") },
        { href: "/services/presentations", label: t("services.presentations") },
        { href: "/services/templates", label: t("services.templates") },
        { href: "/services/custom-requests", label: t("services.custom") },
      ],
    },
    { href: "/courses", label: t("nav.courses") },
    { href: "/shop", label: t("nav.shop") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              EduAcademy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {mainNavItems.map((item) => (
              <div key={item.href} className="relative group">
                {item.children ? (
                  <button
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      pathname === item.href || pathname?.startsWith(`${item.href}/`)
                        ? "text-primary"
                        : "text-gray-700 hover:text-primary hover:bg-gray-50"
                    }`}
                    onClick={() => setIsDropdownOpen(isDropdownOpen === item.href ? null : item.href)}
                    aria-expanded={isDropdownOpen === item.href}
                  >
                    {item.label}
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform ${isDropdownOpen === item.href ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      pathname === item.href ? "text-primary" : "text-gray-700 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown for items with children */}
                {item.children && (
                  <div
                    className={`absolute left-0 mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
                      isDropdownOpen === item.href
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <div className="py-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">3</Badge>
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItems?.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartItems.length}
                </Badge>
              )}
            </Button>

            {/* Language Switcher - Ensure it's visible */}
            <div className="relative z-10">
              <LanguageSwitcher />
            </div>

            {user ? (
              <Link href="/profile">
                <Avatar className="h-8 w-8 border border-gray-200">
                  <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
                  <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Button asChild variant="primary" size="sm" className="hidden md:inline-flex">
                <Link href="/sign-in">{t("auth.signIn")}</Link>
              </Button>
            )}

            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">{t("nav.menu")}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4">
                    <span className="text-xl font-bold">EduAcademy</span>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                  </div>

                  <nav className="flex flex-col space-y-1 py-4">
                    {mainNavItems.map((item) => (
                      <div key={item.href}>
                        <Link
                          href={item.href}
                          className={`px-4 py-3 text-base font-medium rounded-md transition-colors block ${
                            pathname === item.href ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {item.label}
                        </Link>

                        {item.children && (
                          <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-3">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors block ${
                                  pathname === child.href ? "text-primary" : "text-gray-600 hover:text-primary"
                                }`}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>

                  {/* Add Language Switcher to mobile menu */}
                  <div className="px-4 py-2 border-t border-gray-200">
                    <p className="text-sm font-medium mb-2">{t("nav.language") || "Language"}</p>
                    <LanguageSwitcher />
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-200">
                    {user ? (
                      <div className="flex items-center space-x-3 px-4 py-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
                          <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{profile?.full_name || user.email}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-2 px-4">
                        <Button asChild>
                          <Link href="/sign-in">{t("auth.signIn")}</Link>
                        </Button>
                        <Button asChild variant="outline">
                          <Link href="/sign-up">{t("auth.signUp")}</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
