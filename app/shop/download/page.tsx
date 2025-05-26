"use client"

import Link from "next/link"
import { Download, FileText, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"

export default function DownloadPage() {
  const { t } = useLanguage()

  // Mock purchased products for download
  const purchasedProducts = [
    {
      id: "cv-template-modern",
      name: "Modern CV Template",
      downloadUrl: "#",
      fileFormat: ["DOCX", "PDF", "INDD"],
      downloadSize: "15MB",
      purchaseDate: new Date().toLocaleDateString(),
    },
    {
      id: "business-proposal-template",
      name: "Business Proposal Template",
      downloadUrl: "#",
      fileFormat: ["DOCX", "PDF", "PPTX"],
      downloadSize: "25MB",
      purchaseDate: new Date().toLocaleDateString(),
    },
  ]

  return (
    <div>
      <div className="mb-8 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold">{t("shop.thankYou")}</h1>
        <p className="mt-2 text-gray-600">{t("shop.orderConfirmed")}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{t("shop.downloads")}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {purchasedProducts.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>
                  {t("shop.purchased")}: {product.purchaseDate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <FileText className="h-4 w-4" />
                  <span>
                    {t("shop.fileFormats")}: {product.fileFormat.join(", ")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Download className="h-4 w-4" />
                  <span>
                    {t("shop.downloadSize")}: {product.downloadSize}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a href={product.downloadUrl} download>
                    <Download className="mr-2 h-4 w-4" />
                    {t("shop.download")}
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center">
        <p className="mb-4 text-gray-600">{t("shop.downloadInstructions")}</p>
        <Button asChild variant="outline">
          <Link href="/shop">{t("shop.continueShopping")}</Link>
        </Button>
      </div>
    </div>
  )
}
