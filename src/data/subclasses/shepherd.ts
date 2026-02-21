import type { SubclassEntry } from "@/types/forms";

export const SHEPHERD_SUBCLASSES: SubclassEntry[] = [
  {
    id: "shepherd-land",
    name: "Circle of the Land",
    level9Feature: {
      name: "Natural Recovery",
      description: "Once per day, when you finish a short rest, you can recover spell slots with a combined level equal to half your Fatebound level (rounded up), and none of the recovered slots can be 6th level or higher. Additionally, randomly select your land type at dawn (1-Arctic, 2-Coast, 3-Desert, 4-Forest, 5-Grassland, 6-Mountain, 7-Swamp, 8-Underdark); a small set of thematic bonus spells are always prepared for you that day.",
    },
    level13Feature: {
      name: "Nature's Ward",
      description: "You are immune to poison and disease. You cannot be charmed or frightened by elementals or fey.",
    },
    level17Feature: {
      name: "Nature's Sanctuary",
      description: "When a beast or plant creature attacks you, it must make a Wisdom saving throw. On a failed save, it must choose a different target, or the attack automatically misses.",
    },
  },
  {
    id: "shepherd-moon",
    name: "Circle of the Moon",
    level9Feature: {
      name: "Combat Wild Shape",
      description: "Wild Shape as a bonus action. Your CR limit for Wild Shape increases to Fatebound level ÷ 3 (rounded down, minimum 1). While in Wild Shape, you may expend a spell slot as a bonus action to regain 1d8 hit points per level of the slot spent.",
    },
    level13Feature: {
      name: "Elemental Wild Shape",
      description: "You may expend two uses of Wild Shape to transform into an Air, Earth, Fire, or Water Elemental instead of a beast.",
    },
    level17Feature: {
      name: "Thousand Forms",
      description: "You can cast alter self at will without expending a spell slot.",
    },
  },
  {
    id: "shepherd-dreams",
    name: "Circle of Dreams",
    level9Feature: {
      name: "Balm of the Summer Court + Hidden Paths",
      description: "Gain a pool of d6s equal to your Fatebound level; as a bonus action, spend up to half your level in dice to heal a creature within 120 ft by the total rolled, and grant it 1 temporary hit point per die spent. Hidden Paths: As a bonus action, teleport yourself up to 60 ft to an unoccupied space you can see. Alternatively, you can use your action to teleport one willing creature you touch up to 30 ft to an unoccupied space you can see. Once you use this feature, you can't use it again until you finish a short or long rest.",
    },
    level13Feature: {
      name: "Walker in Dreams",
      description: "When you finish a short rest, you can cast dream (as the caster), scrying, or teleportation circle (via a linked tree you have touched) once without expending a spell slot or requiring material components (1/long rest).",
    },
    level17Feature: {
      name: "Dream Realm",
      description: "Your Walker in Dreams feature can now be used once per short rest instead of once per long rest. Additionally, when you use Hidden Paths to teleport yourself, you can bring one willing creature you can touch along with you.",
    },
  },
  {
    id: "shepherd-shepherd",
    name: "Circle of the Shepherd",
    level9Feature: {
      name: "Spirit Totem",
      description: "Speech of the Woods: You can cast speak with animals at will, without expending a spell slot. You also learn Sylvan if you don't already know it. As a bonus action, summon a spirit totem in a 30-ft radius centered on a point within 60 ft; it lasts 1 minute and recharges on a short rest. Randomly select your totem: Bear (1, all creatures you choose gain temporary HP equal to 5 + your Fatebound level and have advantage on STR checks and saves), Hawk (2, all creatures you choose have advantage on Perception checks, and you can use a reaction to grant one ally advantage on an attack roll against a creature in the aura), or Unicorn (3, all creatures you choose have advantage on ability checks to detect creatures within the aura, and each time you cast a healing spell while the totem is active, each creature you choose regains additional HP equal to your Fatebound level).",
    },
    level13Feature: {
      name: "Mighty Summoner",
      description: "Beasts and fey you summon or create with spells gain +2 hit points per Hit Die. Their natural weapons count as magical for the purpose of overcoming resistance.",
    },
    level17Feature: {
      name: "Faithful Summons",
      description: "If you are reduced to 0 HP or incapacitated against your will, you immediately conjure four beasts of CR 2 or lower in unoccupied spaces within 20 ft of you. They last for 1 hour (requiring no concentration and can't be dismissed early), they understand your speech, and they defend you. Usable once per long rest.",
    },
  },
  {
    id: "shepherd-spores",
    name: "Circle of Spores",
    level9Feature: {
      name: "Halo of Spores + Symbiotic Entity",
      description: "Halo of Spores: When a creature moves into or within 10 ft of you, use your reaction to deal 1d4 necrotic damage (CON save for none). Symbiotic Entity: Expend a use of Wild Shape to gain temporary hit points equal to 4 × your Fatebound level; while these persist, your Halo damage doubles to 2d4 and your melee attacks deal an extra 1d6 necrotic damage.",
    },
    level13Feature: {
      name: "Spreading Spores + Fungal Infestation",
      description: "Halo of Spores damage increases to 1d8. Spreading Spores: While your Symbiotic Entity feature is active, as a bonus action you can hurl spores up to 30 ft away, where they fill a 10-foot cube for 1 minute. While this cloud is active, your Halo of Spores reaction no longer triggers from your own position — instead, any creature that moves into or within the cube takes your Halo damage (CON save negates). Fungal Infestation: When a Small or Medium beast or humanoid dies within 10 ft of you, you can use your reaction to animate it as a zombie (1 HP) that obeys your commands for 1 hour.",
    },
    level17Feature: {
      name: "Spreading Spores Mastery + Fungal Body",
      description: "Your Halo of Spores damage increases to 1d10. You gain immunity to being blinded, deafened, frightened, and poisoned, and critical hits against you become normal hits.",
    },
  },
  {
    id: "shepherd-stars",
    name: "Circle of Stars",
    level9Feature: {
      name: "Starry Form + Star Map",
      description: "Star Map: You know the guidance cantrip and always have guiding bolt prepared; you can cast guiding bolt a number of times equal to your proficiency bonus per long rest using the star map as your spellcasting focus, without expending a spell slot. Guidance doesn't count against your number of cantrips known. Starry Form: Expend a Wild Shape use as a bonus action to take a starry form for 10 minutes. Choose: Archer (bonus action — 60-ft ranged attack, 1d8 + WIS mod radiant), Chalice (when you cast a healing spell, a creature within 30 ft regains 1d8 + WIS mod HP), or Dragon (treat Constitution saving throws to maintain concentration below 10 as 10).",
    },
    level13Feature: {
      name: "Full of Stars",
      description: "While in Starry Form you have resistance to bludgeoning, piercing, and slashing damage. Archer's attack deals 2d8 + WIS mod radiant. Chalice heals for 2d8 + WIS mod instead of 1d8 + WIS mod. Dragon also grants a fly speed of 20 ft.",
    },
    level17Feature: {
      name: "Cosmic Form",
      description: "Your Starry Form no longer requires a Wild Shape use to activate. Additionally, once per long rest while in Starry Form, you can change your constellation as a bonus action (normally you choose when activating the form).",
    },
  },
  {
    id: "shepherd-wildfire",
    name: "Circle of Wildfire",
    level9Feature: {
      name: "Wildfire Spirit",
      description: "Expend a Wild Shape use to summon a Small wildfire spirit in an unoccupied space within 30 ft (it vanishes after 1 hour or when you use Wild Shape again). As a bonus action, the spirit and each willing creature of your choice within 5 feet of it teleport to unoccupied spaces you can see within 15 feet of the spirit; each creature within 5 feet of the space the spirit left must succeed on a DEX save or take 1d6 + your proficiency bonus fire damage (half on save). When the spirit first appears, each creature within 10 ft of its arrival point (other than you) must succeed on a DEX save or take 2d6 fire damage.",
    },
    level13Feature: {
      name: "Enhanced Bond",
      description: "While your wildfire spirit is summoned, once per turn when you cast a spell that deals fire damage or restores hit points, add +1d8 to one damage or healing roll. You can cast your spells as if you were in your wildfire spirit's space.",
    },
    level17Feature: {
      name: "Blazing Revival",
      description: "If your wildfire spirit is within 120 ft when you are reduced to 0 HP and fall unconscious, you can cause the spirit to drop to 0 HP. You then regain half your hit points and immediately rise to your feet. Usable once per long rest.",
    },
  },
];;
