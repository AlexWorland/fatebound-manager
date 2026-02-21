"use client";

import React, { useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import { getCasterProfile, getMaxSpellLevel } from "@/engine/spell-prep";
import { SPELL_LISTS } from "@/data/spell-lists";
import { FATEBOUND_SPELLS } from "@/data/spells";
import type { Character, AbilityScores } from "@/types/character";
import type { SpellcastingProfile, SpellReference } from "@/types/spells";

export interface SpellSelectionResult {
  preparedSpells: string[];
  knownCantrips: string[];
  spellcastingProfile: SpellcastingProfile;
}

interface SpellSelectionStepProps {
  character: Character;
  formClassName: string;
  level: number;
  abilityScores: AbilityScores;
  isChaosForm: boolean;
  onComplete: (result: SpellSelectionResult) => void;
}

const LEVEL_LABELS: Record<number, string> = {
  0: "Cantrips",
  1: "1st",
  2: "2nd",
  3: "3rd",
  4: "4th",
  5: "5th",
  6: "6th",
  7: "7th",
  8: "8th",
  9: "9th",
};

function levelOrdinal(level: number): string {
  return LEVEL_LABELS[level] ?? `${level}th`;
}

export default function SpellSelectionStep({
  character,
  formClassName,
  level,
  abilityScores,
  isChaosForm,
  onComplete,
}: SpellSelectionStepProps) {
  const profile = getCasterProfile(formClassName, level, abilityScores, isChaosForm);

  const [selectedCantrips, setSelectedCantrips] = useState<Set<string>>(new Set());
  const [selectedSpells, setSelectedSpells] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const maxSpellLevel = getMaxSpellLevel(level);

  // Build the selectable spell list
  const rawSpells = useMemo<SpellReference[]>(() => {
    const list = SPELL_LISTS[formClassName] ?? [];

    // For Sage Grimoire (Wizard), filter to grimoire if non-empty
    if (formClassName === "Wizard" && character.sageGrimoire && character.sageGrimoire.length > 0) {
      return list.filter((s) => character.sageGrimoire!.includes(s.slug));
    }
    return list;
  }, [formClassName, character.sageGrimoire]);

  const showGrimoireNote =
    formClassName === "Wizard" &&
    (!character.sageGrimoire || character.sageGrimoire.length === 0);

  // Filter by max spell level
  const eligibleSpells = useMemo(
    () => rawSpells.filter((s) => s.level === 0 || s.level <= maxSpellLevel),
    [rawSpells, maxSpellLevel],
  );

  // Apply search + level filter
  const filteredSpells = useMemo(() => {
    return eligibleSpells.filter((s) => {
      const matchesSearch =
        search.trim() === "" || s.name.toLowerCase().includes(search.toLowerCase());
      const matchesLevel = activeLevel === null || s.level === activeLevel;
      return matchesSearch && matchesLevel;
    });
  }, [eligibleSpells, search, activeLevel]);

  const cantripsInList = filteredSpells.filter((s) => s.level === 0);
  const leveledInList = filteredSpells.filter((s) => s.level > 0);

  // Available level tabs
  const availableLevels = useMemo(() => {
    const levels = new Set(eligibleSpells.map((s) => s.level));
    return Array.from(levels).sort((a, b) => a - b);
  }, [eligibleSpells]);

  function toggleCantrip(slug: string) {
    setSelectedCantrips((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else if (!profile || next.size < profile.cantripsKnown) {
        next.add(slug);
      }
      return next;
    });
  }

  function toggleSpell(slug: string) {
    setSelectedSpells((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else if (!profile || next.size < profile.maxPreparedOrKnown) {
        next.add(slug);
      }
      return next;
    });
  }

  function toggleExpanded(slug: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  if (!profile) return null;

  const cantripsValid = selectedCantrips.size === profile.cantripsKnown || profile.cantripsKnown === 0;
  const spellsValid = selectedSpells.size === profile.maxPreparedOrKnown || profile.maxPreparedOrKnown === 0;
  const canConfirm = cantripsValid && spellsValid;

  function handleConfirm() {
    if (!profile || !canConfirm) return;
    onComplete({
      preparedSpells: Array.from(selectedSpells),
      knownCantrips: Array.from(selectedCantrips),
      spellcastingProfile: profile,
    });
  }

  const mechanicLabel =
    profile.mechanic === "prepared"
      ? "Prepare"
      : profile.mechanic === "grimoire"
        ? "Copy to Memory"
        : "Know";

  return (
    <div className="space-y-4">
      {/* Header card */}
      <Card>
        <div className="space-y-1">
          <h2 className="font-heading text-lg text-text-primary uppercase tracking-wide">
            Prepare Spells
          </h2>
          <p className="text-sm text-text-secondary font-body">
            {formClassName} &mdash; {profile.castingAbility}-based
          </p>
          {showGrimoireNote && (
            <p className="text-xs text-text-muted font-body italic">
              Grimoire not yet set up &mdash; selecting from full Wizard list for now.
            </p>
          )}
          <div className="flex gap-4 pt-1 text-sm font-body">
            {profile.cantripsKnown > 0 && (
              <span className={selectedCantrips.size === profile.cantripsKnown ? "text-fate font-bold" : "text-text-secondary"}>
                Cantrips: {selectedCantrips.size}/{profile.cantripsKnown}
              </span>
            )}
            <span className={selectedSpells.size === profile.maxPreparedOrKnown ? "text-fate font-bold" : "text-text-secondary"}>
              {mechanicLabel}: {selectedSpells.size}/{profile.maxPreparedOrKnown}
            </span>
          </div>
        </div>
      </Card>

      {/* Search + filter */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Search spells..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-bg-elevated border border-border-subtle rounded px-3 py-2 text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:border-fate/60"
        />

        {/* Level filter */}
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setActiveLevel(null)}
            className={
              activeLevel === null
                ? "bg-accent text-white rounded px-2 py-0.5 text-xs font-bold"
                : "text-text-secondary hover:text-text-primary px-2 py-0.5 text-xs font-bold transition-colors"
            }
          >
            ALL
          </button>
          {availableLevels.map((lv) => (
            <button
              key={lv}
              onClick={() => setActiveLevel(lv)}
              className={
                activeLevel === lv
                  ? "bg-accent text-white rounded px-2 py-0.5 text-xs font-bold"
                  : "text-text-secondary hover:text-text-primary px-2 py-0.5 text-xs font-bold transition-colors"
              }
            >
              {lv === 0 ? "CANTRIPS" : levelOrdinal(lv).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Cantrips section */}
      {profile.cantripsKnown > 0 && (activeLevel === null || activeLevel === 0) && cantripsInList.length > 0 && (
        <Card>
          <h3 className="text-xs font-heading uppercase text-text-muted tracking-wider mb-2">
            Cantrips &mdash; Select {profile.cantripsKnown}
          </h3>
          <div className="space-y-0">
            {cantripsInList.map((spell) => {
              const isSelected = selectedCantrips.has(spell.slug);
              const isExpanded = expanded.has(spell.slug);
              const isDisabled = !isSelected && selectedCantrips.size >= profile.cantripsKnown;
              return (
                <div key={spell.slug} className="border-b border-border-subtle last:border-0">
                  <div className="flex items-center gap-2 py-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => toggleCantrip(spell.slug)}
                      className="shrink-0 accent-[var(--color-fate)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                    <button
                      onClick={() => toggleExpanded(spell.slug)}
                      className="flex-1 min-w-0 text-left flex items-center gap-1.5"
                    >
                      <span className={`text-sm font-body truncate ${isSelected ? "text-text-primary font-medium" : "text-text-secondary"}`}>
                        {spell.name}
                      </span>
                      {spell.concentration && (
                        <span className="shrink-0 text-[10px] font-bold text-white bg-fate/60 border border-fate/40 rounded px-1">C</span>
                      )}
                      {spell.ritual && (
                        <span className="shrink-0 text-[10px] font-bold text-text-muted border border-border-subtle rounded px-1">R</span>
                      )}
                      {spell.school && (
                        <span className="shrink-0 text-[10px] text-text-muted">{spell.school}</span>
                      )}
                    </button>
                    <button
                      onClick={() => toggleExpanded(spell.slug)}
                      className="shrink-0 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <span className="text-xs">{isExpanded ? "▼" : "▶"}</span>
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="pb-3 pl-6 pr-2">
                      <p className="text-xs text-text-secondary leading-relaxed">{spell.description}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Leveled spells section */}
      {(activeLevel === null || activeLevel > 0) && leveledInList.length > 0 && (
        <Card>
          <h3 className="text-xs font-heading uppercase text-text-muted tracking-wider mb-2">
            Spells &mdash; {mechanicLabel} {profile.maxPreparedOrKnown}
          </h3>
          <div className="space-y-0">
            {leveledInList.map((spell) => {
              const isSelected = selectedSpells.has(spell.slug);
              const isExpanded = expanded.has(spell.slug);
              const isDisabled = !isSelected && selectedSpells.size >= profile.maxPreparedOrKnown;
              return (
                <div key={spell.slug} className="border-b border-border-subtle last:border-0">
                  <div className="flex items-center gap-2 py-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => toggleSpell(spell.slug)}
                      className="shrink-0 accent-[var(--color-fate)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                    <button
                      onClick={() => toggleExpanded(spell.slug)}
                      className="flex-1 min-w-0 text-left flex items-center gap-1.5"
                    >
                      <span className={`text-sm font-body truncate ${isSelected ? "text-text-primary font-medium" : "text-text-secondary"}`}>
                        {spell.name}
                      </span>
                      <span className="shrink-0 text-[10px] text-text-muted bg-bg-elevated border border-border-subtle rounded px-1">
                        {levelOrdinal(spell.level)}
                      </span>
                      {spell.school && (
                        <span className="shrink-0 text-[10px] text-text-muted">{spell.school}</span>
                      )}
                      {spell.concentration && (
                        <span className="shrink-0 text-[10px] font-bold text-white bg-fate/60 border border-fate/40 rounded px-1">C</span>
                      )}
                      {spell.ritual && (
                        <span className="shrink-0 text-[10px] font-bold text-text-muted border border-border-subtle rounded px-1">R</span>
                      )}
                    </button>
                    <button
                      onClick={() => toggleExpanded(spell.slug)}
                      className="shrink-0 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <span className="text-xs">{isExpanded ? "▼" : "▶"}</span>
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="pb-3 pl-6 pr-2 space-y-1">
                      <div className="grid grid-cols-2 gap-x-4 text-xs text-text-secondary">
                        {spell.castingTime && (
                          <span><span className="text-text-primary">Casting Time:</span> {spell.castingTime}</span>
                        )}
                        {spell.range && (
                          <span><span className="text-text-primary">Range:</span> {spell.range}</span>
                        )}
                        {spell.school && (
                          <span><span className="text-text-primary">School:</span> {spell.school}</span>
                        )}
                        {spell.components && (
                          <span><span className="text-text-primary">Components:</span> {spell.components}</span>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed mt-1">{spell.description}</p>
                      {spell.higherLevel && (
                        <p className="text-xs text-text-muted leading-relaxed italic">{spell.higherLevel}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Fatebound always-available spells */}
      <Card>
        <h3 className="text-xs font-heading uppercase text-text-muted tracking-wider mb-2">
          Fatebound Spells (Always Available)
        </h3>
        <div className="space-y-0">
          {FATEBOUND_SPELLS.map((spell) => (
            <div key={spell.name} className="border-b border-border-subtle last:border-0 py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-body text-text-muted">{spell.name}</span>
                {"level" in spell && typeof spell.level === "number" && spell.level === 0 && (
                  <span className="text-[10px] text-text-muted">Cantrip</span>
                )}
                {"level" in spell && typeof spell.level === "number" && spell.level > 0 && (
                  <span className="text-[10px] text-text-muted bg-bg-elevated border border-border-subtle rounded px-1">
                    {levelOrdinal(spell.level)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Confirm button */}
      <button
        onClick={handleConfirm}
        disabled={!canConfirm}
        className={`w-full py-3 rounded-lg font-heading font-bold text-sm uppercase tracking-wide transition-all duration-150 ${
          canConfirm
            ? "bg-accent text-white hover:bg-accent-hover"
            : "bg-bg-elevated text-text-secondary border border-border-subtle cursor-not-allowed opacity-50"
        }`}
      >
        Confirm Spells &rarr;
      </button>
    </div>
  );
}
