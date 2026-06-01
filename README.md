# GimmeAchievement

A gamified achievement tracking platform. Users unlock achievements from a catalog, write personal notes, leave comments and reactions, and earn Gamerscore points. The concept bridges digital and physical: themed enamel pins ship with unique redemption codes that unlock corresponding in-app achievements.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Vue 3 (Composition API), TypeScript, Pinia, Vue Router, Vite |
| Backend | Go, PostgreSQL 17 |
| Testing | Vitest |
| Dev infra | Docker Compose |

---

## Features

- **Achievement catalog** — browse, filter by theme and unlock status
- **Detail page** — story, personal note, comments, emoji reactions
- **Unlock flow** — unlock by code (physical pin)
- **5 visual themes** — Gaming, Retro, Cozy, Forest, Default; each has its own CSS token set and decorative background component
- **Light / dark mode**
- **Responsive** — adapts to mobile layouts

---

## Frontend Architecture

```
src/
├── components/
│   ├── achievement/   # ACard, AHeader, AStory, AReactions — detail & catalog cards
│   ├── profile/       # PHeader, PGamerscore, PFilters, PCatalog, PSidebar
│   ├── decor/         # Per-theme background effects (GamingDecor, RetroDecor, etc)
│   └── ui/            # Primitives: UiButton, UiInput, UiChip, UiImage, UiSpinner
├── composables/       # useFormatDate, usePlural (Intl.PluralRules), useNotifier
├── stores/            # Pinia: achievements, profile, colorScheme
├── services/          # Typed fetch wrapper + per-resource API modules
├── types/             # Shared TypeScript interfaces
├── constants/         # Enums, static maps (themes, accent colors, reactions)
└── styles/
    └── tokens/        # CSS custom properties for light / dark themes
```

## Backend

Minimal Go REST API, no framework - standard library `ServeMux` + CORS middleware.

```
backend/
├── cmd/server/        # Entry point, server setup
└── internal/
    ├── handlers/      # HTTP handlers (achievements.go)
    ├── db/            # pgx connection pool
    └── models/        # Structs + SQL queries
```

**Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/achievements` | List all achievements |
| `GET` | `/api/achievements/{id}` | Single achievement |
| `PATCH` | `/api/achievements/{id}/unlock` | Mark as unlocked |
| `PATCH` | `/api/achievements/{id}/note` | Update personal note |

---

## Local Setup

**Prerequisites:** Node 18+, Go 1.21+, Docker

```bash
# 1. Start PostgreSQL
docker compose up -d

# 2. Apply migrations
psql -U gimme -d gimmeachievement -f backend/migrations/001_init.sql
psql -U gimme -d gimmeachievement -f backend/migrations/002_extend_achievements.sql
psql -U gimme -d gimmeachievement -f backend/migrations/003_seed_more.sql

# 3. Run backend
cd backend && go run ./cmd/server

# 4. Run frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `:8080`.

```bash
npm run test      # Vitest
npm run lint      # ESLint
npm run format    # Prettier
```
