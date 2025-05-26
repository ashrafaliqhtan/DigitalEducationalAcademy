"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  Plus,
  Send,
  Edit,
  Trash2,
  MoreHorizontal,
  Mail,
  MessageSquare,
  Smartphone,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
  Filter,
  Download,
  Settings,
  Eye,
  Copy,
} from "lucide-react"

interface NotificationTemplate {
  id: string
  name: string
  subject: string
  content: string
  type: "email" | "push" | "in-app" | "sms"
  category: "system" | "marketing" | "transactional" | "announcement"
  status: "active" | "draft" | "archived"
  createdAt: string
  updatedAt: string
  usageCount: number
}

interface NotificationCampaign {
  id: string
  name: string
  templateId: string
  targetAudience: string[]
  scheduledAt?: string
  sentAt?: string
  status: "draft" | "scheduled" | "sending" | "sent" | "failed"
  recipients: number
  delivered: number
  opened: number
  clicked: number
  createdAt: string
}

interface NotificationSettings {
  emailEnabled: boolean
  pushEnabled: boolean
  smsEnabled: boolean
  inAppEnabled: boolean
  defaultSender: string
  replyToEmail: string
  unsubscribeUrl: string
  trackingEnabled: boolean
  retryAttempts: number
  batchSize: number
}

