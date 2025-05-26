"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ShoppingCart,
  DollarSign,
  FileText,
  Settings,
  BarChart3,
  MessageSquare,
  Bell,
  Shield,
  Database,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  CreditCard,
  UserCheck,
  TrendingUp,
  Calendar,
  Mail,
  Globe,
  Palette,
  Lock,
  HelpCircle,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  children?: NavItem[]
}

export function AdminSidebar() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const navItems: NavItem[] = [
    {
      title: t("admin.nav.dashboard"),
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: t("admin.nav.analytics"),
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: t("admin.nav.users"),
      href: "/admin/users",
      icon: Users,
      badge: "1,247",
      children: [
        {
          title: t("admin.nav.allUsers"),
          href: "/admin/users",
          icon: Users,
        },
        {
          title: t("admin.nav.instructors"),
          href: "/admin/users/instructors",
          icon: GraduationCap,
        },
        {
          title: t("admin.nav.admins"),
          href: "/admin/users/admins",
          icon: Shield,
        },
      ],
    },
    {
      title: t("admin.nav.courses"),
      href: "/admin/courses",
      icon: BookOpen,
      badge: "45",
      children: [
        {
          title: t("admin.nav.allCourses"),
          href: "/admin/courses",
          icon: BookOpen,
        },
        {
          title: t("admin.nav.categories"),
          href: "/admin/courses/categories",
          icon: Database,
        },
        {
          title: t("admin.nav.reviews"),
          href: "/admin/courses/reviews",
          icon: MessageSquare,
        },
      ],
    },
    {
      title: t("admin.nav.orders"),
      href: "/admin/orders",
      icon: ShoppingCart,
      badge: "12",
      children: [
        {
          title: t("admin.nav.allOrders"),
          href: "/admin/orders",
          icon: ShoppingCart,
        },
        {
          title: t("admin.nav.payments"),
          href: "/admin/orders/payments",
          icon: CreditCard,
        },
        {
          title: t("admin.nav.invoices"),
          href: "/admin/orders/invoices",
          icon: FileText,
        },
      ],
    },
    {
      title: t("admin.nav.enrollments"),
      href: "/admin/enrollments",
      icon: UserCheck,
    },
    {
      title: t("admin.nav.reports"),
      href: "/admin/reports",
      icon: TrendingUp,
      children: [
        {
          title: t("admin.nav.salesReports"),
          href: "/admin/reports/sales",
          icon: DollarSign,
        },
        {
          title: t("admin.nav.userReports"),
          href: "/admin/reports/users",
          icon: Users,
        },
        {
          title: t("admin.nav.courseReports"),
          href: "/admin/reports/courses",
          icon: BookOpen,
        },
      ],
    },
    {
      title: t("admin.nav.communications"),
      href: "/admin/communications",
      icon: Mail,
      children: [
        {
          title: t("admin.nav.notifications"),
          href: "/admin/communications/notifications",
          icon: Bell,
        },
        {
          title: t("admin.nav.emails"),
          href: "/admin/communications/emails",
          icon: Mail,
        },
        {
          title: t("admin.nav.announcements"),
          href: "/admin/communications/announcements",
          icon: MessageSquare,
        },
      ],
    },
    {
      title: t("admin.nav.content"),
      href: "/admin/content",
      icon: FileText,
      children: [
        {
          title: t("admin.nav.pages"),
          href: "/admin/content/pages",
          icon: FileText,
        },
        {
          title: t("admin.nav.blog"),
          href: "/admin/content/blog",
          icon: Calendar,
        },
        {
          title: t("admin.nav.media"),
          href: "/admin/content/media",
          icon: Database,
        },
      ],
    },
    {
      title: t("admin.nav.settings"),
      href: "/admin/settings",
      icon: Settings,
      children: [
        {
          title: t("admin.nav.general"),
          href: "/admin/settings/general",
          icon: Settings,
        },
        {
          title: t("admin.nav.appearance"),
          href: "/admin/settings/appearance",
          icon: Palette,
        },
        {
          title: t("admin.nav.localization"),
          href: "/admin/settings/localization",
          icon: Globe,
        },
        {
          title: t("admin.nav.security"),
          href: "/admin/settings/security",
          icon: Lock,
        },
        {
          title: t("admin.nav.integrations"),
          href: "/admin/settings/integrations",
          icon: Database,
        },
      ],
    },
    {
      title: t("admin.nav.help"),
      href: "/admin/help",
      icon: HelpCircle,
    },
  ]

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) => (prev.includes(href) ? prev.filter((item) => item !== href) : [...prev, href]))
  }

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.href)
    const active = isActive(item.href)

    return (
      <div key={item.href}>
        <div className="relative">
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.href)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                active && "bg-primary/10 text-primary",
                collapsed && "justify-center px-2",
                level > 0 && "ml-4",
              )}
            >
              <item.icon className={cn("h-4 w-4", collapsed && "h-5 w-5")} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")} />
                </>
              )}
            </button>
          ) : (
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                active && "bg-primary/10 text-primary",
                collapsed && "justify-center px-2",
                level > 0 && "ml-4",
              )}
            >
              <item.icon className={cn("h-4 w-4", collapsed && "h-5 w-5")} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          )}
        </div>
        {hasChildren && isExpanded && !collapsed && (
          <div className="mt-1 space-y-1">{item.children?.map((child) => renderNavItem(child, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && <h2 className="text-lg font-semibold">{t("admin.title")}</h2>}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">{navItems.map((item) => renderNavItem(item))}</nav>
      </ScrollArea>
    </div>
  )
}
