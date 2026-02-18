"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { AbilityScore } from "@/types/forms";
import type { AbilityScores } from "@/types/character";
import { Card } from "@/components/ui";

// ── D&D 5e Point Buy Constants ──────────────────────────────────────────

const TOTAL_POINTS = 27;
const MIN_SCORE = 8;
const MAX_SCORE = 15;

/** Point cost for each ability score in standard D&D 5e point buy.
 *  Scores 8-13 cost 1 point each; 14 costs 2 extra; 15 costs 2 extra. */
const POINT_COST: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

const ABILITIES: AbilityScore[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

const ABILITY_LABELS: Record<AbilityScore, string> = {
  STR: "Strength",
  DEX: "Dexterity",
  CON: "Constitution",
  INT: "Intelligence",
  WIS: "Wisdom",
  CHA: "Charisma",
};

// ── 5e Skill List ───────────────────────────────────────────────────────

const SKILLS = [
  "Acrobatics",
  "Animal Handling",
  "Arcana",
  "Athletics",
  "Deception",
  "History",
  "Insight",
  "Intimidation",
  "Investigation",
  "Medicine",
  "Nature",
  "Perception",
  "Performance",
  "Persuasion",
  "Religion",
  "Sleight of Hand",
  "Stealth",
  "Survival",
];

// ── Step Type ───────────────────────────────────────────────────────────

type Step = "name" | "abilities" | "background" | "skills" | "review";

const STEPS: { id: Step; label: string }[] = [
  { id: "name", label: "Name" },
  { id: "abilities", label: "Abilities" },
  { id: "background", label: "Background" },
  { id: "skills", label: "Skills" },
  { id: "review", label: "Review" },
];

// ── Helpers ─────────────────────────────────────────────────────────────

function getModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

function formatModifier(score: number): string {
  const mod = getModifier(score);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

function getTotalPointsUsed(scores: AbilityScores): number {
  return ABILITIES.reduce((sum, ab) => sum + (POINT_COST[scores[ab]] ?? 0), 0);
}

// ── Component ───────────────────────────────────────────────────────────

export default function CreateCharacterClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("name");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [abilityScores, setAbilityScores] = useState<AbilityScores>({
    STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8,
  });
  const [background, setBackground] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const pointsUsed = getTotalPointsUsed(abilityScores);
  const pointsRemaining = TOTAL_POINTS - pointsUsed;
  const currentStepIndex = STEPS.findIndex((s) => s.id === step);

  // ── Score adjustment ──────────────────────────────────────────────

  function adjustScore(ability: AbilityScore, delta: number) {
    const current = abilityScores[ability];
    const next = current + delta;

    if (next < MIN_SCORE || next > MAX_SCORE) return;

    const nextCost = POINT_COST[next];
    const currentCost = POINT_COST[current];
    const costDiff = nextCost - currentCost;

    if (costDiff > pointsRemaining) return;

    setAbilityScores((prev) => ({ ...prev, [ability]: next }));
  }

  // ── Skill toggle ──────────────────────────────────────────────────

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((s) => s !== skill);
      }
      if (prev.length >= 2) return prev;
      return [...prev, skill];
    });
  }

  // ── Navigation ────────────────────────────────────────────────────

  function canAdvance(): boolean {
    switch (step) {
      case "name":
        return name.trim().length > 0;
      case "abilities":
        return pointsRemaining >= 0;
      case "background":
        return true; // background is optional
      case "skills":
        return selectedSkills.length === 2;
      case "review":
        return true;
      default:
        return false;
    }
  }

  function goNext() {
    const idx = currentStepIndex;
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1].id);
    }
  }

  function goBack() {
    const idx = currentStepIndex;
    if (idx > 0) {
      setStep(STEPS[idx - 1].id);
    }
  }

  // ── Submit ────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          abilityScores,
          permanentSkills: selectedSkills as [string, string],
          background: background.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create character");
      }

      const character = await res.json();
      router.push(`/characters/${character.id}/dawn-roll`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setIsSubmitting(false);
    }
  }

  // ── Render Steps ──────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-bg-deep">
      {/* Header */}
      <header className="border-b border-border-subtle">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <button
            onClick={() => router.push("/characters")}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors mb-4 inline-block"
          >
            &larr; Back to Characters
          </button>
          <h1 className="text-2xl font-heading text-text-highlight">
            Create Character
          </h1>
        </div>
      </header>

      {/* Progress bar */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <button
                onClick={() => {
                  // Only allow jumping to completed or current steps
                  if (i <= currentStepIndex) setStep(s.id);
                }}
                className={`text-xs font-body uppercase tracking-widest transition-colors ${
                  i === currentStepIndex
                    ? "text-text-highlight"
                    : i < currentStepIndex
                    ? "text-accent cursor-pointer hover:text-accent-hover"
                    : "text-text-secondary"
                }`}
              >
                {s.label}
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 ${
                    i < currentStepIndex ? "bg-accent" : "bg-border-subtle"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step content */}
      <main className="max-w-2xl mx-auto px-4 py-4">
        {step === "name" && (
          <StepName name={name} onChange={setName} />
        )}

        {step === "abilities" && (
          <StepAbilities
            scores={abilityScores}
            pointsRemaining={pointsRemaining}
            onAdjust={adjustScore}
          />
        )}

        {step === "background" && (
          <StepBackground background={background} onChange={setBackground} />
        )}

        {step === "skills" && (
          <StepSkills
            selectedSkills={selectedSkills}
            onToggle={toggleSkill}
          />
        )}

        {step === "review" && (
          <StepReview
            name={name}
            abilityScores={abilityScores}
            background={background}
            skills={selectedSkills}
          />
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-hp-red/10 border border-hp-red/30 text-hp-red text-sm">
            {error}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-border-subtle">
          <button
            onClick={goBack}
            disabled={currentStepIndex === 0}
            className={`px-4 py-2 rounded-lg text-sm font-body transition-colors ${
              currentStepIndex === 0
                ? "text-text-secondary opacity-50 cursor-not-allowed"
                : "text-text-primary hover:text-text-highlight hover:bg-bg-hover"
            }`}
          >
            &larr; Back
          </button>

          {step === "review" ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-accent hover:bg-accent-hover text-text-highlight text-sm font-body transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Character"}
            </button>
          ) : (
            <button
              onClick={goNext}
              disabled={!canAdvance()}
              className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-text-highlight text-sm font-body transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next &rarr;
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

// ── Step: Name ──────────────────────────────────────────────────────────

function StepName({
  name,
  onChange,
}: {
  name: string;
  onChange: (v: string) => void;
}) {
  return (
    <Card>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-heading text-text-highlight">
          Character Name
        </h2>
        <p className="text-sm text-text-secondary">
          Choose a name for your Fatebound. This is the one constant as fate reshapes everything else about you each dawn.
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter character name..."
          autoFocus
          className="w-full px-4 py-3 rounded-lg bg-bg-elevated border border-border-subtle text-text-primary font-body placeholder:text-text-secondary/50 focus:outline-none focus:border-fate transition-colors"
        />
      </div>
    </Card>
  );
}

// ── Step: Abilities (Point Buy) ─────────────────────────────────────────

function StepAbilities({
  scores,
  pointsRemaining,
  onAdjust,
}: {
  scores: AbilityScores;
  pointsRemaining: number;
  onAdjust: (ability: AbilityScore, delta: number) => void;
}) {
  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-heading text-text-highlight">
              Ability Scores
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              D&D 5e point buy. Start at 8, max 15, spend 27 points. Fate Attunement lets you swap two scores daily.
            </p>
          </div>
          <div className="shrink-0 ml-4 text-right">
            <div className="text-xs text-text-secondary uppercase tracking-widest font-body">
              Points
            </div>
            <div
              className={`text-2xl font-heading font-bold ${
                pointsRemaining === 0
                  ? "text-accent"
                  : pointsRemaining < 0
                  ? "text-hp-red"
                  : "text-text-highlight"
              }`}
            >
              {pointsRemaining}
            </div>
            <div className="text-xs text-text-secondary font-mono">
              / {TOTAL_POINTS}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
          {ABILITIES.map((ab) => (
            <AbilityScoreInput
              key={ab}
              ability={ab}
              score={scores[ab]}
              pointsRemaining={pointsRemaining}
              onAdjust={onAdjust}
            />
          ))}
        </div>

        {pointsRemaining > 0 && (
          <p className="text-xs text-text-secondary text-center mt-2">
            {pointsRemaining} point{pointsRemaining !== 1 ? "s" : ""} remaining &mdash; consider raising your primary stat to 15 for Fate Attunement swaps.
          </p>
        )}
      </div>
    </Card>
  );
}

function AbilityScoreInput({
  ability,
  score,
  pointsRemaining,
  onAdjust,
}: {
  ability: AbilityScore;
  score: number;
  pointsRemaining: number;
  onAdjust: (ability: AbilityScore, delta: number) => void;
}) {
  const mod = formatModifier(score);
  const canIncrease = score < MAX_SCORE && (POINT_COST[score + 1] - POINT_COST[score]) <= pointsRemaining;
  const canDecrease = score > MIN_SCORE;

  return (
    <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-bg-elevated border border-border-subtle">
      <span className="text-xs font-body text-text-secondary uppercase tracking-widest">
        {ABILITY_LABELS[ability]}
      </span>

      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={() => onAdjust(ability, -1)}
          disabled={!canDecrease}
          className="w-7 h-7 rounded flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          &minus;
        </button>

        <div className="flex flex-col items-center min-w-[40px]">
          <span className="text-xl font-heading font-bold text-text-highlight">
            {score}
          </span>
          <span className="text-xs text-text-secondary font-mono">
            ({mod})
          </span>
        </div>

        <button
          onClick={() => onAdjust(ability, 1)}
          disabled={!canIncrease}
          className="w-7 h-7 rounded flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>

      <span className="text-xs text-text-secondary font-mono">
        {POINT_COST[score]} pts
      </span>
    </div>
  );
}

// ── Step: Background ────────────────────────────────────────────────────

function StepBackground({
  background,
  onChange,
}: {
  background: string;
  onChange: (v: string) => void;
}) {
  return (
    <Card>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-heading text-text-highlight">
          Background
        </h2>
        <p className="text-sm text-text-secondary">
          Describe your character's background. This is optional but helps ground your Fatebound's identity as everything else shifts.
        </p>
        <textarea
          value={background}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Acolyte, Sage, Criminal, Folk Hero, or describe your own..."
          rows={3}
          className="w-full px-4 py-3 rounded-lg bg-bg-elevated border border-border-subtle text-text-primary font-body placeholder:text-text-secondary/50 focus:outline-none focus:border-fate transition-colors resize-none"
        />
      </div>
    </Card>
  );
}

// ── Step: Skills ────────────────────────────────────────────────────────

function StepSkills({
  selectedSkills,
  onToggle,
}: {
  selectedSkills: string[];
  onToggle: (skill: string) => void;
}) {
  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-heading text-text-highlight">
              Permanent Skills
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Choose 2 skill proficiencies. These persist across all Daily Forms &mdash; your Fatemark anchors them.
            </p>
          </div>
          <span className="shrink-0 ml-4 px-2 py-0.5 rounded-full bg-bg-elevated text-xs font-mono text-text-secondary border border-border-subtle">
            {selectedSkills.length} / 2
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SKILLS.map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            const isDisabled = !isSelected && selectedSkills.length >= 2;

            return (
              <button
                key={skill}
                onClick={() => onToggle(skill)}
                disabled={isDisabled}
                className={`px-3 py-2 rounded-lg text-sm font-body text-left transition-colors ${
                  isSelected
                    ? "bg-accent/20 border border-accent text-text-highlight"
                    : isDisabled
                    ? "bg-bg-elevated border border-border-subtle text-text-secondary opacity-50 cursor-not-allowed"
                    : "bg-bg-elevated border border-border-subtle text-text-primary hover:border-fate hover:text-text-highlight cursor-pointer"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

// ── Step: Review ────────────────────────────────────────────────────────

function StepReview({
  name,
  abilityScores,
  background,
  skills,
}: {
  name: string;
  abilityScores: AbilityScores;
  background: string;
  skills: string[];
}) {
  return (
    <Card variant="fate">
      <div className="flex flex-col gap-5">
        <h2 className="text-lg font-heading text-text-highlight">
          Review Your Character
        </h2>

        {/* Name */}
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-widest font-body block mb-1">
            Name
          </span>
          <span className="text-lg font-heading text-text-highlight">{name}</span>
        </div>

        {/* Abilities */}
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-widest font-body block mb-2">
            Ability Scores
          </span>
          <div className="grid grid-cols-6 gap-2">
            {ABILITIES.map((ab) => (
              <div key={ab} className="flex flex-col items-center gap-0.5 p-2 rounded bg-bg-elevated">
                <span className="text-xs text-text-secondary font-body">{ab}</span>
                <span className="text-lg font-heading font-bold text-text-highlight">
                  {abilityScores[ab]}
                </span>
                <span className="text-xs text-text-secondary font-mono">
                  {formatModifier(abilityScores[ab])}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Background */}
        {background && (
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-widest font-body block mb-1">
              Background
            </span>
            <span className="text-sm text-text-primary">{background}</span>
          </div>
        )}

        {/* Skills */}
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-widest font-body block mb-1">
            Permanent Skills
          </span>
          <div className="flex gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full bg-accent/20 border border-accent text-sm text-text-highlight"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Level notice */}
        <div className="pt-3 border-t border-border-subtle">
          <p className="text-xs text-text-secondary">
            Your character will start at <span className="text-text-highlight font-medium">Level 1</span>.
            After creation, you'll perform your first Dawn Roll to determine today's form.
          </p>
        </div>
      </div>
    </Card>
  );
}
