"use client";

import React, { useState, useCallback } from "react";
import DiceRoller from "@/components/ui/DiceRoller";
import Card from "@/components/ui/Card";
import { isTableCIncompatible, getTableDRollCount } from "@/engine/chaos-form";
import { TABLE_A_CHASSIS } from "@/data/tables/table-a-chassis";
import { TABLE_B_PRIMARY } from "@/data/tables/table-b-primary";
import { TABLE_C_DEFENSIVE } from "@/data/tables/table-c-defensive";
import { TABLE_D_FEATS } from "@/data/tables/table-d-feats";
import { STABILIZED_FORMS } from "@/data/tables/stabilized-forms";
import type { DawnRollOutcome } from "@/types/dice";
import type { Chassis, PrimaryFeature, DefensiveFeature, StabilizedForm } from "@/types/forms";
import type { Feat } from "@/types/features";

interface ChaosFormState {
  tableARoll: number | null;
  tableBRoll: number | null;
  tableCRoll: number | null;
  tableCRerolled: boolean;
  tableCOriginalRoll: number | null;
  tableDRolls: number[];
  chassis: Chassis | null;
  primary: PrimaryFeature | null;
  defensive: DefensiveFeature | null;
  feats: Feat[];
}

type ChaosPhase =
  | "table-a"
  | "table-b"
  | "table-c"
  | "table-c-reroll"
  | "table-d"
  | "done";

interface StabilizedFormState {
  selectedFormId: number | null;
  selectedSubclassRoll: number | null;
}

export interface FormResolutionResult {
  type: "chaos" | "stabilized";
  chaosRolls?: {
    tableA: number;
    tableB: number;
    tableC: number;
    tableD: number[];
  };
  stabilizedFormId?: number;
}

interface FormResolutionProps {
  outcome: DawnRollOutcome;
  level: number;
  onComplete: (result: FormResolutionResult) => void;
}

// --- Chaos Form Component ---

