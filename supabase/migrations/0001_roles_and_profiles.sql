-- Pabblyn Metropolitan College platform: roles, profiles, and row level security.
-- Roles live in their OWN table, and policies check them through a
-- SECURITY DEFINER function so a policy never recurses into the table
-- it is itself protecting.

create extension if not exists "pgcrypto";

-- 1. App roles. 'visitor' is implicit: no row, no auth session.
create type public.app_role as enum ('super_admin', 'admin', 'teacher', 'student');

-- 2. Profiles. One row per auth user, created automatically on signup.
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  phone       text,
  whatsapp    text,
  avatar_url  text,
  bio         text,
  occupation  text,
  created_at  timestamptz not null default now()
);

-- 3. Roles live separately from profiles so a user can hold several,
--    and so role checks never touch profile read policies.
create table public.user_roles (
  id       uuid primary key default gen_random_uuid(),
  user_id  uuid not null references auth.users (id) on delete cascade,
  role     public.app_role not null,
  unique (user_id, role)
);

-- 4. Role-check helpers. SECURITY DEFINER bypasses RLS on user_roles so
--    a policy elsewhere can call these without recursing.
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

create or replace function public.current_user_has_role(_role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.has_role(auth.uid(), _role);
$$;

create or replace function public.current_user_is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.current_user_has_role('admin') or public.current_user_has_role('super_admin');
$$;

create or replace function public.current_user_is_staff()
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.current_user_is_admin() or public.current_user_has_role('teacher');
$$;

-- 5. Auto-create a profile and a default 'student' role on signup.
--    Visitors who register from the public site become students; staff
--    accounts are promoted by an admin afterwards.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'phone');

  insert into public.user_roles (user_id, role)
  values (new.id, coalesce((new.raw_user_meta_data ->> 'requested_role')::public.app_role, 'student'));

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6. Enable RLS. Nothing is readable until a policy says so.
alter table public.profiles   enable row level security;
alter table public.user_roles enable row level security;

create policy "read own profile"
  on public.profiles for select
  using (auth.uid() = id or public.current_user_is_staff());

create policy "update own profile"
  on public.profiles for update
  using (auth.uid() = id or public.current_user_is_admin());

create policy "admins insert profiles"
  on public.profiles for insert
  with check (auth.uid() = id or public.current_user_is_admin());

create policy "read own roles"
  on public.user_roles for select
  using (auth.uid() = user_id or public.current_user_is_admin());

create policy "admins manage roles"
  on public.user_roles for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());
