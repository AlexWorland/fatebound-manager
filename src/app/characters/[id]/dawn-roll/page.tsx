"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import WizardShell, { type WizardStepId } from "@/components/dawn-roll/WizardShell";
import DawnRollStep from "@/components/dawn-roll/DawnRollStep";
import FormResolution, { type FormResolutionResult } from "@/components/dawn-roll/FormResolution";
import FateAttunement, { type FateAttunementResult } from "@/components/dawn-roll/FateAttunement";
import MemoryAllocation, { type MemoryAllocationResult } from "@/components/dawn-roll/MemoryAllocation";
import DualNatureStep, { type DualNatureResult } from "@/components/dawn-roll/DualNatureStep";
import SummaryStep from "@/components/dawn-roll/SummaryStep";
import SpellSelectionStep, { type SpellSelectionResult } from "@/components/dawn-roll/SpellSelectionStep";
import { dawnRollUsesStabilized } from "@/engine/dawn-roll";
import { STABILIZED_FORMS } from "@/data/tables/stabilized-forms";
import { TABLE_B_PRIMARY } from "@/data/tables/table-b-primary";
import type { Character, DailyState, AbilityScores } from "@/types/character";
import type { DawnRollOutcome } from "@/types/dice";
import type { RetainableFeature } from "@/types/features";
import type { AbilityScore } from "@/types/forms";

interface DawnRollStepData {
  die1: number;
  die2?: number;
  chosen: number;
  outcome: DawnRollOutcome;
  dmDesignText?: string;
}

function buildActiveSteps(params: {
  level: number;
  useDualNature: boolean;
  hasSpellcasting: boolean;
}): WizardStepId[] {
  const steps: WizardStepId[] = ["roll", "form", "attunement"];
  if (params.hasSpellcasting) {
    steps.push("spells");
  }
  if (params.level >= 2) {
    steps.push("memory");
  }
  if (params.useDualNature) {
    steps.push("dual-nature");
  }
  steps.push("summary");
  return steps;
}

