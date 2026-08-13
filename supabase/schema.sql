-- Run this once in Supabase: SQL Editor -> New query -> Run.
-- All access is controlled by Row Level Security.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  phone text not null default '',
  address text not null default '',
  avatar text,
  loyalty_points integer not null default 50,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

create function public.create_profile_for_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email, phone, address, avatar)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(new.raw_user_meta_data ->> 'address', ''),
    nullif(new.raw_user_meta_data ->> 'avatar', '')
  ) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_profile_for_new_user();

create table if not exists public.pizzas (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  customer_id uuid not null references auth.users(id),
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pizzas enable row level security;
alter table public.orders enable row level security;

create policy "Authenticated users can view pizzas"
  on public.pizzas for select to authenticated using (true);

create policy "Users can view their orders"
  on public.orders for select to authenticated
  using (customer_id = auth.uid());

create policy "Users can create their own orders"
  on public.orders for insert to authenticated
  with check (customer_id = auth.uid());
