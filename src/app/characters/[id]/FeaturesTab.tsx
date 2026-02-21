"use client";

import React from "react";
import { Character, DailyState } from "@/types/character";
import { Card, PipTracker, PoolTracker } from "@/components/ui";
import { TABLE_A_CHASSIS } from "@/data/tables/table-a-chassis";
import { TABLE_B_PRIMARY } from "@/data/tables/table-b-primary";
import { TABLE_C_DEFENSIVE } from "@/data/tables/table-c-defensive";
import { TABLE_D_FEATS } from "@/data/tables/table-d-feats";
import { STABILIZED_FORMS } from "@/data/tables/stabilized-forms";
import { LEVEL_PROGRESSION, CLASS_FEATURE_DESCRIPTIONS } from "@/data/level-progression";

interface Props {
  character: Character;
  dailyState: DailyState | null;
  proficiencyBonus: number;
  onDailyStateChange?: (state: DailyState) => void;
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] font-condensed font-bold uppercase text-text-muted tracking-wider mb-3">
      {children}
    </h3>
  );
}

function FeatureRow({
  name,
  source,
  description,
  autoRollResult,
}: {
  name: string;
  source?: string;
  description: string;
  autoRollResult?: string;
}) {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div className="border-b border-border-subtle last:border-0 pb-2 mb-2 last:pb-0 last:mb-0">
      <button
        className="w-full flex items-start justify-between gap-2 text-left group"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-text-secondary text-xs shrink-0">
            {expanded ? "▾" : "▸"}
          </span>
          <span className="text-sm font-condensed font-bold text-text-primary group-hover:text-text-highlight transition-colors">
            {name}
          </span>
          {autoRollResult && (
            <span className="text-xs px-2 py-0.5 bg-fate/20 text-fate-glow rounded-full border border-fate/30">
              {autoRollResult}
            </span>
          )}
          {source && (
            <span className="text-xs text-text-secondary font-condensed">
              [{source}]
            </span>
          )}
        </div>
      </button>
      {expanded && (
        <p className="text-sm text-text-secondary mt-1.5 leading-relaxed pl-5">
          {description}
        </p>
      )}
    </div>
  );
}

