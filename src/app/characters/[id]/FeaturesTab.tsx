"use client";

import React from "react";
import { Character, DailyState } from "@/types/character";
import { Card, PipTracker } from "@/components/ui";
import { useExpandedState } from "@/lib/ui-state";
import { TABLE_A_CHASSIS } from "@/data/tables/table-a-chassis";
import { TABLE_B_PRIMARY } from "@/data/tables/table-b-primary";
import { TABLE_C_DEFENSIVE } from "@/data/tables/table-c-defensive";
import { TABLE_D_FEATS } from "@/data/tables/table-d-feats";
import { STABILIZED_FORMS } from "@/data/tables/stabilized-forms";
import { LEVEL_PROGRESSION } from "@/data/level-progression";

interface Props {
  character: Character;
  dailyState: DailyState | null;
  proficiencyBonus: number;
  characterId: string;
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-3">
      {children}
    </h3>
  );
}

interface FeatureRowProps {
  id: string;
  name: string;
  source?: string;
  description: string;
  expanded: boolean;
  onToggle: (id: string) => void;
}

function FeatureRow({
  id,
  name,
  source,
  description,
  expanded,
  onToggle,
}: FeatureRowProps) {
  return (
    <div className="border-b border-border-subtle last:border-0 pb-2 mb-2 last:pb-0 last:mb-0">
      <button
        className="w-full flex items-start justify-between gap-2 text-left group"
        onClick={() => onToggle(id)}
      >
        <div>
          <span className="text-sm font-body text-text-primary group-hover:text-text-highlight transition-colors">
            {name}
          </span>
          {source && (
            <span className="text-xs text-text-secondary font-body ml-2">
              [{source}]
            </span>
          )}
        </div>
        <span className="text-text-secondary text-xs mt-0.5 shrink-0">
          {expanded ? "▲" : "▼"}
        </span>
      </button>
      {expanded && (
        <p className="text-xs text-text-secondary font-body mt-1.5 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

export default function FeaturesTab({ character, dailyState, proficiencyBonus, characterId }: Props) {
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
              <div key={`${f.level}-${f.name}`} className="flex items-center gap-2 py-1.5 border-b border-border-subtle last:border-0">
                <span className="text-xs text-text-secondary font-mono w-6 shrink-0">
                  {f.level}
                </span>
                <span className="text-sm font-body text-text-primary">{f.name}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-text-secondary font-body text-sm">
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
        <ChaosFormFeatures dailyState={dailyState} proficiencyBonus={proficiencyBonus} characterId={characterId} />
      ) : (
        <StabilizedFormFeatures dailyState={dailyState} character={character} proficiencyBonus={proficiencyBonus} characterId={characterId} />
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
                  <span className="text-sm font-body text-text-primary">{slot.name}</span>
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
            <div
              key={`${f.level}-${f.name}`}
              className="flex items-center gap-2 py-1.5 border-b border-border-subtle last:border-0"
            >
              <span className="text-xs text-text-secondary font-mono w-6 shrink-0">{f.level}</span>
              <span className="text-sm font-body text-text-primary">{f.name}</span>
            </div>
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
}: {
  dailyState: DailyState;
  proficiencyBonus: number;
  characterId: string;
}) {
  const { isExpanded, toggle } = useExpandedState(`${characterId}:chaos-features`);

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

  return (
    <>
      <Card variant="accent">
        <SectionHeader>Chaos Form</SectionHeader>

        {chassis && (
          <div className="mb-3">
            <p className="text-xs text-text-secondary uppercase tracking-wide font-body mb-1">
              Table A — Chassis
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-body text-text-primary font-medium">
                {chassis.name}
              </span>
              <span className="text-xs text-text-secondary">
                d{chassis.hitDie} hit die
              </span>
              <span className="text-xs text-text-secondary">
                Armor: {chassis.armorProficiencies.join(", ")}
              </span>
            </div>
          </div>
        )}

        {primary && (
          <FeatureRow
            id="primary"
            name={primary.name}
            source={`Table B · ${primary.className}`}
            description={primary.description}
            expanded={isExpanded("primary")}
            onToggle={toggle}
          />
        )}

        {defensive && (
          <FeatureRow
            id="defensive"
            name={defensive.name}
            source="Table C"
            description={defensive.description}
            expanded={isExpanded("defensive")}
            onToggle={toggle}
          />
        )}
      </Card>

      {feats.length > 0 && (
        <Card>
          <SectionHeader>Table D — Feats</SectionHeader>
          {feats.map(
            (feat) =>
              feat && (
                <FeatureRow
                  key={feat.id}
                  id={`feat-${feat.id}`}
                  name={feat.name}
                  description={`${feat.description}${feat.notes ? ` ${feat.notes}` : ""}`}
                  expanded={isExpanded(`feat-${feat.id}`)}
                  onToggle={toggle}
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
              <PipTracker
                key={key}
                label={key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                max={tracker.max}
                used={tracker.used}
                onToggle={() => {}}
              />
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
  characterId,
}: {
  dailyState: DailyState;
  character: Character;
  proficiencyBonus: number;
  characterId: string;
}) {
  const { isExpanded, toggle } = useExpandedState(`${characterId}:stabilized-features`);

  const form = dailyState.stabilizedFormId
    ? STABILIZED_FORMS.find((f) => f.id === dailyState.stabilizedFormId)
    : null;

  if (!form) {
    return (
      <Card variant="fate">
        <p className="text-text-secondary font-body text-sm">
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
      <Card variant="fate">
        <div className="flex items-start justify-between mb-3">
          <div>
            <SectionHeader>Stabilized Form</SectionHeader>
            <h4 className="text-lg font-heading text-fate-glow">{form.name}</h4>
            <p className="text-xs text-text-secondary font-body">
              {form.className} · d{form.hitDie} · {form.savingThrows.join(" & ")} saves
            </p>
            {subclass && (
              <p className="text-xs text-fate-glow font-body mt-1">
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
              id={`base-${bf.name}`}
              name={bf.name}
              description={bf.description}
              expanded={isExpanded(`base-${bf.name}`)}
              onToggle={toggle}
            />
          ))}
        </div>

        {/* Subclass features by level */}
        {subclass && character.level >= 9 && (
          <div className="mt-3 border-t border-border-subtle pt-3">
            <p className="text-xs text-text-secondary uppercase tracking-wide font-body mb-2">
              Subclass Features
            </p>
            <FeatureRow
              id="level9"
              name={subclass.level9Feature.name}
              source="Level 9"
              description={subclass.level9Feature.description}
              expanded={isExpanded("level9")}
              onToggle={toggle}
            />
            {character.level >= 13 && (
              <FeatureRow
                id="level13"
                name={subclass.level13Feature.name}
                source="Level 13"
                description={subclass.level13Feature.description}
                expanded={isExpanded("level13")}
                onToggle={toggle}
              />
            )}
            {character.level >= 17 && (
              <FeatureRow
                id="level17"
                name={subclass.level17Feature.name}
                source="Level 17"
                description={subclass.level17Feature.description}
                expanded={isExpanded("level17")}
                onToggle={toggle}
              />
            )}
          </div>
        )}
      </Card>

      {/* Chaos Resonance (level 15+) */}
      {character.level >= 15 && dailyState.chaosResonance && (
        <Card variant="accent">
          <SectionHeader>Chaos Resonance</SectionHeader>
          <p className="text-xs text-text-secondary font-body">
            Retaining form {dailyState.chaosResonance.formId} features as resonance bonus.
          </p>
        </Card>
      )}

      {/* Class resources */}
      {Object.keys(dailyState.classResources).length > 0 && (
        <Card>
          <SectionHeader>Resources</SectionHeader>
          <div className="flex flex-col gap-3">
            {Object.entries(dailyState.classResources).map(([key, tracker]) => (
              <PipTracker
                key={key}
                label={key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                max={tracker.max}
                used={tracker.used}
                onToggle={() => {}}
              />
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
