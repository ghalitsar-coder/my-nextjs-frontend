"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { STEP_ROUTES } from "./StepsConfig";

export type Step = {
  id: number;
  label: string;
  icon?: ReactNode;
};

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  allowNavigation?: boolean; // If true, completed steps will be clickable
}

export default function ProgressSteps({
  steps,
  currentStep,
  allowNavigation = false,
}: ProgressStepsProps) {
  return (
    <div className="flex justify-between items-center mb-12 relative">
      {/* Connecting line */}
      <div className="flex-1 h-1 bg-gray-200 absolute top-1/2 left-0 -translate-y-1/2 z-0"></div>

      {/* Connecting line progress */}
      <div
        className="h-1 bg-purple-600 absolute top-1/2 left-0 -translate-y-1/2 z-0 transition-all duration-300"
        style={{
          width: `${
            (Math.max(currentStep - 1, 0) / (steps.length - 1)) * 100
          }%`,
        }}
      ></div>

      {/* Steps */}
      {steps.map((step) => {
        // Determine if step is completed, current, or upcoming
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        const isUpcoming = step.id > currentStep;
        const isClickable = allowNavigation && isCompleted;

        // Apply classes based on step status
        const circleClasses = `
          w-8 h-8 rounded-full 
          ${
            isCompleted
              ? "bg-purple-600"
              : isCurrent
              ? step.id === 3
                ? "bg-green-500"
                : "bg-purple-600"
              : "bg-gray-200"
          } 
          ${isCompleted || isCurrent ? "text-white" : "text-gray-500"} 
          flex items-center justify-center mb-2
          ${
            isClickable
              ? "cursor-pointer hover:shadow-md transition-shadow"
              : ""
          }
        `;

        const textClasses = `
          text-sm font-medium 
          ${
            isCompleted || isCurrent
              ? step.id === 3 && isCurrent
                ? "text-green-500"
                : "text-purple-600"
              : "text-gray-500"
          }
          ${isClickable ? "cursor-pointer hover:underline" : ""}
        `;

        // Get the route for this step
        const stepRoute = STEP_ROUTES[step.id as keyof typeof STEP_ROUTES];

        const StepContent = () => (
          <>
            <div className={circleClasses}>
              {isCompleted ? (
                <i className="fas fa-check"></i>
              ) : (
                <span>{step.id}</span>
              )}
            </div>
            <span className={textClasses}>{step.label}</span>
          </>
        );

        return (
          <div
            key={step.id}
            className="flex flex-col items-center relative z-10"
          >
            {isClickable ? (
              <Link href={stepRoute}>
                <StepContent />
              </Link>
            ) : (
              <StepContent />
            )}
          </div>
        );
      })}
    </div>
  );
}
