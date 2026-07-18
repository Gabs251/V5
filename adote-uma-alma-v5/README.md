# Adote uma Alma

Plataforma de apadrinhamento espiritual construída para a **Igreja Internacional Geração Profética** — arrecadação de contribuições para levar pessoas ao Encontro com Deus Redenção (24 de julho de 2026).

## Stack

- **Next.js 15** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** para estilo
- **Supabase** (Postgres + Auth + Storage) como backend
- **Framer Motion** para animações
- **React Hook Form + Zod** para formulários e validação
- **Recharts** para gráficos no painel administrativo
- **Lucide Icons**

## Como correr localmente

```bash
npm install
cp .env.example .env.local
# preencha as variáveis do Supabase em .env.local
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Configuração do Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No SQL Editor, corra por ordem os ficheiros em `supabase/migrations/` (criam as tabelas, relações e políticas RLS).
3. Corra `supabase/seed.sql` para criar as duas almas iniciais e as configurações de MBWay.
4. Em **Storage**, confirme que o bucket `comprovativos` foi criado (feito pela migração) — é privado, apenas o admin acede.
5. Em **Authentication → Users**, crie manualmente o utilizador administrador (o email/password que vai usar para entrar em `/admin`), ou use o script abaixo com a Service Role Key:

```bash
# opcional: criar o admin via API REST do Supabase
curl -X POST 'https://SEU_PROJETO.supabase.co/auth/v1/admin/users' \
  -H "apikey: SUA_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer SUA_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@adoteumaalma.pt","password":"troque-esta-password","email_confirm":true}'
```

6. Copie a URL e as chaves do projeto (Settings → API) para o `.env.local`.

## Estrutura de pastas

```
app/                  Rotas (App Router)
  (site)/             Páginas públicas: home, quem-somos, adote-uma-alma, transparencia, investimentos, faq, contato
  admin/              Painel administrativo protegido
  api/                Route handlers (contribuições, contacto)
components/           Componentes reutilizáveis de UI
  ui/                 Primitivos (Botão, Cartão, Barra de progresso...)
  site/               Componentes específicos das páginas públicas
  admin/              Componentes do painel administrativo
lib/                  Cliente Supabase, tipos, validações, utilitários
supabase/
  migrations/         SQL de criação de schema + RLS
  seed.sql            Dados iniciais (2 almas + config MBWay)
public/               Estáticos: robots.txt, sitemap.xml, favicon, imagens
```

## Fluxo de contribuição (sem gateway de pagamento)

1. O visitante escolhe uma alma e clica em **Adotar**.
2. Escolhe um valor (5€, 10€, 20€, 30€, 50€, 100€ ou outro) — abre-se o modal com o QR Code e número MBWay.
3. Após pagar por MBWay, preenche nome, valor e envia o comprovativo (imagem/PDF) — guardado no Supabase Storage.
4. A contribuição fica **pendente** até o administrador a confirmar ou rejeitar no painel.
5. Só depois de confirmada é que o valor arrecadado, a percentagem e a barra de progresso da alma são atualizados.

## Painel administrativo

Aceda a `/admin/login` com as credenciais criadas no Supabase Auth. O painel permite:

- Criar, editar e arquivar almas (incluindo QR Code e meta)
- Confirmar ou rejeitar contribuições pendentes
- Ver o histórico completo e exportar CSV
- Ver gráficos de arrecadação (Recharts)

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Ambiente de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servir o build de produção |
| `npm run lint` | ESLint |

## Deploy

Otimizado para a **Vercel**: importe o repositório, defina as variáveis de ambiente do `.env.example` no painel do projeto e faça deploy.

---

Feito com fé, para as nações. · Instagram [@gp.portugal](https://instagram.com/gp.portugal)

## Pagamentos por cartao (Stripe)

1. Crie uma conta em stripe.com e copie a chave secreta para STRIPE_SECRET_KEY no .env.local.
2. No painel da Stripe, crie um webhook apontando para /api/webhooks/stripe com o evento checkout.session.completed e copie o segredo para STRIPE_WEBHOOK_SECRET.
3. Quando um pagamento por cartao e confirmado, a doacao e registada automaticamente na base de dados e o valor arrecadado da alma e atualizado (requer o Supabase configurado e semeado).

## Autenticacao do administrador (V5)

- O painel /admin e invisivel para visitantes: nao ha qualquer link publico.
- O login faz-se apenas com Google ou Apple (Supabase Auth).
- So o email definido em ADMIN_EMAIL (gprocopio2020@gmail.com) consegue entrar; qualquer outra conta e desligada e devolvida a Home.
- Ative os fornecedores Google e Apple em Authentication > Providers no Supabase e adicione SITE_URL/auth/callback aos Redirect URLs.
- Next.js atualizado para ^15.2.4 (sem a vulnerabilidade de middleware CVE-2025-29927).

## Novas configuracoes do painel (V5)

- Numero MB WAY, data do contador e numero de nacoes alcancadas sao editaveis em /admin (Dashboard > Configuracoes do projeto).
- O valor arrecadado e o pais de cada alma sao editaveis em /admin/almas.
