"use client";

const ABILITIES = ["STR", "DEX", "CON", "INT", "WIS", "CHA"] as const;
const ABILITY_LABELS: Record<string, string> = {
  STR: "Strength",
  DEX: "Dexterity",
  CON: "Constitution",
  INT: "Intelligence",
  WIS: "Wisdom",
  CHA: "Charisma",
};

function getModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

interface SavingThrowsProps {
  abilityScores: Record<string, number>;
  proficiencyBonus: number;
  saveProficiencies?: string[];
  fateResistanceSave?: string;
}

export default function SavingThrows({
  abilityScores,
  proficiencyBonus,
  saveProficiencies = [],
  fateResistanceSave,
}: SavingThrowsProps) {
  return (
    <div className="bg-bg-surface rounded p-3">
      <div className="text-[10px] font-condensed font-bold uppercase text-text-muted tracking-wider mb-2">
        Saving Throws
      </div>

      <div className="flex flex-col">
        {ABILITIES.map((ability) => {
          const score = abilityScores[ability] ?? 10;
          const mod = getModifier(score);
          const isProficient = saveProficiencies.includes(ability);
          const isFateResistance = fateResistanceSave === ability;
          const total = isProficient ? mod + proficiencyBonus : mod;
          const display = total >= 0 ? `+${total}` : `${total}`;

          return (
            <div key={ability} className="flex items-center h-[34px] gap-2">
              {/* Proficiency dot */}
              <div
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  isProficient
                    ? "bg-accent"
                    : "border border-text-muted bg-transparent"
                }`}
              />

              {/* Modifier */}
              <span className="text-sm font-bold text-text-primary w-[40px] text-right tabular-nums">
                {display}
              </span>

              {/* Ability name */}
              <span className="text-xs font-condensed font-bold uppercase text-text-secondary flex-1">
                {ABILITY_LABELS[ability]}
              </span>

              {/* Fate Resistance indicator */}
              {isFateResistance && (
                <span className="text-[9px] font-condensed font-bold uppercase text-fate tracking-wider">
                  Fate
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
