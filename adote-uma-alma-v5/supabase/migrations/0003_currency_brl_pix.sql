-- ============================================================
-- 0003_currency_brl_pix.sql
-- Suporte a doações em Euro (€) e Real Brasileiro (R$) + PIX
-- Taxa fixa do projeto: 110 € = 635 R$  (1 € = 5,7727 R$)
-- Sem APIs externas — toda a conversão é feita no próprio banco.
-- ============================================================

-- ---------- Enum: moeda da contribuição ----------
do $$ begin
  create type contribution_currency as enum ('eur', 'brl');
exception when duplicate_object then null; end $$;

-- ---------- Enum: método de pagamento ----------
do $$ begin
  create type contribution_payment_method as enum ('mbway', 'card', 'pix');
exception when duplicate_object then null; end $$;

-- ---------- Novas colunas em contributions ----------
alter table public.contributions
  add column if not exists currency contribution_currency not null default 'eur';

alter table public.contributions
  add column if not exists payment_method contribution_payment_method not null default 'mbway';

-- Valor original na moeda em que foi paga (em centavos dessa moeda).
-- amount_cents passa a ser sempre em centavos de Euro (moeda canónica da alma).
alter table public.contributions
  add column if not exists original_amount_cents integer;

alter table public.contributions
  add column if not exists donor_email text;

-- Identificador da sessão Stripe (para idempotência do webhook).
alter table public.contributions
  add column if not exists stripe_session_id text;

-- Idempotência: sessão Stripe só pode ter uma contribuição.
create unique index if not exists uq_contributions_stripe_session_id
  on public.contributions(stripe_session_id)
  where stripe_session_id is not null;

-- ---------- Backfill: registos antigos ficam em EUR ----------
update public.contributions
  set currency = 'eur',
      payment_method = 'mbway',
      original_amount_cents = amount_cents
  where original_amount_cents is null;

alter table public.contributions
  alter column original_amount_cents set not null;

alter table public.contributions
  add constraint contributions_original_amount_positive
  check (original_amount_cents > 0);

-- ---------- Função auxiliar: conversão BRL -> EUR (centavos) ----------
-- 1 € = 5,7727 R$  ->  1 R$ = 0,173228... €
create or replace function public.brl_cents_to_eur_cents(brl_cents integer)
returns integer as $$
begin
  if brl_cents is null or brl_cents <= 0 then
    return 0;
  end if;
  -- 110 € = 635 R$  ->  eur_cents = brl_cents * 110 / 635
  return round(brl_cents::numeric * 110.0 / 635.0)::integer;
end;
$$ language plpgsql immutable security definer;

-- ============================================================
-- CORREÇÃO DO STRIPE
-- O gatilho original (apply_confirmed_contribution) só disparava em
-- UPDATE. O webhook do Stripe insere já com status='confirmada', pelo
-- que o valor nunca era somado a raised_cents.
-- Novo gatilho dispara em INSERT e UPDATE, cobrindo ambos os casos.
-- ============================================================

create or replace function public.apply_contribution_status_change()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    if new.status = 'confirmada' then
      update public.souls
        set raised_cents = raised_cents + new.amount_cents,
            status = case
              when raised_cents + new.amount_cents >= goal_cents then 'adotada'::soul_status
              else status
            end
        where id = new.soul_id;
      new.reviewed_at = now();
    end if;
  elsif TG_OP = 'UPDATE' then
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
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_apply_confirmed_contribution on public.contributions;
create trigger trg_apply_confirmed_contribution
  before insert or update on public.contributions
  for each row execute function public.apply_contribution_status_change();

-- Função antiga mantida por segurança (caso algo ainda referencie),
-- mas o gatilho acima passa a ser o ativo.
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

-- ============================================================
-- Meta da alma em BRL (derivada):  goal_brl_cents = goal_cents * 635 / 110
-- Facilita a apresentação "110 € / 635 R$" na interface.
-- ============================================================
create or replace function public.eur_cents_to_brl_cents(eur_cents integer)
returns integer as $$
begin
  if eur_cents is null or eur_cents <= 0 then
    return 0;
  end if;
  return round(eur_cents::numeric * 635.0 / 110.0)::integer;
end;
$$ language plpgsql immutable security definer;
