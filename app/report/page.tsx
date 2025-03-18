"use client";

import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Download,
  AlertTriangle,
  CheckCircle,
  Info,
  ExternalLink,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ChatInterface } from "@/components/chat-interface";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ReportData {
  user_name: string;
  session_id: string;
  document_id: string;
  log_file: string;
  report: string;
  finish_time: string;
  status: string;
  pdf_path: string;
  agentops_url: string;
}

interface Issue {
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
  recommendation: string;
  location: string;
}

export default function ReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derived metrics
  const [complianceScore, setComplianceScore] = useState(0);
  const [criticalIssues, setCriticalIssues] = useState(0);
  const [warningIssues, setWarningIssues] = useState(0);
  const [compliantSections, setCompliantSections] = useState(0);
  const [fileName, setFileName] = useState("");
  const [reportDate, setReportDate] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided");
      setIsLoading(false);
      return;
    }

    const fetchReportData = async () => {
      try {
        // First try fetching from our direct MongoDB connection API
        let response = await fetch(`/api/report/${sessionId}`);

        // If that fails, fall back to the regular backend API
        if (!response.ok) {
          console.log("MongoDB API failed, falling back to backend API");
          response = await fetch(`/api/job-status/${sessionId}`);

          if (!response.ok) {
            throw new Error("Failed to fetch report data from all sources");
          }
        }

        const data = await response.json();
        console.log("Report data received:", data);
        setReportData(data);

        // Check if processing is still ongoing
        if (data.status === "running" || data.status === "pending") {
          // Show that analysis is still in progress
          setError(null);
          setIsLoading(false);

          // Create a timer to refresh the page every 10 seconds
          const refreshTimer = setInterval(() => {
            console.log("Refreshing report page to check progress...");
            window.location.reload();
          }, 10000);

          // Clean up timer if component unmounts
          return () => clearInterval(refreshTimer);
        }

        // Set filename and date
        if (data.pdf_path) {
          setFileName(data.pdf_path.split("/").pop() || "Unknown document");
        }

        // Fix date parsing with error handling
        try {
          if (data.finish_time) {
            const date = new Date(data.finish_time);
            if (!isNaN(date.getTime())) {
              setReportDate(date.toLocaleDateString());
            } else {
              setReportDate("No date available");
            }
          } else {
            setReportDate("No date available");
          }
        } catch (error) {
          console.error("Error parsing date:", error);
          setReportDate("No date available");
        }

        // For demo purposes, derive some statistics from the report
        // In a real application, these would come from the analysis
        // Random number between 60 and 95 for compliance score
        setComplianceScore(Math.floor(Math.random() * 36) + 60);
        setCriticalIssues(Math.floor(Math.random() * 3) + 1);
        setWarningIssues(Math.floor(Math.random() * 5) + 2);
        setCompliantSections(Math.floor(Math.random() * 10) + 5);

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching report data:", err);
        setError("Failed to load report data");
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [sessionId]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="text-lg">Loading report data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-6">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>
                There was an error loading the report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
              <Button
                className="mt-4"
                onClick={() => router.push("/dashboard")}
              >
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Show in-progress view if we have data but processing is ongoing
  if (
    reportData &&
    (reportData.status === "running" || reportData.status === "pending")
  ) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Analysis in Progress</CardTitle>
              <CardDescription>
                Your document is still being analyzed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                  <p className="text-lg">
                    Your document is being analyzed in the background.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This page will automatically refresh when analysis is
                    complete. This typically takes 3-5 minutes.
                  </p>
                </div>
              </div>

              {reportData.pdf_path && (
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertTitle>Document Details</AlertTitle>
                  <AlertDescription>
                    Analyzing: {reportData.pdf_path.split("/").pop()}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                className="w-full"
                onClick={() => window.location.reload()}
              >
                Refresh Status
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!reportData) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-6">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle>No Data Available</CardTitle>
              <CardDescription>
                We couldn't find any report data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>No report data could be found for the provided session ID.</p>
              <Button
                className="mt-4"
                onClick={() => router.push("/dashboard")}
              >
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

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
            <Button
              className="gap-2"
              onClick={() => router.push("/compliant-document")}
            >
              <CheckCircle className="h-4 w-4" /> Generate Compliant Version
            </Button>
          </div>
        </div>

        <Tabs defaultValue="report" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="report">Compliance Report</TabsTrigger>
            <TabsTrigger value="raw">Raw Report</TabsTrigger>
            <TabsTrigger value="chat">AI Assistant Chat</TabsTrigger>
          </TabsList>

          <div className="tab-content-container">
            <TabsContent value="report" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Compliance Overview</span>
                    <Badge
                      variant={
                        complianceScore >= 80 ? "default" : "destructive"
                      }
                    >
                      {complianceScore}% Compliant
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Summary of compliance issues found in your contract
                  </CardDescription>
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
                    <ComplianceCard
                      title="Critical Issues"
                      count={criticalIssues}
                      icon={AlertTriangle}
                      variant="destructive"
                    />
                    <ComplianceCard
                      title="Warnings"
                      count={warningIssues}
                      icon={Info}
                      variant="warning"
                    />
                    <ComplianceCard
                      title="Compliant Sections"
                      count={compliantSections}
                      icon={CheckCircle}
                      variant="success"
                    />
                  </div>
                </CardContent>
              </Card>

              {reportData && (
                <Card>
                  <CardHeader>
                    <CardTitle>Report Overview</CardTitle>
                    <CardDescription>
                      Summary of findings from the automated analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {reportData.report ? (
                        <>
                          <ReactMarkdown>{reportData.report}</ReactMarkdown>
                        </>
                      ) : (
                        <div>
                          <p>No report data available</p>
                          <div className="mt-4 p-4 border border-dashed border-gray-300 bg-gray-50">
                            <h4 className="text-sm font-semibold mb-2">
                              Available fields:
                            </h4>
                            <pre className="text-xs whitespace-pre-wrap">
                              {JSON.stringify(Object.keys(reportData), null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {reportData.agentops_url && (
                <Card>
                  <CardHeader>
                    <CardTitle>AgentOps Dashboard</CardTitle>
                    <CardDescription>
                      View detailed analysis process
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>
                        View the detailed analysis process and agent
                        interactions on AgentOps:
                      </p>
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() =>
                          window.open(reportData.agentops_url, "_blank")
                        }
                      >
                        <ExternalLink className="h-4 w-4" /> Open AgentOps
                        Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="raw" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Raw Analysis Logs</CardTitle>
                  <CardDescription>
                    Complete log output from the analysis process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[500px] text-xs">
                    {reportData.log_file || "No log data available"}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat">
              <Card className="h-[calc(100vh-220px)]">
                <CardHeader>
                  <CardTitle>AI Assistant</CardTitle>
                  <CardDescription>
                    Ask questions about your compliance report and get detailed
                    explanations
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-160px)]">
                  <ChatInterface sessionId={sessionId || ""} />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <style jsx global>{`
        .tab-content-container {
          width: 100%;
        }

        .tab-content-container > div {
          width: 100%;
          animation: none !important;
        }
      `}</style>
    </DashboardLayout>
  );
}

interface ComplianceCardProps {
  title: string;
  count: number;
  icon: React.ElementType;
  variant: "destructive" | "warning" | "success";
}

function ComplianceCard({
  title,
  count,
  icon: Icon,
  variant,
}: ComplianceCardProps) {
  const variantStyles = {
    destructive: "bg-destructive/10 text-destructive border-destructive/20",
    warning: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    success: "bg-green-500/10 text-green-600 border-green-500/20",
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg border ${variantStyles[variant]}`}
    >
      <div className={`p-2 rounded-full ${variantStyles[variant]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-2xl font-bold">{count}</p>
      </div>
    </div>
  );
}

interface ComplianceIssueProps {
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
  recommendation: string;
  location: string;
}

function ComplianceIssue({
  title,
  description,
  severity,
  recommendation,
  location,
}: ComplianceIssueProps) {
  const severityStyles = {
    critical: "bg-destructive text-destructive-foreground",
    warning: "bg-yellow-500 text-white",
    info: "bg-blue-500 text-white",
  };

  const severityIcons = {
    critical: AlertTriangle,
    warning: Info,
    info: Info,
  };

  const Icon = severityIcons[severity];

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
  );
}
