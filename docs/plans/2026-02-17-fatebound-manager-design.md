# Fatebound Manager — Design Document

**Date:** 2026-02-17
**Status:** Approved
**Project Location:** `~/fatebound-manager/`

---

## 1. Overview

A full character management application for The Fatebound homebrew D&D 5e class. The app automates the complex Dawn Roll mechanic, tracks character state across daily form changes, manages resources during sessions, and optionally syncs with D&D Beyond via MCP integration.

### Scope

- Character creation, leveling, and permanent state management
- Daily Dawn Roll automation with full table resolution (Chaos + Stabilized forms)
- Residual Memory and Fate Pool allocation across days
- Resource/HP/spell slot tracking during sessions
- Inventory and session notes management
- D&D Beyond MCP integration for sharing character state with party

### Tech Stack

| Component | Choice |
|-----------|--------|
| Framework | Next.js 14+ (App Router) |
| UI | React + TailwindCSS |
| Database | SQLite via better-sqlite3 |
| Fonts | Cinzel (headers), Roboto (body), Roboto Mono (numbers) |
| Persistence | `~/fatebound-manager/db/fatebound.db` |

---

## 2. Architecture

**Approach:** Page-Per-View, mirroring D&D Beyond's navigation structure.

### Pages

| Route | Purpose |
|-------|---------|
| `/characters` | Character list (grid of cards) |
| `/characters/[id]` | Character sheet (main view, tabbed content) |
| `/characters/[id]/dawn-roll` | Dawn Roll wizard (step-by-step form resolution) |
| `/characters/[id]/level-up` | Level progression manager |
| `/characters/[id]/history` | Past forms timeline, Residual Memory log |
| `/characters/[id]/settings` | D&D Beyond sync configuration |

### Project Structure

```
fatebound-manager/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout (dark theme, fonts)
│   │   ├── page.tsx                  # Redirect to /characters
│   │   ├── characters/
│   │   │   ├── page.tsx              # Character list
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # Character sheet
│   │   │       ├── dawn-roll/page.tsx
│   │   │       ├── level-up/page.tsx
│   │   │       ├── history/page.tsx
│   │   │       └── settings/page.tsx
│   │   └── api/                      # API routes (SQLite access)
│   │       └── characters/
│   │           ├── route.ts          # GET all, POST new
│   │           └── [id]/
│   │               ├── route.ts      # GET, PUT, DELETE
│   │               ├── dawn-roll/route.ts
│   │               ├── daily-state/route.ts
│   │               └── history/route.ts
│   ├── components/
│   │   ├── ui/                       # Base UI components
│   │   │   ├── Card.tsx
│   │   │   ├── DiceRoller.tsx        # Animated dice component
│   │   │   ├── HexBadge.tsx          # Ability score hexagon
│   │   │   ├── PipTracker.tsx        # Resource pip dots
│   │   │   ├── HPBar.tsx
│   │   │   └── TabNav.tsx
│   │   ├── character-sheet/          # Sheet-specific components
│   │   │   ├── AbilityScores.tsx
│   │   │   ├── FeatureCard.tsx
│   │   │   ├── ResidualMemory.tsx
│   │   │   ├── SpellSlots.tsx
│   │   │   └── SkillsList.tsx
│   │   └── dawn-roll/                # Wizard step components
│   │       ├── DawnRollStep.tsx
│   │       ├── FormResolution.tsx
│   │       ├── FateAttunement.tsx
│   │       ├── MemoryAllocation.tsx
│   │       └── DualNatureStep.tsx
│   ├── lib/
│   │   ├── db.ts                     # SQLite connection
│   │   ├── schema.ts                 # Database schema/migrations
│   │   └── dice.ts                   # Dice rolling (crypto-random)
│   ├── engine/                       # Pure game logic (no side effects)
│   │   ├── dawn-roll.ts              # Dawn Roll resolution
│   │   ├── chaos-form.ts             # Chaos Form table logic
│   │   ├── stabilized-form.ts        # Stabilized Form logic
│   │   ├── residual-memory.ts        # Memory slot management
│   │   ├── fate-pool.ts              # Fate Pool allocation
│   │   ├── spell-slots.ts            # Half-caster table
│   │   └── level-progression.ts      # Level-up logic
│   ├── data/                         # Static game data (from Obsidian docs)
│   │   ├── tables/
│   │   │   ├── table-a-chassis.ts
│   │   │   ├── table-b-primary.ts
│   │   │   ├── table-c-defensive.ts
│   │   │   ├── table-d-feats.ts
│   │   │   └── stabilized-forms.ts
│   │   ├── subclasses/               # All 12 form subclass data
│   │   ├── spells.ts
│   │   ├── feats.ts
│   │   └── magic-items.ts
│   ├── integrations/
│   │   └── ddb-sync.ts              # D&D Beyond MCP sync logic
│   └── types/                        # TypeScript type definitions
│       ├── character.ts
│       ├── forms.ts
│       ├── features.ts
│       └── dice.ts
├── db/
│   └── fatebound.db                  # SQLite database file
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```

