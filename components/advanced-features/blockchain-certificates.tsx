"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Award,
  Download,
  Share,
  Eye,
  Copy,
  ExternalLink,
  CheckCircle,
  Globe,
  QrCode,
  Database,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface BlockchainCertificate {
  id: string
  courseTitle: string
  studentName: string
  instructorName: string
  completionDate: string
  issueDate: string
  blockchainHash: string
  transactionId: string
  certificateUrl: string
  skills: string[]
  grade: string
  creditsEarned: number
  isVerified: boolean
  verificationUrl: string
  ipfsHash: string
  nftTokenId?: string
}

interface VerificationResult {
  isValid: boolean
  issuer: string
  timestamp: string
  blockchainNetwork: string
  confirmations: number
}

export default function BlockchainCertificates() {
  const [certificates, setCertificates] = useState<BlockchainCertificate[]>([])
  const [selectedCertificate, setSelectedCertificate] = useState<BlockchainCertificate | null>(null)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Mock blockchain certificates data
    const mockCertificates: BlockchainCertificate[] = [
      {
        id: "cert_001",
        courseTitle: "React Hooks Masterclass",
        studentName: "Sarah Johnson",
        instructorName: "Dr. Mike Chen",
        completionDate: "2024-01-20",
        issueDate: "2024-01-21",
        blockchainHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
        transactionId: "0xabc123def456789012345678901234567890abcd",
        certificateUrl: "https://certificates.educationalacademy.com/cert_001",
        skills: ["React", "JavaScript", "Frontend Development", "Hooks"],
        grade: "A+",
        creditsEarned: 3,
        isVerified: true,
        verificationUrl: "https://verify.educationalacademy.com/cert_001",
        ipfsHash: "QmX1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S",
        nftTokenId: "12345",
      },
      {
        id: "cert_002",
        courseTitle: "JavaScript Fundamentals",
        studentName: "Sarah Johnson",
        instructorName: "Emma Davis",
        completionDate: "2024-01-15",
        issueDate: "2024-01-16",
        blockchainHash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
        transactionId: "0xdef456789012345678901234567890abcdef123",
        certificateUrl: "https://certificates.educationalacademy.com/cert_002",
        skills: ["JavaScript", "ES6+", "DOM Manipulation", "Async Programming"],
        grade: "A",
        creditsEarned: 4,
        isVerified: true,
        verificationUrl: "https://verify.educationalacademy.com/cert_002",
        ipfsHash: "QmY2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T",
      },
      {
        id: "cert_003",
        courseTitle: "UI/UX Design Principles",
        studentName: "Sarah Johnson",
        instructorName: "Alex Rodriguez",
        completionDate: "2024-01-10",
        issueDate: "2024-01-11",
        blockchainHash: "0x3c4d5e6f7890abcdef1234567890abcdef123456",
        transactionId: "0x789012345678901234567890abcdef123456789",
        certificateUrl: "https://certificates.educationalacademy.com/cert_003",
        skills: ["UI Design", "UX Research", "Prototyping", "User Testing"],
        grade: "B+",
        creditsEarned: 3,
        isVerified: true,
        verificationUrl: "https://verify.educationalacademy.com/cert_003",
        ipfsHash: "QmZ3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U",
      },
    ]

    setCertificates(mockCertificates)
  }, [])

  const verifyCertificate = async (certificate: BlockchainCertificate) => {
    setIsVerifying(true)
    setSelectedCertificate(certificate)

    // Simulate blockchain verification
    setTimeout(() => {
      const mockVerification: VerificationResult = {
        isValid: true,
        issuer: "Educational Academy",
        timestamp: certificate.issueDate,
        blockchainNetwork: "Ethereum Mainnet",
        confirmations: 1247,
      }

      setVerificationResult(mockVerification)
      setIsVerifying(false)

      toast({
        title: "Certificate Verified",
        description: "This certificate is authentic and verified on the blockchain",
      })
    }, 2000)
  }

  const downloadCertificate = (certificate: BlockchainCertificate) => {
    toast({
      title: "Download Started",
      description: "Your blockchain certificate is being downloaded",
    })
  }

  const shareCertificate = (certificate: BlockchainCertificate) => {
    navigator.clipboard.writeText(certificate.verificationUrl)
    toast({
      title: "Link Copied",
      description: "Certificate verification link copied to clipboard",
    })
  }

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    toast({
      title: "Hash Copied",
      description: "Blockchain hash copied to clipboard",
    })
  }

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
  }

  const getGradeColor = (grade: string) => {
    switch (grade.charAt(0)) {
      case "A":
        return "bg-green-100 text-green-800"
      case "B":
        return "bg-blue-100 text-blue-800"
      case "C":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Blockchain Certificates</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your achievements are permanently recorded on the blockchain, ensuring authenticity and preventing fraud.
          These certificates are tamper-proof and globally verifiable.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium mb-2">Tamper-Proof</h3>
            <p className="text-sm text-muted-foreground">
              Certificates are immutably stored on the blockchain, preventing any unauthorized modifications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Globe className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium mb-2">Globally Verifiable</h3>
            <p className="text-sm text-muted-foreground">
              Anyone can verify the authenticity of your certificates using blockchain technology
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Database className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium mb-2">Permanent Storage</h3>
            <p className="text-sm text-muted-foreground">
              Your certificates are stored permanently and will never be lost or corrupted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate) => (
          <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{certificate.courseTitle}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">by {certificate.instructorName}</p>
                </div>
                <div className="flex items-center gap-1">
                  {certificate.isVerified && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {certificate.nftTokenId && <Award className="h-5 w-5 text-purple-500" />}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className={getGradeColor(certificate.grade)}>
                  Grade: {certificate.grade}
                </Badge>
                <Badge variant="outline">{certificate.creditsEarned} Credits</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completed:</span>
                  <span>{new Date(certificate.completionDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Issued:</span>
                  <span>{new Date(certificate.issueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Blockchain Hash:</span>
                  <button
                    onClick={() => copyHash(certificate.blockchainHash)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  >
                    <span className="font-mono">{formatHash(certificate.blockchainHash)}</span>
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Skills Acquired:</h4>
                <div className="flex flex-wrap gap-1">
                  {certificate.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex-1">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Certificate Details</DialogTitle>
                    </DialogHeader>
                    <CertificateDetails certificate={certificate} />
                  </DialogContent>
                </Dialog>

                <Button size="sm" variant="outline" onClick={() => verifyCertificate(certificate)}>
                  <Shield className="mr-2 h-4 w-4" />
                  Verify
                </Button>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => downloadCertificate(certificate)} className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button size="sm" variant="outline" onClick={() => shareCertificate(certificate)} className="flex-1">
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Verification Dialog */}
      {selectedCertificate && (
        <Dialog open={!!selectedCertificate} onOpenChange={() => setSelectedCertificate(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Certificate Verification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {isVerifying ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Verifying Certificate</h3>
                  <p className="text-muted-foreground">Checking blockchain records...</p>
                </div>
              ) : verificationResult ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-medium text-green-800">Certificate Verified</h3>
                      <p className="text-sm text-green-600">This certificate is authentic and valid</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Issuer:</span>
                      <span className="font-medium">{verificationResult.issuer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network:</span>
                      <span className="font-medium">{verificationResult.blockchainNetwork}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confirmations:</span>
                      <span className="font-medium">{verificationResult.confirmations.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Timestamp:</span>
                      <span className="font-medium">{new Date(verificationResult.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      onClick={() => window.open(selectedCertificate.verificationUrl, "_blank")}
                      className="w-full"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on Blockchain Explorer
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function CertificateDetails({ certificate }: { certificate: BlockchainCertificate }) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="certificate" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="certificate">Certificate</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
        </TabsList>

        <TabsContent value="certificate" className="space-y-4">
          {/* Certificate Preview */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg border-2 border-dashed border-blue-200">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Certificate of Completion</h2>
                <p className="text-gray-600">Educational Academy</p>
              </div>
              <div className="space-y-2">
                <p className="text-lg">This certifies that</p>
                <h3 className="text-2xl font-bold text-blue-600">{certificate.studentName}</h3>
                <p className="text-lg">has successfully completed</p>
                <h4 className="text-xl font-semibold text-gray-800">{certificate.courseTitle}</h4>
              </div>
              <div className="flex justify-between items-center pt-8">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Instructor</p>
                  <p className="font-medium">{certificate.instructorName}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{new Date(certificate.completionDate).toLocaleDateString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Grade</p>
                  <p className="font-medium">{certificate.grade}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Skills Acquired</h4>
              <div className="space-y-1">
                {certificate.skills.map((skill) => (
                  <div key={skill} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Certificate Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Credits:</span>
                  <span>{certificate.creditsEarned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Grade:</span>
                  <span>{certificate.grade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Verified
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Blockchain Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Transaction Hash</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 p-2 bg-white rounded border text-sm font-mono">
                      {certificate.transactionId}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(certificate.transactionId)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Block Hash</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 p-2 bg-white rounded border text-sm font-mono">
                      {certificate.blockchainHash}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(certificate.blockchainHash)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">IPFS Hash</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 p-2 bg-white rounded border text-sm font-mono">{certificate.ipfsHash}</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(certificate.ipfsHash)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {certificate.nftTokenId && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">NFT Token ID</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 p-2 bg-white rounded border text-sm font-mono">
                        #{certificate.nftTokenId}
                      </code>
                      <Badge variant="outline" className="bg-purple-100 text-purple-800">
                        NFT
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Etherscan
              </Button>
              <Button variant="outline" className="w-full">
                <Globe className="mr-2 h-4 w-4" />
                View on IPFS
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="metadata" className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Certificate Metadata</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Certificate ID:</span>
                  <span className="font-mono">{certificate.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issue Date:</span>
                  <span>{new Date(certificate.issueDate).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completion Date:</span>
                  <span>{new Date(certificate.completionDate).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verification URL:</span>
                  <a
                    href={certificate.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Verify Certificate
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Code Verification
              </h4>
              <div className="flex items-center justify-center p-4">
                <div className="w-32 h-32 bg-white rounded-lg border-2 border-dashed border-blue-300 flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-blue-400" />
                </div>
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Scan this QR code to verify the certificate on any device
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
