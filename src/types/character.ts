import { AbilityScore } from "./forms";
import { MemorySlot, RetainableFeature } from "./features";
import { DawnRollResult, DawnRollOutcome } from "./dice";
import type { CharacterWeapon } from "@/types/equipment";
import type { SpellcastingProfile } from "@/types/spells";

export type AbilityScores = Record<AbilityScore, number>;

export interface Currency {
  cp: number;
  sp: number;
  ep: number;
  gp: number;
  pp: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  weight: number;
  description: string;
  isEquipped: boolean;
  isMagic: boolean;
}

export interface ASIChoice {
  level: number;
  type: "asi" | "feat";
  value: string;
}

export interface DDBSyncSettings {
  enabled: boolean;
  syncAbilityScores: boolean;
  syncHP: boolean;
  syncSpellSlots: boolean;
  syncConditions: boolean;
  syncInventory: boolean;
  syncCurrency: boolean;
  lastSyncedAt: string | null;
}

export interface Character {
  id: string;
  name: string;
  level: number;
  abilityScores: AbilityScores;
  permanentSkills: [string, string];
  permanentMemorySlot: string | null;
  asiChoices: ASIChoice[];
  background: string;
  inventory: InventoryItem[];
  equippedWeapons: CharacterWeapon[];
  currency: Currency;
  notes: string;
  ddbCharacterId: string | null;
  ddbSyncSettings: DDBSyncSettings | null;
  sageGrimoire?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ResourceTracker {
  used: number;
  max: number;
  recovery?: "short" | "long";
}

export interface DailyState {
  id: string;
  characterId: string;
  date: string;
  dawnRoll: DawnRollResult;
  dawnRollOutcome: DawnRollOutcome;
  formType: "CHAOS" | "STABILIZED";
  chaosTableA?: { roll: number; chassisId: number };
  chaosTableB?: { roll: number; featureId: number };
  chaosTableC?: { roll: number; featureId: number };
  chaosTableD?: { roll: number; featId: number }[];
  stabilizedFormId?: number;
  stabilizedSubclassId?: string;
  secondaryFormId?: number | null;
  secondaryFormFeatures?: string[];
  residualMemorySlots: MemorySlot[];
  abilitySwap: { score1: AbilityScore; score2: AbilityScore } | null;
  chaosResonance?: { formId: number; subclassId: string } | null;
  currentHP: number;
  tempHP: number;
  spellSlots: Record<string, ResourceTracker>;
  classResources: Record<string, ResourceTracker>;
  hitDice: ResourceTracker;
  chaosSurgeUsed: boolean;
  twistOfFateUsed: boolean;
  defyFateUsed: boolean;
  fateResistanceSave: string | null;
  autoRollResults: Record<string, string>;
  preparedSpells?: string[];
  knownCantrips?: string[];
  spellcastingProfile?: SpellcastingProfile | null;
}

export interface FormHistory {
  id: string;
  characterId: string;
  date: string;
  formSummary: object;
  retainableFeatures: RetainableFeature[];
}

export interface SessionNote {
  id: string;
  characterId: string;
  date: string;
  title: string;
  content: string;
  tags: string[];
}