export default function NotificationsPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [campaigns, setCampaigns] = useState<NotificationCampaign[]>([])
  const [settings, setSettings] = useState<NotificationSettings>({
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false,
    inAppEnabled: true,
    defaultSender: "Educational Academy <noreply@academy.com>",
    replyToEmail: "support@academy.com",
    unsubscribeUrl: "https://academy.com/unsubscribe",
    trackingEnabled: true,
    retryAttempts: 3,
    batchSize: 100,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null)
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false)
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false)

  useEffect(() => {
    loadNotificationData()
  }, [])

  const loadNotificationData = async () => {
    setIsLoading(true)
    // Mock data - replace with real API calls
    setTimeout(() => {
      setTemplates([
        {
          id: "welcome-email",
          name: "Welcome Email",
          subject: "Welcome to Educational Academy!",
          content: "Welcome to our platform! We're excited to have you join our learning community...",
          type: "email",
          category: "transactional",
          status: "active",
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-18T14:30:00Z",
          usageCount: 1247,
        },
        {
          id: "course-reminder",
          name: "Course Reminder",
          subject: "Don't forget about your course!",
          content: "You have an upcoming lesson in your enrolled course...",
          type: "email",
          category: "marketing",
          status: "active",
          createdAt: "2024-01-10T09:15:00Z",
          updatedAt: "2024-01-19T11:20:00Z",
          usageCount: 892,
        },
        {
          id: "payment-confirmation",
          name: "Payment Confirmation",
          subject: "Payment Received - Thank You!",
          content: "We've received your payment for the course enrollment...",
          type: "email",
          category: "transactional",
          status: "active",
          createdAt: "2024-01-08T16:45:00Z",
          updatedAt: "2024-01-16T13:10:00Z",
          usageCount: 567,
        },
        {
          id: "new-course-announcement",
          name: "New Course Announcement",
          subject: "New Course Available: Advanced React",
          content: "We're excited to announce a new course in our catalog...",
          type: "email",
          category: "announcement",
          status: "draft",
          createdAt: "2024-01-20T08:30:00Z",
          updatedAt: "2024-01-20T08:30:00Z",
          usageCount: 0,
        },
        {
          id: "push-lesson-reminder",
          name: "Lesson Reminder Push",
          subject: "Time for your lesson!",
          content: "Your next lesson starts in 15 minutes. Don't miss it!",
          type: "push",
          category: "system",
          status: "active",
          createdAt: "2024-01-12T12:00:00Z",
          updatedAt: "2024-01-17T15:45:00Z",
          usageCount: 2341,
        },
      ])

      setCampaigns([
        {
          id: "campaign-1",
          name: "January Newsletter",
          templateId: "new-course-announcement",
          targetAudience: ["all-users"],
          scheduledAt: "2024-01-25T10:00:00Z",
          status: "scheduled",
          recipients: 1247,
          delivered: 0,
          opened: 0,
          clicked: 0,
          createdAt: "2024-01-20T14:30:00Z",
        },
        {
          id: "campaign-2",
          name: "Welcome Series - Week 1",
          templateId: "welcome-email",
          targetAudience: ["new-users"],
          sentAt: "2024-01-18T09:00:00Z",
          status: "sent",
          recipients: 156,
          delivered: 154,
          opened: 89,
          clicked: 23,
          createdAt: "2024-01-18T08:45:00Z",
        },
        {
          id: "campaign-3",
          name: "Course Completion Reminder",
          templateId: "course-reminder",
          targetAudience: ["enrolled-users"],
          sentAt: "2024-01-19T15:30:00Z",
          status: "sent",
          recipients: 432,
          delivered: 428,
          opened: 234,
          clicked: 67,
          createdAt: "2024-01-19T14:00:00Z",
        },
      ])
      setIsLoading(false)
    }, 1000)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "push":
        return <Smartphone className="h-4 w-4" />
      case "in-app":
        return <Bell className="h-4 w-4" />
      case "sms":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "sent":
        return "default"
      case "draft":
      case "scheduled":
        return "secondary"
      case "sending":
        return "outline"
      case "failed":
      case "archived":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "sent":
        return <CheckCircle className="h-3 w-3" />
      case "draft":
        return <Edit className="h-3 w-3" />
      case "scheduled":
        return <Clock className="h-3 w-3" />
      case "sending":
        return <Send className="h-3 w-3" />
      case "failed":
        return <XCircle className="h-3 w-3" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  const handleCreateTemplate = () => {
    setSelectedTemplate(null)
    setIsCreatingTemplate(true)
  }

  const handleEditTemplate = (template: NotificationTemplate) => {
    setSelectedTemplate(template)
    setIsCreatingTemplate(true)
  }

  const handleDeleteTemplate = async (template: NotificationTemplate) => {
    setTemplates((prev) => prev.filter((t) => t.id !== template.id))
    toast({
      title: t("admin.notifications.templateDeleted"),
      description: t("admin.notifications.templateDeletedDescription", { name: template.name }),
    })
  }

  const handleSaveTemplate = async (templateData: Partial<NotificationTemplate>) => {
    if (selectedTemplate) {
      setTemplates((prev) =>
        prev.map((template) =>
          template.id === selectedTemplate.id
            ? { ...template, ...templateData, updatedAt: new Date().toISOString() }
            : template,
        ),
      )
      toast({
        title: t("admin.notifications.templateUpdated"),
        description: t("admin.notifications.templateUpdatedDescription", { name: selectedTemplate.name }),
      })
    } else {
      const newTemplate: NotificationTemplate = {
        id: `template-${Date.now()}`,
        name: templateData.name || "",
        subject: templateData.subject || "",
        content: templateData.content || "",
        type: templateData.type || "email",
        category: templateData.category || "system",
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
      }
      setTemplates((prev) => [...prev, newTemplate])
      toast({
        title: t("admin.notifications.templateCreated"),
        description: t("admin.notifications.templateCreatedDescription", { name: newTemplate.name }),
      })
    }
    setIsCreatingTemplate(false)
    setSelectedTemplate(null)
  }

  const handleCreateCampaign = () => {
    setIsCreatingCampaign(true)
  }

  const handleSaveCampaign = async (campaignData: Partial<NotificationCampaign>) => {
    const newCampaign: NotificationCampaign = {
      id: `campaign-${Date.now()}`,
      name: campaignData.name || "",
      templateId: campaignData.templateId || "",
      targetAudience: campaignData.targetAudience || [],
      scheduledAt: campaignData.scheduledAt,
      status: campaignData.scheduledAt ? "scheduled" : "draft",
      recipients: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      createdAt: new Date().toISOString(),
    }
    setCampaigns((prev) => [...prev, newCampaign])
    setIsCreatingCampaign(false)
    toast({
      title: t("admin.notifications.campaignCreated"),
      description: t("admin.notifications.campaignCreatedDescription", { name: newCampaign.name }),
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const calculateOpenRate = (opened: number, delivered: number) => {
    if (delivered === 0) return 0
    return Math.round((opened / delivered) * 100)
  }

  const calculateClickRate = (clicked: number, delivered: number) => {
    if (delivered === 0) return 0
    return Math.round((clicked / delivered) * 100)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("admin.notifications.title")}</h1>
          <p className="text-muted-foreground">{t("admin.notifications.description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            {t("admin.notifications.settings")}
          </Button>
          <Button onClick={handleCreateCampaign}>
            <Send className="h-4 w-4 mr-2" />
            {t("admin.notifications.createCampaign")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">{t("admin.notifications.templates")}</TabsTrigger>
          <TabsTrigger value="campaigns">{t("admin.notifications.campaigns")}</TabsTrigger>
          <TabsTrigger value="analytics">{t("admin.notifications.analytics")}</TabsTrigger>
          <TabsTrigger value="settings">{t("admin.notifications.settings")}</TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t("admin.notifications.templateManagement")}</h2>
            <Button onClick={handleCreateTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              {t("admin.notifications.createTemplate")}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(template.type)}
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t("admin.notifications.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          {t("admin.notifications.preview")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          {t("admin.notifications.duplicate")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteTemplate(template)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t("admin.notifications.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(template.status)}>
                      {getStatusIcon(template.status)}
                      <span className="ml-1">{t(`admin.notifications.${template.status}`)}</span>
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {template.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">{template.subject}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{template.content}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {t("admin.notifications.used")}: {template.usageCount}
                    </span>
                    <span>{formatDate(template.updatedAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t("admin.notifications.campaignManagement")}</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                {t("admin.notifications.filter")}
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                {t("admin.notifications.export")}
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("admin.notifications.campaign")}</TableHead>
                    <TableHead>{t("admin.notifications.template")}</TableHead>
                    <TableHead>{t("admin.notifications.status")}</TableHead>
                    <TableHead>{t("admin.notifications.recipients")}</TableHead>
                    <TableHead>{t("admin.notifications.delivered")}</TableHead>
                    <TableHead>{t("admin.notifications.openRate")}</TableHead>
                    <TableHead>{t("admin.notifications.clickRate")}</TableHead>
                    <TableHead>{t("admin.notifications.date")}</TableHead>
                    <TableHead className="text-right">{t("admin.notifications.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => {
                    const template = templates.find((t) => t.id === campaign.templateId)
                    return (
                      <TableRow key={campaign.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{campaign.name}</p>
                            <p className="text-xs text-muted-foreground">{campaign.targetAudience.join(", ")}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {template && getTypeIcon(template.type)}
                            <span className="text-sm">{template?.name || "Unknown"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(campaign.status)}>
                            {getStatusIcon(campaign.status)}
                            <span className="ml-1">{t(`admin.notifications.${campaign.status}`)}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>{campaign.recipients.toLocaleString()}</TableCell>
                        <TableCell>{campaign.delivered.toLocaleString()}</TableCell>
                        <TableCell>
                          {campaign.delivered > 0 ? `${calculateOpenRate(campaign.opened, campaign.delivered)}%` : "-"}
                        </TableCell>
                        <TableCell>
                          {campaign.delivered > 0
                            ? `${calculateClickRate(campaign.clicked, campaign.delivered)}%`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {campaign.sentAt
                            ? formatDate(campaign.sentAt)
                            : campaign.scheduledAt
                              ? formatDate(campaign.scheduledAt)
                              : formatDate(campaign.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                {t("admin.notifications.viewDetails")}
                              </DropdownMenuItem>
                              {campaign.status === "draft" && (
                                <DropdownMenuItem>
                                  <Send className="mr-2 h-4 w-4" />
                                  {t("admin.notifications.send")}
                                </DropdownMenuItem>
                              )}
                              {campaign.status === "scheduled" && (
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  {t("admin.notifications.reschedule")}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                {t("admin.notifications.duplicate")}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t("admin.notifications.delete")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <h2 className="text-xl font-semibold">{t("admin.notifications.analyticsOverview")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("admin.notifications.totalSent")}</CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,847</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("admin.notifications.deliveryRate")}</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.2%</div>
                <p className="text-xs text-muted-foreground">+0.5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("admin.notifications.averageOpenRate")}</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.8%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("admin.notifications.averageClickRate")}</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.7%</div>
                <p className="text-xs text-muted-foreground">+0.8% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.notifications.performanceByType")}</CardTitle>
                <CardDescription>{t("admin.notifications.performanceDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">8,234 sent</div>
                      <div className="text-sm text-muted-foreground">26.3% open rate</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <span>Push</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">3,421 sent</div>
                      <div className="text-sm text-muted-foreground">18.7% open rate</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>In-App</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">1,192 sent</div>
                      <div className="text-sm text-muted-foreground">45.2% open rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("admin.notifications.topPerformingTemplates")}</CardTitle>
                <CardDescription>{t("admin.notifications.topTemplatesDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templates
                    .filter((t) => t.usageCount > 0)
                    .sort((a, b) => b.usageCount - a.usageCount)
                    .slice(0, 5)
                    .map((template) => (
                      <div key={template.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(template.type)}
                          <span className="text-sm">{template.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{template.usageCount}</div>
                          <div className="text-xs text-muted-foreground">uses</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <h2 className="text-xl font-semibold">{t("admin.notifications.notificationSettings")}</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.notifications.channelSettings")}</CardTitle>
                <CardDescription>{t("admin.notifications.channelDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <div className="text-sm text-muted-foreground">Send notifications via email</div>
                  </div>
                  <Switch
                    checked={settings.emailEnabled}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, emailEnabled: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <div className="text-sm text-muted-foreground">Send push notifications to mobile devices</div>
                  </div>
                  <Switch
                    checked={settings.pushEnabled}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, pushEnabled: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">SMS Notifications</Label>
                    <div className="text-sm text-muted-foreground">Send notifications via SMS</div>
                  </div>
                  <Switch
                    checked={settings.smsEnabled}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, smsEnabled: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">In-App Notifications</Label>
                    <div className="text-sm text-muted-foreground">Show notifications within the application</div>
                  </div>
                  <Switch
                    checked={settings.inAppEnabled}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, inAppEnabled: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("admin.notifications.emailSettings")}</CardTitle>
                <CardDescription>{t("admin.notifications.emailDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultSender">{t("admin.notifications.defaultSender")}</Label>
                  <Input
                    id="defaultSender"
                    value={settings.defaultSender}
                    onChange={(e) => setSettings((prev) => ({ ...prev, defaultSender: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="replyToEmail">{t("admin.notifications.replyToEmail")}</Label>
                  <Input
                    id="replyToEmail"
                    value={settings.replyToEmail}
                    onChange={(e) => setSettings((prev) => ({ ...prev, replyToEmail: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unsubscribeUrl">{t("admin.notifications.unsubscribeUrl")}</Label>
                  <Input
                    id="unsubscribeUrl"
                    value={settings.unsubscribeUrl}
                    onChange={(e) => setSettings((prev) => ({ ...prev, unsubscribeUrl: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("admin.notifications.deliverySettings")}</CardTitle>
                <CardDescription>{t("admin.notifications.deliveryDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{t("admin.notifications.trackingEnabled")}</Label>
                    <div className="text-sm text-muted-foreground">Track opens and clicks</div>
                  </div>
                  <Switch
                    checked={settings.trackingEnabled}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, trackingEnabled: checked }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retryAttempts">{t("admin.notifications.retryAttempts")}</Label>
                  <Input
                    id="retryAttempts"
                    type="number"
                    value={settings.retryAttempts}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, retryAttempts: Number.parseInt(e.target.value) }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batchSize">{t("admin.notifications.batchSize")}</Label>
                  <Input
                    id="batchSize"
                    type="number"
                    value={settings.batchSize}
                    onChange={(e) => setSettings((prev) => ({ ...prev, batchSize: Number.parseInt(e.target.value) }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button>{t("admin.notifications.saveSettings")}</Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Creation/Edit Dialog */}
      <Dialog open={isCreatingTemplate} onOpenChange={setIsCreatingTemplate}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate ? t("admin.notifications.editTemplate") : t("admin.notifications.createTemplate")}
            </DialogTitle>
            <DialogDescription>
              {selectedTemplate
                ? t("admin.notifications.editTemplateDescription")
                : t("admin.notifications.createTemplateDescription")}
            </DialogDescription>
          </DialogHeader>

          <NotificationTemplateForm
            template={selectedTemplate}
            onSave={handleSaveTemplate}
            onCancel={() => {
              setIsCreatingTemplate(false)
              setSelectedTemplate(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Campaign Creation Dialog */}
      <Dialog open={isCreatingCampaign} onOpenChange={setIsCreatingCampaign}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("admin.notifications.createCampaign")}</DialogTitle>
            <DialogDescription>{t("admin.notifications.createCampaignDescription")}</DialogDescription>
          </DialogHeader>

          <NotificationCampaignForm
            templates={templates}
            onSave={handleSaveCampaign}
            onCancel={() => setIsCreatingCampaign(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Notification Template Form Component
function NotificationTemplateForm({
  template,
  onSave,
  onCancel,
}: {
  template: NotificationTemplate | null
  onSave: (templateData: Partial<NotificationTemplate>) => void
  onCancel: () => void
}) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: template?.name || "",
    subject: template?.subject || "",
    content: template?.content || "",
    type: template?.type || "email",
    category: template?.category || "system",
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t("admin.notifications.templateName")}</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder={t("admin.notifications.templateNamePlaceholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">{t("admin.notifications.type")}</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value as any }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="push">Push Notification</SelectItem>
              <SelectItem value="in-app">In-App</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">{t("admin.notifications.category")}</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value as any }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="transactional">Transactional</SelectItem>
            <SelectItem value="announcement">Announcement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">{t("admin.notifications.subject")}</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
          placeholder={t("admin.notifications.subjectPlaceholder")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">{t("admin.notifications.content")}</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
          placeholder={t("admin.notifications.contentPlaceholder")}
          rows={6}
        />
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          {t("admin.notifications.cancel")}
        </Button>
        <Button onClick={() => onSave(formData)}>{t("admin.notifications.save")}</Button>
      </DialogFooter>
    </div>
  )
}

// Notification Campaign Form Component
function NotificationCampaignForm({
  templates,
  onSave,
  onCancel,
}: {
  templates: NotificationTemplate[]
  onSave: (campaignData: Partial<NotificationCampaign>) => void
  onCancel: () => void
}) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    templateId: "",
    targetAudience: [] as string[],
    scheduledAt: "",
  })

  const audienceOptions = [
    { value: "all-users", label: "All Users" },
    { value: "new-users", label: "New Users (Last 30 days)" },
    { value: "enrolled-users", label: "Enrolled Users" },
    { value: "inactive-users", label: "Inactive Users" },
    { value: "premium-users", label: "Premium Users" },
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="campaignName">{t("admin.notifications.campaignName")}</Label>
        <Input
          id="campaignName"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder={t("admin.notifications.campaignNamePlaceholder")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="template">{t("admin.notifications.selectTemplate")}</Label>
        <Select
          value={formData.templateId}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, templateId: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("admin.notifications.selectTemplatePlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {templates
              .filter((template) => template.status === "active")
              .map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name} ({template.type})
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{t("admin.notifications.targetAudience")}</Label>
        <div className="space-y-2">
          {audienceOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={option.value}
                checked={formData.targetAudience.includes(option.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData((prev) => ({
                      ...prev,
                      targetAudience: [...prev.targetAudience, option.value],
                    }))
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      targetAudience: prev.targetAudience.filter((audience) => audience !== option.value),
                    }))
                  }
                }}
                className="rounded border-gray-300"
              />
              <Label htmlFor={option.value} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="scheduledAt">
          {t("admin.notifications.scheduleDate")} ({t("admin.notifications.optional")})
        </Label>
        <Input
          id="scheduledAt"
          type="datetime-local"
          value={formData.scheduledAt}
          onChange={(e) => setFormData((prev) => ({ ...prev, scheduledAt: e.target.value }))}
        />
        <p className="text-xs text-muted-foreground">{t("admin.notifications.scheduleDescription")}</p>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          {t("admin.notifications.cancel")}
        </Button>
        <Button onClick={() => onSave(formData)}>
          {formData.scheduledAt ? t("admin.notifications.schedule") : t("admin.notifications.createDraft")}
        </Button>
      </DialogFooter>
    </div>
  )
}
