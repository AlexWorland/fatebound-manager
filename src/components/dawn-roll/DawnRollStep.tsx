"use client";

import React, { useState } from "react";
import DiceRoller from "@/components/ui/DiceRoller";
import { resolveDawnRollOutcome } from "@/engine/dawn-roll";
import type { DawnRollOutcome } from "@/types/dice";

interface OutcomeConfig {
  label: string;
  colorClass: string;
  description: string;
}

const OUTCOME_CONFIG: Record<DawnRollOutcome, OutcomeConfig> = {
  DM_DESIGN: {
    label: "DM's Design",
    colorClass: "bg-bg-elevated text-text-secondary border border-border-subtle",
    description: "The DM determines your form today.",
  },
  DEEP_CHAOS: {
    label: "Deep Chaos",
    colorClass: "bg-accent text-white animate-pulse",
    description: "The chaos runs deep. Brace yourself.",
  },
  UNSTABLE: {
    label: "Unstable",
    colorClass: "bg-orange-600 text-white",
    description: "Volatile but controllable. Roll your form.",
  },
  GUIDED: {
    label: "Guided",
    colorClass: "bg-fate text-white",
    description: "Fate guides your form. Choose wisely.",
  },
  FAVORED: {
    label: "Favored",
    colorClass: "bg-fate text-fate-glow font-bold",
    description: "Fate smiles upon you. Two forms, one choice.",
  },
  MASTER: {
    label: "Master",
    colorClass: "bg-yellow-500 text-black font-bold",
    description: "Full mastery. Any form is yours to claim.",
  },
};

interface DawnRollStepProps {
  level: number;
  onComplete: (data: {
    die1: number;
    die2?: number;
    chosen: number;
    outcome: DawnRollOutcome;
    dmDesignText?: string;
  }) => void;
}

export default function DawnRollStep({ level, onComplete }: DawnRollStepProps) {
  const hasExtraDie = level >= 5;

  const [die1Result, setDie1Result] = useState<number | null>(null);
  const [die2Result, setDie2Result] = useState<number | null>(null);
  const [chosenDie, setChosenDie] = useState<1 | 2 | null>(null);
  const [dmDesignText, setDmDesignText] = useState("");

  const chosenValue =
    chosenDie === 1 ? die1Result : chosenDie === 2 ? die2Result : null;
  const outcome =
    chosenValue !== null
      ? resolveDawnRollOutcome(chosenValue, level)
      : null;

  const canProceed =
    outcome !== null &&
    (outcome !== "DM_DESIGN" || dmDesignText.trim().length > 0);

  function handleDie1Complete(result: number) {
    setDie1Result(result);
    if (!hasExtraDie) {
      setChosenDie(1);
    }
  }

  function handleDie2Complete(result: number) {
    setDie2Result(result);
  }

  function handleChoose(die: 1 | 2) {
    setChosenDie(die);
  }

  function handleProceed() {
    if (!canProceed || chosenValue === null || outcome === null) return;
    onComplete({
      die1: die1Result!,
      die2: die2Result ?? undefined,
      chosen: chosenValue,
      outcome,
      dmDesignText: outcome === "DM_DESIGN" ? dmDesignText : undefined,
    });
  }

  const bothRolled = die1Result !== null && (!hasExtraDie || die2Result !== null);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-heading text-text-primary">Dawn Roll</h2>
        <p className="text-sm text-text-secondary font-body">
          {hasExtraDie
            ? "Roll two d20s — choose which result to keep."
            : "Roll your d20 to determine today's form."}
        </p>
      </div>

      {/* Dice area */}
      <div className="flex justify-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <DiceRoller
            sides={20}
            onRollComplete={handleDie1Complete}
            label={hasExtraDie ? "Die 1" : "d20"}
          />
          {hasExtraDie && die1Result !== null && die2Result !== null && (
            <button
              onClick={() => handleChoose(1)}
              className={`
                mt-1 px-3 py-1 rounded text-xs font-body font-medium transition-all
                ${
                  chosenDie === 1
                    ? "bg-fate text-white"
                    : "bg-bg-elevated text-text-secondary border border-border-subtle hover:border-fate"
                }
              `}
            >
              {chosenDie === 1 ? "Chosen" : "Keep this"}
            </button>
          )}
        </div>

        {hasExtraDie && (
          <div className="flex flex-col items-center gap-2">
            <DiceRoller
              sides={20}
              onRollComplete={handleDie2Complete}
              label="Die 2"
            />
            {die1Result !== null && die2Result !== null && (
              <button
                onClick={() => handleChoose(2)}
                className={`
                  mt-1 px-3 py-1 rounded text-xs font-body font-medium transition-all
                  ${
                    chosenDie === 2
                      ? "bg-fate text-white"
                      : "bg-bg-elevated text-text-secondary border border-border-subtle hover:border-fate"
                  }
                `}
              >
                {chosenDie === 2 ? "Chosen" : "Keep this"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Choose prompt for extra die */}
      {hasExtraDie && bothRolled && chosenDie === null && (
        <p className="text-center text-sm text-fate-glow font-body animate-pulse">
          Choose which die to keep
        </p>
      )}

      {/* Outcome badge */}
      {outcome !== null && (
        <div className="flex flex-col items-center gap-3 pt-2">
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-heading tracking-wide ${OUTCOME_CONFIG[outcome].colorClass}`}
          >
            {OUTCOME_CONFIG[outcome].label}
          </span>
          <p className="text-sm text-text-secondary font-body text-center">
            {OUTCOME_CONFIG[outcome].description}
          </p>

          {/* DM Design text input */}
          {outcome === "DM_DESIGN" && (
            <div className="w-full max-w-md space-y-2">
              <label className="block text-xs text-text-secondary font-body uppercase tracking-widest">
                DM — Enter form details
              </label>
              <textarea
                value={dmDesignText}
                onChange={(e) => setDmDesignText(e.target.value)}
                placeholder="Describe the form the DM has assigned..."
                rows={3}
                className="w-full bg-bg-elevated border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary font-body placeholder:text-text-secondary focus:outline-none focus:border-fate resize-none"
              />
            </div>
          )}
        </div>
      )}

      {/* Proceed button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleProceed}
          disabled={!canProceed}
          className={`
            px-8 py-2.5 rounded-lg font-body font-medium transition-all duration-150
            ${
              canProceed
                ? "bg-accent text-white hover:bg-accent-hover"
                : "bg-bg-elevated text-text-secondary border border-border-subtle cursor-not-allowed opacity-50"
            }
          `}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
