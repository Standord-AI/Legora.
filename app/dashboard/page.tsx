"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProcessingModal } from "@/components/processing-modal";

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
];

export default function DashboardPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for processing modal
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Effect to handle progress simulation and API polling
  useEffect(() => {
    if (!showProcessingModal) return;

    console.log("Starting progress simulation");

    // Simulate progress immediately before the first API response
    let progressInterval: NodeJS.Timeout;
    let statusInterval: NodeJS.Timeout;

    // Start with gradual progress simulation
    progressInterval = setInterval(() => {
      // Update progress first
      setProgress((prevProgress) => {
        // Cap at 95% until we get a real status
        const newProgress = prevProgress + (95 - prevProgress) * 0.02; // Slower progress increment for 5-minute timeline
        console.log(
          "Progress updated:",
          prevProgress,
          "->",
          Math.min(newProgress, 95)
        );

        // Then immediately update time remaining based on this new progress value
        const progressValue = Math.min(newProgress, 95);
        const remainingProgress = 100 - progressValue;
        const totalDuration = 300; // 5 minutes in seconds
        const remainingSeconds = Math.max(
          Math.round(totalDuration * (remainingProgress / 100)),
          0
        );
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        setTimeRemaining(`${minutes}m ${seconds}s`);

        return progressValue;
      });
    }, 1000);

    // Only poll for status if we have a session ID
    if (sessionId) {
      statusInterval = setInterval(async () => {
        try {
          const response = await fetch(`/api/job-status/${sessionId}`);

          if (response.ok) {
            const data = await response.json();

            // Redirect regardless of status - we have a valid response
            clearInterval(progressInterval);
            clearInterval(statusInterval);
            setProgress(100);
            setTimeRemaining("0m 0s");

            // Redirect to report page immediately
            console.log(
              "Got response from backend, redirecting to report page"
            );
            router.push(`/report?sessionId=${sessionId}`);

            // The code below is no longer needed as we redirect immediately
            /* 
            if (data.status === "success") {
              clearInterval(progressInterval);
              clearInterval(statusInterval);
              setProgress(100);
              setTimeRemaining("0m 0s");

              // Redirect to report page after a short delay
              setTimeout(() => {
                router.push(`/report?sessionId=${sessionId}`);
              }, 1000);
            } else if (data.status === "failed") {
              // Don't close the modal automatically on failure
              // Just update the error message and keep the animation running
              setError(
                "Analysis encountered an issue. Our system will retry automatically."
              );
            }

            // Update progress based on API response if available
            if (data.expected_finish_time && data.start_time) {
              const startTime = new Date(data.start_time).getTime();
              const expectedFinishTime = new Date(
                data.expected_finish_time
              ).getTime();
              const currentTime = new Date().getTime();
              const totalDuration = expectedFinishTime - startTime;
              const elapsedDuration = currentTime - startTime;

              if (totalDuration > 0) {
                const calculatedProgress = Math.min(
                  Math.round((elapsedDuration / totalDuration) * 100),
                  95
                );
                setProgress(calculatedProgress);

                // Calculate time remaining
                const remainingMs = Math.max(
                  0,
                  expectedFinishTime - currentTime
                );
                const remainingMinutes = Math.floor(remainingMs / 60000);
                const remainingSeconds = Math.floor(
                  (remainingMs % 60000) / 1000
                );
                setTimeRemaining(`${remainingMinutes}m ${remainingSeconds}s`);
              }
            }
            */
          }
        } catch (err) {
          console.error("Error polling job status:", err);
          // Don't close modal on polling errors, just log them
        }
      }, 3000);
    }

    return () => {
      console.log("Cleaning up progress simulation");
      clearInterval(progressInterval);
      if (statusInterval) clearInterval(statusInterval);
    };
  }, [showProcessingModal, sessionId, router]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please upload a PDF file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please upload a PDF file");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setError(null);

    // Immediately show the processing modal and start progress simulation
    setProgress(1); // Start at 1% not 0% to show immediate visual feedback
    setShowProcessingModal(true);

    // Initial time estimation (5 minutes = 300 seconds)
    const minutes = Math.floor(300 / 60);
    const seconds = 300 % 60;
    setTimeRemaining(`${minutes}m ${seconds}s`);

    // Trigger a small progress increase after a short delay to ensure animation starts
    setTimeout(() => {
      setProgress((prev) => prev + 1);
    }, 100);

    // Start background API call
    try {
      // For the demo, use the hard-coded path for the PDF
      const pdfPath =
        "uploaded_pdfs/Nathaniel - Employment Agreement - Standord.pdf";

      console.log("Attempting to fetch from backend...");

      // Call our Next.js API route in the background
      fetch("/api/analyze-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: "demo_user",
          pdf_path: pdfPath,
        }),
      })
        .then((response) => {
          console.log("Fetch response:", response);

          if (!response.ok) {
            throw new Error(
              `Failed to start document analysis: ${response.status} ${response.statusText}`
            );
          }

          return response.json();
        })
        .then((data) => {
          console.log("Response data:", data);
          // Save the session ID for status polling
          setSessionId(data.session_id);

          // Immediately redirect to report page once we have a session ID
          if (data.session_id) {
            console.log(
              "Got session ID, redirecting to report page:",
              data.session_id
            );
            // Set progress to 100% to show completion
            setProgress(100);
            // Redirect immediately to the report page
            router.push(`/report?sessionId=${data.session_id}`);
          } else {
            console.error("No session ID received from backend");
            // Nudge progress forward to ensure animation continues if no redirect
            setProgress((prev) => Math.min(prev + 2, 95));
          }
        })
        .catch((err) => {
          console.error("Error during upload:", err);
          // Don't hide the modal on error, just show the error message
          // The user can still see the animation while we retry or they cancel
          setError(
            `Failed to process your document: ${
              err.message || "Unknown error"
            }. The system will continue to attempt processing.`
          );
        });
    } catch (err: any) {
      console.error("Error preparing upload:", err);
      // Even if there's an error preparing the upload, we keep the animation running
      // as it's more user-friendly than suddenly closing the modal
      setError(
        `An issue occurred while preparing your document: ${
          err.message || "Unknown error"
        }. The system will continue to attempt processing.`
      );
    }
  };

  return (
    <DashboardLayout>
      {/* Processing Modal */}
      <ProcessingModal
        isOpen={showProcessingModal}
        onOpenChange={(open) => {
          // Only allow closing if not in progress
          if (!open && progress < 100) {
            // Show confirmation before closing
            if (
              window.confirm("Are you sure you want to cancel the analysis?")
            ) {
              setShowProcessingModal(false);
              setIsUploading(false);
            }
          } else {
            setShowProcessingModal(open);
          }
        }}
        progress={progress}
        timeRemaining={timeRemaining}
        fileName={file?.name}
      />

      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Upload Contract</CardTitle>
              <CardDescription>
                Upload an employment contract for compliance analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-sm text-center text-muted-foreground mb-2">
                  Drag and drop your PDF file here, or click to browse
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  Browse files
                </Button>
              </div>

              {file && (
                <div className="mt-4 flex items-center gap-2 p-2 border rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm truncate flex-1">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                  >
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
              <Button
                className="w-full"
                onClick={handleUpload}
                disabled={!file || isUploading}
              >
                {isUploading ? "Processing..." : "Upload & Analyze"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>
                View your recent compliance reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.length > 0 ? (
                  recentReports.map((report, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{report.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {report.date}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={report.score >= 80 ? "default" : "destructive"}
                      >
                        {report.score}%
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No reports available yet
                  </p>
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
                  <p className="text-sm text-muted-foreground">
                    5 reports remaining
                  </p>
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
                      <p className="text-sm text-muted-foreground">
                        10 reports/month
                      </p>
                    </div>
                    <p className="font-medium">$49/mo</p>
                  </div>
                </div>

                <div className="rounded-lg border p-3 bg-primary/5 border-primary/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Professional</h3>
                      <p className="text-sm text-muted-foreground">
                        50 reports/month
                      </p>
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
                      <p className="text-sm text-muted-foreground">
                        Unlimited reports
                      </p>
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
  );
}
