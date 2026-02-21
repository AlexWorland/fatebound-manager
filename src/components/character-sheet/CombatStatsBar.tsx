"use client";

interface CombatStatsBarProps {
  initiative: number;
  armorClass: number;
  armorSource?: string;
  speed?: number;
  proficiencyBonus: number;
}

interface StatBoxProps {
  value: string;
  label: string;
  sublabel?: string;
}

function StatBox({ value, label, sublabel }: StatBoxProps) {
  return (
    <div className="border border-border-subtle rounded p-2 text-center min-w-[80px] bg-bg-surface">
      <div className="text-xl font-bold text-text-highlight leading-none">{value}</div>
      <div className="text-[10px] font-condensed font-bold uppercase text-text-muted tracking-wider mt-1">
        {label}
      </div>
      {sublabel && (
        <div className="text-[9px] text-text-muted mt-0.5 truncate">{sublabel}</div>
      )}
    </div>
  );
}

export default function CombatStatsBar({
  initiative,
  armorClass,
  armorSource,
  speed = 30,
  proficiencyBonus,
}: CombatStatsBarProps) {
  const initiativeDisplay = initiative >= 0 ? `+${initiative}` : `${initiative}`;
  const profDisplay = proficiencyBonus >= 0 ? `+${proficiencyBonus}` : `${proficiencyBonus}`;

  return (
    <div className="flex flex-wrap gap-2">
      <StatBox value={initiativeDisplay} label="Initiative" />
      <StatBox value={String(armorClass)} label="Armor Class" sublabel={armorSource} />
      <StatBox value={`${speed} ft.`} label="Walking Speed" />
      <StatBox value={profDisplay} label="Proficiency Bonus" />
    </div>
  );
}
