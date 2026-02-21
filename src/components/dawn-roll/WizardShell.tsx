"use client";

import React from "react";

export type WizardStepId =
  | "roll"
  | "form"
  | "attunement"
  | "spells"
  | "memory"
  | "dual-nature"
  | "summary";

interface StepConfig {
  id: WizardStepId;
  label: string;
}

const ALL_STEPS: StepConfig[] = [
  { id: "roll", label: "Roll" },
  { id: "form", label: "Form" },
  { id: "attunement", label: "Attunement" },
  { id: "spells", label: "Spells" },
  { id: "memory", label: "Memory" },
  { id: "dual-nature", label: "Dual Nature" },
  { id: "summary", label: "Summary" },
];

interface WizardShellProps {
  activeSteps: WizardStepId[];
  currentStep: WizardStepId;
  children: React.ReactNode;
  canGoBack: boolean;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
}

export default function WizardShell({
  activeSteps,
  currentStep,
  children,
  canGoBack,
  canGoNext,
  onBack,
  onNext,
  nextLabel = "Next",
}: WizardShellProps) {
  const visibleSteps = ALL_STEPS.filter((s) => activeSteps.includes(s.id));
  const currentIndex = visibleSteps.findIndex((s) => s.id === currentStep);

  return (
    <div className="min-h-screen bg-bg-deep flex flex-col">
      {/* Step indicator bar */}
      <div className="bg-bg-surface border-b border-border-subtle px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            {visibleSteps.map((step, idx) => {
              const isComplete = idx < currentIndex;
              const isCurrent = step.id === currentStep;
              const isUpcoming = idx > currentIndex;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-heading
                        transition-all duration-300
                        ${isComplete ? "bg-fate text-white" : ""}
                        ${isCurrent ? "bg-accent text-white ring-2 ring-accent ring-offset-2 ring-offset-bg-surface" : ""}
                        ${isUpcoming ? "bg-bg-elevated border border-border-subtle text-text-secondary" : ""}
                      `}
                    >
                      {isComplete ? "✓" : idx + 1}
                    </div>
                    <span
                      className={`text-xs font-body hidden sm:block
                        ${isCurrent ? "text-text-primary" : "text-text-secondary"}
                      `}
                    >
                      {step.label}
                    </span>
                  </div>

                  {idx < visibleSteps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 transition-all duration-300
                        ${idx < currentIndex ? "bg-fate" : "bg-border-subtle"}
                      `}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">{children}</div>
      </div>

      {/* Navigation */}
      <div className="bg-bg-surface border-t border-border-subtle px-4 py-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <button
            onClick={onBack}
            disabled={!canGoBack}
            className={`
              px-6 py-2 rounded-lg font-body font-medium transition-all duration-150
              ${
                canGoBack
                  ? "bg-bg-elevated text-text-primary hover:bg-bg-hover border border-border-subtle"
                  : "opacity-0 pointer-events-none"
              }
            `}
          >
            Back
          </button>

          <span className="text-sm text-text-secondary font-body">
            Step {currentIndex + 1} of {visibleSteps.length}
          </span>

          <button
            onClick={onNext}
            disabled={!canGoNext}
            className={`
              px-6 py-2 rounded-lg font-body font-medium transition-all duration-150
              ${
                canGoNext
                  ? "bg-accent text-white hover:bg-accent-hover"
                  : "bg-bg-elevated text-text-secondary border border-border-subtle cursor-not-allowed opacity-50"
              }
            `}
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
