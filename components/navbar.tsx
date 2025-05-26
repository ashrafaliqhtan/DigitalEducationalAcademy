"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, Sun, Moon, Bell, ChevronDown, User } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Cart } from "@/components/cart"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  {
    href: "/services",
    label: "Services",
    subItems: [
      { href: "/services/programming", label: "Programming" },
      { href: "/services/research", label: "Research" },
      { href: "/services/presentations", label: "Presentations" },
      { href: "/services/templates", label: "Templates" },
      { href: "/services/custom-requests", label: "Custom Requests" },
    ],
  },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, profile, signOut } = useAuth()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Handle keyboard navigation for dropdown menus
  const handleKeyDown = (e: React.KeyboardEvent, item: (typeof navLinks)[0]) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setActiveDropdown(activeDropdown === item.label ? null : item.label)
    } else if (e.key === "Escape") {
      setActiveDropdown(null)
    }
  }

  const getUserDisplayName = () => {
    return profile?.full_name || user?.email || "User"
  }

  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return "U"
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Educational Academy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.subItems && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center",
                    pathname === item.href
                      ? "text-primary bg-primary/10"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/10",
                  )}
                  aria-expanded={activeDropdown === item.label}
                  onClick={() => !item.subItems && setActiveDropdown(null)}
                  onKeyDown={(e) => item.subItems && handleKeyDown(e, item)}
                  tabIndex={0}
                  role={item.subItems ? "button" : undefined}
                  aria-haspopup={item.subItems ? "true" : undefined}
                >
                  {item.label}
                  {item.subItems && <ChevronDown className="ml-1 h-4 w-4" />}
                </Link>

                {/* Dropdown Menu */}
                {item.subItems && activeDropdown === item.label && (
                  <div className="absolute left-0 mt-1 w-48 rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className={cn(
                            "block px-4 py-2 text-sm transition-colors",
                            pathname === subItem.href
                              ? "bg-primary/10 text-primary"
                              : "text-foreground/80 hover:bg-primary/10 hover:text-primary",
                          )}
                          role="menuitem"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>

            {/* Shopping Cart */}
            <Cart />

            {/* Auth Buttons or User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 ml-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || ""} alt={getUserDisplayName()} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{getUserDisplayName()}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/courses">My Courses</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] sm:w-[350px] md:hidden">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between border-b pb-4">
                    <span className="text-lg font-bold">Menu</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <nav className="flex-1 overflow-y-auto py-4">
                    <div className="flex flex-col space-y-1">
                      {navLinks.map((item) => (
                        <div key={item.label} className="flex flex-col">
                          <Link
                            href={item.href}
                            className={cn(
                              "px-4 py-2 text-base font-medium rounded-md transition-colors",
                              pathname === item.href
                                ? "text-primary bg-primary/10"
                                : "text-foreground/80 hover:text-primary hover:bg-primary/10",
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.label}
                          </Link>

                          {/* Mobile Submenu */}
                          {item.subItems && (
                            <div className="ml-4 mt-1 flex flex-col space-y-1">
                              {item.subItems.map((subItem) => (
                                <Link
                                  key={subItem.label}
                                  href={subItem.href}
                                  className={cn(
                                    "px-4 py-2 text-sm rounded-md transition-colors",
                                    pathname === subItem.href
                                      ? "text-primary bg-primary/10"
                                      : "text-foreground/80 hover:text-primary hover:bg-primary/10",
                                  )}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {subItem.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </nav>

                  <div className="border-t pt-4">
                    {user ? (
                      <div className="px-4 py-2">
                        <div className="flex items-center space-x-3 mb-4">
                          <Avatar>
                            <AvatarImage src={profile?.avatar_url || ""} alt={getUserDisplayName()} />
                            <AvatarFallback>{getUserInitials()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{getUserDisplayName()}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button asChild variant="outline" className="w-full justify-start">
                            <Link href="/profile">
                              <User className="mr-2 h-4 w-4" />
                              Profile
                            </Link>
                          </Button>
                          <Button variant="outline" className="w-full justify-start" onClick={() => signOut()}>
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-2 px-4">
                        <Button asChild>
                          <Link href="/sign-in">Sign In</Link>
                        </Button>
                        <Button asChild variant="outline">
                          <Link href="/sign-up">Sign Up</Link>
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
