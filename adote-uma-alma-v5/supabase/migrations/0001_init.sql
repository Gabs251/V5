-- Extensões
create extension if not exists "pgcrypto";

-- Enum types
do $$ begin
  create type soul_status as enum ('disponivel', 'adotada', 'arquivada');
exception when duplicate_object then null; end $$;

do $$ begin
  create type contribution_status as enum ('pendente', 'confirmada', 'rejeitada');
exception when duplicate_object then null; end $$;

-- Tabela: souls (almas)
create table if not exists public.souls (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  age integer check (age > 0 and age < 130),
  country text not null,
  extra_info text,
  description text not null,
  image_url text,
  goal_cents integer not null check (goal_cents > 0),
  raised_cents integer not null default 0 check (raised_cents >= 0),
  status soul_status not null default 'disponivel',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabela: contributions (contribuições)
create table if not exists public.contributions (
  id uuid primary key default gen_random_uuid(),
  soul_id uuid not null references public.souls(id) on delete cascade,
  donor_name text not null,
  amount_cents integer not null check (amount_cents > 0),
  proof_url text,
  status contribution_status not null default 'pendente',
  admin_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

-- Tabela: site_settings (configurações, ex: número/QR MBWay)
create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- Tabela: contact_messages (mensagens de contacto)
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Índices
create index if not exists idx_contributions_soul_id on public.contributions(soul_id);
create index if not exists idx_contributions_status on public.contributions(status);
create index if not exists idx_souls_status on public.souls(status);

-- Trigger: updated_at automático em souls
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_souls_updated_at on public.souls;
create trigger trg_souls_updated_at
  before update on public.souls
  for each row execute function public.set_updated_at();

-- Função + trigger: ao confirmar uma contribuição, soma ao raised_cents da alma
-- e, se atingir a meta, marca a alma como adotada.
create or replace function public.apply_confirmed_contribution()
returns trigger as $$
begin
  if new.status = 'confirmada' and old.status is distinct from 'confirmada' then
    update public.souls
      set raised_cents = raised_cents + new.amount_cents,
          status = case
            when raised_cents + new.amount_cents >= goal_cents then 'adotada'::soul_status
            else status
          end
      where id = new.soul_id;
    new.reviewed_at = now();
  elsif new.status = 'rejeitada' and old.status is distinct from 'rejeitada' then
    new.reviewed_at = now();
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_apply_confirmed_contribution on public.contributions;
create trigger trg_apply_confirmed_contribution
  before update on public.contributions
  for each row execute function public.apply_confirmed_contribution();
