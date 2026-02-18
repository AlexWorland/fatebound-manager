"use client";

import React, { useState } from "react";
import DiceRoller from "@/components/ui/DiceRoller";
import Card from "@/components/ui/Card";
import { STABILIZED_FORMS } from "@/data/tables/stabilized-forms";
import type { DawnRollOutcome } from "@/types/dice";

export interface DualNatureResult {
  secondaryFormId: number;
  selectedFeatures: string[];
}

interface DualNatureStepProps {
  level: number;
  primaryOutcome: DawnRollOutcome;
  primaryFormId: number | null;
  onComplete: (result: DualNatureResult) => void;
}

export default function DualNatureStep({
  level,
  primaryOutcome,
  primaryFormId,
  onComplete,
}: DualNatureStepProps) {
  const [secondaryFormRoll, setSecondaryFormRoll] = useState<number | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const isStabilized =
    primaryOutcome === "GUIDED" ||
    primaryOutcome === "FAVORED" ||
    primaryOutcome === "MASTER";

  const secondaryForm =
    secondaryFormRoll !== null ? STABILIZED_FORMS[secondaryFormRoll - 1] : null;

  const primaryForm = primaryFormId
    ? STABILIZED_FORMS.find((f) => f.id === primaryFormId) ?? null
    : null;

  // At level 17+, player picks 2 features from secondary form; otherwise 1
  const featurePickCount = level >= 17 ? 2 : 1;

  function handleRoll(roll: number) {
    setSecondaryFormRoll(roll);
    setSelectedFeatures([]);
  }

  function toggleFeature(featureName: string) {
    setSelectedFeatures((prev) => {
      if (prev.includes(featureName)) {
        return prev.filter((f) => f !== featureName);
      }
      if (prev.length >= featurePickCount) {
        // Replace last selection
        return [...prev.slice(0, featurePickCount - 1), featureName];
      }
      return [...prev, featureName];
    });
  }

  function handleConfirm() {
    if (!secondaryForm || selectedFeatures.length === 0) return;
    onComplete({
      secondaryFormId: secondaryForm.id,
      selectedFeatures,
    });
  }

  const canConfirm =
    secondaryForm !== null && selectedFeatures.length === featurePickCount;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-heading text-text-primary">Dual Nature</h2>
        <p className="text-sm text-text-secondary font-body">
          You manifest a second form alongside your primary.{" "}
          {isStabilized
            ? "Your secondary form is also Stabilized."
            : "Your secondary form is rolled randomly."}
        </p>
      </div>

      {/* Side-by-side form display */}
      <div className="grid grid-cols-2 gap-3">
        <Card variant="fate">
          <p className="text-xs text-text-secondary font-body uppercase tracking-widest mb-1">Primary</p>
          {primaryForm ? (
            <>
              <p className="font-heading text-text-primary">{primaryForm.name}</p>
              <p className="text-xs text-text-secondary font-body">{primaryForm.className}</p>
            </>
          ) : (
            <p className="text-sm text-text-secondary font-body">Chaos Form</p>
          )}
        </Card>

        <Card variant={secondaryForm ? "fate" : "default"}>
          <p className="text-xs text-text-secondary font-body uppercase tracking-widest mb-1">Secondary</p>
          {secondaryForm ? (
            <>
              <p className="font-heading text-text-primary">{secondaryForm.name}</p>
              <p className="text-xs text-text-secondary font-body">{secondaryForm.className}</p>
            </>
          ) : (
            <p className="text-sm text-text-secondary font-body">Rolling...</p>
          )}
        </Card>
      </div>

      {/* Roll for secondary form */}
      {secondaryFormRoll === null && (
        <div className="flex flex-col items-center gap-2">
          <DiceRoller
            sides={12}
            onRollComplete={handleRoll}
            label="Secondary Form"
          />
          <p className="text-xs text-text-secondary font-body">Roll d12 for secondary form</p>
        </div>
      )}

      {/* Feature selection */}
      {secondaryForm && (
        <div className="space-y-3">
          <p className="text-sm font-body text-text-secondary text-center">
            Choose {featurePickCount} feature{featurePickCount > 1 ? "s" : ""} from{" "}
            <span className="text-fate-glow">{secondaryForm.name}</span>
          </p>
          <div className="space-y-2">
            {secondaryForm.baseFeatures.map((feature) => {
              const isSelected = selectedFeatures.includes(feature.name);
              const isDisabled = !isSelected && selectedFeatures.length >= featurePickCount;

              return (
                <button
                  key={feature.name}
                  onClick={() => toggleFeature(feature.name)}
                  disabled={isDisabled}
                  className={`
                    w-full text-left rounded-lg border p-3 transition-all duration-150
                    ${isSelected
                      ? "border-fate bg-fate/10"
                      : isDisabled
                      ? "border-border-subtle bg-bg-elevated opacity-40 cursor-not-allowed"
                      : "border-border-subtle bg-bg-elevated hover:border-fate/50"
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-sm text-text-primary">{feature.name}</p>
                      <p className="text-xs text-text-secondary font-body mt-0.5 line-clamp-2">
                        {feature.description}
                      </p>
                    </div>
                    <div className={`
                      w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center mt-0.5
                      ${isSelected ? "border-fate bg-fate text-white" : "border-border-subtle"}
                    `}>
                      {isSelected && <span className="text-xs font-bold">✓</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirm */}
      {canConfirm && (
        <div className="flex justify-center">
          <button
            onClick={handleConfirm}
            className="px-8 py-2.5 rounded-lg bg-fate text-white font-body font-medium hover:bg-fate/80 transition-all"
          >
            Confirm Dual Nature
          </button>
        </div>
      )}
    </div>
  );
}
