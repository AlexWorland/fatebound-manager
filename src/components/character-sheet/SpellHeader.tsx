"use client";

import React from "react";

interface SpellHeaderProps {
  spellAttackModifier: number;
  spellSaveDC: number;
  spellcastingAbility: string;
}

export default function SpellHeader({
  spellAttackModifier,
  spellSaveDC,
  spellcastingAbility,
}: SpellHeaderProps) {
  return (
    <div className="flex gap-2">
      <div className="flex-1 border border-border-subtle rounded p-2 text-center">
        <div className="text-lg font-bold text-text-highlight">
          {spellcastingAbility}
        </div>
        <div className="text-[10px] font-condensed font-bold uppercase text-text-muted tracking-wide">
          Ability
        </div>
      </div>
      <div className="flex-1 border border-border-subtle rounded p-2 text-center">
        <div className="text-lg font-bold text-text-highlight">
          {spellAttackModifier >= 0 ? "+" : ""}{spellAttackModifier}
        </div>
        <div className="text-[10px] font-condensed font-bold uppercase text-text-muted tracking-wide">
          Spell Attack
        </div>
      </div>
      <div className="flex-1 border border-border-subtle rounded p-2 text-center">
        <div className="text-lg font-bold text-text-highlight">
          {spellSaveDC}
        </div>
        <div className="text-[10px] font-condensed font-bold uppercase text-text-muted tracking-wide">
          Save DC
        </div>
      </div>
    </div>
  );
}
