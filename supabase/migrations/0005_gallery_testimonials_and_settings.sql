-- Gallery, testimonials, and admin settings.

create type public.gallery_category as enum (
  'classes',
  'trainings',
  'practical_sessions',
  'catering_events',
  'food_displays',
  'cakes',
  'student_projects'
);

create type public.testimonial_category as enum (
  'student',
  'graduate',
  'catering_client',
  'corporate_client'
);

-- Gallery images and videos.
create table public.gallery_items (
  id              uuid primary key default gen_random_uuid(),
  category        public.gallery_category not null,
  title           text,
  description     text,
  media_url       text not null,
  media_type      text not null,
  featured        boolean default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Testimonials.
create table public.testimonials (
  id              uuid primary key default gen_random_uuid(),
  category        public.testimonial_category not null,
  author_name     text not null,
  author_title    text,
  quote           text not null,
  image_url       text,
  featured        boolean default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Admin settings: site config, branding, integrations.
create table public.admin_settings (
  id              uuid primary key default gen_random_uuid(),
  site_name       text default 'Pabblyn Metropolitan College',
  tagline         text default 'Forging Purpose-Driven Leaders for the Metropolitan World',
  logo_url        text,
  favicon_url     text,

  -- Contact info
  address         text,
  phone           text,
  whatsapp        text default '09028877816',
  email           text,

  -- Social media
  facebook_url    text,
  instagram_url   text,
  twitter_url     text,
  linkedin_url    text,
  youtube_url     text,

  -- Brand colors
  primary_color   text default '#001f3f',
  secondary_color text default '#FFD700',
  accent_color    text default '#FFD700',

  -- Feature toggles
  animations_enabled  boolean default true,
  learning_community_enabled boolean default true,
  catering_enabled    boolean default true,

  -- WhatsApp order template
  whatsapp_template text default 'Hi! I''d like to place an order. Customer: {customer_name}, Phone: {customer_phone}, Products: {products}, Delivery: {delivery_address}, Total: ₦{grand_total}',

  updated_at      timestamptz not null default now()
);

-- Page content: editable homepage sections, about, mission/vision, etc.
create table public.page_content (
  id              uuid primary key default gen_random_uuid(),
  page_slug       text not null unique,
  section_name    text,
  content_json    jsonb,
  updated_at      timestamptz not null default now()
);

-- Email templates and notifications config.
create table public.notifications_settings (
  id              uuid primary key default gen_random_uuid(),
  event_type      text not null unique,
  enabled         boolean default true,
  email_template  text,
  updated_at      timestamptz not null default now()
);

enable row level security on public.gallery_items;
enable row level security on public.testimonials;
enable row level security on public.admin_settings;
enable row level security on public.page_content;
enable row level security on public.notifications_settings;

-- Gallery and testimonials are public.
create policy "gallery is public"
  on public.gallery_items for select
  using (true);

create policy "testimonials are public"
  on public.testimonials for select
  using (true);

-- Admins manage gallery and testimonials.
create policy "admins manage gallery"
  on public.gallery_items for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

create policy "admins manage testimonials"
  on public.testimonials for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

-- Admin settings are readable by all, writable by admin only.
create policy "admin settings are readable"
  on public.admin_settings for select
  using (true);

create policy "admins manage settings"
  on public.admin_settings for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

-- Page content is readable by all, writable by admin only.
create policy "page content is readable"
  on public.page_content for select
  using (true);

create policy "admins manage pages"
  on public.page_content for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

-- Notification settings are admin-only.
create policy "admins manage notifications"
  on public.notifications_settings for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

-- Insert default settings if empty.
insert into public.admin_settings (id) values (gen_random_uuid())
on conflict do nothing;
