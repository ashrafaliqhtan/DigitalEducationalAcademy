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
  ShoppingCart,
  Search,
  MoreHorizontal,
  Eye,
  Download,
  RefreshCw,
  DollarSign,
  TrendingUp,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Mail,
} from "lucide-react"

interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
    avatar?: string
  }
  items: {
    id: string
    name: string
    type: "course" | "product"
    price: number
    quantity: number
  }[]
  total: number
  status: "pending" | "completed" | "failed" | "refunded" | "cancelled"
  paymentMethod: string
  paymentStatus: "pending" | "completed" | "failed" | "refunded"
  createdAt: string
  updatedAt: string
  notes?: string
}

interface OrderStats {
  totalOrders: number
  completedOrders: number
  pendingOrders: number
  totalRevenue: number
  averageOrderValue: number
  refundedOrders: number
}

export default function OrderManagement() {
  const { t } = useLanguage()
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    refundedOrders: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setIsLoading(true)

    // Mock data - replace with real API calls
    setTimeout(() => {
      const mockOrders: Order[] = [
        {
          id: "1",
          orderNumber: "ORD-2024-001",
          customer: {
            name: "John Doe",
            email: "john.doe@example.com",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          items: [
            {
              id: "course-1",
              name: "React Fundamentals",
              type: "course",
              price: 99.99,
              quantity: 1,
            },
          ],
          total: 99.99,
          status: "completed",
          paymentMethod: "Credit Card",
          paymentStatus: "completed",
          createdAt: "2024-01-20T10:30:00Z",
          updatedAt: "2024-01-20T10:35:00Z",
        },
        {
          id: "2",
          orderNumber: "ORD-2024-002",
          customer: {
            name: "Jane Smith",
            email: "jane.smith@example.com",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          items: [
            {
              id: "course-2",
              name: "Advanced JavaScript",
              type: "course",
              price: 149.99,
              quantity: 1,
            },
            {
              id: "product-1",
              name: "JavaScript Cheat Sheet",
              type: "product",
              price: 19.99,
              quantity: 1,
            },
          ],
          total: 169.98,
          status: "pending",
          paymentMethod: "PayPal",
          paymentStatus: "pending",
          createdAt: "2024-01-20T09:15:00Z",
          updatedAt: "2024-01-20T09:15:00Z",
        },
        {
          id: "3",
          orderNumber: "ORD-2024-003",
          customer: {
            name: "Mike Wilson",
            email: "mike.wilson@example.com",
          },
          items: [
            {
              id: "course-3",
              name: "Python for Beginners",
              type: "course",
              price: 79.99,
              quantity: 1,
            },
          ],
          total: 79.99,
          status: "failed",
          paymentMethod: "Credit Card",
          paymentStatus: "failed",
          createdAt: "2024-01-19T14:22:00Z",
          updatedAt: "2024-01-19T14:25:00Z",
          notes: "Payment declined by bank",
        },
        {
          id: "4",
          orderNumber: "ORD-2024-004",
          customer: {
            name: "Sarah Johnson",
            email: "sarah.johnson@example.com",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          items: [
            {
              id: "course-4",
              name: "UI/UX Design Principles",
              type: "course",
              price: 129.99,
              quantity: 1,
            },
          ],
          total: 129.99,
          status: "refunded",
          paymentMethod: "Credit Card",
          paymentStatus: "refunded",
          createdAt: "2024-01-18T11:45:00Z",
          updatedAt: "2024-01-19T16:30:00Z",
          notes: "Customer requested refund within 24 hours",
        },
        {
          id: "5",
          orderNumber: "ORD-2024-005",
          customer: {
            name: "Alex Brown",
            email: "alex.brown@example.com",
          },
          items: [
            {
              id: "course-5",
              name: "Digital Marketing Mastery",
              type: "course",
              price: 199.99,
              quantity: 1,
            },
          ],
          total: 199.99,
          status: "completed",
          paymentMethod: "Credit Card",
          paymentStatus: "completed",
          createdAt: "2024-01-17T16:20:00Z",
          updatedAt: "2024-01-17T16:25:00Z",
        },
      ]

      setOrders(mockOrders)
      setStats({
        totalOrders: mockOrders.length,
        completedOrders: mockOrders.filter((o) => o.status === "completed").length,
        pendingOrders: mockOrders.filter((o) => o.status === "pending").length,
        totalRevenue: mockOrders.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.total, 0),
        averageOrderValue: mockOrders.reduce((sum, o) => sum + o.total, 0) / mockOrders.length,
        refundedOrders: mockOrders.filter((o) => o.status === "refunded").length,
      })
      setIsLoading(false)
    }, 1000)
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter

    return matchesSearch && matchesStatus && matchesPayment
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            {t("admin.orders.completed")}
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" />
            {t("admin.orders.pending")}
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            {t("admin.orders.failed")}
          </Badge>
        )
      case "refunded":
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            <RefreshCw className="mr-1 h-3 w-3" />
            {t("admin.orders.refunded")}
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="secondary">
            <XCircle className="mr-1 h-3 w-3" />
            {t("admin.orders.cancelled")}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            {t("payment.statusCompleted")}
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            {t("payment.statusPending")}
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">{t("payment.statusFailed")}</Badge>
      case "refunded":
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            {t("payment.status.refunded")}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
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
          <h1 className="text-3xl font-bold">{t("admin.orders.title")}</h1>
          <p className="text-muted-foreground">{t("admin.orders.description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t("admin.orders.export")}
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("admin.orders.refresh")}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.orders.totalOrders")}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedOrders} {t("admin.orders.completed").toLowerCase()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.orders.totalRevenue")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +15% {t("admin.stats.fromLastMonth")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.orders.averageOrderValue")}</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{t("admin.orders.perOrder")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.orders.pendingOrders")}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">{t("admin.orders.requiresAttention")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Order Management */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.orders.orderManagement")}</CardTitle>
          <CardDescription>{t("admin.orders.managementDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("admin.orders.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t("admin.orders.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("admin.orders.all")}</SelectItem>
                <SelectItem value="completed">{t("admin.orders.completed")}</SelectItem>
                <SelectItem value="pending">{t("admin.orders.pending")}</SelectItem>
                <SelectItem value="failed">{t("admin.orders.failed")}</SelectItem>
                <SelectItem value="refunded">{t("admin.orders.refunded")}</SelectItem>
                <SelectItem value="cancelled">{t("admin.orders.cancelled")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t("admin.orders.paymentStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("admin.orders.all")}</SelectItem>
                <SelectItem value="completed">{t("payment.statusCompleted")}</SelectItem>
                <SelectItem value="pending">{t("payment.statusPending")}</SelectItem>
                <SelectItem value="failed">{t("payment.statusFailed")}</SelectItem>
                <SelectItem value="refunded">{t("payment.status.refunded")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.orders.order")}</TableHead>
                  <TableHead>{t("admin.orders.customer")}</TableHead>
                  <TableHead>{t("admin.orders.items")}</TableHead>
                  <TableHead>{t("admin.orders.total")}</TableHead>
                  <TableHead>{t("admin.orders.status")}</TableHead>
                  <TableHead>{t("admin.orders.payment")}</TableHead>
                  <TableHead>{t("admin.orders.date")}</TableHead>
                  <TableHead>{t("admin.orders.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.orderNumber}</div>
                        <div className="text-sm text-muted-foreground">#{order.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={order.customer.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{order.customer.name}</div>
                          <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-muted-foreground"> × {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${order.total.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{order.paymentMethod}</div>
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(order.createdAt)}</div>
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
                            {t("admin.orders.viewDetails")}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            {t("admin.orders.downloadInvoice")}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            {t("admin.orders.sendEmail")}
                          </DropdownMenuItem>
                          {order.status === "pending" && (
                            <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              {t("admin.orders.markCompleted")}
                            </DropdownMenuItem>
                          )}
                          {order.status === "completed" && (
                            <DropdownMenuItem>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              {t("admin.orders.processRefund")}
                            </DropdownMenuItem>
                          )}
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
