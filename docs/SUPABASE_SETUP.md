# Supabase setup

## 1. Create a project
Create a project at supabase.com. From Project Settings > API, copy the
URL and the anon key into your `.env`.

## 2. Apply the schema
Open the SQL editor and run `supabase/migrations/0001_roles_and_profiles.sql`.
It creates the `profiles` and `user_roles` tables, the `has_role`
function, the signup trigger, and the RLS policies.

With the Supabase CLI instead:

```bash
supabase link --project-ref <your-ref>
supabase db push
```

## 3. Grant yourself admin
New users get the `member` role automatically. Promote yourself once:

```sql
insert into public.user_roles (user_id, role)
values ('<your-auth-user-uuid>', 'admin');
```

Find your user id under Authentication > Users.

## 4. Regenerate types as your schema grows
```bash
npx supabase gen types typescript --linked > src/types/database.ts
```
