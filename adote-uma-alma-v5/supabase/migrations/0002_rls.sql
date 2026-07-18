-- Row Level Security

alter table public.souls enable row level security;
alter table public.contributions enable row level security;
alter table public.site_settings enable row level security;
alter table public.contact_messages enable row level security;

-- souls: leitura pública, escrita apenas para autenticados (admin)
create policy "souls_public_read" on public.souls
  for select using (true);

create policy "souls_admin_write" on public.souls
  for insert to authenticated with check (true);

create policy "souls_admin_update" on public.souls
  for update to authenticated using (true) with check (true);

create policy "souls_admin_delete" on public.souls
  for delete to authenticated using (true);

-- contributions: qualquer visitante pode criar (pendente); leitura/gestão só admin
create policy "contributions_public_insert" on public.contributions
  for insert to anon, authenticated with check (status = 'pendente');

create policy "contributions_admin_read" on public.contributions
  for select to authenticated using (true);

create policy "contributions_admin_update" on public.contributions
  for update to authenticated using (true) with check (true);

-- site_settings: leitura pública (para ler número/QR MBWay), escrita só admin
create policy "settings_public_read" on public.site_settings
  for select using (true);

create policy "settings_admin_write" on public.site_settings
  for insert to authenticated with check (true);

create policy "settings_admin_update" on public.site_settings
  for update to authenticated using (true) with check (true);

-- contact_messages: qualquer visitante pode inserir; só admin lê
create policy "contact_public_insert" on public.contact_messages
  for insert to anon, authenticated with check (true);

create policy "contact_admin_read" on public.contact_messages
  for select to authenticated using (true);

-- Storage: bucket privado para comprovativos
insert into storage.buckets (id, name, public)
values ('comprovativos', 'comprovativos', true)
on conflict (id) do nothing;

create policy "comprovativos_public_upload" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'comprovativos');

create policy "comprovativos_public_read" on storage.objects
  for select using (bucket_id = 'comprovativos');

create policy "comprovativos_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'comprovativos');
