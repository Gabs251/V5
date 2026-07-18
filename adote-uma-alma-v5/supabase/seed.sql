-- Dados iniciais: quatro almas + configurações do projeto

insert into public.souls (code, age, country, extra_info, description, goal_cents, raised_cents, status)
values
  (
    '01',
    21,
    'Angola',
    'Feminino · Estudante do Curso Profissional de Tecnologia · Primeira vez',
    'Tenho 21 anos, sou angolana e atualmente estudo num Curso Profissional de Tecnologia. Desde que cheguei a Portugal tenho procurado crescer espiritualmente e fortalecer a minha caminhada com Deus. Esta será a minha primeira oportunidade de participar no Encontro com Deus Redenção, um momento que acredito que poderá transformar profundamente a minha vida. O meu desejo é conhecer mais de Deus, fortalecer a minha fé e regressar preparada para viver os propósitos que Ele tem para mim. A sua contribuição permitirá que esta experiência se torne uma realidade.',
    11000,
    0,
    'disponivel'
  ),
  (
    '02',
    32,
    'Brasil',
    'Divorciada · Mãe de 3 filhos',
    'Deseja participar pela primeira vez no Encontro com Deus Redenção para entregar completamente a sua vida a Jesus.',
    11000,
    0,
    'disponivel'
  ),
  (
    '03',
    20,
    'Brasil',
    'Mãe de uma criança',
    'Tenho 20 anos, sou mãe de uma criança e desejo participar novamente no Encontro com Deus Redenção. Na minha primeira experiência fui profundamente impactada pelo amor de Deus e saí fortalecida espiritualmente. Quero viver mais uma vez este tempo de renovação, crescimento e comunhão com os irmãos, para continuar firme nos propósitos que Deus tem para a minha vida e para a minha família.',
    11000,
    0,
    'disponivel'
  ),
  (
    '04',
    20,
    'Brasil',
    'Mãe de uma criança',
    'Sou mãe de uma criança e desejo participar pela primeira vez no Encontro com Deus Redenção. Tenho buscado me aproximar mais de Deus e acredito que este encontro será uma oportunidade para transformar a minha vida, fortalecer a minha fé e construir um futuro melhor para mim e para o meu filho. O meu desejo é conhecer mais profundamente o amor e os planos de Deus para a nossa família.',
    11000,
    0,
    'disponivel'
  )
on conflict (code) do nothing;

insert into public.site_settings (key, value)
values
  ('mbway_number', '+351 932 849 338'),
  ('event_date', '2026-07-24T21:30:00+01:00')
on conflict (key) do update set value = excluded.value;
