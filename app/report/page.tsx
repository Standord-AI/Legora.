"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Download, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ChatInterface } from "@/components/chat-interface"

export default function ReportPage() {
  const router = useRouter()

  // Sample compliance report data
  const complianceScore = 78
  const reportDate = new Date().toLocaleDateString()
  const fileName = "Employment_Contract_2023.pdf"

  return (
    <DashboardLayout>
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Compliance Report</h1>
            <p className="text-muted-foreground">
              Generated on {reportDate} for {fileName}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Download Report
            </Button>
            <Button className="gap-2" onClick={() => router.push("/compliant-document")}>
              <CheckCircle className="h-4 w-4" /> Generate Compliant Version
            </Button>
          </div>
        </div>

        <Tabs defaultValue="report">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="report">Compliance Report</TabsTrigger>
            <TabsTrigger value="chat">AI Assistant Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="report" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Compliance Overview</span>
                  <Badge variant={complianceScore >= 80 ? "default" : "destructive"}>
                    {complianceScore}% Compliant
                  </Badge>
                </CardTitle>
                <CardDescription>Summary of compliance issues found in your contract</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Compliance</span>
                    <span>{complianceScore}%</span>
                  </div>
                  <Progress value={complianceScore} className="h-2" />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <ComplianceCard title="Critical Issues" count={2} icon={AlertTriangle} variant="destructive" />
                  <ComplianceCard title="Warnings" count={5} icon={Info} variant="warning" />
                  <ComplianceCard title="Compliant Sections" count={12} icon={CheckCircle} variant="success" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Findings</CardTitle>
                <CardDescription>Specific compliance issues and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ComplianceIssue
                  title="Non-Compete Clause Duration"
                  description="The non-compete clause duration of 3 years exceeds the maximum allowed duration of 1 year in the current jurisdiction."
                  severity="critical"
                  recommendation="Reduce the non-compete duration to a maximum of 1 year to comply with local regulations."
                  location="Section 8.2, Page 4"
                />

                <Separator />

                <ComplianceIssue
                  title="Termination Notice Period"
                  description="The termination notice period of 7 days is below the minimum required notice period of 14 days for employees with over 1 year of service."
                  severity="critical"
                  recommendation="Increase the notice period to at least 14 days to comply with employment standards."
                  location="Section 12.1, Page 6"
                />

                <Separator />

                <ComplianceIssue
                  title="Overtime Compensation"
                  description="The contract does not clearly specify overtime compensation rates as required by labor laws."
                  severity="warning"
                  recommendation="Add a clause specifying overtime compensation at 1.5x regular pay rate for hours worked beyond standard hours."
                  location="Section 5, Page 3"
                />

                <Separator />

                <ComplianceIssue
                  title="Privacy Policy Reference"
                  description="The contract references an outdated privacy policy that doesn't comply with current data protection regulations."
                  severity="warning"
                  recommendation="Update references to include the current privacy policy that complies with data protection laws."
                  location="Section 15.3, Page 8"
                />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Issues (7)
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <Card className="h-[calc(100vh-220px)]">
              <CardHeader>
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>
                  Ask questions about your compliance report and get detailed explanations
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[calc(100%-160px)]">
                <ChatInterface />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

interface ComplianceCardProps {
  title: string
  count: number
  icon: React.ElementType
  variant: "destructive" | "warning" | "success"
}

function ComplianceCard({ title, count, icon: Icon, variant }: ComplianceCardProps) {
  const variantStyles = {
    destructive: "bg-destructive/10 text-destructive border-destructive/20",
    warning: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    success: "bg-green-500/10 text-green-600 border-green-500/20",
  }

  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg border ${variantStyles[variant]}`}>
      <div className={`p-2 rounded-full ${variantStyles[variant]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-2xl font-bold">{count}</p>
      </div>
    </div>
  )
}

interface ComplianceIssueProps {
  title: string
  description: string
  severity: "critical" | "warning" | "info"
  recommendation: string
  location: string
}

function ComplianceIssue({ title, description, severity, recommendation, location }: ComplianceIssueProps) {
  const severityStyles = {
    critical: "bg-destructive text-destructive-foreground",
    warning: "bg-yellow-500 text-white",
    info: "bg-blue-500 text-white",
  }

  const severityIcons = {
    critical: AlertTriangle,
    warning: Info,
    info: Info,
  }

  const Icon = severityIcons[severity]

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Badge className={severityStyles[severity]}>
          <Icon className="h-3 w-3 mr-1" />
          {severity.charAt(0).toUpperCase() + severity.slice(1)}
        </Badge>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">{location}</p>
        </div>
      </div>

      <p className="text-sm">{description}</p>

      <div className="bg-muted p-3 rounded-md">
        <p className="text-sm font-medium">Recommendation:</p>
        <p className="text-sm">{recommendation}</p>
      </div>
    </div>
  )
}

