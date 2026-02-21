"use client";

interface PassiveSensesProps {
  passivePerception: number;
  passiveInvestigation: number;
  passiveInsight: number;
}

const SENSES = [
  { key: "passivePerception", label: "Passive Perception" },
  { key: "passiveInvestigation", label: "Passive Investigation" },
  { key: "passiveInsight", label: "Passive Insight" },
] as const;

export default function PassiveSenses({
  passivePerception,
  passiveInvestigation,
  passiveInsight,
}: PassiveSensesProps) {
  const values: Record<string, number> = {
    passivePerception,
    passiveInvestigation,
    passiveInsight,
  };

  return (
    <div className="bg-bg-surface rounded p-3">
      <div className="flex flex-col gap-2">
        {SENSES.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-lg font-bold text-text-primary bg-bg-elevated rounded px-2 py-0.5 min-w-[40px] text-center tabular-nums">
              {values[key]}
            </span>
            <span className="text-[10px] font-condensed font-bold uppercase text-text-muted tracking-wider">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
