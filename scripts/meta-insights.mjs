#!/usr/bin/env node
/**
 * Atelier Nagori — sincronização automática Meta (Instagram/Facebook Ads) -> Supabase
 *
 * Puxa as métricas dos anúncios (gasto, alcance, frequência, cliques, conversas no
 * WhatsApp) direto da API da Meta e grava na tabela `mkt_metricas` do Supabase,
 * que o painel de Marketing lê. O TOKEN nunca fica no site/app — ele vive só aqui,
 * como um "secret" do GitHub Actions.
 *
 * NÃO cria campanhas, NÃO altera orçamento, NÃO gasta dinheiro. Só LÊ e grava números.
 *
 * Variáveis de ambiente (secrets do GitHub):
 *   META_ACCESS_TOKEN          - token de acesso com permissão ads_read
 *   META_AD_ACCOUNT_ID         - id da conta de anúncios (só números, sem "act_")
 *   SUPABASE_URL               - https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY  - chave service_role do Supabase (secreta!)
 *   DIAS (opcional)            - quantos dias puxar (padrão 7; use 90 numa 1ª carga)
 *   META_API_VERSION (opcional)- padrão v21.0
 */

const TOKEN = process.env.META_ACCESS_TOKEN;
const ACCOUNT = (process.env.META_AD_ACCOUNT_ID || "").replace(/^act_/, "");
const SB_URL = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DIAS = parseInt(process.env.DIAS || "7", 10);
const VER = process.env.META_API_VERSION || "v21.0";

function die(msg) { console.error("ERRO:", msg); process.exit(1); }
if (!TOKEN) die("falta META_ACCESS_TOKEN");
if (!ACCOUNT) die("falta META_AD_ACCOUNT_ID");
if (!SB_URL || !SB_KEY) die("faltam SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");

// janela de datas: dos últimos N dias até ontem (dia fechado)
function ymd(d) { return d.toISOString().slice(0, 10); }
const hoje = new Date();
const ate = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate() - 1));
const desde = new Date(ate); desde.setUTCDate(desde.getUTCDate() - (DIAS - 1));
const timeRange = JSON.stringify({ since: ymd(desde), until: ymd(ate) });

function tipoDoNome(nome) {
  const n = (nome || "").toLowerCase();
  if (n.includes("reel")) return "reel";
  if (n.includes("story") || n.includes("stories")) return "story";
  if (n.includes("post") || n.includes("feed")) return "post";
  return "trafego";
}

// soma as ações de "conversa iniciada" (mensagens) que a Meta reporta
function conversasDe(actions) {
  if (!Array.isArray(actions)) return 0;
  let total = 0;
  for (const a of actions) {
    const t = a.action_type || "";
    if (t.includes("messaging_conversation_started") || t === "onsite_conversion.total_messaging_connection") {
      total += Number(a.value || 0);
    }
  }
  return total;
}

async function fetchInsights() {
  const fields = [
    "ad_id", "ad_name", "spend", "reach", "impressions",
    "frequency", "clicks", "inline_link_clicks", "actions",
  ].join(",");
  const base = `https://graph.facebook.com/${VER}/act_${ACCOUNT}/insights`;
  const rows = [];
  let url = `${base}?level=ad&time_increment=1&time_range=${encodeURIComponent(timeRange)}`
    + `&fields=${encodeURIComponent(fields)}&limit=200&access_token=${encodeURIComponent(TOKEN)}`;
  let guard = 0;
  while (url && guard++ < 50) {
    const r = await fetch(url);
    const j = await r.json();
    if (j.error) die("Meta API: " + (j.error.message || JSON.stringify(j.error)));
    for (const d of (j.data || [])) rows.push(d);
    url = j.paging && j.paging.next ? j.paging.next : null;
  }
  return rows;
}

function toMkt(d) {
  const data = d.date_start; // time_increment=1 traz date_start por dia
  const cliques = Number(d.inline_link_clicks || d.clicks || 0);
  return {
    id: `meta_${d.ad_id}_${data}`,
    data,
    campanha: d.ad_name || "(sem nome)",
    tipo: tipoDoNome(d.ad_name),
    investido: Number(d.spend || 0),
    alcance: Math.round(Number(d.reach || 0)),
    impressoes: Math.round(Number(d.impressions || 0)),
    frequencia: Number(d.frequency || 0),
    cliques,
    conversas: conversasDe(d.actions),
    interessados: 0,
    origem: "meta",
    meta_id: d.ad_id,
  };
}

async function upsert(rows) {
  if (!rows.length) return 0;
  // grava em lotes de 200, mesclando duplicados por id (on_conflict=id)
  let gravadas = 0;
  for (let i = 0; i < rows.length; i += 200) {
    const lote = rows.slice(i, i + 200);
    const r = await fetch(`${SB_URL}/rest/v1/mkt_metricas?on_conflict=id`, {
      method: "POST",
      headers: {
        "apikey": SB_KEY,
        "Authorization": `Bearer ${SB_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(lote),
    });
    if (!r.ok) die(`Supabase ${r.status}: ${await r.text()}`);
    gravadas += lote.length;
  }
  return gravadas;
}

(async () => {
  console.log(`Puxando anúncios da Meta de ${ymd(desde)} a ${ymd(ate)} (conta act_${ACCOUNT})...`);
  const raw = await fetchInsights();
  const rows = raw.map(toMkt).filter(x => x.investido > 0 || x.alcance > 0 || x.cliques > 0);
  const n = await upsert(rows);
  console.log(`OK: ${raw.length} linhas da Meta, ${n} gravadas em mkt_metricas.`);
})().catch(e => die(e.message || String(e)));
