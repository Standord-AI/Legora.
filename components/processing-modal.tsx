"use client";

import { useEffect } from "react";
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
  // Prevent closing the modal by clicking outside or pressing escape
  useEffect(() => {
    if (isOpen) {
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
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />

            {timeRemaining && (
              <p className="text-xs text-muted-foreground mt-1 text-right">
                Estimated time remaining: {timeRemaining}
              </p>
            )}
          </div>

          <ProcessingAnimation />

          <div className="bg-muted p-3 rounded-md text-sm">
            <p>
              Please keep this window open while we analyze your document. This
              process typically takes about 2 minutes.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
