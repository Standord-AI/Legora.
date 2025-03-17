"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Add this at the top of the component to define recentReports
const recentReports = [
  {
    name: "Employment_Contract_2023.pdf",
    date: "2023-11-15",
    score: 78,
  },
  {
    name: "Contractor_Agreement.pdf",
    date: "2023-11-10",
    score: 92,
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile)
      setError(null)
    } else {
      setError("Please upload a PDF file")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      setError(null)
    } else {
      setError("Please upload a PDF file")
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setIsUploading(true)
    setError(null)

    // Simulate file upload and processing
    // In a real app, you would send the file to your FastAPI backend
    setTimeout(() => {
      setIsUploading(false)
      router.push("/report")
    }, 3000)
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Upload Contract</CardTitle>
              <CardDescription>Upload an employment contract for compliance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-sm text-center text-muted-foreground mb-2">
                  Drag and drop your PDF file here, or click to browse
                </p>
                <input type="file" id="file-upload" className="hidden" accept=".pdf" onChange={handleFileChange} />
                <Button variant="outline" size="sm" onClick={() => document.getElementById("file-upload")?.click()}>
                  Browse files
                </Button>
              </div>

              {file && (
                <div className="mt-4 flex items-center gap-2 p-2 border rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm truncate flex-1">{file.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                    Remove
                  </Button>
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleUpload} disabled={!file || isUploading}>
                {isUploading ? "Processing..." : "Upload & Analyze"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>View your recent compliance reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.length > 0 ? (
                  recentReports.map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{report.name}</p>
                          <p className="text-xs text-muted-foreground">{report.date}</p>
                        </div>
                      </div>
                      <Badge variant={report.score >= 80 ? "default" : "destructive"}>{report.score}%</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No reports available yet</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/reports")}
                disabled={recentReports.length === 0}
              >
                View All Reports
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>Your current plan and usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Free Trial</p>
                  <p className="text-sm text-muted-foreground">5 reports remaining</p>
                </div>
                <Badge>Active</Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Available Plans:</p>

                <div className="rounded-lg border p-3 bg-muted/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Basic</h3>
                      <p className="text-sm text-muted-foreground">10 reports/month</p>
                    </div>
                    <p className="font-medium">$49/mo</p>
                  </div>
                </div>

                <div className="rounded-lg border p-3 bg-primary/5 border-primary/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Professional</h3>
                      <p className="text-sm text-muted-foreground">50 reports/month</p>
                    </div>
                    <p className="font-medium">$99/mo</p>
                  </div>
                  <Badge variant="outline" className="mt-2">
                    Recommended
                  </Badge>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Enterprise</h3>
                      <p className="text-sm text-muted-foreground">Unlimited reports</p>
                    </div>
                    <p className="font-medium">$249/mo</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Upgrade Plan</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