### Key Architectural Principles

1. **`engine/` is pure functions.** All game logic (Dawn Roll resolution, table lookups, form assembly, conflict resolution) lives here with zero side effects. Testable independently of UI and database.
2. **`data/` is typed game constants.** Every table from the Fatebound docs encoded as TypeScript objects. Source of truth for game rules.
3. **API routes as the persistence boundary.** Components never touch SQLite directly. All reads/writes go through `/api/` routes.
4. **`dice.ts` uses `crypto.getRandomValues()`.** Fair dice rolls implementing Fate's Selection (smallest standard die >= table size, reroll on overflow).

---

## 3. Data Model

### Character (persistent across sessions)

```typescript
interface Character {
  id: string;                // UUID
  name: string;
  level: number;             // 1-20
  abilityScores: {
    STR: number; DEX: number; CON: number;
    INT: number; WIS: number; CHA: number;
  };
  permanentSkills: [string, string]; // Chosen at creation
  permanentMemorySlot: string | null; // Lord of Chaos (level 20)
  asiChoices: ASIChoice[];   // Permanent ASI/feat from Stabilized Form levels
  background: string;
  inventory: InventoryItem[];
  currency: { cp: number; sp: number; ep: number; gp: number; pp: number };
  notes: string;             // Freeform markdown
  ddbCharacterId: string | null; // D&D Beyond link
  ddbSyncSettings: DDBSyncSettings | null;
  createdAt: string;
  updatedAt: string;
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  weight: number;
  description: string;
  isEquipped: boolean;
  isMagic: boolean;
}
```

### DailyState (reset each Dawn Roll)

```typescript
interface DailyState {
  id: string;
  characterId: string;
  date: string;
  dawnRoll: { die1: number; die2?: number; chosen: number };
  dawnRollOutcome: 'DM_DESIGN' | 'DEEP_CHAOS' | 'UNSTABLE' | 'GUIDED' | 'FAVORED' | 'MASTER';
  formType: 'CHAOS' | 'STABILIZED';

  // Chaos Form (if applicable)
  chaosTableA?: { roll: number; chassis: Chassis };
  chaosTableB?: { roll: number; feature: PrimaryFeature };
  chaosTableC?: { roll: number; feature: DefensiveFeature };
  chaosTableD?: { roll: number; feat: Feat }[];

  // Stabilized Form (if applicable)
  stabilizedForm?: { roll: number; formId: number };
  stabilizedSubclass?: { roll: number; subclassId: string };

  // Dual Nature (level 11+)
  secondaryForm?: { formId: number; selectedFeatures: string[] } | null;

  // Residual Memory
  residualMemorySlots: MemorySlot[];

  // Fate Attunement
  abilitySwap?: { score1: string; score2: string } | null;

  // Chaos Resonance (level 15+)
  chaosResonanceSubclass?: { formId: number; subclassId: string } | null;

  // Resource tracking
  currentHP: number;
  tempHP: number;
  spellSlots: Record<string, { used: number; max: number }>;
  classResources: Record<string, { used: number; max: number }>;

  // Feature usage
  chaosSurgeUsed: boolean;
  twistOfFateUsed: boolean;
  defyFateUsed: boolean;
  fateResistanceSave: string | null;
}
```

