-- ============================================================
-- Atelier Nagori · Marketing & Tráfego Pago
-- Rode este SQL UMA VEZ no Supabase:
--   Dashboard do Supabase  ->  SQL Editor  ->  New query  ->  cole tudo  ->  Run
-- Isso cria a tabela onde ficam os números dos anúncios (Meta/Instagram).
-- O faturamento e as vendas NÃO ficam aqui: saem das vendas do próprio app.
-- ============================================================

create table if not exists public.mkt_metricas (
  id            text primary key,              -- id do lançamento (manual) ou "meta_<ad>_<data>" (automático)
  data          date not null,                 -- dia (ou início da semana) a que os números se referem
  campanha      text,                          -- nome da campanha / conteúdo (ex: "Reel Cúpula")
  tipo          text,                          -- reel / post / story / trafego / outro
  investido     numeric  default 0,            -- R$ gastos
  alcance       bigint   default 0,            -- pessoas alcançadas
  impressoes    bigint   default 0,            -- impressões
  frequencia    numeric  default 0,            -- frequência (impressões / alcance)
  cliques       bigint   default 0,            -- cliques no link
  conversas     bigint   default 0,            -- conversas iniciadas no WhatsApp/Direct
  interessados  bigint   default 0,            -- leads qualificados (preenchido à mão)
  obs           text,
  origem        text     default 'manual',     -- 'manual' (digitado no app) ou 'meta' (robô automático)
  meta_id       text,                          -- id do anúncio na Meta (quando automático)
  criado_em     timestamptz default now()
);

-- Índice por data (consultas por período ficam rápidas)
create index if not exists mkt_metricas_data_idx on public.mkt_metricas (data);

-- Segurança: só quem está logado no app enxerga/edita.
alter table public.mkt_metricas enable row level security;

drop policy if exists "mkt metricas - logados podem tudo" on public.mkt_metricas;
create policy "mkt metricas - logados podem tudo"
  on public.mkt_metricas
  for all
  to authenticated
  using (true)
  with check (true);

-- Observação: o robô automático da Meta grava com a chave de serviço
-- (service_role), que ignora o RLS — por isso não precisa de policy pra ele.
