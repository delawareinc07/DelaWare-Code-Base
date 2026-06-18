-- Programmes, enrollments, and payment tracking.

create type public.payment_status as enum (
  'pending',
  'part_payment',
  'fully_paid',
  'overdue',
  'locked',
  'suspended'
);

create type public.visibility as enum (
  'public',
  'students_only',
  'programme_members_only',
  'private',
  'admin_only'
);

-- Programmes offered by the college.
create table public.programmes (
  id              uuid primary key default gen_random_uuid(),
  name            text not null unique,
  slug            text not null unique,
  description     text,
  duration_weeks  int,
  certification   text,
  fee_naira       int not null default 0,
  image_url       text,
  category        text,
  featured        boolean default false,
  active          boolean default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Students enrolled in programmes.
create table public.programme_enrollments (
  id                uuid primary key default gen_random_uuid(),
  student_id        uuid not null references auth.users (id) on delete cascade,
  programme_id      uuid not null references public.programmes (id) on delete cascade,
  status            public.payment_status not null default 'pending',
  amount_paid       int not null default 0,
  amount_due        int not null default 0,
  payment_deadline  date,
  locked            boolean default false,
  completed         boolean default false,
  completed_at      timestamptz,
  enrolled_at       timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (student_id, programme_id)
);

-- Payment history for each enrollment.
create table public.programme_payments (
  id              uuid primary key default gen_random_uuid(),
  enrollment_id   uuid not null references public.programme_enrollments (id) on delete cascade,
  amount_naira    int not null,
  status          text not null default 'recorded',
  payment_date    date not null default now()::date,
  approved_by     uuid references auth.users (id),
  notes           text,
  created_at      timestamptz not null default now()
);

-- Issued certificates.
create table public.certificates (
  id              uuid primary key default gen_random_uuid(),
  student_id      uuid not null references auth.users (id) on delete cascade,
  programme_id    uuid not null references public.programmes (id) on delete cascade,
  issued_at       timestamptz not null default now(),
  certificate_url text
);

enable row level security on public.programmes;
enable row level security on public.programme_enrollments;
enable row level security on public.programme_payments;
enable row level security on public.certificates;

-- Programmes are visible to everyone.
create policy "programmes are public"
  on public.programmes for select
  using (true);

-- Admins manage programmes.
create policy "admins manage programmes"
  on public.programmes for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

-- Students see their own enrollments; teachers see their programme enrollments.
create policy "students see own enrollments"
  on public.programme_enrollments for select
  using (
    auth.uid() = student_id
    or public.current_user_is_admin()
    or exists (
      select 1 from public.teacher_programmes tp
      where tp.teacher_id = auth.uid() and tp.programme_id = programme_id
    )
  );

-- Students can insert enrollments (self-enroll).
create policy "students can enroll"
  on public.programme_enrollments for insert
  with check (auth.uid() = student_id);

-- Admins manage enrollments.
create policy "admins manage enrollments"
  on public.programme_enrollments for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

-- Payment visibility: student sees own, admin/teachers see theirs.
create policy "students see own payments"
  on public.programme_payments for select
  using (
    public.current_user_is_admin()
    or auth.uid() in (
      select student_id from public.programme_enrollments
      where id = enrollment_id
    )
  );

-- Admins record payments.
create policy "admins record payments"
  on public.programme_payments for insert
  with check (public.current_user_is_admin());

-- Certificates: student sees own, admin manages.
create policy "students see own certificates"
  on public.certificates for select
  using (auth.uid() = student_id or public.current_user_is_admin());

create policy "admins issue certificates"
  on public.certificates for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());
