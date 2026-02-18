import type { StandardDie } from "@/types/dice";

export function pickSmallestDie(tableSize: number): StandardDie {
  if (tableSize <= 4) return 4;
  if (tableSize <= 6) return 6;
  if (tableSize <= 8) return 8;
  if (tableSize <= 10) return 10;
  if (tableSize <= 12) return 12;
  if (tableSize <= 20) return 20;
  return 100;
}

export function rollDie(sides: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] % sides) + 1;
}

export function rollFatesSelection(tableSize: number): number {
  const die = pickSmallestDie(tableSize);
  let result: number;
  do {
    result = rollDie(die);
  } while (result > tableSize);
  return result;
}

export function rollD20(): number {
  return rollDie(20);
}
