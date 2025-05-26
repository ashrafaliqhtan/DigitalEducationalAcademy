"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Share2, Award, Calendar, User, BookOpen, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"

interface Certificate {
  id: string
  certificateNumber: string
  issuedAt: string
  certificateUrl?: string
  verificationCode: string
  course: {
    title: string
    instructor: string
    duration: number
    completionDate: string
  }
  student: {
    name: string
    email: string
  }
}

interface CertificateComponentProps {
  certificate: Certificate
  showPreview?: boolean
}

export default function CertificateComponent({ certificate, showPreview = false }: CertificateComponentProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      // In a real app, this would generate and download the PDF certificate
      // For now, we'll simulate the download
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: t("certificate.downloadStarted"),
        description: t("certificate.downloadStartedDesc"),
      })
    } catch (error) {
      toast({
        title: t("certificate.downloadError"),
        description: t("certificate.downloadErrorDesc"),
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: t("certificate.shareTitle"),
      text: t("certificate.shareText", {
        course: certificate.course.title,
        student: certificate.student.name,
      }),
      url: `${window.location.origin}/certificates/verify/${certificate.verificationCode}`,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(shareData.url)
        toast({
          title: t("certificate.linkCopied"),
          description: t("certificate.linkCopiedDesc"),
        })
      }
    } else {
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(shareData.url)
      toast({
        title: t("certificate.linkCopied"),
        description: t("certificate.linkCopiedDesc"),
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (showPreview) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
        {/* Certificate Preview */}
        <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 p-8 md:p-12">
          {/* Decorative Border */}
          <div className="absolute inset-4 border-4 border-blue-200 rounded-lg"></div>
          <div className="absolute inset-6 border-2 border-blue-300 rounded-lg"></div>

          {/* Certificate Content */}
          <div className="relative z-10 text-center space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex justify-center">
                <Award className="h-16 w-16 text-blue-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{t("certificate.title")}</h1>
              <p className="text-lg text-gray-600">{t("certificate.subtitle")}</p>
            </div>

            {/* Student Name */}
            <div className="space-y-2">
              <p className="text-lg text-gray-600">{t("certificate.presentedTo")}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-blue-800 border-b-2 border-blue-300 pb-2 inline-block">
                {certificate.student.name}
              </h2>
            </div>

            {/* Course Information */}
            <div className="space-y-4">
              <p className="text-lg text-gray-600">{t("certificate.hasSuccessfullyCompleted")}</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{certificate.course.title}</h3>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>
                    {t("certificate.instructor")}: {certificate.course.instructor}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>
                    {t("certificate.duration")}: {certificate.course.duration} {t("certificate.hours")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {t("certificate.completed")}: {formatDate(certificate.course.completionDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-8 space-y-4">
              <div className="flex justify-between items-end">
                <div className="text-left">
                  <div className="border-t-2 border-gray-400 pt-2 w-48">
                    <p className="text-sm text-gray-600">{t("certificate.issuedBy")}</p>
                    <p className="font-bold">Golfacadimic</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="border-t-2 border-gray-400 pt-2 w-48">
                    <p className="text-sm text-gray-600">{t("certificate.dateIssued")}</p>
                    <p className="font-bold">{formatDate(certificate.issuedAt)}</p>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <p className="text-xs text-gray-500">
                  {t("certificate.certificateNumber")}: {certificate.certificateNumber}
                </p>
                <p className="text-xs text-gray-500">
                  {t("certificate.verificationCode")}: {certificate.verificationCode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-blue-600" />
            {t("certificate.certificate")}
          </CardTitle>
          <Badge variant="default" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            {t("certificate.verified")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Certificate Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-sm text-gray-600 mb-1">{t("certificate.course")}</h3>
            <p className="font-medium">{certificate.course.title}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-600 mb-1">{t("certificate.student")}</h3>
            <p className="font-medium">{certificate.student.name}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-600 mb-1">{t("certificate.completedOn")}</h3>
            <p className="font-medium">{formatDate(certificate.course.completionDate)}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-600 mb-1">{t("certificate.issuedOn")}</h3>
            <p className="font-medium">{formatDate(certificate.issuedAt)}</p>
          </div>
        </div>

        {/* Certificate Details */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t("certificate.certificateNumber")}:</span>
            <span className="font-mono">{certificate.certificateNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t("certificate.verificationCode")}:</span>
            <span className="font-mono">{certificate.verificationCode}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={handleDownload} disabled={isDownloading} className="flex-1 gap-2">
            <Download className="h-4 w-4" />
            {isDownloading ? t("certificate.downloading") : t("certificate.download")}
          </Button>
          <Button variant="outline" onClick={handleShare} className="flex-1 gap-2">
            <Share2 className="h-4 w-4" />
            {t("certificate.share")}
          </Button>
        </div>

        {/* Verification Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">{t("certificate.verifyOnline")}</p>
          <a
            href={`/certificates/verify/${certificate.verificationCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            {window.location.origin}/certificates/verify/{certificate.verificationCode}
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
