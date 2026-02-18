"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import { STABILIZED_FORMS } from "@/data/tables/stabilized-forms";
import { TABLE_A_CHASSIS } from "@/data/tables/table-a-chassis";
import { TABLE_B_PRIMARY } from "@/data/tables/table-b-primary";
import { TABLE_C_DEFENSIVE } from "@/data/tables/table-c-defensive";
import { TABLE_D_FEATS } from "@/data/tables/table-d-feats";
import type { DawnRollOutcome } from "@/types/dice";
import type { AbilityScores } from "@/types/character";
import type { AbilityScore } from "@/types/forms";
import type { MemorySlot } from "@/types/features";
import type { FormResolutionResult } from "./FormResolution";
import type { FateAttunementResult } from "./FateAttunement";
import type { MemoryAllocationResult } from "./MemoryAllocation";
import type { DualNatureResult } from "./DualNatureStep";

const ABILITY_SCORES: AbilityScore[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

const OUTCOME_LABELS: Record<DawnRollOutcome, string> = {
  DM_DESIGN: "DM's Design",
  DEEP_CHAOS: "Deep Chaos",
  UNSTABLE: "Unstable",
  GUIDED: "Guided",
  FAVORED: "Favored",
  MASTER: "Master",
};

const OUTCOME_COLORS: Record<DawnRollOutcome, string> = {
  DM_DESIGN: "bg-bg-elevated text-text-secondary border border-border-subtle",
  DEEP_CHAOS: "bg-accent text-white",
  UNSTABLE: "bg-orange-600 text-white",
  GUIDED: "bg-fate text-white",
  FAVORED: "bg-fate text-fate-glow font-bold",
  MASTER: "bg-yellow-500 text-black font-bold",
};

function getModifier(score: number): string {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

interface SummaryStepProps {
  characterId: string;
  characterName: string;
  level: number;
  abilityScores: AbilityScores;
  dawnRoll: { die1: number; die2?: number; chosen: number; outcome: DawnRollOutcome };
  formResolution: FormResolutionResult | null;
  attunement: FateAttunementResult | null;
  memoryAllocation: MemoryAllocationResult | null;
  dualNature: DualNatureResult | null;
  onConfirm: () => Promise<void>;
}

export default function SummaryStep({
  characterId,
  characterName,
  level,
  abilityScores,
  dawnRoll,
  formResolution,
  attunement,
  memoryAllocation,
  dualNature,
  onConfirm,
}: SummaryStepProps) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compute post-swap ability scores
  const finalScores: AbilityScores = { ...abilityScores };
  if (attunement?.swap) {
    const { score1, score2 } = attunement.swap;
    finalScores[score1] = abilityScores[score2];
    finalScores[score2] = abilityScores[score1];
  }

  // Resolve form display
  const stabilizedForm =
    formResolution?.type === "stabilized" && formResolution.stabilizedFormId
      ? STABILIZED_FORMS.find((f) => f.id === formResolution.stabilizedFormId) ?? null
      : null;

  const chaosForm =
    formResolution?.type === "chaos" && formResolution.chaosRolls
      ? {
          chassis: formResolution.chaosRolls.tableA > 0
            ? TABLE_A_CHASSIS[formResolution.chaosRolls.tableA - 1]
            : null,
          primary: formResolution.chaosRolls.tableB > 0
            ? TABLE_B_PRIMARY[formResolution.chaosRolls.tableB - 1]
            : null,
          defensive: formResolution.chaosRolls.tableC > 0
            ? TABLE_C_DEFENSIVE[formResolution.chaosRolls.tableC - 1]
            : null,
          feats: (formResolution.chaosRolls.tableD ?? []).map(
            (id) => TABLE_D_FEATS[id - 1]
          ).filter(Boolean),
        }
      : null;

  const dualNatureForm = dualNature
    ? STABILIZED_FORMS.find((f) => f.id === dualNature.secondaryFormId) ?? null
    : null;

  async function handleConfirm() {
    setConfirming(true);
    setError(null);
    try {
      await onConfirm();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to confirm dawn roll");
      setConfirming(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-heading text-text-primary">Summary</h2>
        <p className="text-sm text-text-secondary font-body">
          Review your Dawn Roll results for today.
        </p>
      </div>

      {/* Dawn Roll result */}
      <Card>
        <p className="text-xs text-text-secondary font-body uppercase tracking-widest mb-2">Dawn Roll</p>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-3xl font-heading font-bold text-text-primary">{dawnRoll.chosen}</span>
          {dawnRoll.die2 !== undefined && (
            <span className="text-sm text-text-secondary font-body">
              (rolled {dawnRoll.die1} and {dawnRoll.die2})
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-body ${OUTCOME_COLORS[dawnRoll.outcome]}`}>
            {OUTCOME_LABELS[dawnRoll.outcome]}
          </span>
        </div>
      </Card>

      {/* Form */}
      {stabilizedForm && (
        <Card variant="fate">
          <p className="text-xs text-text-secondary font-body uppercase tracking-widest mb-2">Today&apos;s Form</p>
          <p className="font-heading text-lg text-text-primary">{stabilizedForm.name}</p>
          <p className="text-sm text-text-secondary font-body">{stabilizedForm.className}</p>
          <p className="text-xs text-text-secondary font-body mt-2 italic">{stabilizedForm.flavorText}</p>
          <div className="mt-3 space-y-1">
            {stabilizedForm.baseFeatures.map((f) => (
              <p key={f.name} className="text-xs text-text-secondary font-body">
                <span className="text-text-primary font-medium">{f.name}</span> — {f.description}
              </p>
            ))}
          </div>
        </Card>
      )}

      {chaosForm && (
        <Card variant="accent">
          <p className="text-xs text-text-secondary font-body uppercase tracking-widest mb-2">Chaos Form</p>
          {chaosForm.chassis && (
            <div className="mb-2">
              <span className="text-xs text-text-secondary font-body">Chassis: </span>
              <span className="text-sm text-text-primary font-heading">{chaosForm.chassis.name}</span>
            </div>
          )}
          {chaosForm.primary && (
            <div className="mb-2">
              <span className="text-xs text-text-secondary font-body">Primary: </span>
              <span className="text-sm text-text-primary font-heading">{chaosForm.primary.name}</span>
            </div>
          )}
          {chaosForm.defensive && (
            <div className="mb-2">
              <span className="text-xs text-text-secondary font-body">Defensive: </span>
              <span className="text-sm text-text-primary font-heading">{chaosForm.defensive.name}</span>
            </div>
          )}
          {chaosForm.feats.length > 0 && (
            <div>
              <span className="text-xs text-text-secondary font-body">Feats: </span>
              <span className="text-sm text-text-primary">
                {chaosForm.feats.map((f) => f?.name).filter(Boolean).join(", ")}
              </span>
            </div>
          )}
        </Card>
      )}

      {/* Dual Nature */}
      {dualNatureForm && dualNature && (
        <Card variant="fate">
          <p className="text-xs text-text-secondary font-body uppercase tracking-widest mb-2">Dual Nature — Secondary Form</p>
          <p className="font-heading text-text-primary">{dualNatureForm.name}</p>
          <p className="text-xs text-text-secondary font-body mb-2">{dualNatureForm.className}</p>
          <p className="text-xs text-text-secondary font-body">Retained features:</p>
          <ul className="mt-1 space-y-0.5">
            {dualNature.selectedFeatures.map((f) => (
              <li key={f} className="text-xs text-fate-glow font-body">• {f}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* Ability Scores */}
      <Card>
        <p className="text-xs text-text-secondary font-body uppercase tracking-widest mb-2">Ability Scores</p>
        <div className="grid grid-cols-6 gap-2">
          {ABILITY_SCORES.map((score) => {
            const original = abilityScores[score];
            const final = finalScores[score];
            const swapped = final !== original;
            return (
              <div key={score} className="text-center">
                <p className="text-xs text-text-secondary font-body">{score}</p>
                <p className={`text-lg font-heading font-bold ${swapped ? "text-fate-glow" : "text-text-primary"}`}>
                  {final}
                </p>
                <p className="text-xs text-text-secondary font-body">{getModifier(final)}</p>
                {swapped && (
                  <p className="text-xs text-text-secondary font-body line-through">{original}</p>
                )}
              </div>
            );
          })}
        </div>
        {attunement?.swap && (
          <p className="text-xs text-fate-glow font-body mt-2 text-center">
            {attunement.swap.score1} ↔ {attunement.swap.score2} swapped
          </p>
        )}
      </Card>

      {/* Residual Memory */}
      {memoryAllocation && memoryAllocation.retainedFeatures.length > 0 && (
        <Card>
          <p className="text-xs text-text-secondary font-body uppercase tracking-widest mb-2">Residual Memory</p>
          <div className="space-y-1">
            {memoryAllocation.retainedFeatures.map((slot: MemorySlot) => (
              <div key={slot.featureId} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-fate flex-shrink-0" />
                <span className="text-sm font-body text-fate-glow">{slot.name}</span>
                <span className="text-xs text-text-secondary font-body">— {slot.source}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Error */}
      {error && (
        <div className="bg-accent/20 border border-accent rounded-lg px-4 py-3 text-sm text-accent font-body">
          {error}
        </div>
      )}

      {/* Confirm */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleConfirm}
          disabled={confirming}
          className={`
            px-10 py-3 rounded-lg font-heading font-bold text-lg transition-all duration-150
            ${confirming
              ? "bg-bg-elevated text-text-secondary border border-border-subtle cursor-not-allowed opacity-50"
              : "bg-accent text-white hover:bg-accent-hover"
            }
          `}
        >
          {confirming ? "Confirming..." : "Confirm Dawn Roll"}
        </button>
      </div>
    </div>
  );
}
