create table if not exists user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  include_stale_prices boolean not null default false,
  currency text not null default 'EUR',
  dashboard_prefs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists fund_positions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  isin text not null,
  fund_name text not null,
  management_company text,
  platform_entity text not null,
  contract_mode text not null check (contract_mode in ('individual', 'roboadvisor')),
  robo_advisor_id uuid,
  shares numeric not null default 0,
  invested_amount numeric not null default 0,
  latest_nav numeric,
  latest_nav_date date,
  market_value numeric,
  return_amount numeric,
  return_pct numeric,
  price_status text not null default 'unavailable' check (price_status in ('fresh','recent','stale','unavailable')),
  price_source text,
  xray_json jsonb not null default '{"assetType":[],"sectors":[],"geography":[]}'::jsonb,
  source_meta_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists robo_advisors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  entity text not null,
  invested_value numeric not null default 0,
  total_value numeric not null default 0,
  sub_funds jsonb not null default '[]'::jsonb,
  last_updated timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists price_snapshots (
  id uuid primary key default gen_random_uuid(),
  isin text not null,
  nav numeric,
  nav_date date,
  source text,
  status text not null default 'unavailable',
  fetched_at timestamptz not null default now(),
  raw_payload jsonb not null default '{}'::jsonb
);

alter table user_settings enable row level security;
alter table fund_positions enable row level security;
alter table robo_advisors enable row level security;

create policy "user_settings_select_own" on user_settings for select to authenticated using (auth.uid() = user_id);
create policy "user_settings_insert_own" on user_settings for insert to authenticated with check (auth.uid() = user_id);
create policy "user_settings_update_own" on user_settings for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "fund_positions_select_own" on fund_positions for select to authenticated using (auth.uid() = user_id);
create policy "fund_positions_insert_own" on fund_positions for insert to authenticated with check (auth.uid() = user_id);
create policy "fund_positions_update_own" on fund_positions for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "fund_positions_delete_own" on fund_positions for delete to authenticated using (auth.uid() = user_id);

create policy "robo_advisors_select_own" on robo_advisors for select to authenticated using (auth.uid() = user_id);
create policy "robo_advisors_insert_own" on robo_advisors for insert to authenticated with check (auth.uid() = user_id);
create policy "robo_advisors_update_own" on robo_advisors for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "robo_advisors_delete_own" on robo_advisors for delete to authenticated using (auth.uid() = user_id);

create extension if not exists pgcrypto;

create table if not exists public.fund_positions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  isin text not null,
  fund_name text not null,
  management_company text null,
  platform_entity text not null,
  contract_mode text not null default 'individual',

  robo_advisor_id uuid null references public.robo_advisors(id) on delete set null,

  shares numeric(20,6) not null default 0,
  invested_amount numeric(14,2) not null default 0,

  latest_nav numeric(14,6) null,
  latest_nav_date date null,
  market_value numeric(14,2) null,
  return_amount numeric(14,2) null,
  return_pct numeric(10,4) null,

  price_status text not null default 'unknown',
  price_source text null,

  xray_json jsonb not null default jsonb_build_object(
    'assetType', '[]'::jsonb,
    'sectors', '[]'::jsonb,
    'geography', '[]'::jsonb
  ),
  source_meta_json jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.robo_advisors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  name text not null,
  entity text not null,
  invested_value numeric(14,2) not null default 0,
  total_value numeric(14,2) not null default 0,
  last_updated date null,
  sub_funds jsonb not null default '[]'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  cash_balance numeric(14,2) not null default 0,
  preferred_currency text not null default 'EUR',
  historical_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  fund_position_id uuid not null references public.fund_positions(id) on delete cascade,

  transaction_type text not null default 'buy',
  amount numeric(14,2) not null,
  shares numeric(20,6) null,
  transaction_date date not null default current_date,
  description text null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fund_positions_user_id_idx on public.fund_positions(user_id);
create index if not exists fund_positions_isin_idx on public.fund_positions(isin);
create index if not exists robo_advisors_user_id_idx on public.robo_advisors(user_id);
create index if not exists transactions_user_id_idx on public.transactions(user_id);
create index if not exists transactions_fund_position_id_idx on public.transactions(fund_position_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_fund_positions_updated_at on public.fund_positions;
create trigger trg_fund_positions_updated_at
before update on public.fund_positions
for each row execute function public.set_updated_at();

drop trigger if exists trg_robo_advisors_updated_at on public.robo_advisors;
create trigger trg_robo_advisors_updated_at
before update on public.robo_advisors
for each row execute function public.set_updated_at();

drop trigger if exists trg_portfolio_settings_updated_at on public.portfolio_settings;
create trigger trg_portfolio_settings_updated_at
before update on public.portfolio_settings
for each row execute function public.set_updated_at();

drop trigger if exists trg_transactions_updated_at on public.transactions;
create trigger trg_transactions_updated_at
before update on public.transactions
for each row execute function public.set_updated_at();

alter table public.fund_positions enable row level security;
alter table public.robo_advisors enable row level security;
alter table public.portfolio_settings enable row level security;
alter table public.transactions enable row level security;

drop policy if exists fund_positions_select on public.fund_positions;
create policy fund_positions_select
on public.fund_positions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists fund_positions_insert on public.fund_positions;
create policy fund_positions_insert
on public.fund_positions
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists fund_positions_update on public.fund_positions;
create policy fund_positions_update
on public.fund_positions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists fund_positions_delete on public.fund_positions;
create policy fund_positions_delete
on public.fund_positions
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists robo_advisors_select on public.robo_advisors;
create policy robo_advisors_select
on public.robo_advisors
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists robo_advisors_insert on public.robo_advisors;
create policy robo_advisors_insert
on public.robo_advisors
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists robo_advisors_update on public.robo_advisors;
create policy robo_advisors_update
on public.robo_advisors
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists robo_advisors_delete on public.robo_advisors;
create policy robo_advisors_delete
on public.robo_advisors
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists portfolio_settings_select on public.portfolio_settings;
create policy portfolio_settings_select
on public.portfolio_settings
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists portfolio_settings_insert on public.portfolio_settings;
create policy portfolio_settings_insert
on public.portfolio_settings
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists portfolio_settings_update on public.portfolio_settings;
create policy portfolio_settings_update
on public.portfolio_settings
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists portfolio_settings_delete on public.portfolio_settings;
create policy portfolio_settings_delete
on public.portfolio_settings
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists transactions_select on public.transactions;
create policy transactions_select
on public.transactions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists transactions_insert on public.transactions;
create policy transactions_insert
on public.transactions
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists transactions_update on public.transactions;
create policy transactions_update
on public.transactions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists transactions_delete on public.transactions;
create policy transactions_delete
on public.transactions
for delete
to authenticated
using (auth.uid() = user_id);


