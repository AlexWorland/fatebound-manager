"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { AbilityScore } from "@/types/forms";
import type { AbilityScores } from "@/types/character";
import { Card } from "@/components/ui";
import { SpeciesStep } from "./steps/SpeciesStep";
import {
  BackgroundStep,
  type BackgroundData,
} from "./steps/BackgroundStep";
import {
  AbilityScoreStep,
  ABILITIES,
  formatModifier,
  type ScoreMethod,
} from "./steps/AbilityScoreStep";
import {
  EquipmentStep,
  type EquipmentData,
} from "./steps/EquipmentStep";
import { STARTING_GOLD } from "@/data/starting-equipment";

// ── Step Type ───────────────────────────────────────────────────────────

type Step = "name" | "species" | "background" | "abilities" | "skills" | "equipment" | "review";

const STEPS: { id: Step; label: string }[] = [
  { id: "name", label: "Name" },
  { id: "species", label: "Species" },
  { id: "background", label: "Background" },
  { id: "abilities", label: "Abilities" },
  { id: "skills", label: "Skills" },
  { id: "equipment", label: "Equipment" },
  { id: "review", label: "Review" },
];

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

const ABILITY_LABELS: Record<AbilityScore, string> = {
  STR: "Strength",
  DEX: "Dexterity",
  CON: "Constitution",
  INT: "Intelligence",
  WIS: "Wisdom",
  CHA: "Charisma",
};

// ── Component ───────────────────────────────────────────────────────────

