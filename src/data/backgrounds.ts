export interface Background {
  name: string;
  skillProficiencies: [string, string];
  toolProficiencies: string[];
  languages: string[];
  equipment: string[];
  personalityTraits: string[];
  ideals: string[];
  bonds: string[];
  flaws: string[];
}

export const BACKGROUNDS: Background[] = [
  {
    name: "The Chaos-Marked",
    skillProficiencies: ["Arcana", "Survival"],
    toolProficiencies: [],
    languages: [],
    equipment: ["Explorer's pack", "Trinket from a strange dream"],
    personalityTraits: [
      "I was forever changed by an encounter with chaotic energy.",
      "I feel the pull of transformation in my dreams.",
    ],
    ideals: ["Balance", "Freedom"],
    bonds: ["I must understand why I was chosen."],
    flaws: ["I sometimes lose control of my transformations."],
  },
  {
    name: "Acolyte",
    skillProficiencies: ["Insight", "Religion"],
    toolProficiencies: [],
    languages: ["Two of your choice"],
    equipment: ["Holy symbol", "Prayer book", "5 sticks of incense", "Vestments", "15 gp"],
    personalityTraits: [
      "I idolize a particular hero of my faith.",
      "Nothing can shake my optimistic attitude.",
    ],
    ideals: ["Tradition", "Charity"],
    bonds: ["I owe my life to the priest who took me in."],
    flaws: ["I judge others harshly."],
  },
  {
    name: "Criminal",
    skillProficiencies: ["Deception", "Stealth"],
    toolProficiencies: ["Thieves' tools", "Gaming set"],
    languages: [],
    equipment: ["Crowbar", "Dark clothes with hood", "15 gp"],
    personalityTraits: ["I always have a plan for what to do when things go wrong."],
    ideals: ["Freedom", "Honor among thieves"],
    bonds: ["Someone I loved died because of a mistake I made."],
    flaws: ["When I see something valuable, I can't think about anything but how to steal it."],
  },
  {
    name: "Folk Hero",
    skillProficiencies: ["Animal Handling", "Survival"],
    toolProficiencies: ["Artisan's tools", "Vehicles (land)"],
    languages: [],
    equipment: ["Artisan's tools", "Shovel", "Iron pot", "Common clothes", "10 gp"],
    personalityTraits: ["I judge people by their actions, not their words."],
    ideals: ["Respect", "Sincerity"],
    bonds: ["I protect those who cannot protect themselves."],
    flaws: ["I'm convinced of the significance of my destiny."],
  },
  {
    name: "Noble",
    skillProficiencies: ["History", "Persuasion"],
    toolProficiencies: ["Gaming set"],
    languages: ["One of your choice"],
    equipment: ["Fine clothes", "Signet ring", "Scroll of pedigree", "25 gp"],
    personalityTraits: ["My eloquent flattery makes everyone I talk to feel important."],
    ideals: ["Noble Obligation", "Power"],
    bonds: ["I will face any challenge to win the approval of my family."],
    flaws: ["I secretly believe that everyone is beneath me."],
  },
  {
    name: "Sage",
    skillProficiencies: ["Arcana", "History"],
    toolProficiencies: [],
    languages: ["Two of your choice"],
    equipment: ["Bottle of ink", "Quill", "Small knife", "Letter from colleague", "Common clothes", "10 gp"],
    personalityTraits: ["I'm used to helping out those who aren't as smart as I am."],
    ideals: ["Knowledge", "Power"],
    bonds: ["I've been searching my whole life for the answer to a certain question."],
    flaws: ["I overlook obvious solutions in favor of complicated ones."],
  },
  {
    name: "Soldier",
    skillProficiencies: ["Athletics", "Intimidation"],
    toolProficiencies: ["Gaming set", "Vehicles (land)"],
    languages: [],
    equipment: ["Insignia of rank", "Trophy from a fallen enemy", "Dice set", "Common clothes", "10 gp"],
    personalityTraits: ["I can stare down a hell hound without flinching."],
    ideals: ["Greater Good", "Might"],
    bonds: ["I'll never forget the crushing defeat my company suffered."],
    flaws: ["I'd rather eat my armor than admit when I'm wrong."],
  },
];
