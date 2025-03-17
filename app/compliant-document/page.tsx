"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Download, Share2, ArrowLeft, CheckCircle, Eye, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function CompliantDocumentPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("document")

  // Sample document data
  const documentName = "Employment_Contract_2023_Compliant.pdf"
  const generatedDate = new Date().toLocaleDateString()

  return (
    <DashboardLayout>
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2" onClick={() => router.push("/report")}>
            <ArrowLeft className="h-4 w-4" /> Back to Report
          </Button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Compliant Document</h1>
            <p className="text-muted-foreground">Generated on {generatedDate}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Download
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </div>
        </div>

        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-600 dark:text-green-400">Successfully Generated</AlertTitle>
          <AlertDescription className="text-green-600/90 dark:text-green-400/90">
            All compliance issues have been resolved in this document. It is now fully compliant with current legal
            requirements.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="document" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="document">Compliant Document</TabsTrigger>
            <TabsTrigger value="comparison">Before & After</TabsTrigger>
          </TabsList>

          <TabsContent value="document" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-xl">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      {documentName}
                    </div>
                  </CardTitle>
                  <CardDescription>Compliant version with all issues fixed</CardDescription>
                </div>
                <Badge className="bg-green-600">100% Compliant</Badge>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-6 bg-muted/30 min-h-[60vh] relative">
                  {/* Document Preview */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold text-center">EMPLOYMENT AGREEMENT</h2>
                      <p className="text-center text-muted-foreground">
                        This Employment Agreement (the "Agreement") is made and effective as of [Date]
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">1. EMPLOYMENT</h3>
                      <p>
                        Company agrees to employ Employee as [Position] and Employee accepts such employment subject to
                        the terms and conditions of this Agreement.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">5. COMPENSATION</h3>
                      <p>
                        5.1 Base Salary. As compensation for the services to be rendered by Employee, Company shall pay
                        Employee an annual salary of [Amount].
                      </p>
                      <p>
                        5.2 Overtime Compensation. For hours worked beyond standard working hours, Employee shall be
                        compensated at 1.5x the regular pay rate in accordance with applicable labor laws.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">8. RESTRICTIVE COVENANTS</h3>
                      <p>
                        8.1 Confidentiality. Employee agrees to maintain the confidentiality of all proprietary
                        information of the Company.
                      </p>
                      <p>
                        8.2 Non-Compete. For a period of one (1) year following termination of employment, Employee
                        shall not engage in any competing business within the same geographic area.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">12. TERMINATION</h3>
                      <p>
                        12.1 Notice Period. Either party may terminate this Agreement by providing at least fourteen
                        (14) days written notice to the other party.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">15. MISCELLANEOUS</h3>
                      <p>
                        15.3 Privacy. Employee acknowledges receipt of the Company's current Privacy Policy (version
                        2023-1) and agrees to abide by its terms.
                      </p>
                    </div>
                  </div>

                  {/* Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                    <div className="rotate-45 text-6xl font-bold text-green-600">COMPLIANT</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full gap-2">
                  <Eye className="h-4 w-4" /> View Full Document
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Changes Made to Ensure Compliance</CardTitle>
                <CardDescription>Comparison between original and compliant versions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <ComparisonItem
                    section="Section 5: Compensation"
                    original="The contract did not specify overtime compensation rates."
                    fixed="Added clause 5.2 specifying overtime compensation at 1.5x regular pay rate for hours worked beyond standard hours."
                  />

                  <ComparisonItem
                    section="Section 8.2: Non-Compete Clause"
                    original="The non-compete clause duration was 3 years, exceeding the maximum allowed duration."
                    fixed="Reduced the non-compete duration to 1 year to comply with local regulations."
                  />

                  <ComparisonItem
                    section="Section 12.1: Termination Notice"
                    original="The termination notice period was 7 days, below the minimum required notice period."
                    fixed="Increased the notice period to 14 days to comply with employment standards."
                  />

                  <ComparisonItem
                    section="Section 15.3: Privacy Policy"
                    original="Referenced an outdated privacy policy that doesn't comply with current data protection regulations."
                    fixed="Updated references to include the current privacy policy (version 2023-1) that complies with data protection laws."
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("document")}>
                  View Compliant Document
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" /> Download Comparison Report
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Button variant="outline" className="gap-2" onClick={() => router.push("/report")}>
            <ArrowLeft className="h-4 w-4" /> Back to Report
          </Button>
          <Button className="gap-2" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}

interface ComparisonItemProps {
  section: string
  original: string
  fixed: string
}

function ComparisonItem({ section, original, fixed }: ComparisonItemProps) {
  return (
    <div className="space-y-3 p-4 border rounded-lg">
      <h3 className="font-semibold text-lg">{section}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">Original:</p>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-100 dark:border-red-900/30 text-sm">
            {original}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">Fixed:</p>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-100 dark:border-green-900/30 text-sm">
            {fixed}
          </div>
        </div>
      </div>
    </div>
  )
}

