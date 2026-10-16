/* Gera catálogos PDF (Folhagens, Bonsais, Suportes) a partir de js/products.js
   Estética oficial Atelier Nagori: papel kraft, moldura verde, 名残 dourado,
   serifa Cormorant e ramos botânicos — mantendo as fotos dos produtos. */
const fs = require("fs");
const path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");

const ROOT = "/home/user/ateliernagori";
let code = fs.readFileSync(path.join(ROOT, "js/products.js"), "utf8");
code += "\nmodule.exports={PRODUCTS,BASES,CATEGORIAS};";
fs.writeFileSync("/tmp/prod.cjs", code);
const { PRODUCTS } = require("/tmp/prod.cjs");

const BRL = (n) => "R$ " + Number(n).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const temVar = (p) => Array.isArray(p.variantes) && p.variantes.length;
const menor = (p) => (temVar(p) ? Math.min(...p.variantes.map((v) => v.preco)) : p.preco);
const PH = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23e7dcc3'/%3E%3Cpath d='M200 300c26 16 34 50 0 100-34-50-26-84 0-100z' fill='%238d8f66'/%3E%3Cpath d='M200 306v82' stroke='%236f7a56' stroke-width='4'/%3E%3Ctext x='200' y='432' text-anchor='middle' font-family='Georgia, serif' font-size='18' fill='%238d8f66'%3Efoto em breve%3C/text%3E%3C/svg%3E";
const esc = (s) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ramo botânico em linha (olive) — reutilizado na capa
const SPRIG = (cls) => `<svg class="sprig ${cls}" viewBox="0 0 220 90" fill="none" stroke="#8d8f66" stroke-width="1.5" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 80 C 70 72 130 48 210 10"/>
  ${[0.18,0.32,0.46,0.6,0.74].map((t,i)=>{const x=10+200*t,y=80-70*t;const s=i%2?1:-1;return `<path d="M${x} ${y} q ${s*14} -16 ${s*30} -14" /><path d="M${x} ${y} q ${s*8} -2 ${s*16} -14"/>`;}).join("")}
  <ellipse cx="206" cy="12" rx="4" ry="8" transform="rotate(-38 206 12)" fill="#9aa07a" stroke="none"/>
</svg>`;

function precoTxt(p) {
  if (p.categoria === "suporte") return BRL(p.preco);
  if (temVar(p)) return `<small>a partir de</small> ${BRL(menor(p))}`;
  if (p.encomenda) return `${BRL(p.preco)}<small>Sob encomenda · prazo 3 dias</small>`;
  return BRL(p.preco);
}
function allImgs(p) { return p.imgs && p.imgs.length ? p.imgs : (p.img ? [p.img] : []); }

function card(p) {
  const varLine = temVar(p)
    ? `<div class="c-var">Variedades: ${p.variantes.map((v) => esc(v.label)).join(" · ")}</div>` : "";
  const imgs = allImgs(p);
  const main = imgs[0] || "";
  const rest = imgs.slice(1);
  const mainImg = `<div class="c-main"><img src="/${main}" onerror="this.onerror=null;this.src='${PH}'"></div>`;
  const thumbs = rest.length
    ? `<div class="c-thumbs">${rest.map((s) => `<img src="/${s}" onerror="this.onerror=null;this.src='${PH}'">`).join("")}</div>`
    : "";
  return `<article class="c">
    <div class="c-img">${mainImg}${thumbs}</div>
    <div class="c-b">
      <h3>${esc(p.nome)}</h3>
      ${p.especie ? `<p class="c-esp">${esc(p.especie)}</p>` : ""}
      ${p.descricao ? `<p class="c-desc">${esc(p.descricao)}</p>` : ""}
      ${varLine}
      <div class="c-price">${precoTxt(p)}</div>
    </div>
  </article>`;
}

