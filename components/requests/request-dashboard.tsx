"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  MessageSquare,
  Calendar,
  DollarSign,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface CustomRequest {
  id: string
  title: string
  description: string
  serviceType: string
  status: "pending" | "in_review" | "approved" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  createdAt: string
  deadline?: string
  budgetRange: string
  estimatedCost?: number
  estimatedDuration?: number
  assignedTo?: string
  responseCount: number
  lastResponse?: string
}

interface RequestDashboardProps {
  requests: CustomRequest[]
  onRequestClick: (request: CustomRequest) => void
  userRole?: "client" | "admin"
}

export default function RequestDashboard({ requests, onRequestClick, userRole = "client" }: RequestDashboardProps) {
  const { t } = useLanguage()
  const [filteredRequests, setFilteredRequests] = useState(requests)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")

  useEffect(() => {
    let filtered = requests

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((request) => request.priority === priorityFilter)
    }

    // Service filter
    if (serviceFilter !== "all") {
      filtered = filtered.filter((request) => request.serviceType === serviceFilter)
    }

    setFilteredRequests(filtered)
  }, [requests, searchTerm, statusFilter, priorityFilter, serviceFilter])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, icon: Clock, label: t("requests.status.pending") },
      in_review: { variant: "default" as const, icon: AlertCircle, label: t("requests.status.inReview") },
      approved: { variant: "default" as const, icon: CheckCircle, label: t("requests.status.approved") },
      in_progress: { variant: "default" as const, icon: Clock, label: t("requests.status.inProgress") },
      completed: { variant: "default" as const, icon: CheckCircle, label: t("requests.status.completed") },
      cancelled: { variant: "destructive" as const, icon: XCircle, label: t("requests.status.cancelled") },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { variant: "outline" as const, label: t("requests.priority.low") },
      medium: { variant: "secondary" as const, label: t("requests.priority.medium") },
      high: { variant: "default" as const, label: t("requests.priority.high") },
      urgent: { variant: "destructive" as const, label: t("requests.priority.urgent") },
    }

    const config = priorityConfig[priority as keyof typeof priorityConfig]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getRequestsByStatus = (status: string) => {
    return requests.filter((request) => request.status === status).length
  }

  const stats = [
    {
      title: t("requests.stats.total"),
      value: requests.length,
      icon: Clock,
      color: "text-blue-600",
    },
    {
      title: t("requests.stats.pending"),
      value: getRequestsByStatus("pending") + getRequestsByStatus("in_review"),
      icon: AlertCircle,
      color: "text-orange-600",
    },
    {
      title: t("requests.stats.inProgress"),
      value: getRequestsByStatus("approved") + getRequestsByStatus("in_progress"),
      icon: Clock,
      color: "text-blue-600",
    },
    {
      title: t("requests.stats.completed"),
      value: getRequestsByStatus("completed"),
      icon: CheckCircle,
      color: "text-green-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t("requests.filters")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("requests.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t("requests.filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("requests.allStatuses")}</SelectItem>
                <SelectItem value="pending">{t("requests.status.pending")}</SelectItem>
                <SelectItem value="in_review">{t("requests.status.inReview")}</SelectItem>
                <SelectItem value="approved">{t("requests.status.approved")}</SelectItem>
                <SelectItem value="in_progress">{t("requests.status.inProgress")}</SelectItem>
                <SelectItem value="completed">{t("requests.status.completed")}</SelectItem>
                <SelectItem value="cancelled">{t("requests.status.cancelled")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t("requests.filterByPriority")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("requests.allPriorities")}</SelectItem>
                <SelectItem value="low">{t("requests.priority.low")}</SelectItem>
                <SelectItem value="medium">{t("requests.priority.medium")}</SelectItem>
                <SelectItem value="high">{t("requests.priority.high")}</SelectItem>
                <SelectItem value="urgent">{t("requests.priority.urgent")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t("requests.filterByService")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("requests.allServices")}</SelectItem>
                <SelectItem value="programming">{t("services.programming")}</SelectItem>
                <SelectItem value="research">{t("services.research")}</SelectItem>
                <SelectItem value="design">{t("services.design")}</SelectItem>
                <SelectItem value="writing">{t("services.writing")}</SelectItem>
                <SelectItem value="consulting">{t("services.consulting")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">{t("requests.noRequestsFound")}</p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6" onClick={() => onRequestClick(request)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-2">{request.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{request.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {getStatusBadge(request.status)}
                      {getPriorityBadge(request.priority)}
                      <Badge variant="outline">{request.serviceType}</Badge>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-gray-500 mb-1">
                      {t("requests.created")}: {formatDate(request.createdAt)}
                    </p>
                    {request.deadline && (
                      <p className="text-sm text-gray-500 mb-1">
                        {t("requests.deadline")}: {formatDate(request.deadline)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>
                        {request.responseCount} {t("requests.responses")}
                      </span>
                    </div>
                    {request.estimatedCost && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${request.estimatedCost}</span>
                      </div>
                    )}
                    {request.estimatedDuration && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {request.estimatedDuration} {t("requests.days")}
                        </span>
                      </div>
                    )}
                  </div>
                  {request.lastResponse && (
                    <p className="text-xs">
                      {t("requests.lastResponse")}: {formatDate(request.lastResponse)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
