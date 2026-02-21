export interface SpellReference {
  slug: string;
  name: string;
  level: number;
  school: string;
  ritual: boolean;
  concentration: boolean;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  higherLevel?: string;
}

export interface SpellcastingProfile {
  mechanic: "prepared" | "known" | "pact" | "grimoire";
  spellList: string;
  castingAbility: string;
  maxPreparedOrKnown: number;
  cantripsKnown: number;
}
