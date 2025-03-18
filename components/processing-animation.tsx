"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Server,
  Book,
  Gavel,
  Scale,
  FileText,
  Brain,
  FileCheck,
} from "lucide-react";

interface ProcessingStep {
  id: number;
  message: string;
  icon: React.ElementType;
  duration: number; // in milliseconds
}

export function ProcessingAnimation() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [animationLoops, setAnimationLoops] = useState(0);

  const processingSteps: ProcessingStep[] = [
    {
      id: 1,
      message: "Initializing document analysis...",
      icon: Server,
      duration: 2000,
    },
    {
      id: 2,
      message: "Converting document to processable format",
      icon: FileText,
      duration: 3000,
    },
    {
      id: 3,
      message: "Activating legal analysis agents",
      icon: Brain,
      duration: 3000,
    },
    {
      id: 4,
      message: "Retrieving relevant supreme court judgements",
      icon: Gavel,
      duration: 4000,
    },
    {
      id: 5,
      message: "Retrieving judgements from appellate courts",
      icon: Scale,
      duration: 3500,
    },
    {
      id: 6,
      message: "Analyzing Sri Lankan employment laws",
      icon: Book,
      duration: 4000,
    },
    {
      id: 7,
      message: "Cross-referencing with industry standards",
      icon: FileText,
      duration: 3000,
    },
    {
      id: 8,
      message: "Validating compliance findings",
      icon: CheckCircle2,
      duration: 4000,
    },
    {
      id: 9,
      message: "Generating comprehensive compliance report",
      icon: FileCheck,
      duration: 3500,
    },
  ];

  // Total animation time should be around 30 seconds
  // This will allow for multiple loops during the 2-minute wait

  useEffect(() => {
    if (currentStepIndex >= processingSteps.length) {
      // Animation completed, restart if still on the processing page
      setTimeout(() => {
        setCompletedSteps([]);
        setCurrentStepIndex(0);
        setAnimationLoops((prev) => prev + 1);
      }, 2000); // Wait 2 seconds before restarting
      return;
    }

    const timer = setTimeout(() => {
      setCompletedSteps((prev) => [
        ...prev,
        processingSteps[currentStepIndex].id,
      ]);
      setCurrentStepIndex((prev) => prev + 1);
    }, processingSteps[currentStepIndex].duration);

    return () => clearTimeout(timer);
  }, [currentStepIndex, processingSteps]);

  // Display different messages after multiple animation loops
  const getAnimationHeader = () => {
    if (animationLoops === 0) {
      return "Analysis in Progress";
    } else if (animationLoops === 1) {
      return "Performing Deep Analysis";
    } else {
      return "Finalizing Analysis";
    }
  };

  return (
    <div className="space-y-6 mb-6">
      <h3 className="text-lg font-medium">{getAnimationHeader()}</h3>
      <div className="space-y-4">
        {processingSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStepIndex;
          const isCompleted = completedSteps.includes(step.id);

          return (
            <div
              key={`${step.id}-${animationLoops}`}
              className={`flex items-center gap-3 p-3 rounded-md transition-all duration-300 ${
                isActive
                  ? "bg-primary/10 border border-primary/20"
                  : isCompleted
                  ? "bg-green-500/10 border border-green-500/20"
                  : "opacity-50"
              }`}
            >
              <div className="flex-shrink-0">
                {isActive ? (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                ) : isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Icon className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-grow">
                <p
                  className={`text-sm ${
                    isActive
                      ? "text-primary font-medium"
                      : isCompleted
                      ? "text-green-600"
                      : ""
                  }`}
                >
                  {step.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
