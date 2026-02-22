"use client";

import { Card } from "@/components/ui";
import { SPECIES, type Species } from "@/data/species";

export function SpeciesStep({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (name: string) => void;
}) {
  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-heading text-text-highlight">Species</h2>
          <p className="text-sm text-text-secondary mt-1">
            Choose your character's species. Ability bonuses apply on top of your point-buy scores.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SPECIES.map((s) => (
            <SpeciesCard
              key={s.name}
              species={s}
              isSelected={selected === s.name}
              onSelect={() => onSelect(s.name)}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}

function SpeciesCard({
  species,
  isSelected,
  onSelect,
}: {
  species: Species;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const bonusEntries = Object.entries(species.abilityBonuses);

  return (
    <button
      onClick={onSelect}
      className={`text-left p-4 rounded-lg border transition-colors ${
        isSelected
          ? "bg-fate/10 border-fate text-text-highlight"
          : "bg-bg-elevated border-border-subtle text-text-primary hover:border-fate/50 hover:bg-bg-hover"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-heading text-sm font-semibold">
          {species.name}
        </span>
        <span className="text-xs text-text-secondary font-mono shrink-0">
          {species.speed} ft
        </span>
      </div>

      {bonusEntries.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {bonusEntries.map(([ab, val]) => (
            <span
              key={ab}
              className="px-1.5 py-0.5 rounded text-xs font-mono bg-fate/20 text-fate border border-fate/30"
            >
              +{val} {ab}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1 mt-2">
        {species.traits.map((t) => (
          <span
            key={t}
            className="px-1.5 py-0.5 rounded text-xs text-text-secondary bg-bg-deep border border-border-subtle"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-2 text-xs text-text-secondary">
        {species.languages.join(", ")}
      </div>
    </button>
  );
}
