"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLanguage } from "@/contexts/language-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  BookOpen,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Users,
  Star,
  DollarSign,
  TrendingUp,
  Download,
  Settings,
  Play,
  Pause,
  Archive,
} from "lucide-react"

interface Course {
  id: string
  title: string
  instructor: string
  instructorAvatar?: string
  category: string
  level: "beginner" | "intermediate" | "advanced"
  status: "published" | "draft" | "archived"
  price: number
  enrollments: number
  rating: number
  reviews: number
  duration: string
  lessons: number
  createdAt: string
  updatedAt: string
  thumbnail?: string
}

interface CourseStats {
  totalCourses: number
  publishedCourses: number
  draftCourses: number
  totalEnrollments: number
  averageRating: number
  totalRevenue: number
}

export default function CourseManagement() {
  const { t } = useLanguage()
  const [courses, setCourses] = useState<Course[]>([])
  const [stats, setStats] = useState<CourseStats>({
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalEnrollments: 0,
    averageRating: 0,
    totalRevenue: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    setIsLoading(true)

    // Mock data - replace with real API calls
    setTimeout(() => {
      const mockCourses: Course[] = [
        {
          id: "1",
          title: "React Fundamentals",
          instructor: "John Smith",
          instructorAvatar: "/placeholder.svg?height=32&width=32",
          category: "Programming",
          level: "beginner",
          status: "published",
          price: 99.99,
          enrollments: 1247,
          rating: 4.8,
          reviews: 234,
          duration: "12 hours",
          lessons: 24,
          createdAt: "2024-01-15",
          updatedAt: "2024-01-20",
          thumbnail: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "2",
          title: "Advanced JavaScript",
          instructor: "Sarah Johnson",
          instructorAvatar: "/placeholder.svg?height=32&width=32",
          category: "Programming",
          level: "advanced",
          status: "published",
          price: 149.99,
          enrollments: 892,
          rating: 4.9,
          reviews: 156,
          duration: "18 hours",
          lessons: 32,
          createdAt: "2024-01-10",
          updatedAt: "2024-01-18",
          thumbnail: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "3",
          title: "Python for Beginners",
          instructor: "Mike Wilson",
          category: "Programming",
          level: "beginner",
          status: "draft",
          price: 79.99,
          enrollments: 0,
          rating: 0,
          reviews: 0,
          duration: "10 hours",
          lessons: 20,
          createdAt: "2024-01-20",
          updatedAt: "2024-01-20",
        },
        {
          id: "4",
          title: "UI/UX Design Principles",
          instructor: "Emma Davis",
          instructorAvatar: "/placeholder.svg?height=32&width=32",
          category: "Design",
          level: "intermediate",
          status: "published",
          price: 129.99,
          enrollments: 567,
          rating: 4.7,
          reviews: 89,
          duration: "15 hours",
          lessons: 28,
          createdAt: "2024-01-05",
          updatedAt: "2024-01-15",
          thumbnail: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "5",
          title: "Digital Marketing Mastery",
          instructor: "Alex Brown",
          category: "Marketing",
          level: "intermediate",
          status: "archived",
          price: 199.99,
          enrollments: 234,
          rating: 4.5,
          reviews: 45,
          duration: "20 hours",
          lessons: 35,
          createdAt: "2023-12-01",
          updatedAt: "2024-01-01",
        },
      ]

      setCourses(mockCourses)
      setStats({
        totalCourses: mockCourses.length,
        publishedCourses: mockCourses.filter((c) => c.status === "published").length,
        draftCourses: mockCourses.filter((c) => c.status === "draft").length,
        totalEnrollments: mockCourses.reduce((sum, c) => sum + c.enrollments, 0),
        averageRating:
          mockCourses.filter((c) => c.rating > 0).reduce((sum, c) => sum + c.rating, 0) /
          mockCourses.filter((c) => c.rating > 0).length,
        totalRevenue: mockCourses.reduce((sum, c) => sum + c.price * c.enrollments, 0),
      })
      setIsLoading(false)
    }, 1000)
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || course.status === statusFilter
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter
    const matchesLevel = levelFilter === "all" || course.level === levelFilter

    return matchesSearch && matchesStatus && matchesCategory && matchesLevel
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            {t("admin.courses.published")}
          </Badge>
        )
      case "draft":
        return <Badge variant="secondary">{t("admin.courses.draft")}</Badge>
      case "archived":
        return <Badge variant="outline">{t("admin.courses.archived")}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getLevelBadge = (level: string) => {
    const colors = {
      beginner: "bg-blue-100 text-blue-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800",
    }
    return (
      <Badge variant="outline" className={colors[level as keyof typeof colors]}>
        {t(`common.${level}`)}
      </Badge>
    )
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
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("admin.courses.title")}</h1>
          <p className="text-muted-foreground">{t("admin.courses.description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t("admin.courses.export")}
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("admin.courses.addCourse")}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.courses.totalCourses")}</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedCourses} {t("admin.courses.published").toLowerCase()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.courses.totalEnrollments")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnrollments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% {t("admin.stats.fromLastMonth")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.courses.averageRating")}</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">{t("admin.courses.outOfFive")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.courses.totalRevenue")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% {t("admin.stats.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Course Management */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.courses.courseManagement")}</CardTitle>
          <CardDescription>{t("admin.courses.managementDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("admin.courses.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t("admin.courses.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("admin.courses.all")}</SelectItem>
                <SelectItem value="published">{t("admin.courses.published")}</SelectItem>
                <SelectItem value="draft">{t("admin.courses.draft")}</SelectItem>
                <SelectItem value="archived">{t("admin.courses.archived")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t("admin.courses.category")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("admin.courses.all")}</SelectItem>
                <SelectItem value="Programming">{t("courses.categories.programming")}</SelectItem>
                <SelectItem value="Design">{t("courses.categories.design")}</SelectItem>
                <SelectItem value="Marketing">{t("courses.categories.marketing")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t("admin.courses.level")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("admin.courses.all")}</SelectItem>
                <SelectItem value="beginner">{t("common.beginner")}</SelectItem>
                <SelectItem value="intermediate">{t("common.intermediate")}</SelectItem>
                <SelectItem value="advanced">{t("common.advanced")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Course Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.courses.course")}</TableHead>
                  <TableHead>{t("admin.courses.instructor")}</TableHead>
                  <TableHead>{t("admin.courses.category")}</TableHead>
                  <TableHead>{t("admin.courses.level")}</TableHead>
                  <TableHead>{t("admin.courses.status")}</TableHead>
                  <TableHead>{t("admin.courses.price")}</TableHead>
                  <TableHead>{t("admin.courses.enrollments")}</TableHead>
                  <TableHead>{t("admin.courses.rating")}</TableHead>
                  <TableHead>{t("admin.courses.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {course.thumbnail && (
                          <img
                            src={course.thumbnail || "/placeholder.svg"}
                            alt={course.title}
                            className="w-12 h-8 object-cover rounded"
                          />
                        )}
                        <div>
                          <div className="font-medium">{course.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {course.lessons} {t("courses.lessons")} • {course.duration}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={course.instructorAvatar || "/placeholder.svg"} />
                          <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{course.instructor}</span>
                      </div>
                    </TableCell>
                    <TableCell>{course.category}</TableCell>
                    <TableCell>{getLevelBadge(course.level)}</TableCell>
                    <TableCell>{getStatusBadge(course.status)}</TableCell>
                    <TableCell>${course.price}</TableCell>
                    <TableCell>{course.enrollments.toLocaleString()}</TableCell>
                    <TableCell>
                      {course.rating > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating}</span>
                          <span className="text-muted-foreground">({course.reviews})</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            {t("admin.courses.view")}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            {t("admin.courses.edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            {t("admin.courses.settings")}
                          </DropdownMenuItem>
                          {course.status === "published" ? (
                            <DropdownMenuItem>
                              <Pause className="mr-2 h-4 w-4" />
                              {t("admin.courses.unpublish")}
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <Play className="mr-2 h-4 w-4" />
                              {t("admin.courses.publish")}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Archive className="mr-2 h-4 w-4" />
                            {t("admin.courses.archive")}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t("admin.courses.delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
