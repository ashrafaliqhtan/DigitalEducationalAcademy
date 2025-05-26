"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Bell,
  Plus,
  Send,
  Edit,
  Trash2,
  Eye,
  Users,
  Mail,
  Smartphone,
  MessageSquare,
  Calendar,
  BarChart3,
  Search,
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface NotificationTemplate {
  id: string
  name: string
  type: "email" | "push" | "in-app" | "sms"
  category: "system" | "marketing" | "transactional" | "announcement"
  subject: string
  content: string
  variables: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  usageCount: number
}

interface NotificationCampaign {
  id: string
  name: string
  templateId: string
  templateName: string
  targetAudience: string
  scheduledAt: string
  status: "draft" | "scheduled" | "sending" | "sent" | "failed"
  totalRecipients: number
  sentCount: number
  deliveredCount: number
  openedCount: number
  clickedCount: number
  createdAt: string
}

interface NotificationSettings {
  emailSettings: {
    defaultSender: string
    replyToEmail: string
    unsubscribeUrl: string
  }
  pushSettings: {
    enablePush: boolean
    defaultIcon: string
    defaultSound: string
  }
  smsSettings: {
    enableSms: boolean
    defaultSender: string
  }
  inAppSettings: {
    enableInApp: boolean
    defaultDuration: number
  }
  deliverySettings: {
    enableTracking: boolean
    retryAttempts: number
    batchSize: number
  }
}

