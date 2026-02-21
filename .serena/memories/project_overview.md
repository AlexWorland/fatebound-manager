# Fatebound Manager - Project Overview

## Purpose
Character management web app for "The Fatebound," a homebrew D&D 5e class where characters transform daily based on a Dawn Roll (d20).

## Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Backend**: SQLite (better-sqlite3, synchronous API)
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest
- **Integration**: D&D Beyond MCP sync service

## Key Architecture
- **No ORM** — Raw SQL via better-sqlite3
- **No state management library** — Server components fetch directly from DB
- **Server/Client split** — Page components are server components, interactive parts use `"use client"`
- **Path alias**: `@/` resolves to `src/`
- **Database**: SQLite at `db/fatebound.db`, WAL mode enabled

## Code Style
- TypeScript strict mode
- ESLint configured
- Tailwind v4 with custom design tokens (dark theme only)
- Data files export typed const arrays
- Engine functions are pure (no side effects)
- Subclasses injected at runtime via `src/data/subclasses/index.ts`
