# Fatebound Manager Audit

Audit the manager codebase against the Fatebound source character definitions and apply any needed updates.

## Prerequisites

Pull the source docs submodule to the latest version before starting:

```bash
git submodule update --init --remote the-fatebound
```

## Phase 1: Research & Audit (Agent Team)

Create a team and spawn researcher agents to compare the source docs against the manager implementation in parallel. Each agent should produce a structured findings report covering **discrepancies, missing features, outdated mechanics, and incorrect values**.

### Source Documents (in `the-fatebound/`)

| Area | Source File(s) | Manager Code |
|------|---------------|--------------|
| Core class | `The Fatebound.md` | `src/engine/`, `src/data/level-progression.ts` |
| Stabilized forms | `The Fatebound.md` (form definitions) | `src/data/tables/stabilized-forms.ts` |
| Subclasses (12) | `Subclasses/*.md` | `src/data/subclasses/*.ts` |
| Feat table | `Supplementary/The Fatebound - Feat Table.md`, `Supplementary/The Fatebound - Feats.md` | `src/data/tables/table-d-feats.ts` |
| Spells | `Supplementary/The Fatebound - Spells.md` | `src/data/spells.ts` |
| Magic items | `Supplementary/The Fatebound - Magic Items.md` | `src/data/magic-items.ts` |
| Chassis / Tables A-C | `The Fatebound.md` (table definitions) | `src/data/tables/table-a-chassis.ts`, `table-b-primary.ts`, `table-c-defensive.ts` |
| Dawn Roll mechanics | `The Fatebound.md` (dawn roll section) | `src/engine/dawn-roll.ts`, `src/engine/chaos-form.ts` |
| Residual Memory | `The Fatebound.md` (memory section) | `src/engine/residual-memory.ts` |
| Spell slots | `The Fatebound.md` (spellcasting section) | `src/engine/spell-slots.ts`, `src/data/spell-slot-table.ts` |
| Fate Pool / Dual Nature | `The Fatebound.md` (level 11+ features) | `src/engine/fate-pool.ts` |
| Background | `Supplementary/The Fatebound - Chaos-Marked Background.md` | (check if implemented) |
| Invocations | `Supplementary/The Fatebound - Invocation Table.md` | (check if implemented) |
| Analysis/decisions | `Analysis/*.md` | (check for unimplemented decisions) |

### Agent Assignments

Spawn **4 researcher agents** in parallel. Each agent should:
1. Read the assigned source documents thoroughly
2. Read the corresponding manager code
3. Compare line by line — values, names, descriptions, level requirements, mechanics
4. Produce a findings list in this format:

```
### [Area Name]

#### Discrepancies
- **[item]**: Source says X, manager has Y. File: `path/to/file.ts:line`

#### Missing Features
- **[feature]**: Described in source but not implemented. Should go in: `suggested/path.ts`

#### Outdated/Incorrect
- **[item]**: Manager has stale data. Current source value: X

#### Correct
- Brief summary of what's already accurate (no need to list everything)
```

**Agent 1 — Core Mechanics**: `The Fatebound.md` → dawn roll, chaos form assembly, tables A-C, residual memory, spell slots, fate pool, level progression

**Agent 2 — Forms & Subclasses**: Stabilized form definitions in `The Fatebound.md`, all 12 `Subclasses/*.md` files → `stabilized-forms.ts`, `src/data/subclasses/`

**Agent 3 — Feats, Spells & Items**: `Supplementary/The Fatebound - Feat Table.md`, `Supplementary/The Fatebound - Feats.md`, `Supplementary/The Fatebound - Spells.md`, `Supplementary/The Fatebound - Magic Items.md` → feat table, spells data, magic items data

**Agent 4 — Supplementary & Analysis**: `Supplementary/The Fatebound - Chaos-Marked Background.md`, `Supplementary/The Fatebound - Invocation Table.md`, `Supplementary/The Fatebound - Gameplay Examples.md`, all `Analysis/*.md` files → check for unimplemented content, pending decisions, and known issues that should be addressed

### Audit Report

After all agents complete, synthesize their findings into a single prioritized audit report. Group findings by severity:

1. **Critical** — Incorrect game mechanics or values that would cause wrong behavior
2. **Major** — Missing features that are defined in source and expected to work
3. **Minor** — Text/description mismatches, missing supplementary content, nice-to-haves
4. **Info** — Observations, potential improvements, things already tracked in Analysis docs

Save the report to `docs/audit-report.md` with a date stamp.

## Phase 2: Implementation (Agent Team)

Based on the audit report, create an implementation plan and execute updates.

### Planning

1. Review the audit report and group related changes into logical units
2. Identify dependencies between changes (e.g., type changes before data updates)
3. Estimate which changes are safe (data-only) vs which touch engine logic (need tests)
4. Create a task list with clear ordering

### Agent Assignments

Spawn implementation agents based on the work identified. Suggested split:

- **Data agent(s)** — Update static data files (tables, feats, spells, magic items, subclasses). These are typically safe changes with no logic impact.
- **Engine agent(s)** — Update game logic in `src/engine/`. Must update or add corresponding tests in `src/engine/__tests__/`.
- **Type agent** — Update `src/types/` if new fields or types are needed. This should run first if other agents depend on type changes.
- **UI agent** — Update components if new features need UI representation (new tabs, new display fields, etc.)

### Rules for Implementation Agents

- **Data changes**: Update values to match source exactly. Preserve existing TypeScript types and structure.
- **Engine changes**: Update logic AND tests. All existing tests must continue to pass. Add tests for new mechanics.
- **New features**: Follow existing patterns. Engine logic goes in `src/engine/`, data in `src/data/`, types in `src/types/`.
- **No breaking API changes** unless the audit identifies the API as incorrect.
- **Commit after each logical unit** — don't batch unrelated changes.

## Phase 3: Verification (Agent Team)

After all implementation agents complete, spawn a verification team to confirm every fix was applied correctly. This can reuse the same team created in Phase 2.

### Automated Checks (Lead)

Run these before spawning verifiers:

1. `npx tsc --noEmit` — no type errors
2. `npm test` — all tests must pass
3. `npm run build` — build must succeed

If any fail, fix them before proceeding to agent verification.

### Agent Assignments

Spawn **2 verifier agents** in parallel:

**Verifier 1 — Data Integrity**: For each Critical and Major item in the audit report:
1. Read the source doc referenced in the finding
2. Read the manager code that was supposed to be fixed
3. Confirm the fix matches the source doc exactly
4. Flag any remaining discrepancies or partial fixes

Report format:
```
| ID | Severity | Verified? | Notes |
|----|----------|-----------|-------|
| C1 | Critical | YES/NO | [details if NO] |
```

**Verifier 2 — Engine & Test Coverage**: For each engine logic change (spell-slots.ts, residual-memory.ts, etc.):
1. Read the updated engine code
2. Read the corresponding test file
3. Confirm tests exist that exercise the new/changed behavior
4. Confirm edge cases are covered (boundary levels, empty inputs, etc.)
5. Flag any untested paths

### Resolution

After verifiers complete:

1. If all items are verified, update `docs/audit-report.md` resolution status column (PENDING → RESOLVED)
2. If any items fail verification, create follow-up fix tasks and loop back to Phase 2
3. Commit the updated audit report
