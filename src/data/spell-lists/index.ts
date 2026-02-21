import type { SpellReference } from "@/types/spells";
import { BARD_SPELLS } from "./bard";
import { CLERIC_SPELLS } from "./cleric";
import { DRUID_SPELLS } from "./druid";
import { PALADIN_SPELLS } from "./paladin";
import { RANGER_SPELLS } from "./ranger";
import { SORCERER_SPELLS } from "./sorcerer";
import { WARLOCK_SPELLS } from "./warlock";
import { WIZARD_SPELLS } from "./wizard";
import { ARTIFICER_SPELLS } from "./artificer";

export { BARD_SPELLS, CLERIC_SPELLS, DRUID_SPELLS, PALADIN_SPELLS, RANGER_SPELLS, SORCERER_SPELLS, WARLOCK_SPELLS, WIZARD_SPELLS, ARTIFICER_SPELLS };

export const SPELL_LISTS: Record<string, SpellReference[]> = {
  Bard: BARD_SPELLS,
  Cleric: CLERIC_SPELLS,
  Druid: DRUID_SPELLS,
  Paladin: PALADIN_SPELLS,
  Ranger: RANGER_SPELLS,
  Sorcerer: SORCERER_SPELLS,
  Warlock: WARLOCK_SPELLS,
  Wizard: WIZARD_SPELLS,
  Artificer: ARTIFICER_SPELLS,
};
