"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Download, Share2, Award, Calendar, User, BookOpen, CheckCircle, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

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

interface ModernCertificateProps {
  certificate: Certificate
  showPreview?: boolean
}

export default function ModernCertificate({ certificate, showPreview = false }: ModernCertificateProps) {
  const { toast } = useToast()
  const { theme } = useTheme()
  const [isDownloading, setIsDownloading] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const certificateRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (!certificateRef.current) return

    setIsDownloading(true)
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
      })

      const imgData = canvas.toDataURL("image/png")

      // For PDF
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`${certificate.student.name.replace(/\s+/g, "_")}_Certificate.pdf`)

      toast({
        title: "Certificate downloaded",
        description: "Your certificate has been downloaded as a PDF",
      })
    } catch (error) {
      console.error("Error generating certificate:", error)
      toast({
        title: "Download failed",
        description: "There was an error generating your certificate",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handlePrint = async () => {
    if (!certificateRef.current) return

    setIsPrinting(true)
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff", // Always white for printing
      })

      const imgData = canvas.toDataURL("image/png")

      // Create a new window for printing
      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        throw new Error("Could not open print window")
      }

      // Write the image to the new window and print
      printWindow.document.write(`
        <html>
          <head>
            <title>Certificate - ${certificate.student.name}</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
              }
              img {
                max-width: 100%;
                max-height: 100vh;
              }
              @media print {
                body {
                  height: auto;
                }
              }
            </style>
          </head>
          <body>
            <img src="${imgData}" alt="Certificate" />
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `)

      toast({
        title: "Print initiated",
        description: "Your certificate is ready to print",
      })
    } catch (error) {
      console.error("Error printing certificate:", error)
      toast({
        title: "Print failed",
        description: "There was an error preparing your certificate for printing",
        variant: "destructive",
      })
    } finally {
      setIsPrinting(false)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: "My Course Certificate",
      text: `I've completed ${certificate.course.title} course!`,
      url: `${window.location.origin}/certificates/verify/${certificate.verificationCode}`,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(shareData.url)
        toast({
          title: "Link copied",
          description: "Certificate verification link copied to clipboard",
        })
      }
    } else {
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(shareData.url)
      toast({
        title: "Link copied",
        description: "Certificate verification link copied to clipboard",
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
      <div className="w-full max-w-4xl mx-auto">
        <div
          ref={certificateRef}
          className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 p-8 md:p-12 rounded-lg shadow-lg"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-lg">
            <svg className="absolute -top-24 -left-24 text-blue-500/10 w-64 h-64" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="currentColor" />
            </svg>
            <svg className="absolute -bottom-24 -right-24 text-indigo-500/10 w-64 h-64" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="currentColor" />
            </svg>
          </div>

          {/* Certificate Border */}
          <motion.div
            className="absolute inset-4 border-4 border-blue-200 dark:border-blue-800 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="absolute inset-6 border-2 border-blue-300 dark:border-blue-700 rounded-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />

          {/* Certificate Content */}
          <div className="relative z-10 text-center space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <motion.div
                className="flex justify-center"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Award className="h-16 w-16 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <motion.h1
                className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Certificate of Completion
              </motion.h1>
              <motion.p
                className="text-lg text-gray-600 dark:text-gray-300"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                This certifies that
              </motion.p>
            </div>

            {/* Student Name */}
            <motion.div
              className="space-y-2"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-blue-800 dark:text-blue-300 border-b-2 border-blue-300 dark:border-blue-700 pb-2 inline-block">
                {certificate.student.name}
              </h2>
            </motion.div>

            {/* Course Information */}
            <motion.div
              className="space-y-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="text-lg text-gray-600 dark:text-gray-300">has successfully completed</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                {certificate.course.title}
              </h3>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Instructor: {certificate.course.instructor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>Duration: {certificate.course.duration} hours</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Completed: {formatDate(certificate.course.completionDate)}</span>
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div
              className="pt-8 space-y-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex justify-between items-end">
                <div className="text-left">
                  <div className="border-t-2 border-gray-400 dark:border-gray-600 pt-2 w-48">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Issued By</p>
                    <p className="font-bold">Educational Academy</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="border-t-2 border-gray-400 dark:border-gray-600 pt-2 w-48">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Date Issued</p>
                    <p className="font-bold">{formatDate(certificate.issuedAt)}</p>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Certificate Number: {certificate.certificateNumber}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Verification Code: {certificate.verificationCode}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Button onClick={handleDownload} disabled={isDownloading} className="gap-2">
            <Download className="h-4 w-4" />
            {isDownloading ? "Downloading..." : "Download PDF"}
          </Button>

          <Button variant="outline" onClick={handlePrint} disabled={isPrinting} className="gap-2">
            <Printer className="h-4 w-4" />
            {isPrinting ? "Preparing..." : "Print Certificate"}
          </Button>

          <Button variant="secondary" onClick={handleShare} className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
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
            Certificate of Completion
          </CardTitle>
          <Badge variant="default" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Certificate Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-1">Course</h3>
            <p className="font-medium">{certificate.course.title}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-1">Student</h3>
            <p className="font-medium">{certificate.student.name}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-1">Completed On</h3>
            <p className="font-medium">{formatDate(certificate.course.completionDate)}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-1">Issued On</h3>
            <p className="font-medium">{formatDate(certificate.issuedAt)}</p>
          </div>
        </div>

        {/* Certificate Details */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Certificate Number:</span>
            <span className="font-mono">{certificate.certificateNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Verification Code:</span>
            <span className="font-mono">{certificate.verificationCode}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleDownload} disabled={isDownloading} className="flex-1 gap-2">
            <Download className="h-4 w-4" />
            {isDownloading ? "Downloading..." : "Download"}
          </Button>

          <Button variant="outline" onClick={handlePrint} disabled={isPrinting} className="flex-1 gap-2">
            <Printer className="h-4 w-4" />
            {isPrinting ? "Preparing..." : "Print"}
          </Button>

          <Button variant="secondary" onClick={handleShare} className="flex-1 gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Verification Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Verify this certificate online</p>
          <a
            href={`/certificates/verify/${certificate.verificationCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            {window.location.origin}/certificates/verify/{certificate.verificationCode}
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