function pagina({ titulo, sub, itens, secoes }) {
  const corpo = secoes
    ? secoes.map((s) => `<h2 class="sec"><span>${esc(s.nome)}</span></h2><div class="grid">${s.itens.map(card).join("")}</div>`).join("")
    : `<div class="grid">${itens.map(card).join("")}</div>`;
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link rel="stylesheet" href="gf.css">
<style>
  :root{
    --green:#2a3820; --green-d:#223018; --green-soft:#45503a;
    --badge:#223019; --cream:#f3ead4; --gold:#c0963f; --gold-d:#a9833c; --olive:#8d8f66;
    --paper:#e7dcc3; --paper-lt:#f3ead5; --paper-dk:#d7cbac; --line:#cdc3a7;
    --serif:"Cormorant Garamond","EB Garamond",Georgia,serif;
    --sans:"Helvetica Neue",Arial,sans-serif;
  }
  @page { size: A4; margin: 13mm 13mm 16mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: var(--serif); color: var(--green);
    background: var(--paper);
    -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .kraft { background:
      radial-gradient(120% 70% at 50% 0%, var(--paper-lt) 0%, var(--paper) 52%, var(--paper-dk) 110%); }
  /* ---------- Capa ---------- */
  .cover { position: relative; height: 263mm; page-break-after: always;
    display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
  .cframe { position: absolute; inset: 7mm; border: 1.6pt solid var(--green); }
  .cframe::after { content:""; position:absolute; inset: 2.6mm; border: .5pt solid var(--green); }
  .cdia { position: absolute; width: 11px; height: 11px; background: var(--gold); transform: rotate(45deg); }
  .cdia.tl{ left:7mm; top:7mm; margin:-5px 0 0 -5px } .cdia.tr{ right:7mm; top:7mm; margin:-5px -5px 0 0 }
  .cdia.bl{ left:7mm; bottom:7mm; margin:0 0 -5px -5px } .cdia.br{ right:7mm; bottom:7mm; margin:0 -5px -5px 0 }
  .sprig { position: absolute; width: 62mm; opacity: .8; }
  .sprig.tr { top: 15mm; right: 13mm; }
  .sprig.bl { bottom: 15mm; left: 13mm; transform: rotate(180deg); }
  .badge { width: 44mm; height: 44mm; border-radius: 50%; background: var(--badge);
    display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 9mm; }
  .badge .mk { font-size: 20pt; color: var(--gold); line-height: 1; }
  .badge .nm { font-size: 15pt; color: var(--cream); margin-top: 1mm; white-space: nowrap; }
  .badge .sb { font-style: italic; font-size: 9pt; color: var(--gold); margin-top: .5mm; }
  .cover h1 { font-weight: 600; font-size: 46pt; margin: 2mm 0 0; color: var(--green-d); letter-spacing: .01em; }
  .cover .tsub { font-family: var(--sans); font-size: 8.5pt; letter-spacing: .32em; text-transform: uppercase; color: var(--gold-d); margin-top: 3mm; }
  .cline { display: flex; align-items: center; gap: 4mm; margin: 7mm 0; }
  .cline i { height: .6pt; width: 26mm; background: var(--gold); opacity: .7; }
  .cline b { width: 7px; height: 7px; background: var(--gold); transform: rotate(45deg); }
  .cover .sub { color: var(--green-soft); font-size: 12pt; max-width: 128mm; line-height: 1.55; font-style: italic; }
  .cover .contato { margin-top: 12mm; font-family: var(--sans); font-size: 9pt; color: var(--green); line-height: 1.8; letter-spacing: .02em; }
  .cover .contato b { color: var(--gold-d); letter-spacing: .06em; }
  /* ---------- Cabeçalho das páginas ---------- */
  .page-head { display: flex; justify-content: space-between; align-items: baseline;
    border-bottom: .8pt solid var(--line); padding-bottom: 3mm; margin-bottom: 6mm; }
  .page-head .t { font-family: var(--serif); font-weight: 600; font-size: 19pt; color: var(--green-d); }
  .page-head .n { font-family: var(--sans); font-size: 8pt; letter-spacing: .2em; text-transform: uppercase; color: var(--gold-d); }
  .sec { text-align: center; margin: 9mm 0 5mm; break-after: avoid; display: flex; align-items: center; justify-content: center; gap: 4mm; }
  .sec::before, .sec::after { content:""; height:.6pt; width: 22mm; background: var(--gold); opacity:.55; }
  .sec span { font-family: var(--sans); font-size: 8.5pt; letter-spacing: .24em; text-transform: uppercase; color: var(--green-soft); }
  .grid { display: flex; flex-direction: column; gap: 6mm; }
  /* ---------- Card do produto ---------- */
  .c { break-inside: avoid; border: .8pt solid var(--line); border-radius: 3mm; overflow: hidden;
    display: flex; gap: 5mm; padding: 4mm; background: rgba(255,253,247,.5); }
  .c-img { flex: 0 0 56mm; display: flex; flex-direction: column; gap: 2mm; }
  .c-main { background: var(--paper-dk); border-radius: 2mm; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .c-main img { width: 100%; height: 64mm; object-fit: contain; display: block; }
  .c-thumbs { display: flex; flex-wrap: wrap; gap: 2mm; }
  .c-thumbs img { flex: 0 0 auto; width: 17mm; height: 22mm; object-fit: cover; background: var(--paper-dk); border-radius: 1.5mm; display: block; }
  .c-b { flex: 1; padding: .5mm 1mm .5mm 0; display: flex; flex-direction: column; }
  .c-b h3 { font-family: var(--serif); font-weight: 600; font-size: 16pt; margin: 0 0 1mm; color: var(--green-d); line-height: 1.05; }
  .c-esp { font-family: var(--serif); font-style: italic; font-size: 10.5pt; color: var(--gold-d); margin: 0 0 2mm; }
  .c-desc { font-family: var(--serif); font-size: 11pt; line-height: 1.4; color: var(--green-soft); margin: 0 0 2mm; }
  .c-var { font-family: var(--sans); font-size: 7.5pt; color: var(--olive); margin: 0 0 2mm; letter-spacing: .02em; }
  .c-price { font-family: var(--serif); font-weight: 600; font-size: 17pt; color: var(--green-d); margin-top: auto; }
  .c-price small { font-family: var(--sans); font-size: 7pt; letter-spacing: .04em; color: var(--gold-d); display: block; font-weight: 600; text-transform: uppercase; }
  /* ---------- Rodapé ---------- */
  .foot { margin-top: 9mm; border-top: .8pt solid var(--line); padding-top: 4mm; text-align: center;
    font-family: var(--sans); font-size: 8.5pt; color: var(--green-soft); line-height: 1.6; }
  .foot b { color: var(--gold-d); }
</style></head><body class="kraft">
  <section class="cover">
    <div class="cframe"></div>
    <span class="cdia tl"></span><span class="cdia tr"></span><span class="cdia bl"></span><span class="cdia br"></span>
    ${SPRIG("tr")}${SPRIG("bl")}
    <div class="badge"><div class="mk">名残</div><div class="nm">Atelier Nagori</div><div class="sb">o que permanece</div></div>
    <h1>${esc(titulo)}</h1>
    <div class="tsub">Catálogo · 名残</div>
    <div class="cline"><i></i><b></b><i></i></div>
    <div class="sub">${esc(sub)}</div>
    <div class="contato">
      <b>WhatsApp</b> (41) 98707-4284<br>
      <b>Instagram</b> @ateliernagori<br>
      Curitiba · PR — feito à mão
    </div>
  </section>
  <div class="page-head"><span class="t">${esc(titulo)}</span><span class="n">Atelier Nagori · 名残</span></div>
  ${corpo}
  <div class="foot">Para encomendar, chame no <b>WhatsApp (41) 98707-4284</b> — envio para todo o Brasil, saída de Curitiba/PR.<br>Base inclusa; bases especiais à parte. Valores sujeitos a alteração.</div>
</body></html>`;
}

// Catálogo lista o portfólio completo (inclui itens temporariamente sem estoque).
const folhagens = PRODUCTS.filter((p) => ["dentro", "ambos", "arlivre"].includes(p.categoria));
const grande = PRODUCTS.filter((p) => p.categoria === "grande");
const bonsais = PRODUCTS.filter((p) => p.categoria === "bonsai");
const suportes = PRODUCTS.filter((p) => p.categoria === "suporte");

const catDir = path.join(ROOT, "catalogo");
fs.mkdirSync(catDir, { recursive: true });

const files = [
  { name: "folhagens", html: pagina({
      titulo: "Folhagens", sub: "Kokedamas de folhagens para dentro de casa, varanda e ar livre — mais as peças de grande porte.",
      secoes: [{ nome: "Folhagens", itens: folhagens }, { nome: "Grande porte", itens: grande }] }) },
  { name: "bonsais", html: pagina({
      titulo: "Bonsais", sub: "Árvores formadas ao longo de anos sobre esferas de musgo vivo. O coração do ateliê.",
      itens: bonsais }) },
  { name: "suportes", html: pagina({
      titulo: "Suportes", sub: "Bases para expor sua kokedama — madeira, tripés de ferro e peças especiais. Vendidas à parte.",
      itens: suportes }) },
];
files.forEach((f) => fs.writeFileSync(path.join(catDir, f.name + ".html"), f.html));
console.log("HTML gerado:", files.map((f) => f.name).join(", "));

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
  const pg = await b.newPage();
  for (const f of files) {
    await pg.goto(`http://localhost:8231/catalogo/${f.name}.html`, { waitUntil: "networkidle" });
    await pg.pdf({ path: path.join(catDir, `Atelier-Nagori-${f.name}.pdf`), preferCSSPageSize: true, printBackground: true });
    console.log("PDF:", `Atelier-Nagori-${f.name}.pdf`);
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
