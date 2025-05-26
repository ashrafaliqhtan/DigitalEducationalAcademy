"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  Mail,
  Users,
  UserCheck,
  UserX,
  Download,
} from "lucide-react"

interface User {
  id: string
  email: string
  fullName: string
  avatar?: string
  role: "student" | "instructor" | "admin"
  status: "active" | "inactive" | "banned"
  joinedAt: string
  lastActive: string
  coursesEnrolled: number
  coursesCompleted: number
  totalSpent: number
}

export default function UsersPage() {
  const { t } = useLanguage()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setIsLoading(true)
    // Mock data - replace with real API calls
    setTimeout(() => {
      setUsers([
        {
          id: "1",
          email: "john.doe@example.com",
          fullName: "John Doe",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "student",
          status: "active",
          joinedAt: "2024-01-15",
          lastActive: "2024-01-20",
          coursesEnrolled: 3,
          coursesCompleted: 1,
          totalSpent: 299.99,
        },
        {
          id: "2",
          email: "jane.smith@example.com",
          fullName: "Jane Smith",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "instructor",
          status: "active",
          joinedAt: "2023-12-01",
          lastActive: "2024-01-19",
          coursesEnrolled: 0,
          coursesCompleted: 0,
          totalSpent: 0,
        },
        {
          id: "3",
          email: "mike.wilson@example.com",
          fullName: "Mike Wilson",
          role: "student",
          status: "inactive",
          joinedAt: "2024-01-10",
          lastActive: "2024-01-12",
          coursesEnrolled: 1,
          coursesCompleted: 0,
          totalSpent: 99.99,
        },
        {
          id: "4",
          email: "sarah.jones@example.com",
          fullName: "Sarah Jones",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "admin",
          status: "active",
          joinedAt: "2023-11-15",
          lastActive: "2024-01-20",
          coursesEnrolled: 5,
          coursesCompleted: 3,
          totalSpent: 599.99,
        },
      ])
      setIsLoading(false)
    }, 1000)
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "instructor":
        return "default"
      case "student":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "banned":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
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
          <h1 className="text-3xl font-bold">{t("admin.users.title")}</h1>
          <p className="text-muted-foreground">{t("admin.users.description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t("admin.users.export")}
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t("admin.users.addUser")}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.users.totalUsers")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.users.activeUsers")}</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.status === "active").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.users.instructors")}</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.role === "instructor").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.users.bannedUsers")}</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.status === "banned").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.users.userManagement")}</CardTitle>
          <CardDescription>{t("admin.users.managementDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("admin.users.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  {t("admin.users.role")}: {selectedRole === "all" ? t("admin.users.all") : selectedRole}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedRole("all")}>{t("admin.users.all")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedRole("student")}>
                  {t("admin.users.student")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedRole("instructor")}>
                  {t("admin.users.instructor")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedRole("admin")}>{t("admin.users.admin")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  {t("admin.users.status")}: {selectedStatus === "all" ? t("admin.users.all") : selectedStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedStatus("all")}>{t("admin.users.all")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("active")}>
                  {t("admin.users.active")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("inactive")}>
                  {t("admin.users.inactive")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("banned")}>
                  {t("admin.users.banned")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Users Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.users.user")}</TableHead>
                <TableHead>{t("admin.users.role")}</TableHead>
                <TableHead>{t("admin.users.status")}</TableHead>
                <TableHead>{t("admin.users.joined")}</TableHead>
                <TableHead>{t("admin.users.lastActive")}</TableHead>
                <TableHead>{t("admin.users.courses")}</TableHead>
                <TableHead>{t("admin.users.spent")}</TableHead>
                <TableHead className="text-right">{t("admin.users.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {user.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleColor(user.role)}>{t(`admin.users.${user.role}`)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(user.status)}>{t(`admin.users.${user.status}`)}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.joinedAt)}</TableCell>
                  <TableCell>{formatDate(user.lastActive)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{user.coursesEnrolled} enrolled</div>
                      <div className="text-muted-foreground">{user.coursesCompleted} completed</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(user.totalSpent)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t("admin.users.actions")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          {t("admin.users.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          {t("admin.users.sendEmail")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {user.status === "active" ? (
                            <>
                              <Ban className="mr-2 h-4 w-4" />
                              {t("admin.users.suspend")}
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              {t("admin.users.activate")}
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t("admin.users.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
