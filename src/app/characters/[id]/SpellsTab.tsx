"use client";

import React, { useState } from "react";
import { Character, DailyState } from "@/types/character";
import { Card, PipTracker } from "@/components/ui";
import { FATEBOUND_SPELLS } from "@/data/spells";
import { SPELL_LISTS } from "@/data/spell-lists";
import { STABILIZED_FORMS } from "@/data/tables/stabilized-forms";
import { getMysticArcanumLevels } from "@/engine/spell-slots";
import { AbilityScore } from "@/types/forms";
import type { SpellReference, SpellcastingProfile } from "@/types/spells";
import SpellHeader from "@/components/character-sheet/SpellHeader";
import SpellLevelFilter from "@/components/character-sheet/SpellLevelFilter";
import SpellRow from "@/components/character-sheet/SpellRow";
import { extractSpellEffect, extractSpellHitDC } from "@/engine/spell-utils";

interface Props {
  character: Character;
  dailyState: DailyState | null;
  onDailyStateChange: (state: DailyState) => void;
}

function getProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

function getModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/** Determine spellcasting ability for the current form. Defaults to INT for chaos forms. */
function getSpellcastingAbility(dailyState: DailyState | null): AbilityScore {
  if (!dailyState) return "INT";
  if (dailyState.formType === "STABILIZED" && dailyState.stabilizedFormId) {
    const form = STABILIZED_FORMS.find((f) => f.id === dailyState.stabilizedFormId);
    if (form?.castingAbility) return form.castingAbility;
  }
  return "INT";
}

const LEVEL_ORDINALS: Record<number, string> = {
  0: "CANTRIPS",
  1: "1ST LEVEL",
  2: "2ND LEVEL",
  3: "3RD LEVEL",
  4: "4TH LEVEL",
  5: "5TH LEVEL",
  6: "6TH LEVEL",
  7: "7TH LEVEL",
  8: "8TH LEVEL",
  9: "9TH LEVEL",
};

