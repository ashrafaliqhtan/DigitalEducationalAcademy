"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"

export default function CustomRequestForm() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: t("custom.form.success"),
        description: t("custom.form.successMessage"),
      })
      // Reset form
      e.currentTarget.reset()
    }, 1500)
  }

  return (
    <div className="py-8" id="custom-request-form">
      <h2 className="text-2xl font-bold mb-6">{t("custom.form.title")}</h2>
      <div className="bg-gray-50 p-6 rounded-lg border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t("custom.form.name")}</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("custom.form.email")}</Label>
              <Input id="email" name="email" type="email" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">{t("custom.form.phone")}</Label>
              <Input id="phone" name="phone" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-type">{t("custom.form.serviceType")}</Label>
              <Select name="service-type">
                <SelectTrigger>
                  <SelectValue placeholder={t("custom.form.selectService")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="programming">{t("services.programming")}</SelectItem>
                  <SelectItem value="research">{t("services.research")}</SelectItem>
                  <SelectItem value="presentations">{t("services.presentations")}</SelectItem>
                  <SelectItem value="templates">{t("services.templates")}</SelectItem>
                  <SelectItem value="other">{t("custom.form.other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">{t("custom.form.deadline")}</Label>
            <Input id="deadline" name="deadline" type="date" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("custom.form.description")}</Label>
            <Textarea
              id="description"
              name="description"
              rows={5}
              placeholder={t("custom.form.descriptionPlaceholder")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">{t("custom.form.attachments")}</Label>
            <Input id="file" name="file" type="file" multiple />
            <p className="text-sm text-gray-500">{t("custom.form.attachmentsHelp")}</p>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t("custom.form.submitting") : t("custom.form.submit")}
          </Button>
        </form>
      </div>
    </div>
  )
}