function ChaosFormResolution({
  outcome,
  level,
  onComplete,
}: {
  outcome: "DEEP_CHAOS" | "UNSTABLE";
  level: number;
  onComplete: (result: FormResolutionResult) => void;
}) {
  const [phase, setPhase] = useState<ChaosPhase>("table-a");
  const [state, setState] = useState<ChaosFormState>({
    tableARoll: null,
    tableBRoll: null,
    tableCRoll: null,
    tableCRerolled: false,
    tableCOriginalRoll: null,
    tableDRolls: [],
    chassis: null,
    primary: null,
    defensive: null,
    feats: [],
  });
  const [rerollKey, setRerollKey] = useState(0);

  const featCount = getTableDRollCount(level);
  const tableDComplete = state.tableDRolls.length >= featCount;

  const handleTableA = useCallback(
    (roll: number) => {
      const chassis = TABLE_A_CHASSIS[roll - 1];
      setState((s) => ({ ...s, tableARoll: roll, chassis }));
      setPhase("table-b");
    },
    []
  );

  const handleTableB = useCallback(
    (roll: number) => {
      const primary = TABLE_B_PRIMARY[roll - 1];
      setState((s) => ({ ...s, tableBRoll: roll, primary }));
      setPhase("table-c");
    },
    []
  );

  const handleTableC = useCallback(
    (roll: number) => {
      const { chassis, primary } = state;
      if (!chassis || !primary) return;

      const incompatible = isTableCIncompatible(chassis.id, primary.id, roll);
      if (incompatible) {
        // Show incompatible, then trigger reroll
        const originalDefensive = TABLE_C_DEFENSIVE[roll - 1];
        setState((s) => ({
          ...s,
          tableCOriginalRoll: roll,
          tableCRerolled: true,
        }));
        // Small delay to show the incompatible result before rerolling
        setTimeout(() => {
          setPhase("table-c-reroll");
          setRerollKey((k) => k + 1);
        }, 1500);
        return;
      }

      const defensive = TABLE_C_DEFENSIVE[roll - 1];
      setState((s) => ({ ...s, tableCRoll: roll, defensive }));

      if (featCount > 0) {
        setPhase("table-d");
      } else {
        setPhase("done");
      }
    },
    [state, featCount]
  );

  const handleTableCReroll = useCallback(
    (roll: number) => {
      const defensive = TABLE_C_DEFENSIVE[roll - 1];
      setState((s) => ({ ...s, tableCRoll: roll, defensive }));

      if (featCount > 0) {
        setPhase("table-d");
      } else {
        setPhase("done");
      }
    },
    [featCount]
  );

  const handleTableD = useCallback(
    (roll: number) => {
      const feat = TABLE_D_FEATS[roll - 1];
      setState((s) => {
        const newRolls = [...s.tableDRolls, roll];
        const newFeats = [...s.feats, feat];
        return { ...s, tableDRolls: newRolls, feats: newFeats };
      });
    },
    []
  );

  function handleDone() {
    onComplete({
      type: "chaos",
      chaosRolls: {
        tableA: state.tableARoll!,
        tableB: state.tableBRoll!,
        tableC: state.tableCRoll!,
        tableD: state.tableDRolls,
      },
    });
  }

  // Incompatibility check: show the original roll result before rerolling
  const incompatibleRoll = state.tableCOriginalRoll !== null && phase === "table-c-reroll"
    ? TABLE_C_DEFENSIVE[state.tableCOriginalRoll - 1]
    : null;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-heading text-text-primary">Form Resolution</h2>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-body uppercase tracking-widest
          ${outcome === "DEEP_CHAOS" ? "bg-accent text-white animate-pulse" : "bg-orange-600 text-white"}
        `}>
          {outcome === "DEEP_CHAOS" ? "Deep Chaos" : "Unstable"}
        </span>
      </div>

      <div className="space-y-4">
        {/* Table A */}
        <Card variant={state.chassis ? "fate" : "default"}>
          <div className="flex items-start gap-4">
            <DiceRoller
              sides={TABLE_A_CHASSIS.length}
              onRollComplete={handleTableA}
              label="Table A"
              autoRoll={phase === "table-a"}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-secondary font-body uppercase tracking-widest mb-1">
                Chassis
              </p>
              {state.chassis ? (
                <div>
                  <p className="font-heading text-text-primary">{state.chassis.name}</p>
                  <p className="text-xs text-text-secondary font-body mt-0.5">
                    d{state.chassis.hitDie} | {state.chassis.armorProficiencies.join(", ")}
                  </p>
                </div>
              ) : (
                <p className="text-text-secondary font-body text-sm">Rolling...</p>
              )}
            </div>
          </div>
        </Card>

        {/* Table B */}
        {(phase !== "table-a") && (
          <Card variant={state.primary ? "fate" : "default"}>
            <div className="flex items-start gap-4">
              <DiceRoller
                sides={TABLE_B_PRIMARY.length}
                onRollComplete={handleTableB}
                label="Table B"
                autoRoll={phase === "table-b"}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-secondary font-body uppercase tracking-widest mb-1">
                  Primary Feature
                </p>
                {state.primary ? (
                  <div>
                    <p className="font-heading text-text-primary">{state.primary.name}</p>
                    <p className="text-xs text-text-secondary font-body mt-0.5">
                      {state.primary.className}
                      {state.primary.hasSpellcasting && " · Spellcasting"}
                    </p>
                  </div>
                ) : (
                  <p className="text-text-secondary font-body text-sm">Rolling...</p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Table C */}
        {(phase === "table-c" || phase === "table-c-reroll" || phase === "table-d" || phase === "done") && (
          <Card variant={state.defensive ? "fate" : "default"}>
            <div className="flex items-start gap-4">
              {phase === "table-c-reroll" ? (
                <DiceRoller
                  key={rerollKey}
                  sides={TABLE_C_DEFENSIVE.length}
                  onRollComplete={handleTableCReroll}
                  label="Table C (Reroll)"
                  autoRoll
                />
              ) : (
                <DiceRoller
                  sides={TABLE_C_DEFENSIVE.length}
                  onRollComplete={handleTableC}
                  label="Table C"
                  autoRoll={phase === "table-c"}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-secondary font-body uppercase tracking-widest mb-1">
                  Defensive Feature
                </p>
                {phase === "table-c-reroll" && incompatibleRoll && (
                  <div className="mb-2 px-2 py-1 bg-accent/20 border border-accent rounded text-xs text-accent font-body">
                    Incompatible: {incompatibleRoll.name} — Rerolling!
                  </div>
                )}
                {state.defensive ? (
                  <div>
                    <p className="font-heading text-text-primary">{state.defensive.name}</p>
                    <p className="text-xs text-text-secondary font-body mt-0.5 line-clamp-2">
                      {state.defensive.description}
                    </p>
                    {state.tableCRerolled && (
                      <p className="text-xs text-fate-glow font-body mt-1">
                        Fate's Mercy: Table C was rerolled for incompatibility.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-text-secondary font-body text-sm">Rolling...</p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Table D Feats */}
        {phase === "table-d" && featCount > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-text-secondary font-body uppercase tracking-widest text-center">
              Table D — Feats ({state.tableDRolls.length}/{featCount})
            </p>
            {Array.from({ length: featCount }, (_, i) => {
              const feat = state.feats[i];
              const isActive = i === state.tableDRolls.length;
              const isDone = i < state.tableDRolls.length;

              return (
                <Card key={i} variant={isDone ? "fate" : "default"}>
                  <div className="flex items-start gap-4">
                    <DiceRoller
                      sides={TABLE_D_FEATS.length}
                      onRollComplete={handleTableD}
                      label={`Feat ${i + 1}`}
                      autoRoll={isActive}
                    />
                    <div className="flex-1 min-w-0">
                      {feat ? (
                        <div>
                          <p className="font-heading text-text-primary">{feat.name}</p>
                          <p className="text-xs text-text-secondary font-body mt-0.5 line-clamp-2">
                            {feat.description}
                          </p>
                        </div>
                      ) : (
                        <p className="text-text-secondary font-body text-sm">
                          {isActive ? "Rolling..." : "Waiting..."}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Proceed */}
      {(phase === "done" || (phase === "table-d" && tableDComplete)) && (
        <div className="flex justify-center pt-2">
          <button
            onClick={handleDone}
            className="px-8 py-2.5 rounded-lg bg-accent text-white font-body font-medium hover:bg-accent-hover transition-all"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}

// --- Stabilized Form Component ---

function StabilizedFormResolution({
  outcome,
  level,
  onComplete,
}: {
  outcome: "GUIDED" | "FAVORED" | "MASTER";
  level: number;
  onComplete: (result: FormResolutionResult) => void;
}) {
  const [guidedRoll, setGuidedRoll] = useState<number | null>(null);
  const [favoredRolls, setFavoredRolls] = useState<number[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);

  function handleGuidedRoll(roll: number) {
    const form = STABILIZED_FORMS[roll - 1];
    setGuidedRoll(roll);
    setSelectedFormId(form.id);
  }

  function handleFavoredRoll1(roll: number) {
    setFavoredRolls((r) => [...r, roll]);
  }

  function handleFavoredRoll2(roll: number) {
    setFavoredRolls((r) => [...r, roll]);
  }

  function handleProceed() {
    if (selectedFormId === null) return;
    onComplete({ type: "stabilized", stabilizedFormId: selectedFormId });
  }

  if (outcome === "GUIDED") {
    const guidedForm = guidedRoll !== null ? STABILIZED_FORMS[guidedRoll - 1] : null;
    return (
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-heading text-text-primary">Form Resolution</h2>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-body bg-fate text-white uppercase tracking-widest">
            Guided
          </span>
          <p className="text-sm text-text-secondary font-body">Roll d12 to determine your form.</p>
        </div>

        <div className="flex justify-center">
          <DiceRoller sides={12} onRollComplete={handleGuidedRoll} label="Form" />
        </div>

        {guidedForm && (
          <Card variant="fate">
            <p className="text-xs text-text-secondary font-body uppercase tracking-widest mb-1">Your Form</p>
            <p className="font-heading text-lg text-text-primary">{guidedForm.name}</p>
            <p className="text-sm text-text-secondary font-body">{guidedForm.className}</p>
            <p className="text-xs text-text-secondary font-body mt-2 italic">{guidedForm.flavorText}</p>
          </Card>
        )}

        {guidedForm && (
          <div className="flex justify-center">
            <button onClick={handleProceed} className="px-8 py-2.5 rounded-lg bg-accent text-white font-body font-medium hover:bg-accent-hover transition-all">
              Continue
            </button>
          </div>
        )}
      </div>
    );
  }

  if (outcome === "FAVORED") {
    const form1 = favoredRolls[0] !== undefined ? STABILIZED_FORMS[favoredRolls[0] - 1] : null;
    const form2 = favoredRolls[1] !== undefined ? STABILIZED_FORMS[favoredRolls[1] - 1] : null;

    return (
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-heading text-text-primary">Form Resolution</h2>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-body bg-fate text-fate-glow font-bold uppercase tracking-widest">
            Favored
          </span>
          <p className="text-sm text-text-secondary font-body">Roll twice — choose the form you prefer.</p>
        </div>

        <div className="flex justify-center gap-8">
          <DiceRoller sides={12} onRollComplete={handleFavoredRoll1} label="Option 1" />
          {favoredRolls.length >= 1 && (
            <DiceRoller sides={12} onRollComplete={handleFavoredRoll2} label="Option 2" />
          )}
        </div>

        {form1 && form2 && (
          <div className="grid grid-cols-2 gap-3">
            {[form1, form2].map((form, idx) => (
              <button
                key={form.id}
                onClick={() => setSelectedFormId(form.id)}
                className={`text-left rounded-lg border p-3 transition-all
                  ${selectedFormId === form.id
                    ? "border-fate bg-fate/10"
                    : "border-border-subtle bg-bg-elevated hover:border-fate/50"
                  }
                `}
              >
                <p className="text-xs text-text-secondary font-body mb-1">Option {idx + 1}</p>
                <p className="font-heading text-text-primary">{form.name}</p>
                <p className="text-xs text-text-secondary font-body">{form.className}</p>
              </button>
            ))}
          </div>
        )}

        {selectedFormId !== null && (
          <div className="flex justify-center">
            <button onClick={handleProceed} className="px-8 py-2.5 rounded-lg bg-accent text-white font-body font-medium hover:bg-accent-hover transition-all">
              Continue
            </button>
          </div>
        )}
      </div>
    );
  }

  // MASTER — grid of all 12 forms
  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-heading text-text-primary">Form Resolution</h2>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-body bg-yellow-500 text-black font-bold uppercase tracking-widest">
          Master
        </span>
        <p className="text-sm text-text-secondary font-body">Choose any form.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {STABILIZED_FORMS.map((form) => (
          <button
            key={form.id}
            onClick={() => setSelectedFormId(form.id)}
            className={`text-left rounded-lg border p-3 transition-all
              ${selectedFormId === form.id
                ? "border-yellow-500 bg-yellow-500/10"
                : "border-border-subtle bg-bg-elevated hover:border-yellow-500/50"
              }
            `}
          >
            <p className="font-heading text-sm text-text-primary">{form.name}</p>
            <p className="text-xs text-text-secondary font-body">{form.className}</p>
          </button>
        ))}
      </div>

      {selectedFormId !== null && (
        <div className="flex justify-center">
          <button onClick={handleProceed} className="px-8 py-2.5 rounded-lg bg-yellow-500 text-black font-body font-bold hover:bg-yellow-400 transition-all">
            Continue
          </button>
        </div>
      )}
    </div>
  );
}

// --- Main Component ---

export default function FormResolution({ outcome, level, onComplete }: FormResolutionProps) {
  if (outcome === "DM_DESIGN") {
    // No form resolution for DM_DESIGN
    return (
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-heading text-text-primary">DM&apos;s Design</h2>
          <p className="text-sm text-text-secondary font-body">
            The DM has determined your form. No roll required.
          </p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => onComplete({ type: "chaos", chaosRolls: { tableA: 0, tableB: 0, tableC: 0, tableD: [] } })}
            className="px-8 py-2.5 rounded-lg bg-bg-elevated text-text-primary border border-border-subtle font-body font-medium hover:bg-bg-hover transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (outcome === "DEEP_CHAOS" || outcome === "UNSTABLE") {
    return <ChaosFormResolution outcome={outcome} level={level} onComplete={onComplete} />;
  }

  return <StabilizedFormResolution outcome={outcome as "GUIDED" | "FAVORED" | "MASTER"} level={level} onComplete={onComplete} />;
}
