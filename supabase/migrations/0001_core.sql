-- Kamba core relational model (PostgreSQL). Apply only to a backend-owned database.
-- Authentication credentials should be managed by the identity provider, never stored as client data.
create extension if not exists pgcrypto;
create extension if not exists postgis;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  username text,
  display_name text,
  phone_e164 text,
  status text not null default 'active' check (status in ('active','suspended','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create unique index if not exists users_email_lower_uq on public.users (lower(email)) where deleted_at is null;
create unique index if not exists users_username_lower_uq on public.users (lower(username)) where username is not null and deleted_at is null;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.users(id),
  category_id uuid not null references public.categories(id),
  name text not null,
  slug text not null unique,
  description text,
  verification_status text not null default 'unverified' check (verification_status in ('unverified','pending','verified','rejected')),
  location geography(point,4326),
  address_area text,
  status text not null default 'active' check (status in ('active','paused','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists stores_category_status_idx on public.stores(category_id,status) where deleted_at is null;
create index if not exists stores_location_gix on public.stores using gist(location);
create index if not exists stores_owner_idx on public.stores(owner_user_id);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id),
  category_id uuid not null references public.categories(id),
  name text not null,
  description text,
  price_minor bigint not null check (price_minor >= 0),
  currency char(3) not null default 'NGN',
  inventory_quantity integer check (inventory_quantity is null or inventory_quantity >= 0),
  status text not null default 'active' check (status in ('draft','active','sold_out','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists products_store_status_idx on public.products(store_id,status) where deleted_at is null;
create index if not exists products_category_status_idx on public.products(category_id,status) where deleted_at is null;

create table if not exists public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  alt_text text,
  created_at timestamptz not null default now()
);
create index if not exists product_media_product_sort_idx on public.product_media(product_id,sort_order);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_user_id uuid not null references public.users(id),
  store_id uuid not null references public.stores(id),
  status text not null default 'pending' check (status in ('pending','confirmed','paid','fulfilling','completed','cancelled','refunded')),
  currency char(3) not null default 'NGN',
  subtotal_minor bigint not null check (subtotal_minor >= 0),
  delivery_minor bigint not null default 0 check (delivery_minor >= 0),
  total_minor bigint not null check (total_minor >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_buyer_created_idx on public.orders(buyer_user_id,created_at desc);
create index if not exists orders_store_created_idx on public.orders(store_id,created_at desc);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  product_name text not null,
  unit_price_minor bigint not null check (unit_price_minor >= 0),
  quantity integer not null check (quantity > 0),
  line_total_minor bigint not null check (line_total_minor >= 0)
);
create index if not exists order_items_order_idx on public.order_items(order_id);

create table if not exists public.store_reviews (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id),
  author_user_id uuid not null references public.users(id),
  order_id uuid not null unique references public.orders(id),
  rating smallint not null check (rating between 1 and 5),
  body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists store_reviews_store_created_idx on public.store_reviews(store_id,created_at desc);

create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending','active','paused','expired','rejected')),
  budget_minor bigint not null check (budget_minor >= 0),
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index if not exists ads_active_window_idx on public.ads(status,starts_at,ends_at);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_user_id uuid not null references public.users(id),
  referred_user_id uuid not null unique references public.users(id),
  code text not null unique,
  status text not null default 'pending' check (status in ('pending','qualified','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (referrer_user_id <> referred_user_id)
);

-- API/database role grants, row-level security policies, payment events, audit logs,
-- updated_at triggers and retention rules must be completed in the backend deployment
-- before exposing a production environment. Do not run this migration from the app.