export default function NotificationManagement() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [campaigns, setCampaigns] = useState<NotificationCampaign[]>([])
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<NotificationCampaign | null>(null)
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [showCampaignDialog, setShowCampaignDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("templates")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const { toast } = useToast()

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    type: "email" as const,
    category: "system" as const,
    subject: "",
    content: "",
    variables: [] as string[],
    isActive: true,
  })

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    templateId: "",
    targetAudience: "all",
    scheduledAt: "",
  })

  useEffect(() => {
    loadTemplates()
    loadCampaigns()
    loadSettings()
  }, [])

  const loadTemplates = () => {
    const mockTemplates: NotificationTemplate[] = [
      {
        id: "tpl_001",
        name: "Welcome Email",
        type: "email",
        category: "system",
        subject: "Welcome to Educational Academy, {{firstName}}!",
        content: "Hi {{firstName}},\n\nWelcome to Educational Academy! We're excited to have you join our learning community...",
        variables: ["firstName", "lastName", "email"],
        isActive: true,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-20T14:30:00Z",
        usageCount: 245,
      },
      {
        id: "tpl_002",
        name: "Course Completion",
        type: "email",
        category: "transactional",
        subject: "Congratulations! You've completed {{courseName}}",
        content: "Congratulations {{firstName}}!\n\nYou have successfully completed the course: {{courseName}}...",
        variables: ["firstName", "courseName", "certificateUrl"],
        isActive: true,
        createdAt: "2024-01-10T09:00:00Z",
        updatedAt: "2024-01-18T16:45:00Z",
        usageCount: 89,
      },
      {
        id: "tpl_003",
        name: "New Course Alert",
        type: "push",
        category: "marketing",
        subject: "New Course Available: {{courseName}}",
        content: "Check out our latest course: {{courseName}}. Perfect for {{skillLevel}} learners!",
        variables: ["courseName", "skillLevel", "courseUrl"],
        isActive: true,
        createdAt: "2024-01-12T11:30:00Z",
        updatedAt: "2024-01-22T10:15:00Z",
        usageCount: 156,
      },
      {
        id: "tpl_004",
        name: "Payment Reminder",
        type: "sms",
        category: "transactional",
        subject: "Payment Reminder",
        content: "Hi {{firstName}}, your payment of ${{amount}} for {{courseName}} is due in 3 days.",
        variables: ["firstName", "amount", "courseName", "dueDate"],
        isActive: true,
        createdAt: "2024-01-08T15:20:00Z",
        updatedAt: "2024-01-19T12:00:00Z",
        usageCount: 34,
      },
    ]

    setTemplates(mockTemplates)
  }

  const loadCampaigns = () => {
    const mockCampaigns: NotificationCampaign[] = [
      {
        id: "camp_001",
        name: "January Welcome Campaign",
        templateId: "tpl_001",
        templateName: "Welcome Email",
        targetAudience: "new_users",
        scheduledAt: "2024-01-25T09:00:00Z",
        status: "sent",
        totalRecipients: 1250,
        sentCount: 1250,
        deliveredCount: 1198,
        openedCount: 456,
        clickedCount: 89,
        createdAt: "2024-01-20T14:30:00Z",
      },
      {
        id: "camp_002",
        name: "Course Completion Notifications",
        templateId: "tpl_002",
        templateName: "Course Completion",
        targetAudience: "course_completers",
        scheduledAt: "2024-01-24T18:00:00Z",
        status: "sending",
        totalRecipients: 89,
        sentCount: 67,
        deliveredCount: 65,
        openedCount: 23,
        clickedCount: 8,
        createdAt: "2024-01-24T17:45:00Z",
      },
      {
        id: "camp_003",
        name: "New React Course Promotion",
        templateId: "tpl_003",
        templateName: "New Course Alert",
        targetAudience: "programming_students",
        scheduledAt: "2024-01-26T10:00:00Z",
        status: "scheduled",
        totalRecipients: 2340,
        sentCount: 0,
        deliveredCount: 0,
        openedCount: 0,
        clickedCount: 0,
        createdAt: "2024-01-23T11:20:00Z",
      },
    ]

    setCampaigns(mockCampaigns)
  }

  const loadSettings = () => {
    const mockSettings: NotificationSettings = {
      emailSettings: {
        defaultSender: "noreply@educationalacademy.com",
        replyToEmail: "support@educationalacademy.com",
        unsubscribeUrl: "https://educationalacademy.com/unsubscribe",
      },
      pushSettings: {
        enablePush: true,
        defaultIcon: "/icon-192x192.png",
        defaultSound: "default",
      },
      smsSettings: {
        enableSms: true,
        defaultSender: "EduAcademy",
      },
      inAppSettings: {
        enableInApp: true,
        defaultDuration: 5000,
      },
      deliverySettings: {
        enableTracking: true,
        retryAttempts: 3,
        batchSize: 100,
      },
    }

    setSettings(mockSettings)
  }

  const createTemplate = () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const template: NotificationTemplate = {
      id: `tpl_${Date.now()}`,
      ...newTemplate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
    }

    setTemplates((prev) => [template, ...prev])
    setShowTemplateDialog(false)
    setNewTemplate({
      name: "",
      type: "email",
      category: "system",
      subject: "",
      content: "",
      variables: [],
      isActive: true,
    })

    toast({
      title: "Template Created",
      description: "Notification template has been created successfully",
    })
  }

  const createCampaign = () => {
    if (!newCampaign.name || !newCampaign.templateId || !newCampaign.scheduledAt) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const template = templates.find((t) => t.id === newCampaign.templateId)
    if (!template) return

    const campaign: NotificationCampaign = {
      id: `camp_${Date.now()}`,
      ...newCampaign,
      templateName: template.name,
      status: "draft",
      totalRecipients: 0,
      sentCount: 0,
      deliveredCount: 0,
      openedCount: 0,
      clickedCount: 0,
      createdAt: new Date().toISOString(),
    }

    setCampaigns((prev) => [campaign, ...prev])
    setShowCampaignDialog(false)
    setNewCampaign({
      name: "",
      templateId: "",
      targetAudience: "all",
      scheduledAt: "",
    })

    toast({
      title: "Campaign Created",
      description: "Notification campaign has been created successfully",
    })
  }

  const deleteTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId))
    toast({
      title: "Template Deleted",
      description: "Notification template has been deleted",
    })
  }

  const deleteCampaign = (campaignId: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== campaignId))
    toast({
      title: "Campaign Deleted",
      description: "Notification campaign has been deleted",
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "push":
        return <Bell className="h-4 w-4" />
      case "sms":
        return <Smartphone className="h-4 w-4" />
      case "in-app":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "system":
        return "bg-blue-100 text-blue-800"
      case "marketing":
        return "bg-green-100 text-green-800"
      case "transactional":
        return "bg-purple-100 text-purple-800"
      case "announcement":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "sending":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "scheduled":
        return <Calendar className="h-4 w-4 text-orange-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || template.type === filterType
    const matchesCategory = filterCategory === "all" || template.category === filterCategory

    return matchesSearch && matchesType && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notification Management</h1>
          <p className="text-muted-foreground">Manage notification templates, campaigns, and settings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          {/* Templates Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="push">Push</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="in-app">In-App</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="transactional">Transactional</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Notification Template</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="template-name">Template Name</Label>
                      <Input
                        id="template-name"
                        placeholder="Enter template name"
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate((prev) => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="template-type">Type</Label>
                      <Select
                        value={newTemplate.type}
                        onValueChange={(value: any) => setNewTemplate((prev) => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="push">Push Notification</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="in-app">In-App</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="template-category">Category</Label>
                    <Select
                      value={newTemplate.category}
                      onValueChange={(value: any) => setNewTemplate((prev) => ({ ...prev, category: value }))}
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
                  <div>
                    <Label htmlFor="template-subject">Subject</Label>
                    <Input
                      id="template-subject"
                      placeholder="Enter subject line"
                      value={newTemplate.subject}
                      onChange={(e) => setNewTemplate((prev) => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="template-content">Content</Label>
                    <Textarea
                      id="template-content"
                      placeholder="Enter notification content..."
                      rows={6}
                      value={newTemplate.content}
                      onChange={(e) => setNewTemplate((prev) => ({ ...prev, content: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="template-active"
                      checked={newTemplate.isActive}
                      onCheckedChange={(checked) => setNewTemplate((prev) => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="template-active">Active</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={createTemplate} className="flex-1">
                      Create Template
                    </Button>
                    <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Templates List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{template.name}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-1">{template.subject}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTypeIcon(template.type)}
                      {template.isActive ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                    <Badge variant="outline">{template.type}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{template.content}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Used {template.usageCount} times</span>
                    <span className="text-muted-foreground">
                      {new Date(template.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deleteTemplate(template.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Campaigns Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Notification Campaigns</h2>
            <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Notification Campaign</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input
                      id="campaign-name"
                      placeholder="Enter campaign name"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="campaign-template">Template</Label>
                    <Select
                      value={newCampaign.templateId}
                      onValueChange={(value) => setNewCampaign((prev) => ({ ...prev, templateId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="campaign-audience">Target Audience</Label>
                    <Select
                      value={newCampaign.targetAudience}
                      onValueChange={(value) => setNewCampaign((prev) => ({ ...prev, targetAudience: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="new_users">New Users</SelectItem>
                        <SelectItem value="active_users">Active Users</SelectItem>
                        <SelectItem value="course_completers">Course Completers</SelectItem>
                        <SelectItem value="programming_students">Programming Students</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="campaign-schedule">Schedule</Label>
                    <Input
                      id="campaign-schedule"
                      type="datetime-local"
                      value={newCampaign.scheduledAt}
                      onChange={(e) => setNewCampaign((prev) => ({ ...prev, scheduledAt: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={createCampaign} className="flex-1">
                      Create Campaign
                    </Button>
                    <Button variant="outline" onClick={() => setShowCampaignDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Campaigns List */}
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium">{campaign.name}</h3>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(campaign.status)}
                          <Badge variant="outline">{campaign.status}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Template: {campaign.templateName} • Target: {campaign.targetAudience}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Recipients</span>
                          <p className="font-medium">{campaign.totalRecipients.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Sent</span>
                          <p className="font-medium">{campaign.sentCount.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Delivered</span>
                          <p className="font-medium">{campaign.deliveredCount.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Opened</span>
                          <p className="font-medium">{campaign.openedCount.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Clicked</span>
                          <p className="font-medium">{campaign.clickedCount.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>Scheduled: {new Date(campaign.scheduledAt).toLocaleString()}</span>
                        <span>Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteCampaign(campaign.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,847</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96.2%</div>
                <p className="text-xs text-muted-foreground">+0.5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.8%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.7%</div>
                <p className="text-xs text-muted-foreground">+0.3% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Notification Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                  <p>Analytics chart would be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {settings && (
            <div className="space-y-6">
              {/* Email Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="default-sender">Default Sender Email</Label>
                      <Input
                        id="default-sender"
                        value={settings.emailSettings.defaultSender}
                        onChange={(e) =>
                          setSettings((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  emailSettings: { ...prev.emailSettings, defaultSender: e.target.value },
                                }
                              : null,
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="reply-to">Reply-To Email</Label>
                      <Input
                        id="reply-to"
                        value={settings.emailSettings.replyToEmail}
                        onChange={(e) =>
                          setSettings((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  emailSettings: { ...prev.emailSettings, replyToEmail: e.target.value },
                                }
                              : null,
                          )
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="unsubscribe-url">Unsubscribe URL</Label>
                    <Input
                      id="unsubscribe-url"
                      value={settings.emailSettings.unsubscribeUrl}
                      onChange={(e) =>
                        setSettings((prev) =>
                \
