# Architecture

A request moves through four layers. Each owns one job.

1. **Supabase client** (`src/lib/supabase.ts`)
   A single configured client. It throws on startup if env vars are
   missing, so a misconfigured project fails immediately and loudly
   rather than producing confusing "undefined" errors later.

2. **AuthProvider** (`src/providers/AuthProvider.tsx`)
   Holds session state for the whole app. It subscribes to auth changes
   before fetching the existing session, which is the ordering that
   keeps a fresh page load from missing the first sign-in event. It
   exposes a `loading` flag that every routing decision depends on.

3. **useRole** (`src/hooks/useRole.ts`)
   Reads the current user's roles from the `user_roles` table on demand.
   Roles are never read from the JWT, because a token minted at signup
   goes stale the moment an admin changes someone's access.

4. **ProtectedRoute** (`src/components/ProtectedRoute.tsx`)
   Gates a route on session and, optionally, role. It renders a loading
   state until auth and roles are resolved, and only then decides to
   render or redirect. That single rule is what prevents redirect loops.

## Persistence note

Keep durable state in Supabase, not localStorage. localStorage is fine
for throwaway UI preferences, but using it as a source of truth for
records leads to the device-specific data drift we have hit before.
Read and write through Supabase and let RLS protect the rows.
