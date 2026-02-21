"use client";

import React from "react";
import type { ComputedAttack } from "@/types/actions";
import { formatMod } from "@/engine/attack-calc";
import DamageTypeBadge from "./DamageTypeBadge";

interface WeaponAttackRowProps {
  attack: ComputedAttack;
  proficiencyBonus: number;
  fightingStyle?: string;
  onRollAttack?: (attack: ComputedAttack) => void;
}

export default function WeaponAttackRow({
  attack,
  onRollAttack,
}: WeaponAttackRowProps) {
  return (
    <div className="border-b border-border-subtle last:border-0 py-2 px-2 hover:bg-bg-elevated/50 transition-colors cursor-pointer group">
      <div className="flex items-center gap-3">
        {/* Name column */}
        <div className="flex-1 min-w-0">
          <button
            onClick={() => onRollAttack?.(attack)}
            className="text-sm font-body font-semibold text-text-primary group-hover:text-accent transition-colors text-left truncate block"
          >
            {attack.displayName}
          </button>
          <span className="text-[10px] font-condensed uppercase text-text-muted tracking-wider">
            {attack.weaponType}
          </span>
        </div>

        {/* Range */}
        <span className="text-xs text-text-secondary shrink-0 w-16 text-center">
          {attack.range}
        </span>

        {/* Hit bonus */}
        <span className="text-sm font-mono font-bold text-text-highlight shrink-0 w-10 text-center">
          {formatMod(attack.attackBonus)}
        </span>

        {/* Damage + type badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-sm font-mono text-text-primary">{attack.damage}</span>
          <DamageTypeBadge type={attack.damageType} />
        </div>
      </div>

      {/* Bonus damage / notes row */}
      {(attack.bonusDamage || attack.notes) && (
        <div className="flex items-center gap-2 mt-0.5 pl-0">
          {attack.bonusDamage && (
            <span className="text-xs text-text-secondary">
              + {attack.bonusDamage}{" "}
              {attack.bonusDamageType && (
                <DamageTypeBadge type={attack.bonusDamageType} />
              )}
            </span>
          )}
          {attack.notes && (
            <span className="text-xs text-text-muted italic">{attack.notes}</span>
          )}
        </div>
      )}
    </div>
  );
}
