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
