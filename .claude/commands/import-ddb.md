# Import Character from D&D Beyond

Import an existing D&D Beyond character into Fatebound Manager using the DDB MCP tools.

## Prerequisites

The dev server must be running at `http://localhost:3000`. Verify with:

```bash
curl -s http://localhost:3000/api/characters | head -c 100
```

If this fails, tell the user to start it with `npm run dev` and try again.

## Step 1: Authenticate with D&D Beyond

Load and call the DDB auth check tool:

```
ToolSearch: select:mcp__dndbeyond__check_auth
```

Call `mcp__dndbeyond__check_auth`. If authentication fails, load and call `mcp__dndbeyond__setup_auth` to guide the user through authentication. Do not proceed until auth succeeds.

## Step 2: List Characters

Load and call the character listing tool:

```
ToolSearch: select:mcp__dndbeyond__list_characters
```

Call `mcp__dndbeyond__list_characters`. Present the results to the user via `AskUserQuestion` so they can pick which character to import. Show character name and level for each option.

## Step 3: Fetch Full Character Data

Load and call the character detail tool:

```
ToolSearch: select:mcp__dndbeyond__get_character
```

Call `mcp__dndbeyond__get_character` with the selected character's ID and `detail: "full"`.

## Step 4: Map Fields

Apply these mappings from the DDB character data:

| Fatebound Field | Source |
|-----------------|--------|
| `name` | DDB `name` directly |
| `level` | Sum of all class levels from DDB data |
| `abilityScores` | DDB stat IDs 1-6 → STR/DEX/CON/INT/WIS/CHA (base values only, no modifiers) |
| `inventory` | Map each item: `{ id: "ddb-import-{idx}", name, quantity, weight, description, isEquipped, isMagic }` |
| `currency` | Direct from DDB `currencies` object: `{ cp, sp, ep, gp, pp }` |
| `background` | Always `"The Chaos-Marked"` (Fatebound-specific background) |
| `ddbCharacterId` | String of the DDB character ID |
| `ddbSyncSettings` | `{ enabled: true, syncAbilityScores: true, syncHP: true, syncSpellSlots: true, syncConditions: true, syncInventory: true, syncCurrency: true, lastSyncedAt: null }` |

For ability scores, DDB stat IDs are 1-indexed: 1=STR, 2=DEX, 3=CON, 4=INT, 5=WIS, 6=CHA. Use the base stat values (from the `stats` array), not total/modified values.

## Step 5: Choose Permanent Skills

The Fatebound class grants exactly 2 permanent skill proficiencies chosen at character creation.

Extract the character's DDB skill proficiencies. Present the full list of 18 D&D 5e skills via `AskUserQuestion` with `multiSelect: true`, noting which ones the character is already proficient in on DDB (mark those as suggested/recommended in the option descriptions). The user must pick exactly 2.

The 18 skills: Acrobatics, Animal Handling, Arcana, Athletics, Deception, History, Insight, Intimidation, Investigation, Medicine, Nature, Perception, Performance, Persuasion, Religion, Sleight of Hand, Stealth, Survival.

If the user selects more or fewer than 2, ask again.

## Step 6: Confirm Level

Present the DDB-derived level via `AskUserQuestion` and let the user confirm or adjust it. Valid range is 1-20. The Fatebound class may not match the DDB character's class levels exactly, so the user should pick the appropriate Fatebound level.

## Step 7: Review & Confirm

Display a summary of everything that will be created:

- Character name
- Starting level
- Ability scores (STR/DEX/CON/INT/WIS/CHA)
- Permanent skills (the 2 chosen)
- Background: The Chaos-Marked
- Inventory item count and total weight
- Currency totals
- DDB sync: enabled

Ask the user to confirm via `AskUserQuestion` before proceeding.

## Step 8: Create Character

POST the mapped data to the characters API:

```bash
curl -s -X POST http://localhost:3000/api/characters \
  -H "Content-Type: application/json" \
  -d '<JSON payload>'
```

The JSON payload should include all mapped fields: `name`, `level`, `abilityScores`, `permanentSkills`, `background`, `inventory`, `currency`, `ddbCharacterId`, `ddbSyncSettings`.

## Step 9: Report

On success, show the user:
- The new character's ID
- A link to their character sheet: `http://localhost:3000/characters/{id}`
- A link to start their first Dawn Roll: `http://localhost:3000/characters/{id}/dawn-roll`
- Note that DDB sync is enabled — future daily forms can be pushed to DDB from the character sheet settings

## Error Handling

- **Auth failure**: Guide user through `setup_auth`, retry
- **Dev server not running**: Tell user to run `npm run dev` first
- **Missing ability scores**: If DDB data doesn't have all 6 scores, alert the user and abort
- **API error**: Show the error response and suggest checking the dev server logs
- **Duplicate DDB character**: Warn if a character with the same `ddbCharacterId` already exists (check GET /api/characters first)
