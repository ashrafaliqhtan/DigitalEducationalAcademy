"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/contexts/language-context"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  DollarSign,
  ShoppingCart,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react"

interface AnalyticsData {
  revenue: Array<{ month: string; amount: number; growth: number }>
  users: Array<{ month: string; new: number; active: number }>
  courses: Array<{ name: string; enrollments: number; revenue: number }>
  traffic: Array<{ source: string; visitors: number; percentage: number }>
  conversions: Array<{ step: string; rate: number }>
}

export default function AnalyticsPage() {
  const { t } = useLanguage()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange])

  const loadAnalyticsData = async () => {
    setIsLoading(true)
    // Mock data - replace with real API calls
    setTimeout(() => {
      setData({
        revenue: [
          { month: "Jan", amount: 12000, growth: 12 },
          { month: "Feb", amount: 15000, growth: 25 },
          { month: "Mar", amount: 18000, growth: 20 },
          { month: "Apr", amount: 22000, growth: 22 },
          { month: "May", amount: 25000, growth: 14 },
          { month: "Jun", amount: 28000, growth: 12 },
        ],
        users: [
          { month: "Jan", new: 120, active: 890 },
          { month: "Feb", new: 150, active: 920 },
          { month: "Mar", new: 180, active: 980 },
          { month: "Apr", new: 220, active: 1050 },
          { month: "May", new: 250, active: 1120 },
          { month: "Jun", new: 280, active: 1200 },
        ],
        courses: [
          { name: "React Fundamentals", enrollments: 234, revenue: 11700 },
          { name: "JavaScript Advanced", enrollments: 189, revenue: 9450 },
          { name: "Node.js Backend", enrollments: 156, revenue: 7800 },
          { name: "Python Basics", enrollments: 145, revenue: 7250 },
          { name: "Data Science", enrollments: 123, revenue: 6150 },
        ],
        traffic: [
          { source: "Organic Search", visitors: 4500, percentage: 45 },
          { source: "Direct", visitors: 2800, percentage: 28 },
          { source: "Social Media", visitors: 1500, percentage: 15 },
          { source: "Referral", visitors: 800, percentage: 8 },
          { source: "Email", visitors: 400, percentage: 4 },
        ],
        conversions: [
          { step: "Visitors", rate: 100 },
          { step: "Course Views", rate: 65 },
          { step: "Add to Cart", rate: 25 },
          { step: "Checkout", rate: 18 },
          { step: "Purchase", rate: 15 },
        ],
      })
      setIsLoading(false)
    }, 1000)
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

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
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("admin.analytics.title")}</h1>
          <p className="text-muted-foreground">{t("admin.analytics.description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            {t("admin.analytics.filter")}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {t("admin.analytics.export")}
          </Button>
          <Button variant="outline" size="sm" onClick={loadAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("admin.analytics.refresh")}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.analytics.totalRevenue")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$28,000</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% {t("admin.analytics.fromLastMonth")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.analytics.activeUsers")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,200</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +7% {t("admin.analytics.fromLastMonth")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.analytics.courseEnrollments")}</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,147</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +23% {t("admin.analytics.fromLastMonth")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.analytics.conversionRate")}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15%</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2% {t("admin.analytics.fromLastMonth")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">{t("admin.analytics.revenue")}</TabsTrigger>
          <TabsTrigger value="users">{t("admin.analytics.users")}</TabsTrigger>
          <TabsTrigger value="courses">{t("admin.analytics.courses")}</TabsTrigger>
          <TabsTrigger value="traffic">{t("admin.analytics.traffic")}</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.analytics.revenueOverTime")}</CardTitle>
              <CardDescription>{t("admin.analytics.revenueDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data?.revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.analytics.userGrowth")}</CardTitle>
              <CardDescription>{t("admin.analytics.userDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data?.users}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="new" stroke="#8884d8" name="New Users" />
                  <Line type="monotone" dataKey="active" stroke="#82ca9d" name="Active Users" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.analytics.topCourses")}</CardTitle>
              <CardDescription>{t("admin.analytics.coursesDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data?.courses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="enrollments" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.analytics.trafficSources")}</CardTitle>
                <CardDescription>{t("admin.analytics.trafficDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data?.traffic}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="visitors"
                    >
                      {data?.traffic.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("admin.analytics.conversionFunnel")}</CardTitle>
                <CardDescription>{t("admin.analytics.funnelDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data?.conversions.map((step, index) => (
                  <div key={step.step} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{step.step}</span>
                      <span>{step.rate}%</span>
                    </div>
                    <Progress value={step.rate} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
