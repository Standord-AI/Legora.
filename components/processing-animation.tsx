"use client";

import { useEffect, useState, useRef } from "react";
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
  BarChart,
  Search,
  AlertCircle,
} from "lucide-react";

interface ProcessingStep {
  id: number;
  message: string;
  icon: React.ElementType;
  duration: number; // in milliseconds
  isParallel?: boolean;
  parallelWith?: number;
}

export function ProcessingAnimation() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeSteps, setActiveSteps] = useState<number[]>([]);
  const [animationLoops, setAnimationLoops] = useState(0);
  const animationMounted = useRef(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear all timers on unmount
  useEffect(() => {
    console.log("ProcessingAnimation mounting");

    return () => {
      console.log("ProcessingAnimation unmounting, clearing timers");
      timersRef.current.forEach(clearTimeout);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Define steps with appropriate durations
  const processingSteps: ProcessingStep[] = [
    {
      id: 1,
      message: "Initializing document analysis...",
      icon: Server,
      duration: 3000,
    },
    {
      id: 2,
      message: "Converting document to processable format",
      icon: FileText,
      duration: 5000,
    },
    {
      id: 3,
      message: "Activating legal analysis agents",
      icon: Brain,
      duration: 15000,
    },
    {
      id: 4,
      message: "Retrieving relevant supreme court judgements",
      icon: Gavel,
      duration: 18000,
      isParallel: true,
      parallelWith: 5,
    },
    {
      id: 5,
      message: "Retrieving judgements from appellate courts",
      icon: Scale,
      duration: 20000,
      isParallel: true,
      parallelWith: 4,
    },
    {
      id: 6,
      message: "Analyzing Sri Lankan employment laws",
      icon: Book,
      duration: 25000,
    },
    {
      id: 7,
      message: "Extracting key contract terms and clauses",
      icon: Search,
      duration: 22000,
    },
    {
      id: 8,
      message: "Cross-referencing with industry standards",
      icon: BarChart,
      duration: 20000,
    },
    {
      id: 9,
      message: "Identifying potential compliance issues",
      icon: AlertCircle,
      duration: 25000,
    },
    {
      id: 10,
      message: "Validating compliance findings",
      icon: CheckCircle2,
      duration: 28000,
    },
    {
      id: 11,
      message: "Generating comprehensive compliance report",
      icon: FileCheck,
      duration: 15000,
    },
  ];

  // Start the animation as soon as the component mounts
  useEffect(() => {
    console.log("Animation mounting effect running");
    // Force animation to start even if it was previously started
    animationMounted.current = false;

    // Start the animation with a small delay to ensure DOM is ready
    const startTimer = setTimeout(() => {
      console.log("Starting animation sequence");
      if (!animationMounted.current) {
        animationMounted.current = true;
        runSequentialAnimation();
      }
    }, 100);

    return () => clearTimeout(startTimer);
  }, []);

  // Simple animation sequence with fewer state updates
  const runSequentialAnimation = () => {
    console.log("Running sequential animation");

    // Clear any existing timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    // Reset states immediately
    setCompletedSteps([]);
    setActiveSteps([]);

    let cumulativeTime = 0;
    const parallelGroups: Record<number, number[]> = {};

    // Group parallel steps
    processingSteps.forEach((step) => {
      if (step.isParallel && step.parallelWith) {
        if (!parallelGroups[step.id]) {
          parallelGroups[step.id] = [step.id];
        }
        if (!parallelGroups[step.parallelWith]) {
          parallelGroups[step.parallelWith] = [step.parallelWith];
        }

        // Merge the groups
        parallelGroups[step.id].push(step.parallelWith);
        parallelGroups[step.parallelWith].push(step.id);
      }
    });

    // First step starts immediately
    setTimeout(() => {
      console.log("Activating first step");
      setActiveSteps([1]);
    }, 0);

    // Set up the sequential animation with reduced complexity
    processingSteps.forEach((step, index) => {
      // Skip the first step as we already started it
      if (step.id === 1) {
        // Just set up its completion
        const completeFirstStep = setTimeout(() => {
          console.log("Completing first step");
          setCompletedSteps([1]);
          setActiveSteps((prev) => {
            const newActive = prev.filter((id) => id !== 1);
            // If parallel, add both step 2 and its parallel
            if (
              processingSteps[1].isParallel &&
              processingSteps[1].parallelWith
            ) {
              return [...newActive, 2, processingSteps[1].parallelWith];
            }
            // Otherwise just add step 2
            return [...newActive, 2];
          });
        }, step.duration);

        timersRef.current.push(completeFirstStep);
        cumulativeTime = step.duration;
        return;
      }

      // For all other steps
      const completionTime = cumulativeTime + step.duration;

      // Complete this step and activate next one
      const stepTimer = setTimeout(() => {
        console.log(
          `Processing step ${step.id}, cumulativeTime: ${cumulativeTime}`
        );

        // Mark current as complete
        setCompletedSteps((prev) => [...prev, step.id]);

        // Remove from active steps
        setActiveSteps((prev) => {
          const newActive = prev.filter((id) => id !== step.id);

          // If there's a next step to activate
          if (index < processingSteps.length - 1) {
            const nextStep = processingSteps[index + 1];

            // If next step is parallel, add both
            if (nextStep.isParallel && nextStep.parallelWith) {
              return [...newActive, nextStep.id, nextStep.parallelWith];
            }

            // Otherwise just add the next step
            return [...newActive, nextStep.id];
          }

          return newActive;
        });
      }, completionTime);

      timersRef.current.push(stepTimer);

      // For non-parallel steps or the first step of a parallel group
      if (
        !step.isParallel ||
        (step.isParallel && step.id < step.parallelWith!)
      ) {
        cumulativeTime = completionTime;
      }
    });

    // Reset and restart the animation after all steps are done
    const finalTimer = setTimeout(() => {
      console.log("Animation complete, restarting");
      setAnimationLoops((prev) => prev + 1);
      runSequentialAnimation();
    }, cumulativeTime + 3000); // 3s pause at the end

    timersRef.current.push(finalTimer);
  };

  // Simplified scrolling
  useEffect(() => {
    if (activeSteps.length === 0) return;

    const container = document.getElementById("processing-steps-container");
    if (!container) return;

    // Find the first active step
    const activeStepId = activeSteps[0];
    const activeElement = document.getElementById(`step-${activeStepId}`);

    if (activeElement) {
      // Simple scroll into view
      activeElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeSteps]);

  // Header changes based on animation loops
  const getAnimationHeader = () => {
    if (animationLoops === 0) {
      return "Analysis in Progress";
    } else if (animationLoops === 1) {
      return "Performing Deep Legal Analysis";
    } else {
      return "Finalizing Compliance Evaluation";
    }
  };

  console.log(
    "Rendering with activeSteps:",
    activeSteps,
    "completedSteps:",
    completedSteps
  );

  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-lg font-medium">{getAnimationHeader()}</h3>
      <div
        id="processing-steps-container"
        className="space-y-3 max-h-[300px] overflow-y-auto pr-2"
        style={{ scrollBehavior: "smooth" }}
      >
        {processingSteps.map((step) => {
          const Icon = step.icon;
          const isActive = activeSteps.includes(step.id);
          const isCompleted = completedSteps.includes(step.id);

          return (
            <div
              id={`step-${step.id}`}
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