export default function CreateCharacterClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("name");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Name
  const [name, setName] = useState("");

  // Step 2: Species
  const [species, setSpecies] = useState("");

  // Step 3: Background
  const [backgroundData, setBackgroundData] = useState<BackgroundData>({
    name: "",
    personality: "",
    ideals: "",
    bonds: "",
    flaws: "",
  });

  // Step 4: Ability Scores
  const [abilityScores, setAbilityScores] = useState<AbilityScores>({
    STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8,
  });
  const [scoreMethod, setScoreMethod] = useState<ScoreMethod>("pointbuy");

  // Step 5: Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Step 6: Equipment
  const [equipmentData, setEquipmentData] = useState<EquipmentData>({
    packName: "",
    weapon: "",
    startingGold: STARTING_GOLD.default,
  });

  const currentStepIndex = STEPS.findIndex((s) => s.id === step);

  // ── Skill toggle ──────────────────────────────────────────────────

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) => {
      if (prev.includes(skill)) return prev.filter((s) => s !== skill);
      if (prev.length >= 2) return prev;
      return [...prev, skill];
    });
  }

  // ── Navigation ────────────────────────────────────────────────────

  function canAdvance(): boolean {
    switch (step) {
      case "name":
        return name.trim().length > 0;
      case "species":
        return species.length > 0;
      case "background":
        return true; // optional
      case "abilities":
        return true;
      case "skills":
        return selectedSkills.length === 2;
      case "equipment":
        return true; // optional
      case "review":
        return true;
      default:
        return false;
    }
  }

  function goNext() {
    const idx = currentStepIndex;
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1].id);
  }

  function goBack() {
    const idx = currentStepIndex;
    if (idx > 0) setStep(STEPS[idx - 1].id);
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
          background: backgroundData.name,
          personality: backgroundData.personality,
          ideals: backgroundData.ideals,
          bonds: backgroundData.bonds,
          flaws: backgroundData.flaws,
          alignment: "",
          backstory: "",
          appearance: {},
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

  // ── Render ─────────────────────────────────────────────────────────

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
          <h1 className="text-2xl font-heading text-text-highlight">Create Character</h1>
        </div>
      </header>

      {/* Progress bar */}
      <div className="max-w-2xl mx-auto px-4 py-4 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <button
                onClick={() => {
                  if (i <= currentStepIndex) setStep(s.id);
                }}
                className={`text-xs font-body uppercase tracking-widest transition-colors whitespace-nowrap ${
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
                  className={`w-4 h-px mx-1 shrink-0 ${
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
        {step === "name" && <StepName name={name} onChange={setName} />}

        {step === "species" && (
          <SpeciesStep selected={species} onSelect={setSpecies} />
        )}

        {step === "background" && (
          <BackgroundStep data={backgroundData} onChange={setBackgroundData} />
        )}

        {step === "abilities" && (
          <AbilityScoreStep
            scores={abilityScores}
            method={scoreMethod}
            onScoresChange={setAbilityScores}
            onMethodChange={setScoreMethod}
          />
        )}

        {step === "skills" && (
          <StepSkills selectedSkills={selectedSkills} onToggle={toggleSkill} />
        )}

        {step === "equipment" && (
          <EquipmentStep data={equipmentData} onChange={setEquipmentData} />
        )}

        {step === "review" && (
          <StepReview
            name={name}
            species={species}
            backgroundData={backgroundData}
            abilityScores={abilityScores}
            skills={selectedSkills}
            equipmentData={equipmentData}
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
        <h2 className="text-lg font-heading text-text-highlight">Character Name</h2>
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
            <h2 className="text-lg font-heading text-text-highlight">Permanent Skills</h2>
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
  species,
  backgroundData,
  abilityScores,
  skills,
  equipmentData,
}: {
  name: string;
  species: string;
  backgroundData: BackgroundData;
  abilityScores: AbilityScores;
  skills: string[];
  equipmentData: EquipmentData;
}) {
  return (
    <Card variant="fate">
      <div className="flex flex-col gap-5">
        <h2 className="text-lg font-heading text-text-highlight">Review Your Character</h2>

        {/* Name & Species */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-widest font-body block mb-1">
              Name
            </span>
            <span className="text-lg font-heading text-text-highlight">{name}</span>
          </div>
          {species && (
            <div>
              <span className="text-xs text-text-secondary uppercase tracking-widest font-body block mb-1">
                Species
              </span>
              <span className="text-base font-heading text-text-highlight">{species}</span>
            </div>
          )}
        </div>

        {/* Ability Scores */}
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-widest font-body block mb-2">
            Ability Scores
          </span>
          <div className="grid grid-cols-6 gap-2">
            {ABILITIES.map((ab) => (
              <div
                key={ab}
                className="flex flex-col items-center gap-0.5 p-2 rounded bg-bg-elevated"
              >
                <span className="text-xs text-text-secondary font-body">
                  {ABILITY_LABELS[ab].slice(0, 3).toUpperCase()}
                </span>
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
        {backgroundData.name && (
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-widest font-body block mb-1">
              Background
            </span>
            <span className="text-sm font-heading text-text-highlight">{backgroundData.name}</span>
            {backgroundData.personality && (
              <p className="text-xs text-text-secondary mt-1">{backgroundData.personality}</p>
            )}
          </div>
        )}

        {/* Skills */}
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-widest font-body block mb-1">
            Permanent Skills
          </span>
          <div className="flex gap-2 flex-wrap">
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

        {/* Equipment */}
        {(equipmentData.packName || equipmentData.weapon) && (
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-widest font-body block mb-1">
              Starting Equipment
            </span>
            <div className="flex flex-wrap gap-2 text-sm text-text-primary">
              {equipmentData.packName && (
                <span className="px-2 py-0.5 rounded bg-bg-elevated border border-border-subtle">
                  {equipmentData.packName}
                </span>
              )}
              {equipmentData.weapon && (
                <span className="px-2 py-0.5 rounded bg-bg-elevated border border-border-subtle">
                  {equipmentData.weapon}
                </span>
              )}
              <span className="px-2 py-0.5 rounded bg-bg-elevated border border-border-subtle">
                {equipmentData.startingGold} gp
              </span>
            </div>
          </div>
        )}

        {/* Level notice */}
        <div className="pt-3 border-t border-border-subtle">
          <p className="text-xs text-text-secondary">
            Your character will start at{" "}
            <span className="text-text-highlight font-medium">Level 1</span>.
            After creation, you'll perform your first Dawn Roll to determine today's form.
          </p>
        </div>
      </div>
    </Card>
  );
}
