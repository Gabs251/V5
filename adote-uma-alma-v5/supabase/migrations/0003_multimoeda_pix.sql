-- Multimoeda (EUR / BRL) e método de pagamento PIX.
-- Taxa fixa do projeto: 110 € = 635 R$ (sem taxas de câmbio externas).

-- Estado usado pelo webhook Stripe em reembolsos (já referido no código).
alter type contribution_status add value if not exists 'reembolsada';

alter table public.contributions
  add column if not exists currency text not null default 'EUR' check (currency in ('EUR', 'BRL')),
  add column if not exists payment_method text not null default 'mbway' check (payment_method in ('mbway', 'card', 'pix')),
  add column if not exists donor_email text;

create index if not exists idx_contributions_method_status
  on public.contributions(payment_method, status);

-- Converte um valor em cêntimos para cêntimos de euro à taxa fixa (110 € = 635 R$).
create or replace function public.contribution_eur_cents(amount integer, curr text)
returns integer as $$
  select case
    when curr = 'BRL' then round(amount * 110.0 / 635.0)::integer
    else amount
  end;
$$ language sql immutable;

-- Atualização da função de confirmação:
-- 1. converte contribuições em BRL para EUR à taxa fixa antes de somar ao arrecadado,
--    mantendo um único progresso por alma (raised_cents em cêntimos de euro);
-- 2. passa a disparar também em INSERT, para que os pagamentos Stripe gravados
--    diretamente como 'confirmada' pelo webhook atualizem automaticamente a alma
--    (correção: antes o trigger só existia em UPDATE e os pagamentos Stripe
--    nunca eram refletidos na barra de progresso).
create or replace function public.apply_confirmed_contribution()
returns trigger as $$
declare
  eur_cents integer;
begin
  eur_cents := public.contribution_eur_cents(new.amount_cents, coalesce(new.currency, 'EUR'));

  if new.status = 'confirmada'
     and (tg_op = 'INSERT' or old.status is distinct from 'confirmada') then
    update public.souls
      set raised_cents = raised_cents + eur_cents,
          status = case
            when raised_cents + eur_cents >= goal_cents then 'adotada'::soul_status
            else status
          end
      where id = new.soul_id;
    new.reviewed_at = now();
  elsif tg_op = 'UPDATE' and new.status = 'rejeitada' and old.status is distinct from 'rejeitada' then
    new.reviewed_at = now();
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_apply_confirmed_contribution on public.contributions;
create trigger trg_apply_confirmed_contribution
  before insert or update on public.contributions
  for each row execute function public.apply_confirmed_contribution();
