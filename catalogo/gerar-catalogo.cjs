/* Gera catálogos PDF (Folhagens, Bonsais, Suportes) a partir de js/products.js */
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
const capa = (p) => (p.imgs && p.imgs.length ? p.imgs[0] : p.img || "");
const PH = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23eceadf'/%3E%3Cpath d='M200 300c26 16 34 50 0 100-34-50-26-84 0-100z' fill='%239bad86'/%3E%3Cpath d='M200 306v82' stroke='%237c8e68' stroke-width='4'/%3E%3Ctext x='200' y='432' text-anchor='middle' font-family='sans-serif' font-size='19' fill='%23a99f88'%3EFOTO EM BREVE%3C/text%3E%3C/svg%3E";
const esc = (s) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function precoTxt(p) {
  if (p.categoria === "suporte") return BRL(p.preco);
  if (temVar(p)) return `<small>a partir de</small> ${BRL(menor(p))}`;
  return BRL(p.preco);
}

function allImgs(p) {
  return p.imgs && p.imgs.length ? p.imgs : (p.img ? [p.img] : []);
}

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
    ? secoes.map((s) => `<h2 class="sec">${esc(s.nome)}</h2><div class="grid">${s.itens.map(card).join("")}</div>`).join("")
    : `<div class="grid">${itens.map(card).join("")}</div>`;
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<style>
  @page { size: A4; margin: 12mm 12mm 16mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "Helvetica Neue", Arial, sans-serif; color: #1d1b16; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .serif { font-family: Georgia, "Times New Roman", serif; }
  /* Capa */
  .cover { height: 273mm; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; page-break-after: always; background: #f6f4ee; }
  .cover .mark { font-size: 34pt; color: #1a1712; }
  .cover .brand { font-size: 15pt; letter-spacing: .32em; text-transform: uppercase; color: #6b6659; margin: 6mm 0 2mm; }
  .cover h1 { font-family: Georgia, serif; font-weight: 500; font-size: 40pt; margin: 2mm 0; color: #1a1712; }
  .cover .sub { color: #6b6659; font-size: 12pt; max-width: 120mm; line-height: 1.5; }
  .cover .rule { width: 42mm; border-top: 1px solid #c9c4b6; margin: 8mm 0; }
  .cover .contato { margin-top: 10mm; font-size: 11pt; color: #1d1b16; line-height: 1.7; }
  .cover .contato b { letter-spacing: .02em; }
  /* Cabeçalho de página de conteúdo */
  .page-head { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #e4e1d7; padding-bottom: 3mm; margin-bottom: 6mm; }
  .page-head .t { font-family: Georgia, serif; font-size: 17pt; color: #1a1712; }
  .page-head .n { font-size: 9pt; letter-spacing: .18em; text-transform: uppercase; color: #8c8678; }
  .sec { font-size: 9pt; letter-spacing: .22em; text-transform: uppercase; color: #8c8678; border-bottom: 1px solid #e4e1d7; padding-bottom: 2mm; margin: 8mm 0 5mm; break-after: avoid; }
  .grid { display: flex; flex-direction: column; gap: 6mm; }
  .c { break-inside: avoid; border: 1px solid #e8e5dc; border-radius: 3mm; overflow: hidden; display: flex; gap: 5mm; padding: 4mm; }
  .c-img { flex: 0 0 58mm; display: flex; flex-direction: column; gap: 2mm; }
  .c-main { background: #f0ede5; border-radius: 2mm; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .c-main img { width: 100%; height: 66mm; object-fit: contain; display: block; }   /* foto inteira, sem corte */
  .c-thumbs { display: flex; flex-wrap: wrap; gap: 2mm; }
  .c-thumbs img { flex: 0 0 auto; width: 17.5mm; height: 23mm; object-fit: cover; background: #f0ede5; border-radius: 1.5mm; display: block; }   /* todas as fotos/cores da peça */
  .c-b { flex: 1; padding: 1mm 1mm 1mm 0; display: flex; flex-direction: column; }
  .c-b h3 { font-family: Georgia, serif; font-weight: 500; font-size: 13.5pt; margin: 0 0 1mm; color: #1a1712; }
  .c-esp { font-family: Georgia, serif; font-style: italic; font-size: 9.5pt; color: #6b6659; margin: 0 0 2mm; }
  .c-desc { font-size: 9pt; line-height: 1.4; color: #55524a; margin: 0 0 2mm; }
  .c-var { font-size: 8pt; color: #8c8678; margin: 0 0 2mm; }
  .c-price { font-family: Georgia, serif; font-size: 15pt; color: #1a1712; margin-top: auto; }
  .c-price small { font-family: "Helvetica Neue", Arial, sans-serif; font-size: 7.5pt; letter-spacing: .04em; color: #8c8678; display: block; }
  .foot { margin-top: 8mm; border-top: 1px solid #e4e1d7; padding-top: 4mm; text-align: center; font-size: 9.5pt; color: #6b6659; }
  .foot b { color: #1d1b16; }
</style></head><body>
  <section class="cover">
    <div class="mark serif">名残</div>
    <div class="brand">Atelier Nagori</div>
    <h1>${esc(titulo)}</h1>
    <div class="rule"></div>
    <div class="sub">${esc(sub)}</div>
    <div class="contato">
      <b>WhatsApp</b> (41) 98707-4284<br>
      <b>Instagram</b> @ateliernagori<br>
      Curitiba · PR — feito à mão
    </div>
  </section>
  <div class="page-head"><span class="t serif">${esc(titulo)}</span><span class="n">Atelier Nagori · 名残</span></div>
  ${corpo}
  <div class="foot">Para encomendar, chame no <b>WhatsApp (41) 98707-4284</b> — envio para todo o Brasil, saída de Curitiba/PR. Base inclusa; bases especiais à parte. Valores sujeitos a alteração.</div>
</body></html>`;
}

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
