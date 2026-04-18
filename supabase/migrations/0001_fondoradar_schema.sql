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
