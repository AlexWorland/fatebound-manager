export type MemoryCategory = 1 | 2 | 3 | 4 | 5 | 6;

export interface RetainableFeature {
  featureId: string;
  name: string;
  category: MemoryCategory;
  description: string;
  source: string;
}

export interface MemorySlot {
  featureId: string;
  name: string;
  category: MemoryCategory;
  source: string;
}

export interface Feat {
  id: number;
  name: string;
  description: string;
  notes?: string;
  abilityScoreIncrease?: string;
  canRepeat: boolean;
}

export interface Spell {
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  spellLists: string[];
}

export interface MagicItem {
  name: string;
  type: string;
  rarity: string;
  attunement: string;
  description: string;
}
