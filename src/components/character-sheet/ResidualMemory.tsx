"use client";

import React from "react";
import { Card } from "@/components/ui";
import type { MemorySlot } from "@/types/features";

const CATEGORY_NAMES: Record<number, string> = {
  1: "Combat Style",
  2: "Skill",
  3: "Defense",
  4: "Utility",
  5: "Spell",
  6: "Special",
};

interface ResidualMemoryProps {
  slots: MemorySlot[];
}

export default function ResidualMemory({ slots }: ResidualMemoryProps) {
  if (slots.length === 0) return null;

  return (
    <Card variant="fate" className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-fate-glow text-lg">✦</span>
        <h3 className="font-heading text-fate-glow tracking-wide">Residual Memory</h3>
      </div>
      <div className="flex flex-col gap-2">
        {slots.map((slot, i) => (
          <div
            key={`${slot.featureId}-${i}`}
            className="flex items-center justify-between gap-3 py-1"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-5 h-5 rounded-full bg-fate/30 border border-fate/60 flex items-center justify-center text-xs text-fate-glow flex-shrink-0">
                {slot.category}
              </span>
              <span className="font-body text-sm text-text-highlight truncate">
                {slot.name}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs font-body text-fate-glow/70">
                {CATEGORY_NAMES[slot.category] ?? `Cat. ${slot.category}`}
              </span>
              <span className="text-xs font-body text-text-secondary">{slot.source}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
