"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import DiceRoller from "@/components/ui/DiceRoller";
import type { Character } from "@/types/character";
import { LEVEL_PROGRESSION } from "@/data/level-progression";

const ASI_LEVELS = new Set([4, 8, 12, 16, 19]);

const STANDARD_FEATS = [
  { name: "Alert", description: "+5 initiative, can't be surprised, no hidden-attacker advantage" },
  { name: "Athlete", description: "+1 STR or DEX, various athletic bonuses including faster climbing" },
  { name: "Actor", description: "+1 CHA, mimic voices, advantage on Deception/Performance disguised" },
  { name: "Charger", description: "Bonus attack or shove after Dash action" },
  { name: "Crossbow Expert", description: "No loading penalty, no disadvantage in melee, bonus hand crossbow attack" },
  { name: "Defensive Duelist", description: "Reaction to add proficiency bonus to AC when wielding finesse weapon" },
  { name: "Dual Wielder", description: "+1 AC when dual wielding, use non-light weapons, draw two at once" },
  { name: "Dungeon Delver", description: "Advantage on perception/investigation for traps, resistance to trap damage" },
  { name: "Durable", description: "+1 CON, minimum CON modifier × 2 on hit dice rolls" },
  { name: "Elemental Adept", description: "Choose damage type: ignore resistance, 1s become 2s on that damage" },
  { name: "Grappler", description: "Advantage on attacks against grappled creatures, can restrain" },
  { name: "Great Weapon Master", description: "Bonus attack on crit/kill, -5 attack/+10 damage option" },
  { name: "Healer", description: "Stabilize and restore 1d6 + 4 + HD with healer's kit, once per short rest" },
  { name: "Heavily Armored", description: "+1 STR, gain heavy armor proficiency" },
  { name: "Heavy Armor Master", description: "+1 STR, reduce non-magical weapon damage by 3 in heavy armor" },
  { name: "Inspiring Leader", description: "Spend 10 min to grant temp HP = level + CHA mod to 6 creatures" },
  { name: "Keen Mind", description: "+1 INT, always know north/time, recall anything seen/heard in last month" },
  { name: "Lightly Armored", description: "+1 STR or DEX, gain light armor proficiency" },
  { name: "Linguist", description: "+1 INT, learn 3 languages, create ciphers" },
  { name: "Lucky", description: "3 luck points per long rest to reroll attack, ability check, or saving throw" },
  { name: "Mage Slayer", description: "Reaction to attack caster in melee, disadvantage on concentration saves" },
  { name: "Magic Initiate", description: "Learn 2 cantrips and one 1st-level spell from chosen class" },
  { name: "Martial Adept", description: "Learn 2 maneuvers, gain 1 superiority die (d6)" },
  { name: "Medium Armor Master", description: "+1 STR or DEX, no stealth disadvantage, max DEX bonus +3" },
  { name: "Mobile", description: "+10 speed, Dash ignores difficult terrain, no OA from attacked creature" },
  { name: "Moderately Armored", description: "+1 STR or DEX, gain medium armor and shield proficiency" },
  { name: "Mounted Combatant", description: "Advantage vs unmounted smaller foes, redirect attacks to mount" },
  { name: "Observant", description: "+1 INT or WIS, read lips, +5 passive Perception and Investigation" },
  { name: "Polearm Master", description: "Bonus butt-end attack, OA when creatures enter reach" },
  { name: "Resilient", description: "+1 to one ability score, gain proficiency in that saving throw" },
  { name: "Ritual Caster", description: "Learn 2 ritual spells from chosen class, cast them as rituals" },
  { name: "Savage Attacker", description: "Once per turn reroll melee damage dice, take either result" },
  { name: "Sentinel", description: "Reduce speed to 0 on OA hit, OA even on Disengage, OA vs attackers of others" },
  { name: "Sharpshooter", description: "No disadvantage at long range, ignore cover, -5/+10 damage option" },
  { name: "Shield Master", description: "Bonus shove after Attack, add shield to DEX saves, succeed on DEX saves" },
  { name: "Skilled", description: "Gain proficiency in any 3 skills or tools" },
  { name: "Skulker", description: "+1 DEX, hide in light obscurement, no reveal on missed ranged attack" },
  { name: "Spell Sniper", description: "Double spell range, ignore cover, learn one attack-roll cantrip" },
  { name: "Tavern Brawler", description: "+1 STR or CON, proficient with improvised weapons, bonus grapple" },
  { name: "Tough", description: "+2 HP per level (retroactive)" },
  { name: "War Caster", description: "Advantage on concentration saves, somatic with full hands, cast as OA" },
  { name: "Weapon Master", description: "+1 STR or DEX, gain proficiency with 4 weapons of your choice" },
] as const;

interface LevelUpClientProps {
  character: Character;
}

