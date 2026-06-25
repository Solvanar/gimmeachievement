# GimmeAchievement

A gamified achievement tracker. A user activates a physical pin by its code → the
matching achievement unlocks in the catalog, where they can add a personal note,
comments and reactions, and accumulate points (Gamerscore).

## Stack

- **Frontend:** Vue 3 (Composition API, `<script setup>`), TypeScript, Pinia, Vue Router, Vite
- **Backend:** Go (standard library `ServeMux` + CORS middleware, no framework), pgx
- **DB:** PostgreSQL 17 (schema — `backend/migrations/001_init.sql`)
- **Tests:** Vitest

## Structure

```
src/
├── components/
│   ├── ui/          # Primitives: UiButton, UiInput, UiChip, UiImage, UiSpinner
│   ├── profile/     # P-prefix: PHeader, PGamerscore, PFilters, PCatalog, PSidebar
│   ├── achievement/ # A-prefix: ACard, AHeader, AStory, AReactions
│   ├── auth/        # AuthCard
│   └── decor/       # Per-theme backgrounds: GamingDecor, RetroDecor, CozyDecor, ForestDecor…
├── layouts/         # Route-level pages (Profile, Achievement, Login, Register, Shop, Guide)
├── stores/          # Pinia setup stores: achievements, auth, profile, colorScheme
├── services/        # Typed fetch wrappers
│   └── api/         # Core: request.ts (fetch + auto-refresh), authToken, session, errors
├── composables/     # useFormatDate, usePlural, useNotifier, useComments
├── constants/       # Static maps: ranks, achievementThemes, reactions, themeAccents
└── types/           # Shared interfaces (Achievement, User…)

backend/
├── cmd/server/      # Entry point, server setup, CORS
└── internal/
    ├── handlers/    # HTTP handlers (auth, achievements, comments, codes)
    ├── middleware/  # JWT auth middleware
    ├── db/          # pgx connection pool
    └── models/      # Structs + SQL queries
```

## Frontend layers

Data flows strictly through layers:

1. **`services/`** — thin functions, one per endpoint, return a typed result. No logic,
   just `apiGet/apiPost/...`. Example: `services/achievements.ts`.
2. **`services/api/`** — the core. `request.ts` is the single entry point: attaches the
   `Authorization` header, and on a 401 hits `/auth/refresh` once and retries (parallel
   refreshes are de-duplicated via a shared promise). Access token lives in localStorage,
   refresh token in an HttpOnly cookie.
3. **`stores/`** — Pinia **setup stores** (`defineStore('x', () => {...})`, not options).
   Hold state, call services, surface errors to the UI via `useNotifier`.
   Example: `stores/achievements.ts`.
4. **Components** read stores; they never call services directly.

The API returns camelCase (Go json tags), and the frontend interfaces are camelCase too —
no mapping layer.

## Backend (Go)

Minimal REST API on the standard library. Auth flow:

- Access token: short-lived JWT, sent as `Authorization: Bearer`.
- Refresh token: stored as a **hash** in `refresh_tokens`, delivered in an HttpOnly cookie.
  Rotated on every `/auth/refresh` (old one revoked in the same transaction), revoked on `/auth/logout`.
- Passwords are bcrypt-hashed. Unique-login conflicts detected via pg error code `23505`.

All `/api/*` routes except `auth/register|login|refresh|logout` require the JWT middleware.

## Coding conventions

- Indentation — **tabs** (frontend). Semicolons, single quotes. Imports via the `@/` alias.
- Strict TS (`strict`, `noUnused*`). Narrow types internally; `unknown` only at boundaries (catch).
- **Descriptive names** everywhere. Single-letter only for `for` counters. Use `item` in
  callbacks, not `i`/`x`.
- **A blank line before every standalone `return`** and **after every `if` block**.
- Static data (maps, enum-like arrays, sets, thresholds) goes in `constants/`. Keep only
  file-specific constants inline.
- Components are named by zone prefix (`Ui*`, `P*`, `A*`, `*Decor`).

## Commands

```bash
npm run dev          # Vite dev server (:5173)
npm run build        # production build to dist/
npm run lint         # ESLint
npm run lint:fix     # + autofix
npm run format       # Prettier
npm run test         # Vitest

docker compose up -d # Postgres (:5432)

cd backend && go run ./cmd/server   # Go API (:8080)
```

## DB schema notes

The schema (`uuid_generate_v7`, the `achievement_theme` enum, CHECK constraints) is owned by
the SQL migration in `backend/migrations/`, applied manually. There is no migration tooling yet.
