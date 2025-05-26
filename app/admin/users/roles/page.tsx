"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Shield, Users, Plus, Edit, Trash2, MoreHorizontal, Check, X, Crown, UserCheck, Eye, Lock } from "lucide-react"

interface Permission {
  id: string
  name: string
  description: string
  category: string
  resource: string
  action: string
}

interface Role {
  id: string
  name: string
  description: string
  color: string
  permissions: string[]
  userCount: number
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export default function RolesPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    loadRolesAndPermissions()
  }, [])

  const loadRolesAndPermissions = async () => {
    setIsLoading(true)
    // Mock data - replace with real API calls
    setTimeout(() => {
      setPermissions([
        // User Management
        {
          id: "users.view",
          name: "View Users",
          description: "View user profiles and information",
          category: "User Management",
          resource: "users",
          action: "view",
        },
        {
          id: "users.create",
          name: "Create Users",
          description: "Create new user accounts",
          category: "User Management",
          resource: "users",
          action: "create",
        },
        {
          id: "users.edit",
          name: "Edit Users",
          description: "Edit user profiles and information",
          category: "User Management",
          resource: "users",
          action: "edit",
        },
        {
          id: "users.delete",
          name: "Delete Users",
          description: "Delete user accounts",
          category: "User Management",
          resource: "users",
          action: "delete",
        },
        {
          id: "users.suspend",
          name: "Suspend Users",
          description: "Suspend or ban user accounts",
          category: "User Management",
          resource: "users",
          action: "suspend",
        },

        // Course Management
        {
          id: "courses.view",
          name: "View Courses",
          description: "View course content and information",
          category: "Course Management",
          resource: "courses",
          action: "view",
        },
        {
          id: "courses.create",
          name: "Create Courses",
          description: "Create new courses",
          category: "Course Management",
          resource: "courses",
          action: "create",
        },
        {
          id: "courses.edit",
          name: "Edit Courses",
          description: "Edit course content and settings",
          category: "Course Management",
          resource: "courses",
          action: "edit",
        },
        {
          id: "courses.delete",
          name: "Delete Courses",
          description: "Delete courses",
          category: "Course Management",
          resource: "courses",
          action: "delete",
        },
        {
          id: "courses.publish",
          name: "Publish Courses",
          description: "Publish or unpublish courses",
          category: "Course Management",
          resource: "courses",
          action: "publish",
        },

        // Order Management
        {
          id: "orders.view",
          name: "View Orders",
          description: "View order information and history",
          category: "Order Management",
          resource: "orders",
          action: "view",
        },
        {
          id: "orders.edit",
          name: "Edit Orders",
          description: "Edit order details and status",
          category: "Order Management",
          resource: "orders",
          action: "edit",
        },
        {
          id: "orders.refund",
          name: "Process Refunds",
          description: "Process order refunds",
          category: "Order Management",
          resource: "orders",
          action: "refund",
        },

        // Content Management
        {
          id: "content.view",
          name: "View Content",
          description: "View pages, posts, and media",
          category: "Content Management",
          resource: "content",
          action: "view",
        },
        {
          id: "content.create",
          name: "Create Content",
          description: "Create new pages and posts",
          category: "Content Management",
          resource: "content",
          action: "create",
        },
        {
          id: "content.edit",
          name: "Edit Content",
          description: "Edit pages, posts, and media",
          category: "Content Management",
          resource: "content",
          action: "edit",
        },
        {
          id: "content.delete",
          name: "Delete Content",
          description: "Delete pages, posts, and media",
          category: "Content Management",
          resource: "content",
          action: "delete",
        },
        {
          id: "content.publish",
          name: "Publish Content",
          description: "Publish or unpublish content",
          category: "Content Management",
          resource: "content",
          action: "publish",
        },

        // Analytics & Reports
        {
          id: "analytics.view",
          name: "View Analytics",
          description: "View analytics and reports",
          category: "Analytics",
          resource: "analytics",
          action: "view",
        },
        {
          id: "reports.export",
          name: "Export Reports",
          description: "Export data and generate reports",
          category: "Analytics",
          resource: "reports",
          action: "export",
        },

        // System Settings
        {
          id: "settings.view",
          name: "View Settings",
          description: "View system settings",
          category: "System",
          resource: "settings",
          action: "view",
        },
        {
          id: "settings.edit",
          name: "Edit Settings",
          description: "Edit system settings",
          category: "System",
          resource: "settings",
          action: "edit",
        },
        {
          id: "integrations.manage",
          name: "Manage Integrations",
          description: "Manage third-party integrations",
          category: "System",
          resource: "integrations",
          action: "manage",
        },

        // Role Management
        {
          id: "roles.view",
          name: "View Roles",
          description: "View user roles and permissions",
          category: "Role Management",
          resource: "roles",
          action: "view",
        },
        {
          id: "roles.create",
          name: "Create Roles",
          description: "Create new user roles",
          category: "Role Management",
          resource: "roles",
          action: "create",
        },
        {
          id: "roles.edit",
          name: "Edit Roles",
          description: "Edit user roles and permissions",
          category: "Role Management",
          resource: "roles",
          action: "edit",
        },
        {
          id: "roles.delete",
          name: "Delete Roles",
          description: "Delete user roles",
          category: "Role Management",
          resource: "roles",
          action: "delete",
        },
      ])

      setRoles([
        {
          id: "super-admin",
          name: "Super Administrator",
          description: "Full system access with all permissions",
          color: "red",
          permissions: [
            "users.view",
            "users.create",
            "users.edit",
            "users.delete",
            "users.suspend",
            "courses.view",
            "courses.create",
            "courses.edit",
            "courses.delete",
            "courses.publish",
            "orders.view",
            "orders.edit",
            "orders.refund",
            "content.view",
            "content.create",
            "content.edit",
            "content.delete",
            "content.publish",
            "analytics.view",
            "reports.export",
            "settings.view",
            "settings.edit",
            "integrations.manage",
            "roles.view",
            "roles.create",
            "roles.edit",
            "roles.delete",
          ],
          userCount: 2,
          isSystem: true,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "admin",
          name: "Administrator",
          description: "Administrative access with most permissions",
          color: "orange",
          permissions: [
            "users.view",
            "users.create",
            "users.edit",
            "users.suspend",
            "courses.view",
            "courses.create",
            "courses.edit",
            "courses.publish",
            "orders.view",
            "orders.edit",
            "orders.refund",
            "content.view",
            "content.create",
            "content.edit",
            "content.publish",
            "analytics.view",
            "reports.export",
            "settings.view",
          ],
          userCount: 5,
          isSystem: true,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "instructor",
          name: "Instructor",
          description: "Course creation and management permissions",
          color: "blue",
          permissions: [
            "courses.view",
            "courses.create",
            "courses.edit",
            "content.view",
            "content.create",
            "content.edit",
            "analytics.view",
          ],
          userCount: 23,
          isSystem: true,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-10T15:20:00Z",
        },
        {
          id: "moderator",
          name: "Moderator",
          description: "Content moderation and user management",
          color: "green",
          permissions: [
            "users.view",
            "users.edit",
            "users.suspend",
            "courses.view",
            "courses.edit",
            "content.view",
            "content.edit",
            "content.publish",
            "orders.view",
          ],
          userCount: 8,
          isSystem: false,
          createdAt: "2024-01-05T09:15:00Z",
          updatedAt: "2024-01-18T14:45:00Z",
        },
        {
          id: "support",
          name: "Support Agent",
          description: "Customer support and basic user management",
          color: "purple",
          permissions: ["users.view", "users.edit", "courses.view", "orders.view", "orders.edit", "content.view"],
          userCount: 12,
          isSystem: false,
          createdAt: "2024-01-08T11:30:00Z",
          updatedAt: "2024-01-19T16:20:00Z",
        },
        {
          id: "student",
          name: "Student",
          description: "Basic student access permissions",
          color: "gray",
          permissions: ["courses.view", "content.view"],
          userCount: 1247,
          isSystem: true,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      ])
      setIsLoading(false)
    }, 1000)
  }

  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "super administrator":
        return <Crown className="h-4 w-4" />
      case "administrator":
        return <Shield className="h-4 w-4" />
      case "instructor":
        return <UserCheck className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      red: "bg-red-100 text-red-800 border-red-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      green: "bg-green-100 text-green-800 border-green-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      gray: "bg-gray-100 text-gray-800 border-gray-200",
    }
    return colorMap[color] || colorMap.gray
  }

  const handleCreateRole = () => {
    setSelectedRole(null)
    setIsCreating(true)
  }

  const handleEditRole = (role: Role) => {
    setSelectedRole(role)
    setIsEditing(true)
  }

  const handleDeleteRole = async (role: Role) => {
    if (role.isSystem) {
      toast({
        title: t("admin.roles.cannotDelete"),
        description: t("admin.roles.systemRoleProtected"),
        variant: "destructive",
      })
      return
    }

    setRoles((prev) => prev.filter((r) => r.id !== role.id))
    toast({
      title: t("admin.roles.deleted"),
      description: t("admin.roles.deletedDescription", { name: role.name }),
    })
  }

  const handleSaveRole = async (roleData: Partial<Role>) => {
    if (isCreating) {
      const newRole: Role = {
        id: `role-${Date.now()}`,
        name: roleData.name || "",
        description: roleData.description || "",
        color: roleData.color || "gray",
        permissions: roleData.permissions || [],
        userCount: 0,
        isSystem: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setRoles((prev) => [...prev, newRole])
      toast({
        title: t("admin.roles.created"),
        description: t("admin.roles.createdDescription", { name: newRole.name }),
      })
    } else if (selectedRole) {
      setRoles((prev) =>
        prev.map((role) =>
          role.id === selectedRole.id ? { ...role, ...roleData, updatedAt: new Date().toISOString() } : role,
        ),
      )
      toast({
        title: t("admin.roles.updated"),
        description: t("admin.roles.updatedDescription", { name: selectedRole.name }),
      })
    }
    setIsCreating(false)
    setIsEditing(false)
    setSelectedRole(null)
  }

  const groupedPermissions = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    },
    {} as Record<string, Permission[]>,
  )

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
          <h1 className="text-3xl font-bold">{t("admin.roles.title")}</h1>
          <p className="text-muted-foreground">{t("admin.roles.description")}</p>
        </div>
        <Button onClick={handleCreateRole}>
          <Plus className="h-4 w-4 mr-2" />
          {t("admin.roles.createRole")}
        </Button>
      </div>

      {/* Roles Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <Card key={role.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getRoleIcon(role.name)}
                  <CardTitle className="text-lg">{role.name}</CardTitle>
                  {role.isSystem && (
                    <Badge variant="secondary" className="text-xs">
                      <Lock className="h-3 w-3 mr-1" />
                      {t("admin.roles.system")}
                    </Badge>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditRole(role)}>
                      <Edit className="mr-2 h-4 w-4" />
                      {t("admin.roles.edit")}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      {t("admin.roles.viewUsers")}
                    </DropdownMenuItem>
                    {!role.isSystem && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteRole(role)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t("admin.roles.delete")}
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("admin.roles.users")}:</span>
                <Badge variant="outline">{role.userCount}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("admin.roles.permissions")}:</span>
                <Badge variant="outline">{role.permissions.length}</Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {t("admin.roles.lastUpdated")}: {new Date(role.updatedAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role Creation/Edit Dialog */}
      <Dialog
        open={isCreating || isEditing}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreating(false)
            setIsEditing(false)
            setSelectedRole(null)
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreating ? t("admin.roles.createRole") : t("admin.roles.editRole")}</DialogTitle>
            <DialogDescription>
              {isCreating
                ? t("admin.roles.createDescription")
                : t("admin.roles.editDescription", { name: selectedRole?.name })}
            </DialogDescription>
          </DialogHeader>

          <RoleForm
            role={selectedRole}
            permissions={permissions}
            groupedPermissions={groupedPermissions}
            onSave={handleSaveRole}
            onCancel={() => {
              setIsCreating(false)
              setIsEditing(false)
              setSelectedRole(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Role Form Component
function RoleForm({
  role,
  permissions,
  groupedPermissions,
  onSave,
  onCancel,
}: {
  role: Role | null
  permissions: Permission[]
  groupedPermissions: Record<string, Permission[]>
  onSave: (roleData: Partial<Role>) => void
  onCancel: () => void
}) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: role?.name || "",
    description: role?.description || "",
    color: role?.color || "gray",
    permissions: role?.permissions || [],
  })

  const handlePermissionToggle = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId],
    }))
  }

  const handleSelectAllCategory = (category: string) => {
    const categoryPermissions = groupedPermissions[category].map((p) => p.id)
    const allSelected = categoryPermissions.every((id) => formData.permissions.includes(id))

    if (allSelected) {
      setFormData((prev) => ({
        ...prev,
        permissions: prev.permissions.filter((id) => !categoryPermissions.includes(id)),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        permissions: [...new Set([...prev.permissions, ...categoryPermissions])],
      }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t("admin.roles.name")}</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder={t("admin.roles.namePlaceholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">{t("admin.roles.color")}</Label>
          <select
            id="color"
            value={formData.color}
            onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="gray">Gray</option>
            <option value="red">Red</option>
            <option value="orange">Orange</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="purple">Purple</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("admin.roles.description")}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder={t("admin.roles.descriptionPlaceholder")}
          rows={3}
        />
      </div>

      {/* Permissions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t("admin.roles.permissions")}</h3>
        <div className="space-y-4">
          {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => {
            const allSelected = categoryPermissions.every((p) => formData.permissions.includes(p.id))
            const someSelected = categoryPermissions.some((p) => formData.permissions.includes(p.id))

            return (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{category}</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => handleSelectAllCategory(category)}>
                      {allSelected ? (
                        <>
                          <X className="h-3 w-3 mr-1" />
                          {t("admin.roles.deselectAll")}
                        </>
                      ) : (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          {t("admin.roles.selectAll")}
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categoryPermissions.map((permission) => (
                      <div key={permission.id} className="flex items-start space-x-3">
                        <Switch
                          id={permission.id}
                          checked={formData.permissions.includes(permission.id)}
                          onCheckedChange={() => handlePermissionToggle(permission.id)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label
                            htmlFor={permission.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {permission.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          {t("admin.roles.cancel")}
        </Button>
        <Button onClick={() => onSave(formData)}>{t("admin.roles.save")}</Button>
      </DialogFooter>
    </div>
  )
}