export default function DawnRollPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.id as string;

  const [character, setCharacter] = useState<Character | null>(null);
  const [yesterdaysFeatures, setYesterdaysFeatures] = useState<RetainableFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wizard state
  const [currentStep, setCurrentStep] = useState<WizardStepId>("roll");
  const [dawnRollData, setDawnRollData] = useState<DawnRollStepData | null>(null);
  const [formResolution, setFormResolution] = useState<FormResolutionResult | null>(null);
  const [attunement, setAttunement] = useState<FateAttunementResult | null>(null);
  const [spellSelection, setSpellSelection] = useState<SpellSelectionResult | null>(null);
  const [memoryAllocation, setMemoryAllocation] = useState<MemoryAllocationResult | null>(null);
  const [dualNature, setDualNature] = useState<DualNatureResult | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/characters/${characterId}`).then((r) => {
        if (!r.ok) throw new Error("Character not found");
        return r.json().then((data: { character: Character; dailyState: unknown }) => data.character);
      }),
      fetch(`/api/characters/${characterId}/history`).then((r) => {
        if (!r.ok) return [];
        return r.json() as Promise<RetainableFeature[]>;
      }),
    ])
      .then(([char, features]) => {
        setCharacter(char);
        setYesterdaysFeatures(Array.isArray(features) ? features : []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load character");
        setLoading(false);
      });
  }, [characterId]);

  const useDualNature = memoryAllocation?.useDualNature ?? false;

  // Compute hasSpellcasting from the resolved form
  const hasSpellcasting = (() => {
    if (!formResolution) return false;
    if (formResolution.stabilizedFormId) {
      const form = STABILIZED_FORMS.find((f) => f.id === formResolution.stabilizedFormId);
      return form?.hasSpellcasting ?? false;
    }
    if (formResolution.chaosRolls) {
      const feature = TABLE_B_PRIMARY.find((f) => f.id === formResolution.chaosRolls?.tableB);
      return feature?.hasSpellcasting ?? false;
    }
    return false;
  })();

  // Get the form's class name for spell list lookup
  const formClassName = (() => {
    if (formResolution?.stabilizedFormId) {
      const form = STABILIZED_FORMS.find((f) => f.id === formResolution.stabilizedFormId);
      return form?.className ?? "";
    }
    if (formResolution?.chaosRolls) {
      const feature = TABLE_B_PRIMARY.find((f) => f.id === formResolution.chaosRolls?.tableB);
      return feature?.className ?? "";
    }
    return "";
  })();

  // Compute ability scores after any attunement swap
  function getSwappedScores(): AbilityScores {
    if (!character) return {} as AbilityScores;
    const base = { ...character.abilityScores };
    if (attunement?.swap) {
      const { score1, score2 } = attunement.swap as { score1: AbilityScore; score2: AbilityScore };
      const temp = base[score1];
      base[score1] = base[score2];
      base[score2] = temp;
    }
    return base;
  }

  const activeSteps = character
    ? buildActiveSteps({ level: character.level, useDualNature, hasSpellcasting })
    : ["roll", "form", "attunement", "summary"] as WizardStepId[];

  const currentIndex = activeSteps.indexOf(currentStep);

  function advanceStep() {
    const next = activeSteps[currentIndex + 1];
    if (next) setCurrentStep(next);
  }

  function retreatStep() {
    const prev = activeSteps[currentIndex - 1];
    if (prev) setCurrentStep(prev);
  }

  // Rebuild active steps when dual nature toggles so we add/remove the step
  useEffect(() => {
    if (currentStep === "dual-nature" && !useDualNature) {
      setCurrentStep("summary");
    }
  }, [useDualNature, currentStep]);

  const canGoBack = currentIndex > 0;
  // Next is enabled based on whether the current step data exists
  const canGoNext = (() => {
    switch (currentStep) {
      case "roll": return dawnRollData !== null;
      case "form": return formResolution !== null;
      case "attunement": return attunement !== null;
      case "spells": return spellSelection !== null || !hasSpellcasting;
      case "memory": return memoryAllocation !== null;
      case "dual-nature": return dualNature !== null;
      case "summary": return false; // Summary uses its own confirm button
      default: return false;
    }
  })();

  const handleConfirmDawnRoll = useCallback(async () => {
    if (!character || !dawnRollData) return;

    const isStabilized = dawnRollUsesStabilized(dawnRollData.outcome);

    const body: Record<string, unknown> = {
      forcedRoll: dawnRollData.chosen,
      abilitySwap: attunement?.swap ?? null,
      residualMemory: memoryAllocation?.retainedFeatures ?? [],
    };

    if (isStabilized && formResolution?.stabilizedFormId) {
      body.chosenFormId = formResolution.stabilizedFormId;
    } else if (!isStabilized && formResolution?.chaosRolls) {
      body.chaosRolls = formResolution.chaosRolls;
    }

    if (dualNature) {
      body.secondaryFormId = dualNature.secondaryFormId;
      body.secondaryFormFeatures = dualNature.selectedFeatures;
    }

    if (spellSelection) {
      body.preparedSpells = spellSelection.preparedSpells;
      body.knownCantrips = spellSelection.knownCantrips;
      body.spellcastingProfile = spellSelection.spellcastingProfile;
    }

    const res = await fetch(`/api/characters/${characterId}/dawn-roll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error((data as { error?: string }).error ?? "Failed to save dawn roll");
    }

    router.push(`/characters/${characterId}`);
  }, [character, dawnRollData, formResolution, attunement, spellSelection, memoryAllocation, dualNature, characterId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center">
        <p className="text-text-secondary font-body">Loading...</p>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center">
        <p className="text-accent font-body">{error ?? "Character not found"}</p>
      </div>
    );
  }

  function renderStep() {
    switch (currentStep) {
      case "roll":
        return (
          <DawnRollStep
            level={character!.level}
            onComplete={(data) => {
              setDawnRollData(data);
              // Reset downstream steps if re-rolling
              setFormResolution(null);
              setAttunement(null);
              setSpellSelection(null);
              setMemoryAllocation(null);
              setDualNature(null);
              advanceStep();
            }}
          />
        );

      case "form":
        return dawnRollData ? (
          <FormResolution
            outcome={dawnRollData.outcome}
            level={character!.level}
            onComplete={(result) => {
              setFormResolution(result);
              advanceStep();
            }}
          />
        ) : null;

      case "attunement":
        return (
          <FateAttunement
            abilityScores={character!.abilityScores}
            onComplete={(result) => {
              setAttunement(result);
              advanceStep();
            }}
          />
        );

      case "spells":
        return hasSpellcasting && formResolution ? (
          <SpellSelectionStep
            character={character!}
            formClassName={formClassName}
            level={character!.level}
            abilityScores={getSwappedScores()}
            isChaosForm={!dawnRollUsesStabilized(dawnRollData!.outcome)}
            onComplete={(result) => {
              setSpellSelection(result);
              advanceStep();
            }}
          />
        ) : null;

      case "memory":
        return character!.level >= 2 ? (
          <MemoryAllocation
            level={character!.level}
            yesterdaysFeatures={yesterdaysFeatures}
            onComplete={(result) => {
              setMemoryAllocation(result);
              advanceStep();
            }}
          />
        ) : null;

      case "dual-nature":
        return dawnRollData ? (
          <DualNatureStep
            level={character!.level}
            primaryOutcome={dawnRollData.outcome}
            primaryFormId={formResolution?.stabilizedFormId ?? null}
            onComplete={(result) => {
              setDualNature(result);
              advanceStep();
            }}
          />
        ) : null;

      case "summary":
        return dawnRollData ? (
          <SummaryStep
            characterId={characterId}
            characterName={character!.name}
            level={character!.level}
            abilityScores={character!.abilityScores}
            dawnRoll={dawnRollData}
            formResolution={formResolution}
            attunement={attunement}
            memoryAllocation={memoryAllocation}
            dualNature={dualNature}
            onConfirm={handleConfirmDawnRoll}
          />
        ) : null;

      default:
        return null;
    }
  }

  const isLastStep = currentIndex === activeSteps.length - 1;

  return (
    <WizardShell
      activeSteps={activeSteps}
      currentStep={currentStep}
      canGoBack={canGoBack}
      canGoNext={canGoNext && !isLastStep}
      onBack={retreatStep}
      onNext={advanceStep}
      nextLabel={isLastStep ? "Summary" : "Next"}
    >
      {renderStep()}
    </WizardShell>
  );
}
