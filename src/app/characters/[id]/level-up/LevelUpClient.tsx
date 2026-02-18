"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import DiceRoller from "@/components/ui/DiceRoller";
import type { Character } from "@/types/character";
import { LEVEL_PROGRESSION } from "@/data/level-progression";

const ASI_LEVELS = new Set([4, 8, 12, 16, 19]);

interface LevelUpClientProps {
  character: Character;
}

type HpChoice = "rolled" | "average" | null;
type AsiChoice = "asi" | "feat";
type Phase = "hp" | "asi" | "confirm" | "done";

export default function LevelUpClient({ character }: LevelUpClientProps) {
  const router = useRouter();
  const nextLevel = character.level + 1;
  const newFeatures = LEVEL_PROGRESSION.find((e) => e.level === nextLevel);
  const isAsiLevel = ASI_LEVELS.has(nextLevel);

  // HP state
  const conMod = Math.floor((character.abilityScores.CON - 10) / 2);
  const averageHp = 5 + conMod; // average of d8 = 4.5, rounded up to 5
  const [rolledHp, setRolledHp] = useState<number | null>(null);
  const [hpChoice, setHpChoice] = useState<HpChoice>(null);
  const [hpGained, setHpGained] = useState<number | null>(null);

  // ASI state
  const [asiChoice, setAsiChoice] = useState<AsiChoice>("asi");
  const [asiScore, setAsiScore] = useState<string>("STR");
  const [asiScore2, setAsiScore2] = useState<string>("STR");
  const [asiValue, setAsiValue] = useState<string>(""); // feat name or score string

  const [phase, setPhase] = useState<Phase>("hp");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abilityScores = ["STR", "DEX", "CON", "INT", "WIS", "CHA"] as const;

  const handleRollComplete = useCallback((result: number) => {
    setRolledHp(result);
  }, []);

  function chooseHp(choice: HpChoice) {
    const raw = choice === "average" ? averageHp : (rolledHp ?? 0) + conMod;
    const final = Math.max(1, raw);
    setHpChoice(choice);
    setHpGained(final);
    if (isAsiLevel) {
      setPhase("asi");
    } else {
      setPhase("confirm");
    }
  }

  function buildAsiValue(): string {
    if (asiChoice === "feat") return asiValue.trim();
    if (asiScore === asiScore2) return `${asiScore} +2`;
    return `${asiScore} +1, ${asiScore2} +1`;
  }

  async function handleConfirm() {
    setSaving(true);
    setError(null);
    try {
      const asiEntry = isAsiLevel
        ? { level: nextLevel, type: asiChoice, value: buildAsiValue() }
        : null;

      const body: Record<string, unknown> = {
        level: nextLevel,
      };

      if (asiEntry) {
        body.asiChoices = [...character.asiChoices, asiEntry];
      }

      const res = await fetch(`/api/characters/${character.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to level up");
      }

      setPhase("done");
      setTimeout(() => router.push(`/characters/${character.id}`), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setSaving(false);
    }
  }

  // ── HP Phase ──────────────────────────────────────────────────────────────
  if (phase === "hp") {
    return (
      <div className="min-h-screen bg-bg-deep p-6 max-w-lg mx-auto">
        <BackLink id={character.id} />

        <div className="mb-8">
          <h1 className="font-heading text-3xl text-text-highlight">Level Up</h1>
          <p className="text-text-secondary mt-1">
            {character.name} — Level {character.level} → {nextLevel}
          </p>
        </div>

        {newFeatures && newFeatures.features.length > 0 && (
          <Card className="mb-6">
            <h2 className="font-heading text-sm uppercase tracking-widest text-text-secondary mb-3">
              New at Level {nextLevel}
            </h2>
            <ul className="space-y-1">
              {newFeatures.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-text-primary text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </Card>
        )}

        <Card className="mb-6">
          <h2 className="font-heading text-sm uppercase tracking-widest text-text-secondary mb-4">
            Hit Points
          </h2>
          <p className="text-xs text-text-secondary mb-4">
            CON modifier: {conMod >= 0 ? `+${conMod}` : conMod}
          </p>

          <div className="flex gap-6 items-start">
            <div className="flex flex-col items-center gap-2">
              <DiceRoller sides={8} onRollComplete={handleRollComplete} label="Roll d8" />
              {rolledHp !== null && (
                <p className="text-xs text-text-secondary text-center">
                  {rolledHp} + {conMod >= 0 ? `+${conMod}` : conMod} ={" "}
                  <span className="text-hp-green font-bold">
                    +{Math.max(1, rolledHp + conMod)} HP
                  </span>
                </p>
              )}
            </div>

            <div className="flex flex-col items-center gap-2 flex-1">
              <button
                onClick={() => chooseHp("average")}
                className="w-full py-3 px-4 rounded-lg border border-border-subtle bg-bg-elevated hover:border-border-accent hover:bg-bg-hover transition-colors text-sm font-body"
              >
                <div className="text-text-highlight font-bold">Take Average</div>
                <div className="text-text-secondary text-xs mt-0.5">
                  +{averageHp} HP guaranteed
                </div>
              </button>
            </div>
          </div>

          {rolledHp !== null && (
            <button
              onClick={() => chooseHp("rolled")}
              className="w-full mt-4 py-2.5 px-4 rounded-lg border border-hp-green bg-bg-elevated hover:bg-bg-hover transition-colors text-sm font-body text-hp-green font-medium"
            >
              Keep Roll (+{Math.max(1, rolledHp + conMod)} HP)
            </button>
          )}
        </Card>
      </div>
    );
  }

  // ── ASI Phase ─────────────────────────────────────────────────────────────
  if (phase === "asi") {
    return (
      <div className="min-h-screen bg-bg-deep p-6 max-w-lg mx-auto">
        <BackLink id={character.id} />

        <div className="mb-8">
          <h1 className="font-heading text-3xl text-text-highlight">Level Up</h1>
          <p className="text-text-secondary mt-1">ASI / Feat at Level {nextLevel}</p>
          {hpGained !== null && (
            <p className="text-xs text-hp-green mt-1">+{hpGained} HP confirmed</p>
          )}
        </div>

        <Card className="mb-6">
          <h2 className="font-heading text-sm uppercase tracking-widest text-text-secondary mb-4">
            Ability Score Improvement or Feat
          </h2>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setAsiChoice("asi")}
              className={`flex-1 py-2 rounded-lg border text-sm font-body transition-colors ${
                asiChoice === "asi"
                  ? "border-accent bg-bg-elevated text-accent"
                  : "border-border-subtle bg-bg-elevated text-text-secondary hover:border-border-accent"
              }`}
            >
              +2 to One / +1 to Two
            </button>
            <button
              onClick={() => setAsiChoice("feat")}
              className={`flex-1 py-2 rounded-lg border text-sm font-body transition-colors ${
                asiChoice === "feat"
                  ? "border-accent bg-bg-elevated text-accent"
                  : "border-border-subtle bg-bg-elevated text-text-secondary hover:border-border-accent"
              }`}
            >
              Feat
            </button>
          </div>

          {asiChoice === "asi" ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-secondary uppercase tracking-widest block mb-2">
                  Score 1 (+1 or +2)
                </label>
                <select
                  value={asiScore}
                  onChange={(e) => setAsiScore(e.target.value)}
                  className="w-full bg-bg-elevated border border-border-subtle rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent"
                >
                  {abilityScores.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-text-secondary uppercase tracking-widest block mb-2">
                  Score 2 (same = +2 to Score 1; different = +1 each)
                </label>
                <select
                  value={asiScore2}
                  onChange={(e) => setAsiScore2(e.target.value)}
                  className="w-full bg-bg-elevated border border-border-subtle rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent"
                >
                  {abilityScores.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-text-secondary">
                Result: <span className="text-text-primary">{buildAsiValue()}</span>
              </p>
            </div>
          ) : (
            <div>
              <label className="text-xs text-text-secondary uppercase tracking-widest block mb-2">
                Feat Name
              </label>
              <input
                type="text"
                value={asiValue}
                onChange={(e) => setAsiValue(e.target.value)}
                placeholder="e.g., Sentinel, Lucky, Polearm Master..."
                className="w-full bg-bg-elevated border border-border-subtle rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent placeholder:text-text-secondary"
              />
            </div>
          )}
        </Card>

        <button
          onClick={() => setPhase("confirm")}
          disabled={asiChoice === "feat" && !asiValue.trim()}
          className="w-full py-3 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-body font-medium transition-colors"
        >
          Continue
        </button>
      </div>
    );
  }

  // ── Confirm Phase ─────────────────────────────────────────────────────────
  if (phase === "confirm") {
    return (
      <div className="min-h-screen bg-bg-deep p-6 max-w-lg mx-auto">
        <BackLink id={character.id} />

        <div className="mb-8">
          <h1 className="font-heading text-3xl text-text-highlight">Confirm Level Up</h1>
          <p className="text-text-secondary mt-1">
            {character.name} → Level {nextLevel}
          </p>
        </div>

        <Card variant="accent" className="mb-6">
          <h2 className="font-heading text-sm uppercase tracking-widest text-text-secondary mb-4">
            Summary
          </h2>
          <div className="space-y-3">
            <SummaryRow label="New Level" value={`${nextLevel}`} />
            {hpGained !== null && (
              <SummaryRow label="HP Gained" value={`+${hpGained}`} valueClass="text-hp-green" />
            )}
            {newFeatures?.features.map((f) => (
              <SummaryRow key={f} label="New Feature" value={f} />
            ))}
            {isAsiLevel && (
              <SummaryRow
                label={asiChoice === "feat" ? "Feat" : "ASI"}
                value={buildAsiValue()}
              />
            )}
          </div>
        </Card>

        {error && (
          <p className="text-hp-red text-sm mb-4">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => setPhase(isAsiLevel ? "asi" : "hp")}
            className="flex-1 py-3 rounded-lg border border-border-subtle bg-bg-elevated hover:bg-bg-hover text-text-secondary font-body transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleConfirm}
            disabled={saving}
            className="flex-1 py-3 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-60 text-white font-body font-medium transition-colors"
          >
            {saving ? "Saving..." : "Level Up"}
          </button>
        </div>
      </div>
    );
  }

  // ── Done Phase ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg-deep flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">⚔</div>
        <h1 className="font-heading text-3xl text-text-highlight mb-2">
          Level {nextLevel}!
        </h1>
        <p className="text-text-secondary">Redirecting...</p>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function BackLink({ id }: { id: string }) {
  return (
    <a
      href={`/characters/${id}`}
      className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm font-body mb-6 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back to Character
    </a>
  );
}

function SummaryRow({
  label,
  value,
  valueClass = "text-text-primary",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className={`text-sm font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}
