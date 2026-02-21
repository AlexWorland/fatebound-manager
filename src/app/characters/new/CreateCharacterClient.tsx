"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { AbilityScore } from "@/types/forms";
import type { AbilityScores } from "@/types/character";
import { Card } from "@/components/ui";
import { rollAbilityScoreSet } from "@/lib/dice";

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

// ── Component ───────────────────────────────────────────────────────────

export default function CreateCharacterClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("name");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [level, setLevel] = useState(1);
  const [rolledScores, setRolledScores] = useState<number[] | null>(null);
  const [abilityScores, setAbilityScores] = useState<AbilityScores>({
    STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0,
  });
  const [background] = useState("The Chaos-Marked");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const currentStepIndex = STEPS.findIndex((s) => s.id === step);

  // ── Rolling helpers ───────────────────────────────────────────────

  function handleRoll() {
    const scores = rollAbilityScoreSet();
    setRolledScores(scores);
    setAbilityScores({ STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 });
  }

  function assignScore(ability: AbilityScore, value: number) {
    setAbilityScores((prev) => {
      const updated = { ...prev };
      updated[ability] = value;

      // Count how many of this value exist in the rolled pool
      const rolledCount = rolledScores!.filter((s) => s === value).length;
      // Count how many abilities are now assigned this value
      const assignedCount = ABILITIES.filter((ab) => updated[ab] === value).length;

      // Only unassign if we've exceeded the pool — remove one at a time
      if (assignedCount > rolledCount) {
        for (const ab of ABILITIES) {
          if (ab !== ability && updated[ab] === value) {
            updated[ab] = 0;
            break;
          }
        }
      }

      return updated;
    });
  }

  function getAssignedValues(): number[] {
    return ABILITIES.map((ab) => abilityScores[ab]).filter((v) => v > 0);
  }

  function getAvailableScores(currentAbility: AbilityScore): number[] {
    if (!rolledScores) return [];
    const assigned = getAssignedValues();
    const currentValue = abilityScores[currentAbility];

    // Build a pool of remaining scores by tracking which rolled scores are used
    const usedIndices = new Set<number>();
    for (const ab of ABILITIES) {
      if (ab === currentAbility) continue;
      const val = abilityScores[ab];
      if (val > 0) {
        const idx = rolledScores.findIndex((s, i) => s === val && !usedIndices.has(i));
        if (idx !== -1) usedIndices.add(idx);
      }
    }

    const available = rolledScores
      .filter((_, i) => !usedIndices.has(i))
      .sort((a, b) => b - a);

    // Deduplicate for the dropdown display
    return [...new Set(available)];
  }

  const allAssigned = rolledScores !== null && ABILITIES.every((ab) => abilityScores[ab] > 0);

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
        return allAssigned;
      case "background":
        return true;
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
          level,
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
                className={`text-xs font-condensed uppercase tracking-widest transition-colors ${
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
          <StepName name={name} onChangeName={setName} level={level} onChangeLevel={setLevel} />
        )}

        {step === "abilities" && (
          <StepAbilities
            scores={abilityScores}
            rolledScores={rolledScores}
            onRoll={handleRoll}
            onAssign={assignScore}
            getAvailableScores={getAvailableScores}
          />
        )}

        {step === "background" && (
          <StepBackground />
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
            level={level}
            abilityScores={abilityScores}
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
            className={`px-4 py-2 rounded border text-xs font-condensed font-bold uppercase tracking-wider transition-colors ${
              currentStepIndex === 0
                ? "border-border-subtle text-text-muted opacity-50 cursor-not-allowed"
                : "border-border-subtle text-text-secondary hover:text-text-highlight hover:border-text-secondary"
            }`}
          >
            &larr; Back
          </button>

          {step === "review" ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 rounded bg-accent hover:bg-accent-hover text-white text-xs font-condensed font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Character"}
            </button>
          ) : (
            <button
              onClick={goNext}
              disabled={!canAdvance()}
              className="px-4 py-2 rounded bg-accent hover:bg-accent-hover text-white text-xs font-condensed font-bold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
  onChangeName,
  level,
  onChangeLevel,
}: {
  name: string;
  onChangeName: (v: string) => void;
  level: number;
  onChangeLevel: (v: number) => void;
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
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="Enter character name..."
          autoFocus
          className="w-full px-4 py-3 rounded bg-bg-input border border-border-input text-text-primary font-body placeholder:text-text-secondary/50 focus:outline-none focus:border-accent transition-colors"
        />

        <div>
          <label className="text-xs text-text-secondary uppercase tracking-wider font-condensed block mb-1.5">
            Starting Level
          </label>
          <select
            value={level}
            onChange={(e) => onChangeLevel(Number(e.target.value))}
            className="w-full px-4 py-3 rounded bg-bg-input border border-border-input text-text-primary font-body focus:outline-none focus:border-accent transition-colors"
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((lvl) => (
              <option key={lvl} value={lvl}>
                Level {lvl}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
}

// ── Step: Abilities (4d6 Drop Lowest) ───────────────────────────────────

function StepAbilities({
  scores,
  rolledScores,
  onRoll,
  onAssign,
  getAvailableScores,
}: {
  scores: AbilityScores;
  rolledScores: number[] | null;
  onRoll: () => void;
  onAssign: (ability: AbilityScore, value: number) => void;
  getAvailableScores: (ability: AbilityScore) => number[];
}) {
  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-heading text-text-highlight">
            Ability Scores
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Roll 4d6, drop the lowest die, six times. Assign each result to an ability. Fate Attunement lets you swap two scores daily.
          </p>
        </div>

        {/* Roll / Reroll button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRoll}
            className="px-4 py-2 rounded bg-fate hover:bg-fate/80 text-white text-xs font-condensed font-bold uppercase tracking-wider transition-colors"
          >
            {rolledScores ? "Reroll All" : "Roll Ability Scores"}
          </button>
          {rolledScores && (
            <span className="text-sm text-text-secondary font-mono">
              Rolled: {[...rolledScores].sort((a, b) => b - a).join(", ")}
            </span>
          )}
        </div>

        {/* Assignment grid */}
        {rolledScores && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
            {ABILITIES.map((ab) => {
              const available = getAvailableScores(ab);
              const current = scores[ab];
              return (
                <div
                  key={ab}
                  className="flex flex-col items-center gap-1 p-3 rounded-lg bg-bg-elevated border border-border-subtle"
                >
                  <span className="text-xs font-body text-text-secondary uppercase tracking-widest">
                    {ABILITY_LABELS[ab]}
                  </span>

                  <select
                    value={current || ""}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val > 0) onAssign(ab, val);
                    }}
                    className="w-full mt-1 px-2 py-1.5 rounded bg-bg-input border border-border-input text-text-primary text-center font-heading text-lg focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="">--</option>
                    {current > 0 && !available.includes(current) && (
                      <option value={current}>{current}</option>
                    )}
                    {available.map((score) => (
                      <option key={score} value={score}>
                        {score}
                      </option>
                    ))}
                  </select>

                  {current > 0 && (
                    <span className="text-xs text-text-secondary font-mono">
                      ({formatModifier(current)})
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!rolledScores && (
          <p className="text-xs text-text-secondary text-center mt-2">
            Click &ldquo;Roll Ability Scores&rdquo; to generate six scores using the 4d6 drop lowest method.
          </p>
        )}
      </div>
    </Card>
  );
}

// ── Step: Background (Locked — Chaos-Marked) ───────────────────────────

function StepBackground() {
  return (
    <Card variant="fate">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-heading text-text-highlight">
          Background: The Chaos-Marked
        </h2>
        <p className="text-sm text-text-secondary italic">
          All Fatebound characters share this background. A moment of contact with raw fate itself left its Mark on you — now chaos clings to you like a second shadow.
        </p>

        <div className="flex flex-col gap-3 mt-1">
          {/* Feature */}
          <div className="p-3 rounded-lg bg-bg-elevated border border-border-subtle">
            <span className="text-xs text-fate uppercase tracking-widest font-body block mb-1">
              Feature: Ambient Chaos
            </span>
            <p className="text-sm text-text-primary">
              Chaotic phenomena manifest passively around you. Once per long rest, in a moment of tension or uncertainty, you can lean into the chaos — a minor, unpredictable beneficial event occurs. The DM determines the manifestation.
            </p>
          </div>

          {/* Skill proficiencies */}
          <div className="p-3 rounded-lg bg-bg-elevated border border-border-subtle">
            <span className="text-xs text-text-secondary uppercase tracking-widest font-body block mb-1">
              Skill Proficiencies
            </span>
            <p className="text-sm text-text-primary">
              Choose 2 from: Arcana, Insight, Perception, Sleight of Hand, Survival
            </p>
          </div>

          {/* Languages */}
          <div className="p-3 rounded-lg bg-bg-elevated border border-border-subtle">
            <span className="text-xs text-text-secondary uppercase tracking-widest font-body block mb-1">
              Languages
            </span>
            <p className="text-sm text-text-primary">
              Two languages of your choice
            </p>
          </div>

          {/* Equipment */}
          <div className="p-3 rounded-lg bg-bg-elevated border border-border-subtle">
            <span className="text-xs text-text-secondary uppercase tracking-widest font-body block mb-1">
              Equipment
            </span>
            <p className="text-sm text-text-primary">
              Common clothes with faintly shifting patterns, a trinket from your former life, a journal of half-remembered dreams, and a belt pouch containing 10 gp
            </p>
          </div>
        </div>
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
  level,
  abilityScores,
  skills,
}: {
  name: string;
  level: number;
  abilityScores: AbilityScores;
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
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-widest font-body block mb-1">
            Background
          </span>
          <span className="text-sm text-text-primary">The Chaos-Marked</span>
        </div>

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
            Your character will start at <span className="text-text-highlight font-medium">Level {level}</span>.
            After creation, you&apos;ll perform your first Dawn Roll to determine today&apos;s form.
          </p>
        </div>
      </div>
    </Card>
  );
}
