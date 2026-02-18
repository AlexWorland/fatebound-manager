# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fatebound Manager is a character management web app for "The Fatebound," a homebrew D&D 5e class where characters transform daily based on a Dawn Roll (d20). Built with Next.js 16 (App Router), React 19, TypeScript, SQLite (better-sqlite3), and Tailwind CSS v4.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npm test             # Run all tests (vitest run)
npm run test:watch   # Watch mode

# Single test file
npx vitest run src/engine/__tests__/dawn-roll.test.ts

# Tests matching a name pattern
npx vitest run -t "resolveDawnRollOutcome"

# Type check (no script defined)
npx tsc --noEmit
```

## Architecture

### Layered Structure

```
src/
├── app/            # Next.js App Router (pages + API routes)
├── components/     # React UI components
├── data/           # Static game data tables (chassis, feats, forms, spells, subclasses)
├── engine/         # Pure game logic — no React, no DB, independently testable
├── integrations/   # D&D Beyond MCP sync service
├── lib/            # Database layer (SQLite via better-sqlite3, raw SQL)
└── types/          # Shared TypeScript type definitions
```

### Key Architectural Decisions

- **No ORM** — Raw SQL via `better-sqlite3` (synchronous API). Complex fields stored as JSON strings in SQLite with row-to-domain mapping functions handling deserialization.
- **No state management library** — Server components fetch directly from DB; client components use local `useState` + `fetch()` for mutations.
- **Server/Client split** — Page components (`page.tsx`) are server components that call DB functions directly, then pass data as props to `"use client"` components for interactivity.
- **Path alias** — `@/` resolves to `src/` (configured in both tsconfig.json and vitest.config.ts).

### Database

SQLite file at `db/fatebound.db` (created at runtime, gitignored). WAL mode, foreign keys enabled. Four tables: `characters`, `daily_states` (per-character per-date, upsert via UNIQUE constraint), `form_history`, `session_notes`. All cascade-delete on character removal.

### API Routes

All under `src/app/api/characters/`. RESTful route handlers using `NextResponse.json()`. Dynamic params use Next.js 15+ `Promise<{ id: string }>` pattern.

### Game Engine (`src/engine/`)

Pure functions with no side effects — designed for easy testing:
- `dawn-roll.ts` — Resolves d20 outcome tier (Chaos vs Stabilized)
- `chaos-form.ts` — Assembles random form from tables A/B/C/D with Fate's Mercy corrections
- `stabilized-form.ts` — Resolves one of 12 named forms with subclass features
- `residual-memory.ts` — Validates persistent feature slot allocation
- `spell-slots.ts` — Spell slot progression, Arcane Recovery, Mystic Arcanum
- `fate-pool.ts` — Fate pool mechanics (level 11+)

### Static Game Data (`src/data/`)

Lookup tables for the Fatebound class: chassis (Table A), primary features (Table B), defensive features (Table C), feats (Table D — 92 entries), 12 stabilized forms, 12 subclasses, level progression, spell slots, spells, and magic items.

### D&D Beyond Integration

`src/integrations/ddb-sync.ts` generates MCP tool call payloads (JSON with `tool` + `params`) for syncing to D&D Beyond. These are displayed in the settings UI for use with Claude Code + DDB MCP tools — the app does not call DDB directly.

## Testing

Vitest with `environment: "node"` and globals enabled. Tests live in `__tests__/` directories adjacent to source.

- **Engine tests** mock `@/lib/dice` with `vi.mock` for deterministic results
- **DB tests** mock the db module to use a temp SQLite file created with `fs.mkdtempSync`; `beforeEach` wipes all tables in dependency order for isolation
- **No component tests** — only unit/integration tests for engine logic and DB layer

## Styling

Tailwind v4 with custom design tokens in `src/app/globals.css` via `@theme inline`. Dark theme only. Custom color tokens: `bg-deep`, `bg-surface`, `bg-elevated`, `accent` (red), `fate` (purple). Fonts: Cinzel (headings), Roboto (body). UI primitives barrel-exported from `src/components/ui/index.ts`.

## Dice Randomness

`crypto.getRandomValues` in `src/lib/dice.ts` for unbiased randomness. `rollFatesSelection()` uses rejection sampling to avoid modulo bias.