export default function SpellsTab({ character, dailyState, onDailyStateChange }: Props) {
  const [search, setSearch] = useState("");
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const [expandedSpells, setExpandedSpells] = useState<Set<string>>(new Set());

  // Determine if the current form has spellcasting
  const hasSpellcasting = (() => {
    if (!dailyState) return false;
    if (dailyState.formType === "STABILIZED" && dailyState.stabilizedFormId) {
      const form = STABILIZED_FORMS.find((f) => f.id === dailyState.stabilizedFormId);
      return form?.hasSpellcasting ?? false;
    }
    // Chaos form — spellcasting comes from Table B; spellSlots will be non-empty
    return Object.values(dailyState.spellSlots).some((s) => s.max > 0);
  })();

  const mysticArcanumLevels = getMysticArcanumLevels(character.level);

  // Spellcasting profile and resolved prepared spells
  const spellcastingProfile: SpellcastingProfile | null | undefined = dailyState?.spellcastingProfile;

  const resolvedPreparedSpells: SpellReference[] = (() => {
    if (!dailyState?.preparedSpells || !spellcastingProfile) return [];
    const spellList = SPELL_LISTS[spellcastingProfile.spellList] ?? [];
    return dailyState.preparedSpells
      .map((slug) => spellList.find((s) => s.slug === slug))
      .filter((s): s is SpellReference => s !== undefined);
  })();

  const resolvedCantrips: SpellReference[] = (() => {
    if (!dailyState?.knownCantrips || !spellcastingProfile) return [];
    const spellList = SPELL_LISTS[spellcastingProfile.spellList] ?? [];
    return dailyState.knownCantrips
      .map((slug) => spellList.find((s) => s.slug === slug))
      .filter((s): s is SpellReference => s !== undefined);
  })();

  const handleSlotToggle = async (slotLevel: string, index: number) => {
    if (!dailyState) return;
    const tracker = dailyState.spellSlots[slotLevel];
    if (!tracker) return;

    const currentUsed = tracker.used;
    const newUsed =
      index < currentUsed
        ? index
        : Math.min(index + 1, tracker.max);

    const newState: DailyState = {
      ...dailyState,
      spellSlots: {
        ...dailyState.spellSlots,
        [slotLevel]: { ...tracker, used: newUsed },
      },
    };
    onDailyStateChange(newState);

    try {
      await fetch(`/api/characters/${character.id}/daily-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spellSlots: newState.spellSlots }),
      });
    } catch {
      // Ignore network errors; parent state already updated optimistically
    }
  };

  const toggleSpell = (key: string) => {
    setExpandedSpells((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleCastSpell = async (spellLevel: number) => {
    if (!dailyState) return;

    const slotEntries = Object.entries(dailyState.spellSlots)
      .filter(([key, tracker]) => {
        const level = parseInt(key, 10);
        return !isNaN(level) && level >= spellLevel && tracker.used < tracker.max;
      })
      .sort(([a], [b]) => Number(a) - Number(b));

    if (slotEntries.length === 0) return;

    const [slotKey, tracker] = slotEntries[0];
    const newState: DailyState = {
      ...dailyState,
      spellSlots: {
        ...dailyState.spellSlots,
        [slotKey]: { ...tracker, used: tracker.used + 1 },
      },
    };
    onDailyStateChange(newState);

    try {
      await fetch(`/api/characters/${character.id}/daily-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spellSlots: newState.spellSlots }),
      });
    } catch {
      // Ignore network errors; already updated optimistically
    }
  };

  // Filter Fatebound spells
  const filteredFateboundSpells = FATEBOUND_SPELLS.filter((spell) => {
    const matchesSearch =
      search.trim() === "" ||
      spell.name.toLowerCase().includes(search.toLowerCase()) ||
      spell.school.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = activeLevel === null || spell.level === activeLevel;
    return matchesSearch && matchesLevel;
  });

  // Filter prepared spells by search and level
  const filteredPreparedSpells = resolvedPreparedSpells.filter((spell) => {
    const matchesSearch =
      search.trim() === "" ||
      spell.name.toLowerCase().includes(search.toLowerCase()) ||
      spell.school.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = activeLevel === null || spell.level === activeLevel;
    return matchesSearch && matchesLevel;
  });

  // Filter cantrips by search
  const filteredCantrips = resolvedCantrips.filter((spell) => {
    const matchesSearch =
      search.trim() === "" ||
      spell.name.toLowerCase().includes(search.toLowerCase()) ||
      spell.school.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = activeLevel === null || activeLevel === 0;
    return matchesSearch && matchesLevel;
  });

  // Available levels for the filter bar (union of all spell sources)
  const allLevels = Array.from(
    new Set([
      ...FATEBOUND_SPELLS.map((s) => s.level),
      ...resolvedPreparedSpells.map((s) => s.level),
      ...(resolvedCantrips.length > 0 ? [0] : []),
    ])
  ).sort((a, b) => a - b);

  // Group filtered Fatebound spells by level
  const fateboundByLevel = filteredFateboundSpells.reduce<Record<number, typeof FATEBOUND_SPELLS>>(
    (acc, spell) => {
      if (!acc[spell.level]) acc[spell.level] = [];
      acc[spell.level].push(spell);
      return acc;
    },
    {}
  );
  const fateboundSortedLevels = Object.keys(fateboundByLevel)
    .map(Number)
    .sort((a, b) => a - b);

  // Group filtered prepared spells by level
  const preparedByLevel = filteredPreparedSpells.reduce<Record<number, SpellReference[]>>(
    (acc, spell) => {
      if (!acc[spell.level]) acc[spell.level] = [];
      acc[spell.level].push(spell);
      return acc;
    },
    {}
  );
  const preparedSortedLevels = Object.keys(preparedByLevel)
    .map(Number)
    .sort((a, b) => a - b);

  // Slot entries for active spell slots
  const slotEntries = dailyState
    ? Object.entries(dailyState.spellSlots)
        .filter(([, tracker]) => tracker.max > 0)
        .sort(([a], [b]) => Number(a) - Number(b))
    : [];

  // Spellcasting stats
  const castingAbility = getSpellcastingAbility(dailyState);
  const abilityScore = character.abilityScores[castingAbility as keyof typeof character.abilityScores] ?? 10;
  const abilityMod = getModifier(abilityScore);
  const profBonus = getProficiencyBonus(character.level);
  const spellAttack = abilityMod + profBonus;
  const spellSaveDC = 8 + abilityMod + profBonus;

  if (!hasSpellcasting) {
    return (
      <div className="flex flex-col gap-4">
        <Card>
          <p className="text-text-secondary font-body text-sm">
            {dailyState
              ? "Today's form does not grant spellcasting."
              : "No dawn roll recorded. Spellcasting depends on today's form."}
          </p>
        </Card>

        {/* Spell List Reference */}
        <Card>
          <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-3">
            Fatebound Spell List (Reference)
          </h3>

          {/* Search */}
          <input
            type="text"
            placeholder="Search spells..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-3 px-3 py-1.5 text-sm font-body bg-bg-elevated border border-border-subtle rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
          />

          {/* Level filter */}
          <div className="mb-3">
            <SpellLevelFilter
              levels={allLevels}
              activeLevel={activeLevel}
              onLevelChange={setActiveLevel}
            />
          </div>

          {/* Spell groups */}
          {fateboundSortedLevels.map((level) => (
            <div key={level} className="mb-4 last:mb-0">
              <div className="flex items-center gap-2 mb-1 pb-1 border-b border-border-subtle">
                <span className="text-[10px] font-condensed font-bold uppercase text-text-muted tracking-wider">
                  {LEVEL_ORDINALS[level] ?? `Level ${level}`}
                </span>
              </div>
              {fateboundByLevel[level].map((spell) => (
                <SpellRow
                  key={spell.name}
                  spell={{
                    ...spell,
                    concentration: spell.duration?.toLowerCase().includes("concentration"),
                  }}
                  expanded={expandedSpells.has(spell.name)}
                  onToggle={() => toggleSpell(spell.name)}
                  hitDC={extractSpellHitDC(spell.description, spellAttack, spellSaveDC)}
                  effect={extractSpellEffect(spell.description)}
                  showInlineColumns={true}
                />
              ))}
            </div>
          ))}

          {filteredFateboundSpells.length === 0 && (
            <p className="text-sm font-body text-text-secondary text-center py-4">
              No spells match your search.
            </p>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Spellcasting stats header */}
      <Card>
        <SpellHeader
          spellAttackModifier={spellAttack}
          spellSaveDC={spellSaveDC}
          spellcastingAbility={castingAbility}
        />
      </Card>

      {/* Spellcasting profile info */}
      {spellcastingProfile && (
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading text-text-secondary uppercase tracking-widest">
              {spellcastingProfile.mechanic === "prepared" ? "Prepared" :
               spellcastingProfile.mechanic === "known" ? "Known" :
               spellcastingProfile.mechanic === "grimoire" ? "Grimoire" : "Pact"} Caster
            </span>
            <span className="text-sm font-body text-text-primary">
              {resolvedPreparedSpells.length}/{spellcastingProfile.maxPreparedOrKnown} Spells
              {spellcastingProfile.cantripsKnown > 0 && (
                <> | {resolvedCantrips.length}/{spellcastingProfile.cantripsKnown} Cantrips</>
              )}
            </span>
          </div>
        </Card>
      )}

      {/* Spell slots */}
      {slotEntries.length > 0 && (
        <Card variant="fate">
          <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-3">
            Spell Slots
          </h3>
          <div className="flex flex-col gap-3">
            {slotEntries.map(([level, tracker]) => (
              <PipTracker
                key={level}
                label={`Level ${level}`}
                max={tracker.max}
                used={tracker.used}
                color="bg-fate"
                onToggle={(i) => handleSlotToggle(level, i)}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Search bar (shared across all spell sections) */}
      <div>
        <input
          type="text"
          placeholder="Search spells..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-1.5 text-sm font-body bg-bg-elevated border border-border-subtle rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
        />
      </div>

      {/* Level filter */}
      <SpellLevelFilter
        levels={allLevels}
        activeLevel={activeLevel}
        onLevelChange={setActiveLevel}
      />

      {/* Known Cantrips */}
      {resolvedCantrips.length > 0 && filteredCantrips.length > 0 && (
        <Card>
          <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-3">
            Known Cantrips
          </h3>
          {filteredCantrips.map((spell) => (
            <SpellRow
              key={spell.slug}
              spell={{ ...spell }}
              expanded={expandedSpells.has(spell.slug)}
              onToggle={() => toggleSpell(spell.slug)}
              hitDC={extractSpellHitDC(spell.description, spellAttack, spellSaveDC)}
              effect={extractSpellEffect(spell.description)}
              showInlineColumns={true}
            />
          ))}
        </Card>
      )}

      {/* Prepared/Known Spells */}
      {hasSpellcasting && spellcastingProfile && (
        <Card>
          <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-3">
            {spellcastingProfile.mechanic === "prepared" ? "Prepared" : "Known"} Spells
          </h3>
          {resolvedPreparedSpells.length === 0 ? (
            <p className="text-sm font-body text-text-secondary text-center py-4">
              No spells prepared for today. Spell selection can be done during the dawn roll.
            </p>
          ) : preparedSortedLevels.length === 0 ? (
            <p className="text-sm font-body text-text-secondary text-center py-4">
              No spells match your search.
            </p>
          ) : (
            preparedSortedLevels.map((level) => {
              const slotKey = String(level);
              const slotTracker = level > 0 ? dailyState?.spellSlots[slotKey] : undefined;
              return (
                <div key={level} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between gap-2 mb-1 pb-1 border-b border-border-subtle">
                    <span className="text-[10px] font-condensed font-bold uppercase text-text-muted tracking-wider">
                      {LEVEL_ORDINALS[level] ?? `Level ${level}`}
                    </span>
                    {slotTracker && slotTracker.max > 0 && (
                      <PipTracker
                        label=""
                        max={slotTracker.max}
                        used={slotTracker.used}
                        color="bg-fate"
                        onToggle={(i) => handleSlotToggle(slotKey, i)}
                      />
                    )}
                  </div>
                  {preparedByLevel[level].map((spell) => (
                    <SpellRow
                      key={spell.slug}
                      spell={{ ...spell }}
                      expanded={expandedSpells.has(spell.slug)}
                      onToggle={() => toggleSpell(spell.slug)}
                      onCast={spell.level > 0 ? () => handleCastSpell(spell.level) : undefined}
                      hitDC={extractSpellHitDC(spell.description, spellAttack, spellSaveDC)}
                      effect={extractSpellEffect(spell.description)}
                      showInlineColumns={true}
                    />
                  ))}
                </div>
              );
            })
          )}
        </Card>
      )}

      {/* Mystic Arcanum (level 13+) */}
      {mysticArcanumLevels.length > 0 && (
        <Card variant="fate">
          <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-3">
            Mystic Arcanum
          </h3>
          <div className="flex flex-col gap-3">
            {mysticArcanumLevels.map((slotLevel) => {
              const key = `arcanum_${slotLevel}`;
              const tracker = dailyState?.spellSlots[key] ?? { max: 1, used: 0 };
              return (
                <PipTracker
                  key={key}
                  label={`${slotLevel}th-level (1/LR)`}
                  max={tracker.max}
                  used={tracker.used}
                  color="bg-fate"
                  onToggle={(i) => handleSlotToggle(key, i)}
                />
              );
            })}
          </div>
        </Card>
      )}

      {/* Fatebound Spells (Always Available) */}
      <Card>
        <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-3">
          Fatebound Spells (Always Available)
        </h3>

        {/* Spells grouped by level */}
        {fateboundSortedLevels.map((level) => {
          const slotKey = String(level);
          const slotTracker = level > 0 ? dailyState?.spellSlots[slotKey] : undefined;

          return (
            <div key={level} className="mb-4 last:mb-0">
              {/* Level header with pip tracker on the right */}
              <div className="flex items-center justify-between gap-2 mb-1 pb-1 border-b border-border-subtle">
                <span className="text-[10px] font-condensed font-bold uppercase text-text-muted tracking-wider">
                  {LEVEL_ORDINALS[level] ?? `Level ${level}`}
                </span>
                {slotTracker && slotTracker.max > 0 && (
                  <PipTracker
                    label=""
                    max={slotTracker.max}
                    used={slotTracker.used}
                    color="bg-fate"
                    onToggle={(i) => handleSlotToggle(slotKey, i)}
                  />
                )}
              </div>

              {fateboundByLevel[level].map((spell) => (
                <SpellRow
                  key={spell.name}
                  spell={{
                    ...spell,
                    concentration: spell.duration?.toLowerCase().includes("concentration"),
                  }}
                  expanded={expandedSpells.has(spell.name)}
                  onToggle={() => toggleSpell(spell.name)}
                  onCast={spell.level > 0 ? () => handleCastSpell(spell.level) : undefined}
                  hitDC={extractSpellHitDC(spell.description, spellAttack, spellSaveDC)}
                  effect={extractSpellEffect(spell.description)}
                  showInlineColumns={true}
                />
              ))}
            </div>
          );
        })}

        {filteredFateboundSpells.length === 0 && (
          <p className="text-sm font-body text-text-secondary text-center py-4">
            No spells match your search.
          </p>
        )}
      </Card>
    </div>
  );
}
