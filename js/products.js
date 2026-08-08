/* =====================================================================
   ATELIER NAGORI — CATÁLOGO DE PRODUTOS
   ---------------------------------------------------------------------
   Para trocar por FOTOS REAIS: em cada produto, substitua a chave
   "art" por uma chave "img" com o caminho da foto, por exemplo:
        img: "assets/samambaia.jpg"
   O código usa a foto quando existir e a ilustração quando não.
   Preços em reais (R$).
   ===================================================================== */

/* ---- Gerador de ilustrações botânicas (SVG) ------------------------- */
const Art = (() => {
  // Base: a esfera de musgo (kokedama) desenhada na parte de baixo.
  const mossBall = (c1, c2) => `
    <ellipse cx="200" cy="360" rx="92" ry="30" fill="rgba(0,0,0,.12)"/>
    <circle cx="200" cy="300" r="78" fill="url(#moss)"/>
    <circle cx="200" cy="300" r="78" fill="url(#mossTex)"/>
    <defs>
      <radialGradient id="moss" cx="40%" cy="35%" r="75%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </radialGradient>
      <radialGradient id="mossTex" cx="50%" cy="50%" r="60%">
        <stop offset="70%" stop-color="transparent"/>
        <stop offset="100%" stop-color="rgba(0,0,0,.18)"/>
      </radialGradient>
    </defs>`;

  const leaf = (x, y, rot, len, col) =>
    `<path transform="translate(${x} ${y}) rotate(${rot})"
       d="M0 0 Q ${len * 0.28} ${-len * 0.5} 0 ${-len} Q ${-len * 0.28} ${-len * 0.5} 0 0 Z"
       fill="${col}"/>`;

  const wrap = (inner) =>
    `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img">
       <rect width="400" height="400" fill="url(#bg)"/>
       <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
         <stop offset="0%" stop-color="#f7f4ec"/><stop offset="100%" stop-color="#eae3d4"/>
       </linearGradient></defs>${inner}</svg>`;

  return {
    // Samambaia / asplênio — folhagem em leque
    fern: (a = "#4e7c4a", b = "#2f5230", m1 = "#6b5a3e", m2 = "#3f3423") =>
      wrap(`${[...Array(9)].map((_, i) => {
        const ang = -80 + i * 20;
        return `<g transform="translate(200 240) rotate(${ang})">
          <path d="M0 0 C 8 -70 -8 -140 0 -190" stroke="${i % 2 ? a : b}" stroke-width="5" fill="none" stroke-linecap="round"/>
          ${[...Array(7)].map((_, j) => {
            const yy = -25 - j * 24, s = 14 - j * 1.3;
            return `<path d="M0 ${yy} q ${s} -6 ${s * 1.6} 4" stroke="${i % 2 ? a : b}" stroke-width="3" fill="none" stroke-linecap="round"/>
                    <path d="M0 ${yy} q ${-s} -6 ${-s * 1.6} 4" stroke="${i % 2 ? a : b}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
          }).join("")}
        </g>`;
      }).join("")}${mossBall(m1, m2)}`),

    // Folhas largas — peperômia / jiboia
    broad: (a = "#5c8a4a", b = "#3c6b34", m1 = "#6b5a3e", m2 = "#3f3423") =>
      wrap(`${[[-55, -30, 90], [-20, -55, 130], [25, -50, 150], [55, -20, 105], [0, -70, 175]]
        .map(([x, y, l], i) => leaf(200 + x, 235 + y, x < 0 ? -35 - i * 6 : 35 + i * 6, l, i % 2 ? a : b))
        .join("")}${mossBall(m1, m2)}`),

    // Pendente — hera / jiboia caindo pelas laterais
    trailing: (a = "#5f9b57", b = "#3d6d3a", m1 = "#5f5136", m2 = "#362c1d") =>
      wrap(`${mossBall(m1, m2)}
        ${[[-1, "#3d6d3a"], [1, "#5f9b57"]].map(([dir, col]) =>
          `<path d="M${200 + dir * 40} 300 q ${dir * 60} 40 ${dir * 30} 120" stroke="${col}" stroke-width="4" fill="none"/>
           ${[...Array(6)].map((_, j) =>
             leaf(200 + dir * (40 + j * 6), 305 + j * 20, dir > 0 ? 60 : -60, 26, j % 2 ? a : b)).join("")}`).join("")}
        ${[[-25, -60], [0, -75], [25, -58]].map(([x, y], i) =>
          leaf(200 + x, 235 + y, x < 0 ? -25 : x > 0 ? 25 : 0, 60, i === 1 ? a : b)).join("")}`),

    // Folhas eretas com flor — lírio da paz / antúrio
    lily: (a = "#3f7a3c", b = "#2c5a2b", flower = "#f4f1e8", spadix = "#e9c46a",
           m1 = "#6b5a3e", m2 = "#3f3423") =>
      wrap(`${[[-45, 100, -22], [-15, 120, -8], [15, 118, 8], [45, 98, 22]]
        .map(([x, l, r]) => leaf(200 + x, 240, r, l, b)).join("")}
        ${[[-30, 88, -16], [0, 108, 0], [30, 86, 16]].map(([x, l, r]) => leaf(200 + x, 240, r, l, a)).join("")}
        <g transform="translate(200 150)">
          <path d="M0 0 C 34 -20 30 -70 -4 -60 C -26 -54 -22 -12 0 0 Z" fill="${flower}"/>
          <rect x="-3" y="-52" width="6" height="34" rx="3" fill="${spadix}"/>
        </g>${mossBall(m1, m2)}`),

    // Suculenta — roseta compacta
    succulent: (a = "#7fae7a", b = "#a7c6a0", tip = "#c98b7a",
                m1 = "#6b5a3e", m2 = "#3f3423") =>
      wrap(`<g transform="translate(200 250)">
        ${[...Array(12)].map((_, i) => {
          const ang = i * 30, r = i % 2 ? 58 : 42;
          return `<g transform="rotate(${ang})"><path d="M0 0 Q 12 ${-r * 0.6} 0 ${-r} Q -12 ${-r * 0.6} 0 0 Z"
            fill="${i % 2 ? a : b}"/><circle cx="0" cy="${-r}" r="3" fill="${tip}"/></g>`;
        }).join("")}
        <circle r="10" fill="${b}"/></g>${mossBall(m1, m2)}`),

    // Orquídea — haste com flores
    orchid: (leafc = "#3f7a3c", stem = "#6d7f52", petal = "#e7a6c4", heart = "#b3679a",
             m1 = "#6b5a3e", m2 = "#3f3423") =>
      wrap(`${[[-38, 70, -20], [38, 66, 20]].map(([x, l, r]) => leaf(200 + x, 250, r, l, leafc)).join("")}
        <path d="M200 250 C 240 200 250 150 236 110" stroke="${stem}" stroke-width="4" fill="none"/>
        ${[[236, 110], [230, 145], [244, 180]].map(([cx, cy], i) =>
          `<g transform="translate(${cx} ${cy}) scale(${1 - i * 0.12})">
             ${[0, 72, 144, 216, 288].map(a =>
               `<ellipse cx="0" cy="-16" rx="9" ry="15" fill="${petal}" transform="rotate(${a})"/>`).join("")}
             <circle r="7" fill="${heart}"/></g>`).join("")}
        ${mossBall(m1, m2)}`),
  };
})();

/* ---- Catálogo ------------------------------------------------------- */
const PRODUCTS = [
  {
    id: "samambaia-americana",
    nome: "Kokedama de Samambaia Americana",
    preco: 89,
    categoria: "Folhagens",
    descricao: "Folhagem exuberante e cheia, ideal para ambientes de meia-sombra e cantos que pedem frescor.",
    cuidados: "Meia-sombra · Borrifar as folhas · Mergulhar a cada 3–4 dias",
    art: Art.fern("#4e7c4a", "#2f5230"),
  },
  {
    id: "jiboia-verde",
    nome: "Kokedama de Jiboia",
    preco: 75,
    categoria: "Pendentes",
    descricao: "Ramos que caem com leveza — perfeita para prateleiras altas e suportes suspensos.",
    cuidados: "Luz indireta · Rega moderada · Muito resistente",
    art: Art.trailing("#5f9b57", "#3d6d3a"),
  },
  {
    id: "lirio-da-paz",
    nome: "Kokedama de Lírio da Paz",
    preco: 98,
    categoria: "Floríferas",
    descricao: "Flores brancas e elegantes sobre folhagem verde profunda. Purifica o ar do ambiente.",
    cuidados: "Meia-sombra · Manter musgo úmido · Floresce na primavera",
    art: Art.lily(),
  },
  {
    id: "peperomia",
    nome: "Kokedama de Peperômia",
    preco: 68,
    categoria: "Folhagens",
    descricao: "Folhas suculentas e arredondadas, compacta e discreta. Excelente para mesas e escrivaninhas.",
    cuidados: "Luz indireta · Rega leve · Tolera esquecimentos",
    art: Art.broad("#5c8a4a", "#3c6b34"),
  },
  {
    id: "suculenta-rosetao",
    nome: "Kokedama de Suculenta Rosetão",
    preco: 59,
    categoria: "Suculentas",
    descricao: "Roseta simétrica e escultural, para quem gosta de plantas de baixa manutenção e muita personalidade.",
    cuidados: "Sol pleno ou meia-sombra · Rega quinzenal · Cuidado com excesso de água",
    art: Art.succulent(),
  },
  {
    id: "orquidea-mini",
    nome: "Kokedama de Mini Orquídea",
    preco: 145,
    categoria: "Floríferas",
    descricao: "A joia do ateliê. Floração delicada e duradoura, montada com musgo sphagnum selecionado.",
    cuidados: "Luz indireta forte · Mergulhar 1x por semana · Adubar na floração",
    art: Art.orchid(),
  },
  {
    id: "hera-inglesa",
    nome: "Kokedama de Hera Inglesa",
    preco: 72,
    categoria: "Pendentes",
    descricao: "Cascata de folhas recortadas que ganha volume com o tempo. Um clássico atemporal.",
    cuidados: "Meia-sombra · Rega moderada · Podar para dar forma",
    art: Art.trailing("#6ea864", "#3f6f3b"),
  },
  {
    id: "asplenio-ninho",
    nome: "Kokedama de Asplênio Ninho",
    preco: 92,
    categoria: "Folhagens",
    descricao: "Folhas onduladas em formato de ninho, tropical e escultural. Presença marcante em qualquer canto.",
    cuidados: "Meia-sombra · Umidade alta · Borrifar com frequência",
    art: Art.fern("#5a8a4f", "#356037"),
  },
  {
    id: "anturio-vermelho",
    nome: "Kokedama de Antúrio",
    preco: 110,
    categoria: "Floríferas",
    descricao: "Espatas vermelhas brilhantes o ano inteiro sobre folhagem lustrosa. Sofisticação tropical.",
    cuidados: "Luz indireta · Musgo sempre úmido · Ambiente aquecido",
    art: Art.lily("#3f7a3c", "#2c5a2b", "#c0392b", "#e9c46a"),
  },
  {
    id: "duo-presente",
    nome: "Duo Presente — 2 Kokedamas",
    preco: 165,
    categoria: "Kits",
    descricao: "Dois kokedamas à sua escolha, embalados para presente com cartão manuscrito e furoshiki de tecido.",
    cuidados: "Acompanha guia de cuidados impresso",
    art: Art.succulent("#7fae7a", "#a7c6a0", "#c98b7a"),
  },
];
