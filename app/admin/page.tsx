"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { redirect } from "next/navigation"
import {
  Users,
  BookOpen,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Calendar,
  Star,
  Activity,
  Target,
  Zap,
  Award,
  Bell,
  MessageSquare,
  FileText,
  BarChart3,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DashboardStats {
  totalUsers: number
  totalCourses: number
  totalOrders: number
  totalRevenue: number
  activeUsers: number
  pendingRequests: number
  monthlyGrowth: {
    users: number
    revenue: number
    courses: number
    orders: number
  }
}

interface RecentActivity {
  id: string
  type: "user_registration" | "course_enrollment" | "order_placed" | "review_submitted" | "course_completed"
  description: string
  timestamp: string
  user: string
  avatar?: string
}

interface QuickStat {
  title: string
  value: string
  change: number
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export default function AdminDashboard() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingRequests: 0,
    monthlyGrowth: {
      users: 0,
      revenue: 0,
      courses: 0,
      orders: 0,
    },
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])

  // Check if user is admin (in real app, check user role from database)
  useEffect(() => {
    if (!user) {
      redirect("/sign-in")
    }
    loadDashboardData()
  }, [user])

  const loadDashboardData = async () => {
    setIsLoading(true)

    // Mock data - replace with real API calls
    setTimeout(() => {
      setStats({
        totalUsers: 1247,
        totalCourses: 45,
        totalOrders: 892,
        totalRevenue: 45670,
        activeUsers: 234,
        pendingRequests: 12,
        monthlyGrowth: {
          users: 12,
          revenue: 15,
          courses: 8,
          orders: 23,
        },
      })

      setRecentActivity([
        {
          id: "1",
          type: "user_registration",
          description: "New user registered",
          timestamp: "2024-01-20T10:30:00Z",
          user: "john.doe@example.com",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          id: "2",
          type: "course_enrollment",
          description: "Enrolled in 'React Fundamentals'",
          timestamp: "2024-01-20T10:15:00Z",
          user: "jane.smith@example.com",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          id: "3",
          type: "order_placed",
          description: "New order placed for $99.99",
          timestamp: "2024-01-20T09:45:00Z",
          user: "mike.wilson@example.com",
        },
        {
          id: "4",
          type: "course_completed",
          description: "Completed 'JavaScript Basics'",
          timestamp: "2024-01-20T09:30:00Z",
          user: "sarah.jones@example.com",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          id: "5",
          type: "review_submitted",
          description: "5-star review on 'Python Course'",
          timestamp: "2024-01-20T09:15:00Z",
          user: "alex.brown@example.com",
        },
      ])

      setChartData([
        { name: "Jan", users: 400, revenue: 2400, orders: 240 },
        { name: "Feb", users: 300, revenue: 1398, orders: 221 },
        { name: "Mar", users: 200, revenue: 9800, orders: 229 },
        { name: "Apr", users: 278, revenue: 3908, orders: 200 },
        { name: "May", users: 189, revenue: 4800, orders: 218 },
        { name: "Jun", users: 239, revenue: 3800, orders: 250 },
      ])

      setIsLoading(false)
    }, 1000)
  }

  const quickStats: QuickStat[] = [
    {
      title: t("admin.stats.totalUsers"),
      value: stats.totalUsers.toLocaleString(),
      change: stats.monthlyGrowth.users,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: t("admin.stats.totalRevenue"),
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: stats.monthlyGrowth.revenue,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: t("admin.stats.totalCourses"),
      value: stats.totalCourses.toString(),
      change: stats.monthlyGrowth.courses,
      icon: BookOpen,
      color: "text-purple-600",
    },
    {
      title: t("admin.stats.totalOrders"),
      value: stats.totalOrders.toLocaleString(),
      change: stats.monthlyGrowth.orders,
      icon: ShoppingCart,
      color: "text-orange-600",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_registration":
        return <Users className="h-4 w-4 text-blue-500" />
      case "course_enrollment":
        return <BookOpen className="h-4 w-4 text-green-500" />
      case "order_placed":
        return <ShoppingCart className="h-4 w-4 text-purple-500" />
      case "review_submitted":
        return <Star className="h-4 w-4 text-yellow-500" />
      case "course_completed":
        return <Award className="h-4 w-4 text-emerald-500" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("admin.dashboard")}</h1>
          <p className="text-muted-foreground">{t("admin.dashboardDescription")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            {t("admin.dateRange")}
          </Button>
          <Button>
            <BarChart3 className="mr-2 h-4 w-4" />
            {t("admin.viewReports")}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs">
                {stat.change > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                )}
                <span className={stat.change > 0 ? "text-green-600" : "text-red-600"}>
                  {stat.change > 0 ? "+" : ""}
                  {stat.change}%
                </span>
                <span className="text-muted-foreground ml-1">{t("admin.stats.fromLastMonth")}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.performance.title")}</CardTitle>
            <CardDescription>{t("admin.performance.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.recentActivity")}</CardTitle>
            <CardDescription>{t("admin.recentActivityDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {activity.avatar ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{activity.user.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>{getTimeAgo(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.systemStatus.title")}</CardTitle>
            <CardDescription>{t("admin.systemStatus.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">{t("admin.systemStatus.serverHealth")}</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <Activity className="h-3 w-3 mr-1" />
                {t("admin.systemStatus.healthy")}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t("admin.systemStatus.database")}</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <Zap className="h-3 w-3 mr-1" />
                {t("admin.systemStatus.online")}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t("admin.systemStatus.storage")}</span>
              <div className="flex items-center gap-2">
                <Progress value={65} className="w-16 h-2" />
                <span className="text-xs text-muted-foreground">65%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t("admin.systemStatus.bandwidth")}</span>
              <div className="flex items-center gap-2">
                <Progress value={42} className="w-16 h-2" />
                <span className="text-xs text-muted-foreground">42%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.quickActions")}</CardTitle>
            <CardDescription>{t("admin.quickActionsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              {t("admin.actions.createCourse")}
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              {t("admin.actions.manageUsers")}
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              {t("admin.actions.sendAnnouncement")}
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              {t("admin.actions.generateReport")}
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <AlertCircle className="mr-2 h-4 w-4" />
              {t("admin.actions.reviewRequests")}
              {stats.pendingRequests > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {stats.pendingRequests}
                </Badge>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.notifications.title")}</CardTitle>
            <CardDescription>{t("admin.notifications.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">{t("admin.notifications.systemUpdate")}</p>
                <p className="text-xs text-muted-foreground">{t("admin.notifications.updateDescription")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Bell className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">{t("admin.notifications.newFeature")}</p>
                <p className="text-xs text-muted-foreground">{t("admin.notifications.featureDescription")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Target className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">{t("admin.notifications.goalAchieved")}</p>
                <p className="text-xs text-muted-foreground">{t("admin.notifications.goalDescription")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
