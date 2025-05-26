"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, X, FileText } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"

interface RequestFormProps {
  onSubmit: (requestData: any) => void
  isSubmitting?: boolean
}

export default function RequestForm({ onSubmit, isSubmitting = false }: RequestFormProps) {
  const { t } = useLanguage()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    title: "",
    description: "",
    requirements: "",
    deadline: "",
    budgetRange: "",
    priority: "medium",
  })
  const [attachments, setAttachments] = useState<File[]>([])

  const serviceTypes = [
    { value: "programming", label: t("services.programming") },
    { value: "research", label: t("services.research") },
    { value: "presentations", label: t("services.presentations") },
    { value: "templates", label: t("services.templates") },
    { value: "writing", label: t("services.writing") },
    { value: "design", label: t("services.design") },
    { value: "consulting", label: t("services.consulting") },
    { value: "other", label: t("services.other") },
  ]

  const budgetRanges = [
    { value: "under-500", label: t("requests.budget.under500") },
    { value: "500-1000", label: t("requests.budget.500to1000") },
    { value: "1000-2500", label: t("requests.budget.1000to2500") },
    { value: "2500-5000", label: t("requests.budget.2500to5000") },
    { value: "over-5000", label: t("requests.budget.over5000") },
    { value: "negotiable", label: t("requests.budget.negotiable") },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])

    // Check file size (max 10MB per file)
    const oversizedFiles = files.filter((file) => file.size > 10 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      toast({
        title: t("requests.fileTooLarge"),
        description: t("requests.fileTooLargeDesc"),
        variant: "destructive",
      })
      return
    }

    // Check total number of files (max 5)
    if (attachments.length + files.length > 5) {
      toast({
        title: t("requests.tooManyFiles"),
        description: t("requests.tooManyFilesDesc"),
        variant: "destructive",
      })
      return
    }

    setAttachments((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const required = ["name", "email", "serviceType", "title", "description"]
    const missing = required.filter((field) => !formData[field as keyof typeof formData])

    if (missing.length > 0) {
      toast({
        title: t("requests.validationError"),
        description: t("requests.fillRequiredFields"),
        variant: "destructive",
      })
      return false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: t("requests.invalidEmail"),
        description: t("requests.invalidEmailDesc"),
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const requestData = {
      ...formData,
      attachments: attachments.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
    }

    onSubmit(requestData)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{t("requests.submitRequest")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="font-medium mb-4">{t("requests.personalInfo")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t("requests.fullName")} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">{t("requests.email")} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="phone">{t("requests.phone")}</Label>
                <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div>
            <h3 className="font-medium mb-4">{t("requests.serviceDetails")}</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="serviceType">{t("requests.serviceType")} *</Label>
                <Select value={formData.serviceType} onValueChange={(value) => handleInputChange("serviceType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("requests.selectService")} />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">{t("requests.projectTitle")} *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder={t("requests.titlePlaceholder")}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">{t("requests.description")} *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder={t("requests.descriptionPlaceholder")}
                  rows={5}
                  required
                />
              </div>

              <div>
                <Label htmlFor="requirements">{t("requests.requirements")}</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange("requirements", e.target.value)}
                  placeholder={t("requests.requirementsPlaceholder")}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div>
            <h3 className="font-medium mb-4">{t("requests.projectDetails")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deadline">{t("requests.deadline")}</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange("deadline", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <Label htmlFor="budgetRange">{t("requests.budgetRange")}</Label>
                <Select value={formData.budgetRange} onValueChange={(value) => handleInputChange("budgetRange", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("requests.selectBudget")} />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Priority */}
          <div>
            <Label className="text-base font-medium">{t("requests.priority")}</Label>
            <RadioGroup
              value={formData.priority}
              onValueChange={(value) => handleInputChange("priority", value)}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low">{t("requests.priority.low")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">{t("requests.priority.medium")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high">{t("requests.priority.high")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urgent" id="urgent" />
                <Label htmlFor="urgent">{t("requests.priority.urgent")}</Label>
              </div>
            </RadioGroup>
          </div>

          {/* File Attachments */}
          <div>
            <Label className="text-base font-medium">{t("requests.attachments")}</Label>
            <div className="mt-2 space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{t("requests.dragDropFiles")}</p>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="max-w-xs mx-auto"
                    accept=".pdf,.doc,.docx,.txt,.zip,.jpg,.jpeg,.png"
                  />
                </div>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">{t("requests.attachedFiles")}:</p>
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500">{t("requests.fileSupport")}</p>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting} size="lg">
            {isSubmitting ? t("requests.submitting") : t("requests.submitRequest")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
