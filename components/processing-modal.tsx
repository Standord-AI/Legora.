"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ProcessingAnimation } from "./processing-animation";

interface ProcessingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  progress: number;
  timeRemaining?: string;
  fileName?: string;
}

export function ProcessingModal({
  isOpen,
  onOpenChange,
  progress,
  timeRemaining,
  fileName,
}: ProcessingModalProps) {
  // Always render the animation when modal is open
  // No need for extra state here - simplify the logic

  // Prevent closing the modal by clicking outside or pressing escape
  useEffect(() => {
    if (isOpen) {
      console.log("ProcessingModal is open");

      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue =
          "Your document is still being processed. Are you sure you want to leave?";
        return e.returnValue;
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [isOpen]);

  // Ensure progress is always at least 1 to show some movement
  const displayProgress = progress < 1 ? 1 : progress;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showClose={false}>
        <DialogHeader>
          <DialogTitle>Analyzing Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            {fileName && (
              <p className="text-sm text-muted-foreground mb-4">
                Analyzing {fileName}
              </p>
            )}

            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{displayProgress.toFixed(1)}%</span>
            </div>
            <Progress value={displayProgress} className="h-2" />

            {timeRemaining && (
              <p className="text-xs text-muted-foreground mt-1 text-right">
                Estimated time remaining: {timeRemaining}
              </p>
            )}
          </div>

          {/* Always render the animation when modal is open */}
          {isOpen && <ProcessingAnimation />}

          <div className="bg-muted p-3 rounded-md text-sm">
            <p>
              Please keep this window open while we analyze your document. This
              process typically takes about 5 minutes for a comprehensive legal
              analysis.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
