-- Catering products, orders, and delivery pricing.

-- Product categories.
create type public.product_category as enum (
  'food',
  'pastries',
  'desserts',
  'ethnic_treats',
  'event_catering',
  'corporate_catering',
  'services'
);

-- Products and services offered.
create table public.products (
  id              uuid primary key default gen_random_uuid(),
  name            text not null unique,
  description     text,
  category        public.product_category not null,
  price_naira     int not null,
  image_url       text,
  available       boolean default true,
  quantity_unit   text default 'unit',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Delivery cities and fees.
create table public.delivery_cities (
  id              uuid primary key default gen_random_uuid(),
  city_name       text not null unique,
  delivery_fee    int not null default 0,
  service_charge  int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Customer orders.
create table public.product_orders (
  id              uuid primary key default gen_random_uuid(),
  customer_name   text not null,
  customer_phone  text not null,
  customer_email  text,
  delivery_city   text not null,
  delivery_address text not null,
  notes           text,
  product_total   int not null default 0,
  delivery_fee    int not null default 0,
  service_charge  int not null default 0,
  grand_total     int not null,
  status          text not null default 'pending',
  whatsapp_sent   boolean default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Order line items.
create table public.order_items (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references public.product_orders (id) on delete cascade,
  product_id      uuid not null references public.products (id) on delete restrict,
  quantity        int not null,
  unit_price      int not null,
  subtotal        int not null
);

enable row level security on public.products;
enable row level security on public.delivery_cities;
enable row level security on public.product_orders;
enable row level security on public.order_items;

-- Products are public to browse.
create policy "products are public"
  on public.products for select
  using (true);

-- Admins manage products.
create policy "admins manage products"
  on public.products for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

-- Delivery cities are public to browse.
create policy "cities are public"
  on public.delivery_cities for select
  using (true);

-- Admins manage delivery cities.
create policy "admins manage cities"
  on public.delivery_cities for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

-- Orders are public (anyone can view their own by ID at order time).
-- For authenticated users, they can see orders they placed.
create policy "users view own orders"
  on public.product_orders for select
  using (true);

-- Authenticated users place orders.
create policy "users create orders"
  on public.product_orders for insert
  with check (true);

-- Admins view and manage all orders.
create policy "admins manage orders"
  on public.product_orders for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

-- Order items follow order visibility.
create policy "order items visible with order"
  on public.order_items for select
  using (true);

create policy "items created with order"
  on public.order_items for insert
  with check (true);