### FormHistory (for Residual Memory reference)

```typescript
interface FormHistory {
  id: string;
  characterId: string;
  date: string;
  formSummary: object;       // Snapshot of complete form
  retainableFeatures: RetainableFeature[];
}
```

### SessionNote

```typescript
interface SessionNote {
  id: string;
  characterId: string;
  date: string;
  title: string;
  content: string;           // Markdown
  tags: string[];
}
```

---

## 4. Visual Design System

### Color Palette

```
// D&D Beyond-inspired dark theme with Fatebound chaos accent
colors:
  bg-deep:       #0B0B0D    // Page background
  bg-surface:    #1A1B1E    // Card surfaces
  bg-elevated:   #242528    // Elevated cards, modals
  bg-hover:      #2C2D31    // Hover states

  accent:        #C53131    // DDB Red (primary accent)
  accent-hover:  #E03E3E    // Hover
  accent-muted:  #8B2020    // Disabled

  fate:          #7C3AED    // Fate purple (Fatebound-specific)
  fate-glow:     #A78BFA    // Glow effects

  text-primary:  #E8E6E3    // Primary text
  text-secondary:#9B9B9B    // Muted text
  text-highlight:#FFFFFF    // Emphasized

  border-subtle: #333538    // Card borders
  border-accent: #C53131    // Accent borders

  hp-green:      #22C55E    // HP healthy
  hp-yellow:     #EAB308    // HP mid
  hp-red:        #EF4444    // HP critical
```

### Typography

```
fonts:
  heading: 'Cinzel, serif'            // D&D-style decorative headers
  body:    'Roboto, sans-serif'       // Clean body text
  mono:    'Roboto Mono, monospace'   // Dice rolls, numbers
```

### Component Patterns

- **Cards**: `bg-surface`, 1px `border-subtle`, `rounded-lg`, `p-4`
- **Ability Score Hexagons**: Large modifier, small score below, purple glow if Fate Attuned
- **Section Headers**: Cinzel uppercase, thin accent bottom border
- **Dice Animations**: Bounce/shake on roll, number counting up
- **Tabs**: Underline active indicator in accent red
- **Resource Pips**: Clickable filled/empty dots
- **HP Bar**: Gradient green→yellow→red, temp HP overlay

---

## 5. Page Layouts

### Character Sheet (`/characters/[id]`)

```
┌─────────────────────────────────────────────────────────────┐
│  CHARACTER HEADER                                            │
│  Name  |  Level  |  Current Form  |  Fatemark (animated)    │
│  Dawn Roll: 14 (Favored Fate)  |  Form: The Blade (Fighter) │
├──────────┬──────────────────────────────────────────────────┤
│ SIDEBAR  │  MAIN CONTENT (tabbed)                           │
│          │                                                   │
│ Ability  │  Tab: Features | Spells | Equipment | Notes      │
│ Scores   │  ┌──────────────────────────────────────────┐    │
│ (6 hex   │  │ Feature Cards (collapsible)              │    │
│  badges) │  │ ┌─────────┐ ┌─────────┐ ┌─────────┐     │    │
│          │  │ │ Rage    │ │ Extra   │ │ Action  │     │    │
│ Saves    │  │ │ 3/3 uses│ │ Attack  │ │ Surge   │     │    │
│          │  │ └─────────┘ └─────────┘ └─────────┘     │    │
│ Skills   │  │                                          │    │
│          │  │ RESIDUAL MEMORY (fate purple section)     │    │
│ Profic.  │  │ [Sneak Attack from yesterday]             │    │
│          │  │                                           │    │
│ HP Bar   │  │ RESOURCE TRACKERS                         │    │
│ ████░░   │  │ Spell Slots: ●●●○ (1st) ●●○ (2nd)      │    │
│ 28/42    │  │ Ki Points: ●●●●●○○ (5/7)                │    │
│          │  └──────────────────────────────────────────┘    │
│ Speed    │                                                   │
│ AC  Init │                                                   │
└──────────┴──────────────────────────────────────────────────┘
```

