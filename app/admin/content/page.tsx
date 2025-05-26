"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  FileText,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Calendar,
  User,
  ImageIcon,
  Video,
  File,
  Upload,
  Download,
  Copy,
  Archive,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface ContentItem {
  id: string
  title: string
  type: "page" | "blog" | "media"
  status: "published" | "draft" | "archived"
  author: string
  category?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
  publishedAt?: string
  views?: number
  size?: string
  url?: string
  thumbnail?: string
}

interface ContentStats {
  totalPages: number
  totalPosts: number
  totalMedia: number
  publishedContent: number
  draftContent: number
  totalViews: number
}

export default function ContentManagement() {
  const { t } = useLanguage()
  const [content, setContent] = useState<ContentItem[]>([])
  const [stats, setStats] = useState<ContentStats>({
    totalPages: 0,
    totalPosts: 0,
    totalMedia: 0,
    publishedContent: 0,
    draftContent: 0,
    totalViews: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("pages")

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    setIsLoading(true)

    // Mock data - replace with real API calls
    setTimeout(() => {
      const mockContent: ContentItem[] = [
        // Pages
        {
          id: "1",
          title: "About Us",
          type: "page",
          status: "published",
          author: "Admin",
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-20T14:30:00Z",
          publishedAt: "2024-01-15T10:00:00Z",
          views: 1247,
        },
        {
          id: "2",
          title: "Privacy Policy",
          type: "page",
          status: "published",
          author: "Admin",
          createdAt: "2024-01-10T09:00:00Z",
          updatedAt: "2024-01-18T11:15:00Z",
          publishedAt: "2024-01-10T09:00:00Z",
          views: 892,
        },
        {
          id: "3",
          title: "Terms of Service",
          type: "page",
          status: "draft",
          author: "Admin",
          createdAt: "2024-01-20T16:00:00Z",
          updatedAt: "2024-01-20T16:00:00Z",
          views: 0,
        },
        // Blog Posts
        {
          id: "4",
          title: "10 Tips for Effective Online Learning",
          type: "blog",
          status: "published",
          author: "Sarah Johnson",
          category: "Education",
          tags: ["learning", "tips", "online"],
          createdAt: "2024-01-18T12:00:00Z",
          updatedAt: "2024-01-19T09:30:00Z",
          publishedAt: "2024-01-18T12:00:00Z",
          views: 2156,
          thumbnail: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "5",
          title: "The Future of Web Development",
          type: "blog",
          status: "published",
          author: "John Smith",
          category: "Technology",
          tags: ["web development", "future", "trends"],
          createdAt: "2024-01-16T14:00:00Z",
          updatedAt: "2024-01-17T10:45:00Z",
          publishedAt: "2024-01-16T14:00:00Z",
          views: 1834,
          thumbnail: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "6",
          title: "Getting Started with React Hooks",
          type: "blog",
          status: "draft",
          author: "Mike Wilson",
          category: "Programming",
          tags: ["react", "hooks", "javascript"],
          createdAt: "2024-01-19T11:00:00Z",
          updatedAt: "2024-01-20T15:20:00Z",
          views: 0,
        },
        // Media
        {
          id: "7",
          title: "hero-banner.jpg",
          type: "media",
          status: "published",
          author: "Admin",
          createdAt: "2024-01-15T08:00:00Z",
          updatedAt: "2024-01-15T08:00:00Z",
          size: "2.4 MB",
          url: "/placeholder.svg?height=400&width=800",
          thumbnail: "/placeholder.svg?height=100&width=150",
        },
        {
          id: "8",
          title: "course-intro-video.mp4",
          type: "media",
          status: "published",
          author: "John Smith",
          createdAt: "2024-01-12T16:30:00Z",
          updatedAt: "2024-01-12T16:30:00Z",
          size: "45.2 MB",
          url: "/videos/course-intro.mp4",
        },
        {
          id: "9",
          title: "student-handbook.pdf",
          type: "media",
          status: "published",
          author: "Admin",
          createdAt: "2024-01-10T13:15:00Z",
          updatedAt: "2024-01-10T13:15:00Z",
          size: "1.8 MB",
          url: "/documents/handbook.pdf",
        },
      ]

      setContent(mockContent)
      setStats({
        totalPages: mockContent.filter((c) => c.type === "page").length,
        totalPosts: mockContent.filter((c) => c.type === "blog").length,
        totalMedia: mockContent.filter((c) => c.type === "media").length,
        publishedContent: mockContent.filter((c) => c.status === "published").length,
        draftContent: mockContent.filter((c) => c.status === "draft").length,
        totalViews: mockContent.reduce((sum, c) => sum + (c.views || 0), 0),
      })
      setIsLoading(false)
    }, 1000)
  }

  const filteredContent = content.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || item.type === typeFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const getContentByTab = (tab: string) => {
    switch (tab) {
      case "pages":
        return filteredContent.filter((item) => item.type === "page")
      case "blog":
        return filteredContent.filter((item) => item.type === "blog")
      case "media":
        return filteredContent.filter((item) => item.type === "media")
      default:
        return filteredContent
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            {t("admin.content.published")}
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            {t("admin.content.draft")}
          </Badge>
        )
      case "archived":
        return (
          <Badge variant="outline">
            <Archive className="mr-1 h-3 w-3" />
            {t("admin.content.archived")}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getFileIcon = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return <ImageIcon className="h-4 w-4" />
      case "mp4":
      case "avi":
      case "mov":
      case "wmv":
        return <Video className="h-4 w-4" />
      case "pdf":
      case "doc":
      case "docx":
      case "txt":
        return <File className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
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
          <h1 className="text-3xl font-bold">{t("admin.content.title")}</h1>
          <p className="text-muted-foreground">{t("admin.content.description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            {t("admin.content.uploadMedia")}
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("admin.content.createContent")}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.content.totalPages")}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPages}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedContent} {t("admin.content.published").toLowerCase()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.content.totalPosts")}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.draftContent} {t("admin.content.draft").toLowerCase()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.content.totalMedia")}</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMedia}</div>
            <p className="text-xs text-muted-foreground">{t("admin.content.mediaFiles")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.content.totalViews")}</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{t("admin.content.pageViews")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Management */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.content.contentManagement")}</CardTitle>
          <CardDescription>{t("admin.content.managementDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("admin.content.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t("admin.content.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("admin.content.all")}</SelectItem>
                <SelectItem value="published">{t("admin.content.published")}</SelectItem>
                <SelectItem value="draft">{t("admin.content.draft")}</SelectItem>
                <SelectItem value="archived">{t("admin.content.archived")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pages">{t("admin.content.pages")}</TabsTrigger>
              <TabsTrigger value="blog">{t("admin.content.blog")}</TabsTrigger>
              <TabsTrigger value="media">{t("admin.content.media")}</TabsTrigger>
            </TabsList>

            <TabsContent value="pages" className="mt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("admin.content.title")}</TableHead>
                      <TableHead>{t("admin.content.author")}</TableHead>
                      <TableHead>{t("admin.content.status")}</TableHead>
                      <TableHead>{t("admin.content.views")}</TableHead>
                      <TableHead>{t("admin.content.lastModified")}</TableHead>
                      <TableHead>{t("admin.content.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getContentByTab("pages").map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="font-medium">{item.title}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {item.author}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>{item.views?.toLocaleString() || 0}</TableCell>
                        <TableCell>{formatDate(item.updatedAt)}</TableCell>
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
                                {t("admin.content.view")}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                {t("admin.content.edit")}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                {t("admin.content.duplicate")}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Archive className="mr-2 h-4 w-4" />
                                {t("admin.content.archive")}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t("admin.content.delete")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="blog" className="mt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("admin.content.title")}</TableHead>
                      <TableHead>{t("admin.content.author")}</TableHead>
                      <TableHead>{t("admin.content.category")}</TableHead>
                      <TableHead>{t("admin.content.status")}</TableHead>
                      <TableHead>{t("admin.content.views")}</TableHead>
                      <TableHead>{t("admin.content.publishDate")}</TableHead>
                      <TableHead>{t("admin.content.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getContentByTab("blog").map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {item.thumbnail && (
                              <img
                                src={item.thumbnail || "/placeholder.svg"}
                                alt={item.title}
                                className="w-12 h-8 object-cover rounded"
                              />
                            )}
                            <div>
                              <div className="font-medium">{item.title}</div>
                              {item.tags && (
                                <div className="flex gap-1 mt-1">
                                  {item.tags.slice(0, 2).map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {item.tags.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{item.tags.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {item.author}
                          </div>
                        </TableCell>
                        <TableCell>{item.category && <Badge variant="secondary">{item.category}</Badge>}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>{item.views?.toLocaleString() || 0}</TableCell>
                        <TableCell>{item.publishedAt ? formatDate(item.publishedAt) : "-"}</TableCell>
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
                                {t("admin.content.view")}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                {t("admin.content.edit")}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Tag className="mr-2 h-4 w-4" />
                                {t("admin.content.manageTags")}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                {t("admin.content.duplicate")}
                              </DropdownMenuItem>
                              {item.status === "draft" ? (
                                <DropdownMenuItem>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  {t("admin.content.publish")}
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  {t("admin.content.unpublish")}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Archive className="mr-2 h-4 w-4" />
                                {t("admin.content.archive")}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t("admin.content.delete")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="media" className="mt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("admin.content.file")}</TableHead>
                      <TableHead>{t("admin.content.type")}</TableHead>
                      <TableHead>{t("admin.content.size")}</TableHead>
                      <TableHead>{t("admin.content.uploadedBy")}</TableHead>
                      <TableHead>{t("admin.content.uploadDate")}</TableHead>
                      <TableHead>{t("admin.content.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getContentByTab("media").map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {item.thumbnail ? (
                              <img
                                src={item.thumbnail || "/placeholder.svg"}
                                alt={item.title}
                                className="w-12 h-8 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                                {getFileIcon(item.title)}
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{item.title}</div>
                              {item.url && (
                                <div className="text-xs text-muted-foreground truncate max-w-48">{item.url}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getFileIcon(item.title)}
                            <span className="text-sm">{item.title.split(".").pop()?.toUpperCase()}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.size || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {item.author}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(item.createdAt)}</TableCell>
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
                                {t("admin.content.view")}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                {t("admin.content.download")}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                {t("admin.content.copyUrl")}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                {t("admin.content.rename")}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t("admin.content.delete")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
