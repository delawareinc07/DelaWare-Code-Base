-- Training uploads, comments, and discussions.

-- Uploaded training content (by teachers and students).
create table public.training_uploads (
  id              uuid primary key default gen_random_uuid(),
  author_id       uuid not null references auth.users (id) on delete cascade,
  programme_id    uuid references public.programmes (id) on delete set null,
  title           text not null,
  description     text,
  category        text,
  tags            text[],
  thumbnail_url   text,
  visibility      public.visibility not null default 'public',
  featured        boolean default false,
  is_official     boolean default false,
  views           int default 0,
  likes           int default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Uploaded files associated with training (video, pdf, image, audio, etc).
create table public.training_files (
  id              uuid primary key default gen_random_uuid(),
  training_id     uuid not null references public.training_uploads (id) on delete cascade,
  file_url        text not null,
  file_type       text not null,
  file_size_mb    numeric,
  uploaded_at     timestamptz not null default now()
);

-- Comments and replies on training.
create table public.training_comments (
  id              uuid primary key default gen_random_uuid(),
  training_id     uuid not null references public.training_uploads (id) on delete cascade,
  author_id       uuid not null references auth.users (id) on delete cascade,
  parent_id       uuid references public.training_comments (id) on delete cascade,
  content         text not null,
  pinned          boolean default false,
  likes           int default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Student project submissions.
create table public.student_projects (
  id              uuid primary key default gen_random_uuid(),
  student_id      uuid not null references auth.users (id) on delete cascade,
  programme_id    uuid references public.programmes (id) on delete set null,
  title           text not null,
  description     text,
  image_url       text,
  featured        boolean default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Teacher links to programmes they teach.
create table public.teacher_programmes (
  id              uuid primary key default gen_random_uuid(),
  teacher_id      uuid not null references auth.users (id) on delete cascade,
  programme_id    uuid not null references public.programmes (id) on delete cascade,
  unique (teacher_id, programme_id)
);

enable row level security on public.training_uploads;
enable row level security on public.training_files;
enable row level security on public.training_comments;
enable row level security on public.student_projects;
enable row level security on public.teacher_programmes;

-- Training visibility rules.
create policy "training is public if public"
  on public.training_uploads for select
  using (
    visibility = 'public'
    or public.current_user_is_admin()
    or auth.uid() = author_id
    or (visibility = 'students_only' and public.current_user_has_role('student'))
    or (visibility = 'programme_members_only' and programme_id is not null and exists (
      select 1 from public.programme_enrollments
      where student_id = auth.uid() and programme_id = training_uploads.programme_id
    ))
  );

-- Authors manage their uploads.
create policy "authors manage uploads"
  on public.training_uploads for all
  using (auth.uid() = author_id or public.current_user_is_admin())
  with check (auth.uid() = author_id or public.current_user_is_admin());

-- Files follow training visibility.
create policy "files follow training"
  on public.training_files for select
  using (
    exists (
      select 1 from public.training_uploads tu
      where tu.id = training_id and (
        tu.visibility = 'public'
        or public.current_user_is_admin()
        or auth.uid() = tu.author_id
        or (tu.visibility = 'students_only' and public.current_user_has_role('student'))
        or (tu.visibility = 'programme_members_only' and tu.programme_id is not null and exists (
          select 1 from public.programme_enrollments
          where student_id = auth.uid() and programme_id = tu.programme_id
        ))
      )
    )
  );

-- Authors upload files to their trainings.
create policy "authors upload files"
  on public.training_files for insert
  with check (
    exists (
      select 1 from public.training_uploads tu
      where tu.id = training_id and auth.uid() = tu.author_id
    )
  );

-- Comments follow training visibility.
create policy "comments follow training"
  on public.training_comments for select
  using (
    exists (
      select 1 from public.training_uploads tu
      where tu.id = training_id and (
        tu.visibility = 'public'
        or public.current_user_is_admin()
        or auth.uid() = tu.author_id
        or (tu.visibility = 'students_only' and public.current_user_has_role('student'))
        or (tu.visibility = 'programme_members_only' and tu.programme_id is not null and exists (
          select 1 from public.programme_enrollments
          where student_id = auth.uid() and programme_id = tu.programme_id
        ))
      )
    )
  );

-- Authenticated users comment; staff moderate.
create policy "users comment"
  on public.training_comments for insert
  with check (auth.uid() = author_id);

create policy "authors edit own comments"
  on public.training_comments for update
  using (auth.uid() = author_id or public.current_user_is_staff());

-- Student projects are public or admin-only.
create policy "projects are public if featured"
  on public.student_projects for select
  using (
    featured
    or public.current_user_is_admin()
    or auth.uid() = student_id
  );

-- Students submit projects.
create policy "students submit projects"
  on public.student_projects for insert
  with check (auth.uid() = student_id);

-- Teachers link to programmes.
create policy "staff manage teacher assignments"
  on public.teacher_programmes for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());
