# Roles and access control

## The model
Roles live in their own `user_roles` table, one row per role per user, so
a single user can hold several roles. The `app_role` enum currently has
`admin`, `staff`, and `member`.

## The critical pattern
RLS policies check roles through `has_role`, a `SECURITY DEFINER`
function. This matters: if a policy on a table checks roles by querying
that same table directly, Postgres recurses into the policy again and
errors. Routing every check through the function breaks that cycle.

## Adding a role
1. Extend the enum:
   ```sql
   alter type public.app_role add value 'auditor';
   ```
2. Use it in policies via `public.current_user_has_role('auditor')`.
3. Add it to the `AppRole` union in `src/types/database.ts`.

## Client vs server
The client uses `useRole` for UX: showing or hiding an admin link, for
example. That is convenience only. Real enforcement is the RLS policies
on the database. Never rely on hiding a button as a security control.
