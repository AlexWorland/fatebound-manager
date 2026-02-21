"use client";

import React from "react";

interface DamageTypeBadgeProps {
  type: string;
}

const TYPE_COLORS: Record<string, string> = {
  piercing: "bg-builder-blue/20 text-builder-blue border-builder-blue/40",
  slashing: "bg-accent/20 text-accent border-accent/40",
  bludgeoning: "bg-bg-elevated text-text-secondary border-border-subtle",
  fire: "bg-orange-500/20 text-orange-400 border-orange-500/40",
  cold: "bg-sky-500/20 text-sky-400 border-sky-500/40",
  lightning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  thunder: "bg-violet-500/20 text-violet-400 border-violet-500/40",
  poison: "bg-green-500/20 text-green-400 border-green-500/40",
  acid: "bg-lime-500/20 text-lime-400 border-lime-500/40",
  necrotic: "bg-gray-700/20 text-gray-400 border-gray-600/40",
  radiant: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  force: "bg-white/10 text-white border-white/30",
  psychic: "bg-pink-500/20 text-pink-400 border-pink-500/40",
};

export default function DamageTypeBadge({ type }: DamageTypeBadgeProps) {
  const colorClass =
    TYPE_COLORS[type.toLowerCase()] ?? "bg-bg-elevated text-text-secondary border-border-subtle";

  return (
    <span
      className={`text-[10px] font-condensed font-bold uppercase px-1.5 py-0.5 rounded border whitespace-nowrap ${colorClass}`}
    >
      {type}
    </span>
  );
}
