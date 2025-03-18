"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { ProcessingAnimation } from "@/components/processing-animation";

interface JobStatus {
  session_id: string;
  status: string;
  user_name: string;
  pdf_path: string;
  start_time: string;
  expected_finish_time: string;
  message: string;
  agentops_url?: string;
  document_id?: string;
}

export default function ProcessingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Fetch job status and update progress
  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided");
      return;
    }

    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/job-status/${sessionId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch job status");
        }

        const data = await response.json();
        setJobStatus(data);

        // Calculate progress based on start and expected finish time
        const startTime = new Date(
          data.start_time || data.trigger_start_time
        ).getTime();
        const expectedFinishTime = new Date(
          data.expected_finish_time
        ).getTime();
        const currentTime = new Date().getTime();

        const totalDuration = expectedFinishTime - startTime;
        const elapsedDuration = currentTime - startTime;
        const calculatedProgress = Math.min(
          Math.round((elapsedDuration / totalDuration) * 100),
          99
        );

        // If status is "success" or "failed", set progress to 100%
        if (data.status === "success" || data.status === "failed") {
          setProgress(100);
          // If success, redirect to report page after a delay
          if (data.status === "success") {
            setTimeout(() => {
              router.push(`/report?sessionId=${sessionId}`);
            }, 1500);
          }
        } else {
          setProgress(calculatedProgress);

          // Calculate time remaining
          const remainingMs = Math.max(0, expectedFinishTime - currentTime);
          const remainingMinutes = Math.floor(remainingMs / 60000);
          const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);
          setTimeRemaining(`${remainingMinutes}m ${remainingSeconds}s`);
        }
      } catch (err) {
        setError("Error fetching job status");
        console.error(err);
      }
    };

    // Fetch status immediately and then every 3 seconds
    fetchStatus();
    const intervalId = setInterval(fetchStatus, 3000);

    return () => clearInterval(intervalId);
  }, [sessionId, router]);

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-6">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>
                There was an error processing your document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 p-6 space-y-6">
        <h1 className="text-3xl font-bold">Processing Document</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Analysis Status</span>
              <Badge variant={getStatusVariant(jobStatus?.status)}>
                {jobStatus?.status || "Initializing..."}
              </Badge>
            </CardTitle>
            <CardDescription>
              {jobStatus?.pdf_path
                ? `Analyzing ${jobStatus.pdf_path.split("/").pop()}`
                : "Preparing document analysis"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Processing Animation Component */}
            {(jobStatus?.status === "running" || !jobStatus?.status) && (
              <ProcessingAnimation />
            )}

            <div className="flex flex-col gap-4 p-4 rounded-lg border bg-muted/40">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <div>
                  <p className="font-medium">
                    {getStatusMessage(jobStatus?.status)}
                  </p>
                  {timeRemaining &&
                    jobStatus?.status !== "success" &&
                    jobStatus?.status !== "failed" && (
                      <p className="text-sm text-muted-foreground">
                        Estimated time remaining: {timeRemaining}
                      </p>
                    )}
                </div>
              </div>

              {jobStatus?.message && (
                <p className="text-sm mt-2">{jobStatus.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function getStatusVariant(
  status: string | undefined
): "default" | "secondary" | "destructive" {
  if (!status) return "secondary";

  switch (status) {
    case "success":
      return "default";
    case "failed":
      return "destructive";
    default:
      return "secondary";
  }
}

function getStatusMessage(status: string | undefined): string {
  if (!status) return "Initializing document analysis...";

  switch (status) {
    case "queued":
      return "Your document is in queue for analysis";
    case "running":
      return "AI is analyzing your document";
    case "success":
      return "Analysis completed! Redirecting to report...";
    case "failed":
      return "Analysis failed";
    default:
      return "Processing your document";
  }
}
