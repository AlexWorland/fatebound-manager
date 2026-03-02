"use client";

interface HPBoxProps {
  current: number;
  max: number;
}

function getHPColor(current: number, max: number): string {
  if (current === 0) return "text-text-secondary";
  const pct = current / max;
  if (pct > 0.5) return "text-hp-green";
  if (pct > 0.25) return "text-hp-yellow";
  return "text-hp-red";
}

export default function HPBox({ current, max }: HPBoxProps) {
  const colorClass = getHPColor(current, max);

  return (
    <div className="flex items-baseline gap-1">
      <span className={`text-2xl font-bold font-heading ${colorClass}`}>{current}</span>
      <span className="text-text-secondary font-body">/ {max}</span>
    </div>
  );
}
