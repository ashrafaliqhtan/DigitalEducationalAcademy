"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Settings,
  Check,
  X,
  AlertCircle,
  Database,
  Mail,
  CreditCard,
  MessageSquare,
  Cloud,
  Shield,
  Zap,
  Video,
  BarChart3,
  Webhook,
  RefreshCw,
} from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  category: "payment" | "email" | "analytics" | "storage" | "communication" | "security" | "other"
  status: "connected" | "disconnected" | "error"
  icon: React.ComponentType<{ className?: string }>
  config: Record<string, any>
  lastSync?: string
  version?: string
  webhookUrl?: string
}

export default function IntegrationsPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [isConfiguring, setIsConfiguring] = useState(false)

  useEffect(() => {
    loadIntegrations()
  }, [])

  const loadIntegrations = async () => {
    setIsLoading(true)
    // Mock data - replace with real API calls
    setTimeout(() => {
      setIntegrations([
        {
          id: "stripe",
          name: "Stripe",
          description: "Payment processing and subscription management",
          category: "payment",
          status: "connected",
          icon: CreditCard,
          config: {
            publishableKey: "pk_test_***",
            secretKey: "sk_test_***",
            webhookSecret: "whsec_***",
          },
          lastSync: "2024-01-20T10:30:00Z",
          version: "2023-10-16",
          webhookUrl: "https://api.example.com/webhooks/stripe",
        },
        {
          id: "supabase",
          name: "Supabase",
          description: "Database and authentication backend",
          category: "storage",
          status: "connected",
          icon: Database,
          config: {
            url: "https://project.supabase.co",
            anonKey: "eyJ***",
            serviceKey: "eyJ***",
          },
          lastSync: "2024-01-20T10:25:00Z",
          version: "2.0.0",
        },
        {
          id: "sendgrid",
          name: "SendGrid",
          description: "Email delivery and marketing automation",
          category: "email",
          status: "disconnected",
          icon: Mail,
          config: {
            apiKey: "",
            fromEmail: "",
            fromName: "",
          },
        },
        {
          id: "google-analytics",
          name: "Google Analytics",
          description: "Web analytics and user behavior tracking",
          category: "analytics",
          status: "connected",
          icon: BarChart3,
          config: {
            trackingId: "GA-***",
            measurementId: "G-***",
          },
          lastSync: "2024-01-20T09:15:00Z",
          version: "4",
        },
        {
          id: "discord",
          name: "Discord",
          description: "Community communication and notifications",
          category: "communication",
          status: "error",
          icon: MessageSquare,
          config: {
            botToken: "***",
            guildId: "***",
            channelId: "***",
          },
          lastSync: "2024-01-19T15:30:00Z",
        },
        {
          id: "cloudinary",
          name: "Cloudinary",
          description: "Image and video management in the cloud",
          category: "storage",
          status: "disconnected",
          icon: Cloud,
          config: {
            cloudName: "",
            apiKey: "",
            apiSecret: "",
          },
        },
        {
          id: "auth0",
          name: "Auth0",
          description: "Identity and access management platform",
          category: "security",
          status: "disconnected",
          icon: Shield,
          config: {
            domain: "",
            clientId: "",
            clientSecret: "",
          },
        },
        {
          id: "zoom",
          name: "Zoom",
          description: "Video conferencing for live classes",
          category: "communication",
          status: "disconnected",
          icon: Video,
          config: {
            apiKey: "",
            apiSecret: "",
            webhookSecret: "",
          },
        },
      ])
      setIsLoading(false)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "default"
      case "disconnected":
        return "secondary"
      case "error":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <Check className="h-3 w-3" />
      case "disconnected":
        return <X className="h-3 w-3" />
      case "error":
        return <AlertCircle className="h-3 w-3" />
      default:
        return <X className="h-3 w-3" />
    }
  }

  const handleConnect = async (integration: Integration) => {
    setIsConfiguring(true)
    // Simulate API call
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((int) => (int.id === integration.id ? { ...int, status: "connected" as const } : int)),
      )
      setIsConfiguring(false)
      setSelectedIntegration(null)
      toast({
        title: t("admin.integrations.connected"),
        description: t("admin.integrations.connectedDescription", { name: integration.name }),
      })
    }, 2000)
  }

  const handleDisconnect = async (integration: Integration) => {
    setIntegrations((prev) =>
      prev.map((int) => (int.id === integration.id ? { ...int, status: "disconnected" as const } : int)),
    )
    toast({
      title: t("admin.integrations.disconnected"),
      description: t("admin.integrations.disconnectedDescription", { name: integration.name }),
    })
  }

  const handleTestConnection = async (integration: Integration) => {
    toast({
      title: t("admin.integrations.testing"),
      description: t("admin.integrations.testingDescription", { name: integration.name }),
    })
    // Simulate test
    setTimeout(() => {
      toast({
        title: t("admin.integrations.testSuccess"),
        description: t("admin.integrations.testSuccessDescription"),
      })
    }, 2000)
  }

  const categorizedIntegrations = integrations.reduce(
    (acc, integration) => {
      if (!acc[integration.category]) {
        acc[integration.category] = []
      }
      acc[integration.category].push(integration)
      return acc
    },
    {} as Record<string, Integration[]>,
  )

  const formatLastSync = (dateString?: string) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("admin.integrations.title")}</h1>
          <p className="text-muted-foreground">{t("admin.integrations.description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadIntegrations}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("admin.integrations.refresh")}
          </Button>
          <Button>
            <Webhook className="h-4 w-4 mr-2" />
            {t("admin.integrations.manageWebhooks")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">{t("admin.integrations.all")}</TabsTrigger>
          <TabsTrigger value="payment">{t("admin.integrations.payment")}</TabsTrigger>
          <TabsTrigger value="email">{t("admin.integrations.email")}</TabsTrigger>
          <TabsTrigger value="analytics">{t("admin.integrations.analytics")}</TabsTrigger>
          <TabsTrigger value="storage">{t("admin.integrations.storage")}</TabsTrigger>
          <TabsTrigger value="communication">{t("admin.integrations.communication")}</TabsTrigger>
          <TabsTrigger value="security">{t("admin.integrations.security")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <integration.icon className="h-8 w-8 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <Badge variant={getStatusColor(integration.status)} className="mt-1">
                          {getStatusIcon(integration.status)}
                          <span className="ml-1">{t(`admin.integrations.${integration.status}`)}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {integration.lastSync && (
                    <div className="text-sm text-muted-foreground">
                      <strong>{t("admin.integrations.lastSync")}:</strong> {formatLastSync(integration.lastSync)}
                    </div>
                  )}
                  {integration.version && (
                    <div className="text-sm text-muted-foreground">
                      <strong>{t("admin.integrations.version")}:</strong> {integration.version}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {integration.status === "connected" ? (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleTestConnection(integration)}>
                          <Zap className="h-3 w-3 mr-1" />
                          {t("admin.integrations.test")}
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedIntegration(integration)}>
                              <Settings className="h-3 w-3 mr-1" />
                              {t("admin.integrations.configure")}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>
                                {t("admin.integrations.configureTitle", { name: integration.name })}
                              </DialogTitle>
                              <DialogDescription>{integration.description}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              {Object.entries(integration.config).map(([key, value]) => (
                                <div key={key} className="space-y-2">
                                  <Label htmlFor={key}>{key}</Label>
                                  <Input
                                    id={key}
                                    type={key.includes("secret") || key.includes("key") ? "password" : "text"}
                                    defaultValue={value}
                                    placeholder={`Enter ${key}`}
                                  />
                                </div>
                              ))}
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => handleDisconnect(integration)}>
                                {t("admin.integrations.disconnect")}
                              </Button>
                              <Button onClick={() => handleConnect(integration)} disabled={isConfiguring}>
                                {isConfiguring ? t("admin.integrations.saving") : t("admin.integrations.save")}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm" onClick={() => handleDisconnect(integration)}>
                          {t("admin.integrations.disconnect")}
                        </Button>
                      </>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedIntegration(integration)}>
                            {t("admin.integrations.connect")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>
                              {t("admin.integrations.connectTitle", { name: integration.name })}
                            </DialogTitle>
                            <DialogDescription>{integration.description}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            {Object.entries(integration.config).map(([key, value]) => (
                              <div key={key} className="space-y-2">
                                <Label htmlFor={key}>{key}</Label>
                                <Input
                                  id={key}
                                  type={key.includes("secret") || key.includes("key") ? "password" : "text"}
                                  defaultValue={value}
                                  placeholder={`Enter ${key}`}
                                />
                              </div>
                            ))}
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setSelectedIntegration(null)}>
                              {t("admin.integrations.cancel")}
                            </Button>
                            <Button onClick={() => handleConnect(integration)} disabled={isConfiguring}>
                              {isConfiguring ? t("admin.integrations.connecting") : t("admin.integrations.connect")}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {Object.entries(categorizedIntegrations).map(([category, categoryIntegrations]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryIntegrations.map((integration) => (
                <Card key={integration.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <integration.icon className="h-8 w-8 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <Badge variant={getStatusColor(integration.status)} className="mt-1">
                            {getStatusIcon(integration.status)}
                            <span className="ml-1">{t(`admin.integrations.${integration.status}`)}</span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription>{integration.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {integration.lastSync && (
                      <div className="text-sm text-muted-foreground">
                        <strong>{t("admin.integrations.lastSync")}:</strong> {formatLastSync(integration.lastSync)}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {integration.status === "connected" ? (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleTestConnection(integration)}>
                            <Zap className="h-3 w-3 mr-1" />
                            {t("admin.integrations.test")}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDisconnect(integration)}>
                            {t("admin.integrations.disconnect")}
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" onClick={() => handleConnect(integration)}>
                          {t("admin.integrations.connect")}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
