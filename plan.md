# Deka - Implementation Plan

## Context
Build a goal-tracking web app where 1 year = 36 blocks (3 per month: days 1-10, 11-20, 21-end). Users set goals per block, mark them complete or carry forward. Supports multiple profiles (self, kids, etc.) and categorized goals.

## Tech Stack
| Layer | Choice |
|-------|--------|
| Framework | Next.js 14+ (App Router, TypeScript) |
| Auth | Auth.js v5 — Google OAuth |
| Database | SQLite via Turso |
| ORM | Drizzle ORM |
| UI | Tailwind CSS + shadcn/ui |
| Hosting | Vercel |

## Database: 4 Tables
- **users**: id, email, name, avatar_url, provider, provider_id, timestamps
- **profiles**: id, user_id, name, color, avatar_url, is_default, created_at
- **categories**: id, user_id (null=system default), name, color, icon, sort_order
- **goals**: id, profile_id, category_id, title, description, year, block_number(1-36), status(pending/completed/carried), carried_from(self-ref), carry_count, priority(1-3), completed_at, timestamps

## Block Logic
3 blocks per calendar month (not absolute 10-day windows):
- Position 0: day 1-10
- Position 1: day 11-20
- Position 2: day 21-end of month

`month = Math.ceil(blockNumber / 3)`, `position = (blockNumber - 1) % 3`

Core logic lives in `src/lib/blocks.ts`.

---

## Phase 1: Project Scaffolding
1. `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
2. `npx shadcn@latest init` (New York style, Zinc, CSS variables)
3. Add shadcn components: button, card, dialog, dropdown-menu, input, label, select, badge, avatar, separator, toast, sheet, tabs
4. Create `.env.example` with placeholder keys
5. Verify: `npm run dev` and `npm run build` succeed

## Phase 2: Database Schema + Drizzle
1. Install `drizzle-orm @libsql/client` + `drizzle-kit`
2. Create `drizzle.config.ts`, `src/db/schema.ts` (all 4 tables), `src/db/index.ts` (client)
3. Create `src/db/seed.ts` — 6 default categories (Health, Work, Life, Learning, Finance, Others)
4. Create `src/types/index.ts` — inferred types from schema
5. Verify: `drizzle-kit generate` + `drizzle-kit push`, seed runs, Drizzle Studio shows tables

## Phase 3: Authentication
1. Install `next-auth@beta`
2. Create `src/auth.ts` — Google provider, custom signIn callback (upsert user + create default profile)
3. Create `src/app/api/auth/[...nextauth]/route.ts`
4. Create `src/middleware.ts` — protect `/(app)` routes, allow `/login` + `/api/auth`
5. Create login page at `src/app/(auth)/login/page.tsx`
6. Create `src/components/providers.tsx` (SessionProvider)
7. Verify: full OAuth flow works, user + profile rows created in DB

## Phase 4: Core Layout + Block Grid
1. Create `src/lib/blocks.ts` — `getBlockDates()`, `getCurrentBlock()`, `getBlockLabel()`
2. Create app shell: `src/components/nav-sidebar.tsx`, `src/components/header.tsx`, `src/components/profile-switcher.tsx`
3. Create `src/app/(app)/layout.tsx` — authenticated layout with sidebar + header
4. Create `src/components/block-grid.tsx` — 12-row x 3-col grid (months x blocks)
5. Create `src/components/block-card.tsx` — date range, current block highlighted
6. Create `src/app/(app)/dashboard/page.tsx` — renders BlockGrid
7. Verify: 36 blocks render with correct dates, current block highlighted, clicking navigates to `/block/[N]`

## Phase 5: Goal CRUD
1. Create `src/lib/validators.ts` — Zod schemas for goal/category forms
2. Create `src/actions/goals.ts` — createGoal, updateGoal, deleteGoal, getGoalsForBlock
3. Create `src/actions/categories.ts` — getCategories, createCategory, deleteCategory
4. Create goal UI: `goal-form.tsx` (dialog), `goal-card.tsx`, `goal-list.tsx`, `category-badge.tsx`
5. Create `src/app/(app)/block/[blockNumber]/page.tsx` — block detail with goal list
6. Verify: full CRUD works, goals isolated per block/profile

## Phase 6: Complete + Carry Forward
1. Add `completeGoal(goalId)` — sets status=completed, completed_at=now
2. Add `carryForwardGoal(goalId)` — marks original as carried, creates new goal in next block with carried_from link and incremented carry_count
3. Create `carry-forward-dialog.tsx` — confirmation with carry count warning
4. Update goal-card to show status actions and carry chain links
5. Group goals by status in block view (pending > completed > carried)
6. Verify: complete/carry works, chain is traceable, block 36 carries to block 1 of next year

## Phase 7: Dashboard Stats, Profiles, Categories, Polish
1. Add `getBlockStats(profileId, year)` — aggregated completion stats per block
2. Color-code block cards by completion % (gray→amber→blue→green)
3. Create `src/app/(app)/profiles/page.tsx` — profile CRUD (max 10, can't delete default)
4. Create `src/app/(app)/categories/page.tsx` — view defaults + manage custom categories
5. Profile switcher stores selection in cookie for server component access
6. Polish: year selector, loading skeletons, toasts, mobile responsive sidebar
7. Verify: stats render on grid, profile switching works, mobile layout works

## Deployment
1. Push to GitHub, connect to Vercel
2. Set env vars in Vercel: GOOGLE_CLIENT_ID/SECRET, AUTH_SECRET, TURSO_DATABASE_URL/AUTH_TOKEN
3. Update Google OAuth callback URL for production domain
4. Run `drizzle-kit push` + seed against production Turso
5. Full smoke test: sign in → create goal → carry forward → check dashboard

## Key Files
- `src/db/schema.ts` — foundation, all table definitions
- `src/lib/blocks.ts` — core domain logic (block↔date mapping)
- `src/auth.ts` — Auth.js config + user bootstrapping
- `src/actions/goals.ts` — goal mutations + carry-forward (most complex logic)
- `src/app/(app)/dashboard/page.tsx` — primary view tying everything together

## File Structure
```
src/
├── app/
│   ├── layout.tsx, page.tsx, globals.css
│   ├── api/auth/[...nextauth]/route.ts
│   ├── (auth)/login/page.tsx
│   └── (app)/
│       ├── layout.tsx
│       ├── dashboard/page.tsx
│       ├── block/[blockNumber]/page.tsx
│       ├── profiles/page.tsx
│       └── categories/page.tsx
├── auth.ts, middleware.ts
├── db/
│   ├── index.ts, schema.ts, seed.ts
├── lib/
│   ├── blocks.ts, utils.ts, validators.ts
├── actions/
│   ├── goals.ts, profiles.ts, categories.ts
├── components/
│   ├── ui/ (shadcn primitives)
│   ├── block-grid.tsx, block-card.tsx
│   ├── goal-list.tsx, goal-form.tsx, goal-card.tsx
│   ├── profile-switcher.tsx, category-badge.tsx
│   ├── carry-forward-dialog.tsx
│   ├── nav-sidebar.tsx, header.tsx, providers.tsx
└── types/index.ts
```
