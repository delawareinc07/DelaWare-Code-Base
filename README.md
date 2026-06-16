<!--
Repository metadata (paste into GitHub's "About" panel)

description: Production React + TypeScript + Tailwind + Supabase starter with auth, roles, and row level security solved. Built by Delaware Inc. to ship client sites in 3 days.

topics: react, typescript, tailwindcss, supabase, vite, starter-template, boilerplate, rbac, row-level-security, nigeria
-->

<div align="center">

# DelaWare-Code-Base

**The production base every Delaware Inc. build starts from.**

React · TypeScript · Tailwind · Supabase

Auth, roles, and row level security solved once, correctly, so client work ships in 3 days instead of fighting the same bugs every time.

</div>

---

## Why this exists

Most web app boilerplates hand you a folder of files and leave the hard parts to you. The hard parts are always the same: getting Supabase auth to survive a page refresh, resolving user roles without leaking the whole table, and keeping protected pages from bouncing users in a redirect loop.

This starter is opinionated about exactly those problems. Each one is solved in a single, well-commented place, and the comment explains the failure mode it prevents. You build features on top, not plumbing underneath.

## What is solved for you

| Area | What you get | The trap it avoids |
| --- | --- | --- |
| **Auth state** | An `AuthProvider` that subscribes before it fetches | Dropping the first sign-in event on a fresh load |
| **Roles** | A `useRole` hook reading from the `user_roles` table | Stale roles baked into the JWT at signup |
| **Route guards** | A `ProtectedRoute` that waits for loading to finish | Login to dashboard to login redirect loops |
| **Database** | RLS policies driven by a `SECURITY DEFINER` function | Infinite recursion when a policy checks its own table |
| **Brand** | Tokens wired into Tailwind and CSS variables | Restyling from scratch on every project |

## Stack

- **Vite + React 18 + TypeScript**, the same shape Lovable generates, so patterns here drop straight into a Lovable project.
- **Tailwind CSS** with Delaware brand tokens preloaded.
- **Supabase** for auth, Postgres, and row level security.
- **React Router** for protected routing.

## Quickstart

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
# then fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 3. Apply the database schema
#    Run supabase/migrations/0001_roles_and_profiles.sql in the
#    Supabase SQL editor, or via the Supabase CLI.

# 4. Run
npm run dev
```

Make your first user an admin by inserting a row in `user_roles`:

```sql
insert into public.user_roles (user_id, role)
values ('<your-auth-user-uuid>', 'admin');
```

## Project structure

```
src/
  lib/supabase.ts            Supabase client, fails loud on missing env
  providers/AuthProvider.tsx Session state, the listener-first pattern
  hooks/useRole.ts           Role resolution from user_roles
  components/
    ProtectedRoute.tsx       Loading-gated route guard
    ui/Button.tsx            Branded button
  pages/                     Login, Dashboard, admin/
  types/database.ts          Hand-written types, swap for generated
supabase/migrations/         The roles + RLS schema
docs/                        Architecture, Supabase, and RBAC notes
```

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) how the pieces fit together
- [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md) project setup and migrations
- [`docs/RBAC.md`](docs/RBAC.md) the role model and how to extend it

## Brand tokens

| Token | Value |
| --- | --- |
| Primary Blue | `#0046FF` |
| Accent Green | `#00D084` |
| Ink Navy | `#0C1B33` |
| Display | Space Grotesk |
| Body | Inter |

---

<div align="center">

Built and maintained by **[Delaware Inc.](https://delaware.ng)** — websites for Nigerian businesses, delivered in 3 days.

</div>