### Dawn Roll Wizard (`/characters/[id]/dawn-roll`)

Step-by-step wizard with animated dice:

1. **Roll the Dawn** — Animated d20 (or 2d20 at level 5+). Shows outcome label.
2. **Form Resolution** — Chaos: sequential Tables A→B→C→D. Stabilized: d12 + subclass.
3. **Fate Attunement** — Swap two ability scores (drag-and-drop or dropdown).
4. **Residual Memory** — Show yesterday's features, pick retentions (respecting Fate Pool).
5. **Dual Nature** (level 11+) — If spending 2 pool points, roll secondary form.
6. **Summary** — Complete character sheet preview, confirm.

---

## 6. D&D Beyond MCP Integration

### Architecture

The Fatebound Manager is the source of truth. D&D Beyond serves as a display/sharing layer for the party.

```
Fatebound Manager ──push→ D&D Beyond (MCP)
                   ←pull── (initial import only)
```

### Sync Capabilities

| Feature | Direction | MCP Tool |
|---------|-----------|----------|
| Import base character | DDB → App | `get_character` |
| Push ability scores | App → DDB | `set_ability_score` |
| Push HP changes | App → DDB | `update_hp` |
| Push spell slots | App → DDB | `update_spell_slots` |
| Push conditions | App → DDB | `add_condition` / `remove_condition` |
| Push inventory | App → DDB | `add_inventory_items` |
| Push currency | App → DDB | `update_currency` |

### Non-Syncable (Homebrew-Only)

- Dawn Roll results and form assignments
- Residual Memory / Fate Pool allocation
- Chaos Form table results
- Fatebound class features (Fatemark, Chaos Surge, etc.)
- Custom Fatebound spells and feats

### Settings

Per-character sync settings page with:
- DDB character link/selector
- Per-field sync toggles
- Manual "Sync Now" button
- Last synced timestamp

---

## 7. Edge Case Handling

| Edge Case | Rule | Engine Module |
|-----------|------|---------------|
| Metamagic without spellcasting | Table C reroll | `chaos-form.ts` |
| Heavy chassis + Unarmored Defense | Table C reroll | `chaos-form.ts` |
| Duplicate Table D feats | Reroll (except ASI) | `chaos-form.ts` |
| Two spellcasting forms (Dual Nature) | Shared slot pool | `spell-slots.ts` |
| Extra Attack from both forms | No stack | `stabilized-form.ts` |
| Category 4 Residual Memory (spells) | One level's worth | `residual-memory.ts` |
| Fate Pool budget overflow | Enforce pool size | `fate-pool.ts` |
| Hexer short-rest + other caster | One slot per short rest | `spell-slots.ts` |
| Chaos Resonance (level 15) | Subclass on Chaos Form | `chaos-form.ts` |
| Defy Fate (level 18) | Bypass Dawn Roll | `dawn-roll.ts` |
| Fate's Mercy floor | d8 HD, light armor, simple, AC 12+DEX, Fate Strike | `chaos-form.ts` |

---

## 8. Design Notes

- **Dual accent system**: DDB Red for standard UI, Fate Purple for homebrew-specific mechanics. Keeps the D&D Beyond feel while distinguishing chaos features.
- **Pure engine**: All game logic is testable without browser. ~100 pages of rules demand comprehensive unit tests.
- **Static data as code**: Tables are TypeScript constants, not database rows. Easier to update and version control with the Obsidian docs.
- **Denormalized DailyState**: Stores fully resolved form, not just roll results. Avoids re-resolving cascading lookups on every render.
- **FormHistory for Memory**: Pre-computes retainable features per the Category 1-6 taxonomy. Powers the Residual Memory UI without recomputation.