export default function FeaturesTab({ character, dailyState, proficiencyBonus, onDailyStateChange }: Props) {
  // Class-level features from level progression
  const classFeatures = LEVEL_PROGRESSION.filter((lf) => lf.level <= character.level).flatMap(
    (lf) => lf.features.map((f) => ({ name: f, level: lf.level }))
  );

  if (!dailyState) {
    return (
      <div className="flex flex-col gap-4">
        {/* No daily state — show class features only */}
        <Card>
          <SectionHeader>Class Features (Level {character.level})</SectionHeader>
          <div>
            {classFeatures.map((f) => (
              <FeatureRow
                key={`${f.level}-${f.name}`}
                name={f.name}
                source={`Level ${f.level}`}
                description={CLASS_FEATURE_DESCRIPTIONS[f.name] ?? ""}
              />
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-text-secondary text-sm">
            No dawn roll recorded for today. Complete a Dawn Roll to see today's form features.
          </p>
        </Card>
      </div>
    );
  }

  const isChaos = dailyState.formType === "CHAOS";

  return (
    <div className="flex flex-col gap-4">
      {isChaos ? (
        <ChaosFormFeatures dailyState={dailyState} proficiencyBonus={proficiencyBonus} characterId={String(character.id)} onDailyStateChange={onDailyStateChange} />
      ) : (
        <StabilizedFormFeatures dailyState={dailyState} character={character} proficiencyBonus={proficiencyBonus} onDailyStateChange={onDailyStateChange} />
      )}

      {/* Residual Memory */}
      {dailyState.residualMemorySlots.length > 0 && (
        <Card variant="fate">
          <SectionHeader>Residual Memory</SectionHeader>
          <div>
            {dailyState.residualMemorySlots.map((slot) => (
              <div
                key={slot.featureId}
                className="flex items-center gap-2 py-1.5 border-b border-border-subtle last:border-0"
              >
                <span className="text-xs px-1.5 py-0.5 rounded border border-fate text-fate-glow font-mono">
                  {slot.category}
                </span>
                <div>
                  <span className="text-sm font-condensed font-bold text-text-primary">{slot.name}</span>
                  <span className="text-xs text-text-secondary ml-2">from {slot.source}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Class progression features */}
      <Card>
        <SectionHeader>Class Features (Level {character.level})</SectionHeader>
        <div>
          {classFeatures.map((f) => (
            <FeatureRow
              key={`${f.level}-${f.name}`}
              name={f.name}
              source={`Level ${f.level}`}
              description={CLASS_FEATURE_DESCRIPTIONS[f.name] ?? ""}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

function ChaosFormFeatures({
  dailyState,
  proficiencyBonus,
  characterId,
  onDailyStateChange,
}: {
  dailyState: DailyState;
  proficiencyBonus: number;
  characterId: string;
  onDailyStateChange?: (state: DailyState) => void;
}) {
  const autoRollResults = dailyState.autoRollResults ?? {};
  const chassis = dailyState.chaosTableA
    ? TABLE_A_CHASSIS.find((c) => c.id === dailyState.chaosTableA!.chassisId) ??
      TABLE_A_CHASSIS[dailyState.chaosTableA.roll - 1]
    : null;
  const primary = dailyState.chaosTableB
    ? TABLE_B_PRIMARY[dailyState.chaosTableB.roll - 1]
    : null;
  const defensive = dailyState.chaosTableC
    ? TABLE_C_DEFENSIVE[dailyState.chaosTableC.roll - 1]
    : null;
  const feats = dailyState.chaosTableD
    ? dailyState.chaosTableD.map((d) => TABLE_D_FEATS.find((f) => f.id === d.featId)).filter(Boolean)
    : [];

  const handleResourceToggle = async (resourceKey: string, index: number) => {
    if (!onDailyStateChange) return;
    const tracker = dailyState.classResources[resourceKey];
    if (!tracker) return;

    const newUsed = index < tracker.used ? index : Math.min(index + 1, tracker.max);
    const newState: DailyState = {
      ...dailyState,
      classResources: {
        ...dailyState.classResources,
        [resourceKey]: { ...tracker, used: newUsed },
      },
    };
    onDailyStateChange(newState);

    try {
      await fetch(`/api/characters/${characterId}/daily-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classResources: newState.classResources }),
      });
    } catch {
      // Optimistic update already applied
    }
  };

  const handlePoolIncrement = async (resourceKey: string) => {
    if (!onDailyStateChange) return;
    const tracker = dailyState.classResources[resourceKey];
    if (!tracker || tracker.used <= 0) return;

    const newState: DailyState = {
      ...dailyState,
      classResources: {
        ...dailyState.classResources,
        [resourceKey]: { ...tracker, used: tracker.used - 1 },
      },
    };
    onDailyStateChange(newState);
    try {
      await fetch(`/api/characters/${characterId}/daily-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classResources: newState.classResources }),
      });
    } catch {}
  };

  const handlePoolDecrement = async (resourceKey: string) => {
    if (!onDailyStateChange) return;
    const tracker = dailyState.classResources[resourceKey];
    if (!tracker || tracker.used >= tracker.max) return;

    const newState: DailyState = {
      ...dailyState,
      classResources: {
        ...dailyState.classResources,
        [resourceKey]: { ...tracker, used: tracker.used + 1 },
      },
    };
    onDailyStateChange(newState);
    try {
      await fetch(`/api/characters/${characterId}/daily-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classResources: newState.classResources }),
      });
    } catch {}
  };

  return (
    <>
      {/* Chaos Form card — DDB-style left accent stripe */}
      <div className="rounded shadow-card bg-bg-surface border border-border-subtle border-l-4 border-l-accent overflow-hidden">
        <div className="px-4 pt-4 pb-3">
          <SectionHeader>Chaos Form</SectionHeader>

          {chassis && (
            <div className="mb-3">
              <p className="text-[10px] font-condensed font-bold uppercase text-text-muted tracking-wider mb-1">
                Table A — Chassis
              </p>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-condensed font-bold text-text-primary">
                  {chassis.name}
                </span>
                <span className="text-xs text-text-secondary">
                  d{chassis.hitDie} hit die
                </span>
                <span className="text-xs text-text-secondary">
                  Armor: {chassis.armorProficiencies[0] === "none" ? "No Armor" : chassis.armorProficiencies.join(", ")}
                </span>
              </div>
            </div>
          )}

          {primary && (
            <FeatureRow
              name={primary.name}
              source={`Table B · ${primary.className}`}
              description={primary.description}
              autoRollResult={autoRollResults[primary.name]}
            />
          )}

          {defensive && (
            <FeatureRow
              name={defensive.name}
              source="Table C"
              description={defensive.description}
              autoRollResult={autoRollResults[defensive.name]}
            />
          )}
        </div>
      </div>

      {feats.length > 0 && (
        <Card>
          <SectionHeader>Table D — Feats</SectionHeader>
          {feats.map(
            (feat) =>
              feat && (
                <FeatureRow
                  key={feat.id}
                  name={feat.name}
                  description={`${feat.description}${feat.notes ? ` ${feat.notes}` : ""}`}
                  autoRollResult={autoRollResults[feat.name]}
                />
              )
          )}
        </Card>
      )}

      {/* Class resources for chaos form */}
      {Object.keys(dailyState.classResources).length > 0 && (
        <Card>
          <SectionHeader>Resources</SectionHeader>
          <div className="flex flex-col gap-3">
            {Object.entries(dailyState.classResources).map(([key, tracker]) => (
              tracker.max > 12 ? (
                <PoolTracker
                  key={key}
                  label={key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  max={tracker.max}
                  used={tracker.used}
                  onDecrement={() => handlePoolDecrement(key)}
                  onIncrement={() => handlePoolIncrement(key)}
                />
              ) : (
                <PipTracker
                  key={key}
                  label={key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  max={tracker.max}
                  used={tracker.used}
                  onToggle={(i) => handleResourceToggle(key, i)}
                />
              )
            ))}
          </div>
        </Card>
      )}
    </>
  );
}

function StabilizedFormFeatures({
  dailyState,
  character,
  proficiencyBonus,
  onDailyStateChange,
}: {
  dailyState: DailyState;
  character: Character;
  proficiencyBonus: number;
  onDailyStateChange?: (state: DailyState) => void;
}) {
  const characterId = String(character.id);

  const handleResourceToggle = async (resourceKey: string, index: number) => {
    if (!onDailyStateChange) return;
    const tracker = dailyState.classResources[resourceKey];
    if (!tracker) return;

    const newUsed = index < tracker.used ? index : Math.min(index + 1, tracker.max);
    const newState: DailyState = {
      ...dailyState,
      classResources: {
        ...dailyState.classResources,
        [resourceKey]: { ...tracker, used: newUsed },
      },
    };
    onDailyStateChange(newState);

    try {
      await fetch(`/api/characters/${characterId}/daily-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classResources: newState.classResources }),
      });
    } catch {
      // Optimistic update already applied
    }
  };

  const handlePoolIncrement = async (resourceKey: string) => {
    if (!onDailyStateChange) return;
    const tracker = dailyState.classResources[resourceKey];
    if (!tracker || tracker.used <= 0) return;

    const newState: DailyState = {
      ...dailyState,
      classResources: {
        ...dailyState.classResources,
        [resourceKey]: { ...tracker, used: tracker.used - 1 },
      },
    };
    onDailyStateChange(newState);
    try {
      await fetch(`/api/characters/${characterId}/daily-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classResources: newState.classResources }),
      });
    } catch {}
  };

  const handlePoolDecrement = async (resourceKey: string) => {
    if (!onDailyStateChange) return;
    const tracker = dailyState.classResources[resourceKey];
    if (!tracker || tracker.used >= tracker.max) return;

    const newState: DailyState = {
      ...dailyState,
      classResources: {
        ...dailyState.classResources,
        [resourceKey]: { ...tracker, used: tracker.used + 1 },
      },
    };
    onDailyStateChange(newState);
    try {
      await fetch(`/api/characters/${characterId}/daily-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classResources: newState.classResources }),
      });
    } catch {}
  };

  const autoRollResults = dailyState.autoRollResults ?? {};

  const form = dailyState.stabilizedFormId
    ? STABILIZED_FORMS.find((f) => f.id === dailyState.stabilizedFormId)
    : null;

  if (!form) {
    return (
      <Card variant="fate">
        <p className="text-text-secondary text-sm">
          Stabilized form details not available.
        </p>
      </Card>
    );
  }

  // Find active subclass from the form's subclasses
  const subclass = dailyState.stabilizedSubclassId
    ? form.subclasses.find((s) => s.id === dailyState.stabilizedSubclassId) ?? null
    : null;

  return (
    <>
      {/* Stabilized Form card — DDB-style left fate stripe */}
      <div className="rounded shadow-card bg-bg-surface border border-border-subtle border-l-4 border-l-fate overflow-hidden">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-start justify-between mb-3">
            <div>
              <SectionHeader>Stabilized Form</SectionHeader>
              <h4 className="text-lg font-heading text-fate-glow">{form.name}</h4>
              <p className="text-xs text-text-secondary font-condensed">
                {form.className} · d{form.hitDie} · {form.savingThrows.join(" & ")} saves
              </p>
              {subclass && (
                <p className="text-xs text-fate-glow font-condensed mt-1">
                  Subclass: {subclass.name}
                </p>
              )}
            </div>
          </div>

          {/* Base features */}
          <div>
            {form.baseFeatures.map((bf) => (
              <FeatureRow
                key={bf.name}
                name={bf.name}
                description={bf.description}
                autoRollResult={autoRollResults[bf.name]}
              />
            ))}
          </div>

          {/* Subclass features by level */}
          {subclass && character.level >= 9 && (
            <div className="mt-3 border-t border-border-subtle pt-3">
              <p className="text-[10px] font-condensed font-bold uppercase text-text-muted tracking-wider mb-2">
                Subclass Features
              </p>
              <FeatureRow
                name={subclass.level9Feature.name}
                source="Level 9"
                description={subclass.level9Feature.description}
                autoRollResult={autoRollResults[subclass.level9Feature.name]}
              />
              {character.level >= 13 && (
                <FeatureRow
                  name={subclass.level13Feature.name}
                  source="Level 13"
                  description={subclass.level13Feature.description}
                  autoRollResult={autoRollResults[subclass.level13Feature.name]}
                />
              )}
              {character.level >= 17 && (
                <FeatureRow
                  name={subclass.level17Feature.name}
                  source="Level 17"
                  description={subclass.level17Feature.description}
                  autoRollResult={autoRollResults[subclass.level17Feature.name]}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chaos Resonance (level 15+) */}
      {character.level >= 15 && dailyState.chaosResonance && (
        <div className="rounded shadow-card bg-bg-surface border border-border-subtle border-l-4 border-l-accent overflow-hidden">
          <div className="px-4 pt-4 pb-3">
            <SectionHeader>Chaos Resonance</SectionHeader>
            <p className="text-xs text-text-secondary">
              Retaining form {dailyState.chaosResonance.formId} features as resonance bonus.
            </p>
          </div>
        </div>
      )}

      {/* Class resources */}
      {Object.keys(dailyState.classResources).length > 0 && (
        <Card>
          <SectionHeader>Resources</SectionHeader>
          <div className="flex flex-col gap-3">
            {Object.entries(dailyState.classResources).map(([key, tracker]) => (
              tracker.max > 12 ? (
                <PoolTracker
                  key={key}
                  label={key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  max={tracker.max}
                  used={tracker.used}
                  onDecrement={() => handlePoolDecrement(key)}
                  onIncrement={() => handlePoolIncrement(key)}
                />
              ) : (
                <PipTracker
                  key={key}
                  label={key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  max={tracker.max}
                  used={tracker.used}
                  onToggle={(i) => handleResourceToggle(key, i)}
                />
              )
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
