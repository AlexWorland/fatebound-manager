"use client";

import React from "react";
import { Tooltip } from "@/components/ui";

interface CombatStatsBarProps {
  ac: number;
  speed?: number;
  initiative: number;
  acBreakdown?: string;
}

function StatBox({
  label,
  value,
  breakdown,
}: {
  label: string;
  value: string | number;
  breakdown?: string;
}) {
  const content = (
    <div className="flex flex-col items-center justify-center bg-bg-elevated border border-border-subtle rounded-lg p-2">
      <span className="text-xs font-body text-text-secondary uppercase tracking-widest">
        {label}
      </span>
      <span className="text-xl font-heading text-text-highlight">
        {typeof value === "number" && value >= 0 ? `+${value}` : value}
      </span>
    </div>
  );

  if (breakdown) {
    return (
      <Tooltip content={breakdown} position="top" delay={200}>
        {content}
      </Tooltip>
    );
  }

  return content;
}

export default function CombatStatsBar({
  ac,
  speed = 30,
  initiative,
  acBreakdown,
}: CombatStatsBarProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <StatBox label="AC" value={ac} breakdown={acBreakdown} />
      <StatBox label="Speed" value={speed} />
      <StatBox label="Init" value={initiative} />
    </div>
  );
}
