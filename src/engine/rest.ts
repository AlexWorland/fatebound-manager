import type { DailyState, ResourceTracker } from "@/types/character";

export function applyShortRest(
  dailyState: DailyState,
  hitDiceToSpend: number,
  hitDie: number,
  conMod: number,
  maxHP: number
): Partial<DailyState> {
  // Deep clone spellSlots and classResources
  const spellSlots: Record<string, ResourceTracker> = {};
  for (const [key, tracker] of Object.entries(dailyState.spellSlots)) {
    if (tracker.recovery === "short") {
      spellSlots[key] = { ...tracker, used: 0 };
    } else {
      spellSlots[key] = { ...tracker };
    }
  }

  const classResources: Record<string, ResourceTracker> = {};
  for (const [key, tracker] of Object.entries(dailyState.classResources)) {
    if (tracker.recovery === "short") {
      classResources[key] = { ...tracker, used: 0 };
    } else {
      classResources[key] = { ...tracker };
    }
  }

  const healing = hitDiceToSpend * (Math.floor(hitDie / 2) + 1 + conMod);
  const currentHP = Math.min(dailyState.currentHP + healing, maxHP);
  const hitDice: ResourceTracker = {
    ...dailyState.hitDice,
    used: dailyState.hitDice.used + hitDiceToSpend,
  };

  return { spellSlots, classResources, hitDice, currentHP };
}

export function applyLongRest(
  dailyState: DailyState,
  maxHP: number
): Partial<DailyState> {
  // Deep clone spellSlots → reset ALL to used: 0
  const spellSlots: Record<string, ResourceTracker> = {};
  for (const [key, tracker] of Object.entries(dailyState.spellSlots)) {
    spellSlots[key] = { ...tracker, used: 0 };
  }

  // Deep clone classResources → reset ALL to used: 0
  const classResources: Record<string, ResourceTracker> = {};
  for (const [key, tracker] of Object.entries(dailyState.classResources)) {
    classResources[key] = { ...tracker, used: 0 };
  }

  // Recover half spent hit dice
  const hitDice: ResourceTracker = {
    ...dailyState.hitDice,
    used: Math.max(0, dailyState.hitDice.used - Math.floor(dailyState.hitDice.max / 2)),
  };

  return {
    spellSlots,
    classResources,
    hitDice,
    currentHP: maxHP,
    tempHP: 0,
    chaosSurgeUsed: false,
    twistOfFateUsed: false,
    defyFateUsed: false,
  };
}
