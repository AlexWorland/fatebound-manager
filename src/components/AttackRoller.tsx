"use client";

import React, { useState, useMemo } from "react";
import { AbilityScores } from "@/types/character";
import { AbilityScore } from "@/types/forms";
import { CharacterWeapon } from "@/types/equipment";
import { WEAPONS } from "@/data/weapons";
import { rollDie } from "@/lib/dice";
import {
  getAbilityMod,
  getEffectiveScores,
  parseDamage,
  isFinesse,
  isLight,
  isTwoHanded,
  isVersatile,
  getVersatileDamage,
  getAttackAbility,
  getAttackStyleBonus,
  getDamageStyleBonus,
  formatMod,
} from "@/engine/attack-calc";

interface AttackRollerProps {
  abilityScores: AbilityScores;
  proficiencyBonus: number;
  abilitySwap?: { score1: AbilityScore; score2: AbilityScore } | null;
  fightingStyle?: string;
  characterWeapons?: CharacterWeapon[];
  onClose: () => void;
}

interface RollResult {
  d20: number;
  attackTotal: number;
  breakdown: string;
  isCrit: boolean;
  isFumble: boolean;
}

interface DamageResult {
  dice: number[];
  modifier: number;
  total: number;
  breakdown: string;
}

export default function AttackRoller({
  abilityScores,
  proficiencyBonus,
  abilitySwap,
  fightingStyle,
  characterWeapons,
  onClose,
}: AttackRollerProps) {
  const [selectedWeaponName, setSelectedWeaponName] = useState<string>(WEAPONS[0].name);
  const [useVersatile, setUseVersatile] = useState(false);
  const [isOffHand, setIsOffHand] = useState(false);
  const [attackResult, setAttackResult] = useState<RollResult | null>(null);
  const [damageResult, setDamageResult] = useState<DamageResult | null>(null);

  const effectiveScores = useMemo(
    () => getEffectiveScores(abilityScores, abilitySwap),
    [abilityScores, abilitySwap]
  );

  const weapon = useMemo(
    () => WEAPONS.find((w) => w.name === selectedWeaponName) ?? WEAPONS[0],
    [selectedWeaponName]
  );

  const { ability, mod: abilityMod } = useMemo(
    () => getAttackAbility(weapon, effectiveScores),
    [weapon, effectiveScores]
  );

  const styleAttackBonus = useMemo(
    () => getAttackStyleBonus(weapon, fightingStyle),
    [weapon, fightingStyle]
  );

  const attackBonus = abilityMod + proficiencyBonus + styleAttackBonus;

  const damageString = useVersatile && isVersatile(weapon)
    ? getVersatileDamage(weapon)
    : weapon.damage;

  const styleDamageBonus = useMemo(
    () => getDamageStyleBonus(weapon, fightingStyle, isOffHand, abilityMod, useVersatile),
    [weapon, fightingStyle, isOffHand, abilityMod, useVersatile]
  );

  // Off-hand attacks don't add the ability mod to damage (unless Two-Weapon Fighting style)
  const damageModifier = isOffHand
    ? styleDamageBonus
    : abilityMod + styleDamageBonus;

  function handleRollAttack() {
    setDamageResult(null);
    const d20 = rollDie(20);
    const isCrit = d20 === 20;
    const isFumble = d20 === 1;
    const attackTotal = d20 + attackBonus;

    const parts: string[] = [`d20(${d20})`];
    if (abilityMod !== 0) parts.push(`${ability}(${formatMod(abilityMod)})`);
    if (proficiencyBonus !== 0) parts.push(`prof(${formatMod(proficiencyBonus)})`);
    if (styleAttackBonus !== 0) parts.push(`style(${formatMod(styleAttackBonus)})`);

    setAttackResult({
      d20,
      attackTotal,
      breakdown: parts.join(" + ").replace(/\+ -/g, "- "),
      isCrit,
      isFumble,
    });
  }

  function handleRollDamage() {
    const { count, sides } = parseDamage(damageString);
    const isCrit = attackResult?.isCrit ?? false;
    const rollCount = isCrit ? count * 2 : count;

    let dice: number[];
    if (sides === 0) {
      // Fixed damage (blowgun: "1")
      dice = Array.from({ length: rollCount }, () => count);
    } else {
      dice = Array.from({ length: rollCount }, () => {
        let roll = rollDie(sides);
        // Great Weapon Fighting: reroll 1s and 2s once
        if (fightingStyle === "Great Weapon Fighting" && (roll === 1 || roll === 2)) {
          roll = rollDie(sides);
        }
        return roll;
      });
    }

    const diceSum = dice.reduce((a, b) => a + b, 0);
    const total = Math.max(1, diceSum + damageModifier);

    const diceBreakdown = dice.length > 0 ? `[${dice.join(", ")}]` : "";
    const modStr = damageModifier !== 0 ? formatMod(damageModifier) : "";
    const critStr = isCrit ? " (CRIT)" : "";

    setDamageResult({
      dice,
      modifier: damageModifier,
      total,
      breakdown: `${diceBreakdown}${modStr ? ` ${modStr}` : ""}${critStr}`,
    });
  }

  function handleReset() {
    setAttackResult(null);
    setDamageResult(null);
  }

  const canUseVersatile = isVersatile(weapon) && weapon.range === "melee";
  const canUseOffHand = isLight(weapon) && weapon.range === "melee";
  const isNetWeapon = weapon.name === "Net";

  // Group weapons by category for the dropdown
  const simpleMelee = WEAPONS.filter((w) => w.category === "simple" && w.range === "melee");
  const simpleRanged = WEAPONS.filter((w) => w.category === "simple" && w.range === "ranged");
  const martialMelee = WEAPONS.filter((w) => w.category === "martial" && w.range === "melee");
  const martialRanged = WEAPONS.filter((w) => w.category === "martial" && w.range === "ranged");

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-8 pb-4 sm:pb-8 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-bg-surface border border-border-subtle rounded-xl w-full max-w-md mx-4 shadow-floating">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h2 className="text-xl font-heading text-text-highlight">Attack Roller</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors text-xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="px-6 py-4 space-y-5">
          {/* Weapon selector */}
          <div>
            <label className="block text-xs font-condensed uppercase tracking-wider text-text-secondary mb-1">Weapon</label>
            <select
              value={selectedWeaponName}
              onChange={(e) => {
                setSelectedWeaponName(e.target.value);
                setUseVersatile(false);
                setIsOffHand(false);
                handleReset();
              }}
              className="w-full bg-bg-input border border-border-input rounded px-3 py-2 text-text-primary font-body focus:outline-none focus:border-accent"
            >
              {characterWeapons && characterWeapons.length > 0 && (
                <optgroup label="My Weapons">
                  {characterWeapons.filter(cw => cw.isEquipped).map((cw) => (
                    <option key={cw.id} value={cw.weaponName}>
                      {cw.customName || cw.weaponName}{cw.magicBonus > 0 ? ` (+${cw.magicBonus})` : ""}
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="Simple Melee">
                {simpleMelee.map((w) => (
                  <option key={w.name} value={w.name}>{w.name}</option>
                ))}
              </optgroup>
              <optgroup label="Simple Ranged">
                {simpleRanged.map((w) => (
                  <option key={w.name} value={w.name}>{w.name}</option>
                ))}
              </optgroup>
              <optgroup label="Martial Melee">
                {martialMelee.map((w) => (
                  <option key={w.name} value={w.name}>{w.name}</option>
                ))}
              </optgroup>
              <optgroup label="Martial Ranged">
                {martialRanged.map((w) => (
                  <option key={w.name} value={w.name}>{w.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Weapon info row */}
          <div className="bg-bg-elevated rounded-lg px-4 py-3 text-sm font-body space-y-1">
            <div className="flex gap-4 text-text-secondary">
              <span className="capitalize">{weapon.category} {weapon.range}</span>
              <span>
                {isNetWeapon ? "Special" : `${damageString} ${weapon.damageType}`}
              </span>
              <span>{weapon.cost}</span>
            </div>
            {weapon.properties.length > 0 && (
              <div className="text-text-secondary text-xs">
                {weapon.properties.join(", ")}
              </div>
            )}
          </div>

          {/* Options row */}
          <div className="flex gap-4 text-sm font-body">
            {canUseVersatile && (
              <label className="flex items-center gap-1.5 text-text-secondary cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={useVersatile}
                  onChange={(e) => {
                    setUseVersatile(e.target.checked);
                    handleReset();
                  }}
                  className="accent-fate"
                />
                Two-handed ({getVersatileDamage(weapon)})
              </label>
            )}
            {canUseOffHand && (
              <label className="flex items-center gap-1.5 text-text-secondary cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isOffHand}
                  onChange={(e) => {
                    setIsOffHand(e.target.checked);
                    handleReset();
                  }}
                  className="accent-fate"
                />
                Off-hand
              </label>
            )}
          </div>

          {/* Attack modifier breakdown */}
          <div className="bg-bg-surface rounded-lg px-4 py-3">
            <p className="text-xs font-condensed font-bold uppercase tracking-wider text-text-secondary mb-2">Attack Bonus</p>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-3xl font-mono font-bold text-text-highlight">
                {formatMod(attackBonus)}
              </span>
              <span className="text-sm font-body text-text-secondary">
                {ability} {formatMod(abilityMod)}
                {" + "}prof {formatMod(proficiencyBonus)}
                {styleAttackBonus !== 0 && ` + ${fightingStyle} ${formatMod(styleAttackBonus)}`}
              </span>
            </div>
            {damageModifier !== 0 || styleDamageBonus !== 0 ? (
              <p className="text-xs font-body text-text-secondary mt-1">
                Damage mod: {formatMod(damageModifier)}
                {fightingStyle === "Dueling" && weapon.range === "melee" && !isLight(weapon) && !isTwoHanded(weapon) && (
                  <span className="ml-1">(Dueling +2)</span>
                )}
              </p>
            ) : null}
            {fightingStyle === "Defense" && (
              <p className="text-xs text-fate-glow font-body mt-1">Defense style: +1 AC (passive)</p>
            )}
            {fightingStyle === "Protection" && (
              <p className="text-xs text-fate-glow font-body mt-1">Protection style: impose disadvantage on adjacent ally attacks (reaction)</p>
            )}
            {abilitySwap && (
              <p className="text-xs text-fate-glow font-body mt-1">
                Fate Attunement: {abilitySwap.score1} ↔ {abilitySwap.score2}
              </p>
            )}
          </div>

          {/* Roll buttons */}
          {!isNetWeapon ? (
            <div className="flex gap-3">
              <button
                onClick={handleRollAttack}
                className="flex-1 py-2.5 text-xs font-condensed font-bold uppercase tracking-wider bg-accent hover:bg-accent-hover text-white rounded transition-colors"
              >
                Roll Attack (d20)
              </button>
              <button
                onClick={handleRollDamage}
                disabled={!attackResult}
                className="flex-1 py-2.5 text-xs font-condensed font-bold uppercase tracking-wider bg-bg-elevated border border-border-subtle hover:border-accent text-text-primary rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Roll Damage
              </button>
            </div>
          ) : (
            <div className="text-sm font-body text-text-secondary text-center py-2">
              Net: Restrain target. No attack roll — opposed Athletics/Acrobatics to escape.
            </div>
          )}

          {/* Attack result */}
          {attackResult && (
            <div
              className={`rounded-lg px-4 py-3 border ${
                attackResult.isCrit
                  ? "border-accent bg-accent/10"
                  : attackResult.isFumble
                  ? "border-hp-red bg-hp-red/10"
                  : "border-border-subtle bg-bg-elevated"
              }`}
            >
              <div className="flex items-baseline gap-3">
                <span
                  className={`text-4xl font-mono font-bold ${
                    attackResult.isCrit
                      ? "text-accent"
                      : attackResult.isFumble
                      ? "text-hp-red"
                      : "text-text-highlight"
                  }`}
                >
                  {attackResult.attackTotal}
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-condensed uppercase tracking-wider text-text-secondary">to hit</span>
                  <span className="text-xs font-mono text-text-secondary">{attackResult.breakdown}</span>
                </div>
                {attackResult.isCrit && (
                  <span className="ml-auto text-sm font-heading text-accent uppercase tracking-widest">
                    Critical!
                  </span>
                )}
                {attackResult.isFumble && (
                  <span className="ml-auto text-sm font-heading text-hp-red uppercase tracking-widest">
                    Fumble
                  </span>
                )}
              </div>
              {attackResult.isCrit && (
                <p className="text-xs font-body text-text-secondary mt-1">Damage dice doubled!</p>
              )}
            </div>
          )}

          {/* Damage result */}
          {damageResult && (
            <div className="rounded-lg px-4 py-3 border border-fate/40 bg-fate/10">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-mono font-bold text-fate-glow">
                  {damageResult.total}
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-condensed uppercase tracking-wider text-text-secondary">{weapon.damageType} damage</span>
                  <span className="text-xs font-mono text-text-secondary">{damageResult.breakdown}</span>
                </div>
              </div>
            </div>
          )}

          {/* Reset */}
          {(attackResult || damageResult) && (
            <button
              onClick={handleReset}
              className="w-full py-2 text-xs font-condensed font-bold uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