type HpChoice = "rolled" | "average" | null;
type AsiChoice = "asi" | "feat";
type AsiSubChoice = "+2-one" | "+1-two";
type Phase = "hp" | "asi" | "confirm" | "done";

type AbilityScoreKey = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

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
  const [asiSubChoice, setAsiSubChoice] = useState<AsiSubChoice>("+2-one");
  const [asiScore1, setAsiScore1] = useState<AbilityScoreKey>("STR");
  const [asiScore2, setAsiScore2] = useState<AbilityScoreKey>("DEX");
  const [selectedFeat, setSelectedFeat] = useState<string>("");
  const [featSearch, setFeatSearch] = useState<string>("");

  const [phase, setPhase] = useState<Phase>("hp");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abilityScores: AbilityScoreKey[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

  const filteredFeats = useMemo(() => {
    const q = featSearch.toLowerCase();
    if (!q) return STANDARD_FEATS;
    return STANDARD_FEATS.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
    );
  }, [featSearch]);

  const handleRollComplete = useCallback((result: number) => {
    setRolledHp(result);
  }, []);

  function chooseHp(choice: HpChoice) {
    const raw = choice === "average" ? averageHp : Math.max(1, (rolledHp ?? 0) + conMod);
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
    if (asiChoice === "feat") return selectedFeat;
    if (asiSubChoice === "+2-one") return `${asiScore1} +2`;
    return `${asiScore1} +1, ${asiScore2} +1`;
  }

  function computeUpdatedAbilityScores(): Record<AbilityScoreKey, number> | null {
    if (!isAsiLevel || asiChoice !== "asi") return null;

    const updated = { ...character.abilityScores } as Record<AbilityScoreKey, number>;
    if (asiSubChoice === "+2-one") {
      updated[asiScore1] = Math.min(20, updated[asiScore1] + 2);
    } else {
      updated[asiScore1] = Math.min(20, updated[asiScore1] + 1);
      updated[asiScore2] = Math.min(20, updated[asiScore2] + 1);
    }
    return updated;
  }

  function isAsiValid(): boolean {
    if (!isAsiLevel) return true;
    if (asiChoice === "feat") return selectedFeat.trim() !== "";
    return true;
  }

  async function handleConfirm() {
    setSaving(true);
    setError(null);
    try {
      const asiEntry = isAsiLevel
        ? { level: nextLevel, type: asiChoice, value: buildAsiValue() }
        : null;

      const updatedAbilityScores = computeUpdatedAbilityScores();

      // Build character update body
      const characterBody: Record<string, unknown> = {
        level: nextLevel,
      };

      if (asiEntry) {
        characterBody.asiChoices = [...character.asiChoices, asiEntry];
      }

      if (updatedAbilityScores) {
        characterBody.abilityScores = updatedAbilityScores;
      }

      // Update character level (and ASI/ability scores if applicable)
      const charRes = await fetch(`/api/characters/${character.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(characterBody),
      });

      if (!charRes.ok) {
        const data = await charRes.json();
        throw new Error(data.error ?? "Failed to level up");
      }

      // Update current HP in today's daily state if there is one
      if (hpGained !== null && hpGained > 0) {
        const stateRes = await fetch(`/api/characters/${character.id}/daily-state`);
        if (stateRes.ok) {
          const dailyState = await stateRes.json();
          await fetch(`/api/characters/${character.id}/daily-state`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentHP: (dailyState.currentHP ?? 0) + hpGained }),
          });
        }
        // If no daily state exists yet, the HP gain will be reflected when the dawn roll is done
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
    const projectedScores = computeUpdatedAbilityScores();

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

          {/* Main choice: ASI vs Feat */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setAsiChoice("asi")}
              className={`flex-1 py-2 rounded-lg border text-sm font-body transition-colors ${
                asiChoice === "asi"
                  ? "border-accent bg-bg-elevated text-accent"
                  : "border-border-subtle bg-bg-elevated text-text-secondary hover:border-border-accent"
              }`}
            >
              Ability Score
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
              {/* Sub-choice: +2 one vs +1 two */}
              <div className="flex gap-2">
                <button
                  onClick={() => setAsiSubChoice("+2-one")}
                  className={`flex-1 py-2 rounded-lg border text-xs font-body transition-colors ${
                    asiSubChoice === "+2-one"
                      ? "border-accent bg-bg-elevated text-accent"
                      : "border-border-subtle bg-bg-elevated text-text-secondary hover:border-border-accent"
                  }`}
                >
                  +2 to One Score
                </button>
                <button
                  onClick={() => setAsiSubChoice("+1-two")}
                  className={`flex-1 py-2 rounded-lg border text-xs font-body transition-colors ${
                    asiSubChoice === "+1-two"
                      ? "border-accent bg-bg-elevated text-accent"
                      : "border-border-subtle bg-bg-elevated text-text-secondary hover:border-border-accent"
                  }`}
                >
                  +1 to Two Scores
                </button>
              </div>

              <div className={`grid gap-4 ${asiSubChoice === "+1-two" ? "grid-cols-2" : "grid-cols-1"}`}>
                <div>
                  <label className="text-xs text-text-secondary uppercase tracking-widest block mb-2">
                    {asiSubChoice === "+2-one" ? "Score (+2)" : "First Score (+1)"}
                  </label>
                  <select
                    value={asiScore1}
                    onChange={(e) => setAsiScore1(e.target.value as AbilityScoreKey)}
                    className="w-full bg-bg-elevated border border-border-subtle rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent"
                  >
                    {abilityScores.map((s) => (
                      <option key={s} value={s}>
                        {s} ({character.abilityScores[s]}{projectedScores ? ` → ${projectedScores[s]}` : ""})
                      </option>
                    ))}
                  </select>
                </div>
                {asiSubChoice === "+1-two" && (
                  <div>
                    <label className="text-xs text-text-secondary uppercase tracking-widest block mb-2">
                      Second Score (+1)
                    </label>
                    <select
                      value={asiScore2}
                      onChange={(e) => setAsiScore2(e.target.value as AbilityScoreKey)}
                      className="w-full bg-bg-elevated border border-border-subtle rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent"
                    >
                      {abilityScores.map((s) => (
                        <option key={s} value={s}>
                          {s} ({character.abilityScores[s]}{projectedScores ? ` → ${projectedScores[s]}` : ""})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Current ability scores with projected changes */}
              <div className="mt-2 p-3 rounded-lg bg-bg-elevated border border-border-subtle">
                <p className="text-xs text-text-secondary uppercase tracking-widest mb-2">
                  Current → Projected
                </p>
                <div className="grid grid-cols-6 gap-1">
                  {abilityScores.map((s) => {
                    const current = character.abilityScores[s];
                    const projected = projectedScores ? projectedScores[s] : current;
                    const changed = projected !== current;
                    return (
                      <div key={s} className="text-center">
                        <div className="text-xs text-text-secondary">{s}</div>
                        <div className={`text-sm font-medium ${changed ? "text-accent" : "text-text-primary"}`}>
                          {current}{changed ? `→${projected}` : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="text-xs text-text-secondary">
                Result: <span className="text-text-primary">{buildAsiValue()}</span>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Feat search */}
              <input
                type="text"
                value={featSearch}
                onChange={(e) => setFeatSearch(e.target.value)}
                placeholder="Search feats..."
                className="w-full bg-bg-elevated border border-border-subtle rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent placeholder:text-text-secondary"
              />

              {/* Feat list */}
              <div className="max-h-52 overflow-y-auto rounded-lg border border-border-subtle divide-y divide-border-subtle">
                {filteredFeats.length === 0 ? (
                  <p className="text-center text-text-secondary text-sm py-4">No feats match</p>
                ) : (
                  filteredFeats.map((feat) => (
                    <button
                      key={feat.name}
                      onClick={() => setSelectedFeat(feat.name)}
                      className={`w-full text-left px-3 py-2.5 transition-colors ${
                        selectedFeat === feat.name
                          ? "bg-bg-elevated border-l-2 border-l-accent"
                          : "bg-bg-deep hover:bg-bg-elevated"
                      }`}
                    >
                      <div className={`text-sm font-medium ${selectedFeat === feat.name ? "text-accent" : "text-text-primary"}`}>
                        {feat.name}
                      </div>
                      <div className="text-xs text-text-secondary mt-0.5">{feat.description}</div>
                    </button>
                  ))
                )}
              </div>

              {selectedFeat && (
                <p className="text-xs text-text-secondary">
                  Selected: <span className="text-text-primary font-medium">{selectedFeat}</span>
                </p>
              )}
            </div>
          )}
        </Card>

        <button
          onClick={() => setPhase("confirm")}
          disabled={!isAsiValid()}
          className="w-full py-3 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-body font-medium transition-colors"
        >
          Continue
        </button>
      </div>
    );
  }

  // ── Confirm Phase ─────────────────────────────────────────────────────────
  if (phase === "confirm") {
    const projectedScores = computeUpdatedAbilityScores();

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
            {isAsiLevel && asiChoice === "asi" && projectedScores && (
              <div className="pt-2 border-t border-border-subtle">
                <p className="text-xs text-text-secondary uppercase tracking-widest mb-2">
                  Updated Ability Scores
                </p>
                <div className="grid grid-cols-6 gap-1">
                  {(["STR", "DEX", "CON", "INT", "WIS", "CHA"] as AbilityScoreKey[]).map((s) => {
                    const current = character.abilityScores[s];
                    const projected = projectedScores[s];
                    const changed = projected !== current;
                    return (
                      <div key={s} className="text-center">
                        <div className="text-xs text-text-secondary">{s}</div>
                        <div className={`text-sm font-medium ${changed ? "text-accent" : "text-text-primary"}`}>
                          {projected}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
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
