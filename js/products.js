/* =====================================================================
   ATELIER NAGORI — CATÁLOGO
   ---------------------------------------------------------------------
   55 peças · fonte: Catálogo Atelier Nagori (30/07/2026)
   Cada produto tem:
     nome, especie, categoria, ambiente, pet, descricao
     preco  → número único  OU  variantes: [{label, preco}]
     peso   → peso estimado em kg p/ o frete (opcional). Sem ele, o site
              estima pela categoria: folhagem ~1,8 · bonsai/raridade ~3,5 ·
              ambiente externo ~2,5 · grande porte ~6 kg. Use este campo nas
              folhagens maiores (fícus, asplênio etc.) p/ um frete mais justo.
     img    → caminho da foto  (quando não há foto, usa placeholder)
     encomenda: true → peça sob consulta (não vai ao carrinho)
     raridade: true → edição especial
   Para trocar/adicionar fotos: coloque o arquivo em assets/produtos/
   e aponte o caminho em "img".
   ===================================================================== */

/* Placeholder elegante para peças com "foto em preparo" ---------------- */
function fotoEmBreve() {
  return `
  <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Foto em breve">
    <rect width="400" height="500" fill="url(#pg)"/>
    <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f2efe6"/><stop offset="100%" stop-color="#e3dccb"/>
    </linearGradient>
    <radialGradient id="pm" cx="42%" cy="36%" r="70%">
      <stop offset="0%" stop-color="#7d6a49"/><stop offset="100%" stop-color="#4a3d29"/>
    </radialGradient></defs>
    <ellipse cx="200" cy="330" rx="86" ry="26" fill="rgba(0,0,0,.10)"/>
    <circle cx="200" cy="270" r="74" fill="url(#pm)"/>
    <path d="M200 200 C 214 150 210 120 200 96 C 190 120 186 150 200 200 Z" fill="#5c8a4a"/>
    <path d="M200 205 C 236 175 250 172 262 150 C 250 176 236 196 200 210 Z" fill="#3c6b34"/>
    <path d="M200 205 C 164 175 150 172 138 150 C 150 176 164 196 200 210 Z" fill="#4e7c4a"/>
    <text x="200" y="410" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#8a7f6a">名残</text>
    <text x="200" y="440" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" letter-spacing="2" fill="#a99f88">FOTO EM BREVE</text>
  </svg>`;
}

const IMG = (id) => `assets/produtos/${id}.jpg`;

/* Categorias (seções do catálogo) ------------------------------------- */
const CATEGORIAS = [
  { id: "dentro",  nome: "Dentro de casa", desc: "Folhagens e floridas para luz indireta." },
  { id: "ambos",   nome: "Dentro ou fora", desc: "Versáteis: interior com boa luz ou varanda." },
  { id: "arlivre", nome: "Ao ar livre",    desc: "Peças que pedem sol e ar livre." },
  { id: "bonsai",  nome: "Bonsais",        desc: "Árvores formadas ao longo de anos sobre musgo vivo. O coração do ateliê." },
  { id: "grande",  nome: "Grande porte",   desc: "As maxi kokedamas — peças de chão para hall e pé-direito alto." },
  { id: "suporte", nome: "Suportes",       desc: "Bases para expor sua kokedama — madeira, tripés de ferro e peças especiais. Vendidas à parte." },
];

const PRODUCTS = [
  /* ---------- 01 · DENTRO DE CASA ---------- */
  { id: "arranjo-orquidea", nome: "Arranjo de Orquídea", peso: 3, especie: "Phalaenopsis com folhagens · composição única · também chamado tamandama", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "Orquídea combinada com folhagens sobre a mesma esfera. A raiz da orquídea e o musgo se entendem naturalmente, e cada arranjo é montado de forma única.", preco: 450, imgs: [IMG("arranjo-orquidea"), IMG("arranjo-orquidea-2")] },
  { id: "anturio-vermelho", nome: "Antúrio Vermelho", especie: "Anthurium andraeanum", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Espata lacada, folha larga e escura. Floresce quase o ano inteiro em luz indireta.", preco: 180, img: IMG("anturio-vermelho") },
  { id: "anturio-rosa", nome: "Antúrio Rosa", especie: "Anthurium andraeanum · tamanho único", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Espata rosada e brilhante que dura semanas abertas, sobre folhagem verde-escura lustrosa. Floresce quase o ano todo em luz indireta.", preco: 180, img: IMG("anturio-rosa") },
  { id: "maranta-pavao", nome: "Maranta Pavão", especie: "Calathea makoyana", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "Desenho de pena em cada folha, translúcido contra a luz. Fecha as folhas à noite e as reabre pela manhã. Gosta de luz indireta e de ar úmido.", preco: 200, img: IMG("maranta-pavao") },
  { id: "alocasia-polly", nome: "Alocásia Polly", peso: 3, especie: "Alocasia × amazonica", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folha em ponta de flecha, verde quase preto com nervura branca em relevo. Desenho gráfico, quase artificial de tão marcado.", preco: 215, img: IMG("alocasia-polly") },
  { id: "begonia-maculata", nome: "Begônia Maculata", especie: "Begonia maculata", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folha em asa com pontos prateados sobre verde escuro e verso vinho. Uma das folhagens mais fotografadas que existem.", preco: 290, img: IMG("begonia-maculata") },
  { id: "maranta-white-fusion", nome: "Maranta White Fusion", especie: "Calathea 'White Fusion'", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "Manchas brancas irregulares que invadem o verde, cada folha com um desenho próprio. A mais delicada da família — pede umidade constante.", preco: 230, img: IMG("maranta-white-fusion") },
  { id: "asplenio", nome: "Asplênio", peso: 3, especie: "Asplenium nidus", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "Folhas inteiras em roseta, brilhantes. Cresce como um ninho aberto sobre a esfera.", preco: 345, img: IMG("asplenio") },
  { id: "maranta-cascavel", nome: "Maranta Cascavel", especie: "Goeppertia insignis", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "Folha estreita e ondulada, salpicada de manchas escuras alternadas — o nome vem do desenho, que lembra pele de cobra. O par montado junto fica especialmente bonito.", variantes: [{ label: "Peça única", preco: 125 }, { label: "O par", preco: 230 }], img: IMG("maranta-cascavel") },
  { id: "maranta-triostar", nome: "Maranta Triostar", especie: "Stromanthe sanguinea 'Triostar'", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "Verde, creme e rosa na mesma folha, com verso inteiramente magenta. Levanta as folhas à noite e as baixa pela manhã.", preco: 215, img: IMG("maranta-triostar") },
  { id: "peperomia-raindrop", nome: "Peperomia Raindrop", especie: "Peperomia polybotrya", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "Folha em gota, grossa e envernizada, sobre haste alta e ereta. Mais vertical e mais rara que a peperomia comum.", variantes: [{ label: "Peça única", preco: 125 }, { label: "O par", preco: 230 }], img: IMG("peperomia-raindrop") },
  { id: "ficus-lyrata", nome: "Fícus Lyrata", peso: 3, especie: "Ficus lyrata", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folha grande em forma de lira, nervura marcada. Escolhe um lugar e não gosta de ser mudada dele.", preco: 250, img: IMG("ficus-lyrata") },
  { id: "ficus-tineke", nome: "Fícus Tineke", peso: 3, especie: "Ficus elastica 'Tineke'", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folha grossa mesclada em creme e verde, nervura central rosada. Cada folha abre com um desenho diferente da anterior.", preco: 250, img: IMG("ficus-tineke") },
  { id: "ficus-ruby", nome: "Fícus Ruby", peso: 3, especie: "Ficus elastica 'Ruby'", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Variegação em rosa vivo sobre verde escuro, mais intensa nas folhas novas. Quanto mais luz recebe, mais forte fica o rosa.", preco: 250, img: IMG("ficus-ruby") },
  { id: "philodendron-birkin", nome: "Philodendron Birkin", especie: "Philodendron 'Birkin'", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Riscos brancos finos, nenhuma folha igual à outra. Compacta e discreta.", preco: 180, img: IMG("philodendron-birkin") },
  { id: "monstera-adansonii", nome: "Monstera Adansonii", especie: "Monstera adansonii", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folha vazada de furos irregulares. Trepa ou pende, conforme você deixar.", preco: 155, img: IMG("monstera-adansonii") },
  { id: "aglaonema-vermelha", nome: "Aglaonema Vermelha", especie: "Aglaonema commutatum", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Nervura e pecíolo em vermelho vivo sobre folha verde. Cor sem depender de flor.", preco: 210, img: IMG("aglaonema-vermelha") },
  { id: "aglaonema-rosa", nome: "Aglaonema Rosa", especie: "Aglaonema sp.", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folha salpicada de rosa e creme, como se tivesse sido pintada. Nenhuma repete o desenho da outra.", preco: 210, img: IMG("aglaonema-rosa") },
  { id: "aglaonema-branca", nome: "Aglaonema Branca", especie: "Aglaonema sp. · branca", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folha larga de centro branco cremoso e borda verde. A mais clara da família — clareia canto de pouca luz sem pedir sol.", preco: 210, img: IMG("aglaonema-branca") },
  { id: "aglaonema-tricolor", nome: "Aglaonema Tricolor", especie: "Aglaonema sp. · tamanho único", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Verde escuro nas bordas e um miolo que mistura rosa e vermelho, cada folha com o desenho um pouco diferente. Cor viva o ano todo, sem depender de flor, em luz indireta.", preco: 210, img: IMG("aglaonema-tricolor") },
  { id: "singonio", nome: "Singônio", especie: "Syngonium podophyllum", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folha em ponta de flecha que muda de forma conforme a planta amadurece.", preco: 180, img: IMG("singonio") },
  { id: "pau-dagua-60", nome: "Pau d'Água · 60 cm", peso: 3, especie: "Dracaena fragrans", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "A mesma folha listrada da grande, em escala de mesa e estante. Aceita canto pouco iluminado e esquecimento de rega.", preco: 210, img: IMG("pau-dagua-60") },
  { id: "aspargo-melindre", nome: "Aspargo Melindre", especie: "Asparagus setaceus", categoria: "dentro", ambiente: "ambos", pet: "toxic",
    descricao: "Ramos horizontais em camadas finíssimas, quase gráficos. Parece desenho a nanquim.", preco: 180, img: IMG("aspargo-melindre") },
  { id: "aspargo-alfinete", nome: "Aspargo Alfinete", especie: "Asparagus densiflorus 'Sprengeri'", categoria: "dentro", ambiente: "ambos", pet: "toxic",
    descricao: "Hastes arqueadas cobertas de folículos finos como agulhas, verde vivo. Mais volumoso e rústico que o melindre.", variantes: [{ label: "Peça única", preco: 70 }, { label: "O par", preco: 135 }], img: IMG("aspargo-alfinete") },
  { id: "maranta-burle-marx", nome: "Maranta Burle Marx", especie: "Ctenanthe burle-marxii · aprox. 25 cm", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "Folha listrada em espinha de peixe, verde-claro sobre verde escuro, com o verso vinho. Fecha as folhas à noite e reabre pela manhã.", preco: 110, img: IMG("maranta-burle-marx") },

  /* ---------- 02 · DENTRO OU FORA ---------- */
  { id: "costela-adao", nome: "Costela de Adão", peso: 3, especie: "Monstera deliciosa", categoria: "ambos", ambiente: "ambos", pet: "toxic",
    descricao: "Folha recortada que ganha novos vãos a cada broto. Cresce rápido e pede espaço.", preco: 265, img: IMG("costela-adao") },
  { id: "croton", nome: "Croton", especie: "Codiaeum variegatum", categoria: "ambos", ambiente: "ambos", pet: "toxic",
    descricao: "Folha coriácea listrada de verde, amarelo e vermelho, que ganha cor quanto mais luz recebe. Nenhuma folha repete a mistura da outra.", preco: 165, img: IMG("croton") },
  { id: "pachira-aquatica", nome: "Pachira Aquática", peso: 3, especie: "Pachira aquatica · árvore do dinheiro", categoria: "ambos", ambiente: "ambos", pet: "safe",
    descricao: "Tronco trançado à mão e folhas em leque no topo. Conhecida como árvore do dinheiro — dizem que atrai prosperidade, e é por isso que sai tanto como presente.", preco: 150, img: IMG("pachira-aquatica") },
  { id: "palmeira-fenix", nome: "Palmeira Fênix", peso: 3, especie: "Phoenix roebelenii", categoria: "ambos", ambiente: "ambos", pet: "safe",
    descricao: "Fronde fina e arqueada, folíolos estreitos em duas fileiras. Cresce devagar e mantém o porte pequeno por anos: a palmeira que cabe dentro de casa.", preco: 180, img: IMG("palmeira-fenix") },
  { id: "pacova", nome: "Pacová", peso: 3, especie: "Philodendron martianum", categoria: "ambos", ambiente: "ambos", pet: "toxic",
    descricao: "Folha inteira e grossa sobre pecíolo inflado. Forma limpa, quase escultórica.", preco: 180, img: IMG("pacova") },
  { id: "pata-de-elefante", nome: "Pata de Elefante", peso: 3, especie: "Beaucarnea recurvata", categoria: "ambos", ambiente: "ambos", pet: "safe",
    descricao: "Base inchada que guarda água, folhas finas em cascata. Esquece a rega e ela não sente.", preco: 330, img: IMG("pata-de-elefante") },

  /* ---------- 03 · AO AR LIVRE ---------- */
  { id: "aveloz-palito-fogo", nome: "Aveloz Palito de Fogo", especie: "Euphorbia tirucalli 'Rosea'", categoria: "arlivre", ambiente: "externo", pet: "toxic",
    descricao: "Hastes cilíndricas sem folha, que passam de verde a laranja e coral conforme pegam sol. Escultura viva, e das que menos pedem água.", preco: 230, img: IMG("aveloz-palito-fogo") },

  /* ---------- 04 · BONSAIS ---------- */
  { id: "bonsai-oliveira-16", nome: "Bonsai Oliveira · 16 anos", especie: "Olea europaea · aprox. 40 cm", categoria: "bonsai", ambiente: "externo", pet: "safe",
    descricao: "Dezesseis anos de condução em um tronco que já carrega casca rugosa e curva definida. Folha prateada que troca de tom conforme a luz atravessa o dia.", preco: 2000, img: IMG("bonsai-oliveira-16") },
  { id: "bonsai-jabuticabeira-12", nome: "Bonsai Jabuticabeira · 12 anos", especie: "Plinia cauliflora · aprox. 50 cm · frutificando", categoria: "bonsai", ambiente: "externo", pet: "safe",
    descricao: "Doze anos de formação, e já frutifica. A jabuticaba nasce colada ao tronco, como na árvore inteira — só que em meio metro de altura.", preco: 2000, img: IMG("bonsai-jabuticabeira-12") },
  { id: "bonsai-jabuticabeira-4", nome: "Bonsai Jabuticabeira · 4 anos", especie: "Plinia cauliflora · aprox. 40 cm", categoria: "bonsai", ambiente: "externo", pet: "safe",
    descricao: "Casca lisa e clara, folhagem miúda, estrutura ainda em desenho. A peça de quem quer acompanhar a árvore desde cedo.", preco: 700, img: IMG("bonsai-jabuticabeira-4") },
  { id: "bonsai-amora-17", nome: "Bonsai Amora · 16 anos", especie: "Morus nigra · aprox. 50 cm", categoria: "bonsai", ambiente: "externo", pet: "safe",
    descricao: "Dezesseis anos em meio metro. Tronco engrossado, casca fissurada, e fruta escura na estação — árvore que dá colheita numa mesa de sala.", preco: 1400, img: IMG("bonsai-amora-17") },
  { id: "bonsai-amora-7", nome: "Bonsai Amora · 7 anos", especie: "Morus nigra · aprox. 50 cm", categoria: "bonsai", ambiente: "externo", pet: "safe",
    descricao: "Mesma altura da irmã mais velha, dez anos a menos de tronco. Cresce rápido e responde bem à poda — boa para quem quer aprender a conduzir.", preco: 700, img: IMG("bonsai-amora-7") },
  { id: "bonsai-pinheiro-negro-14", nome: "Bonsai Pinheiro Negro · 14 anos", especie: "Pinus thunbergii · 40 a 60 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "A espécie mais reverenciada da tradição japonesa. Agulha rígida, casca em placas, silhueta construída agulha por agulha ao longo de catorze anos.", preco: 2500, img: IMG("bonsai-pinheiro-negro-14") },
  { id: "bonsai-shimpaku-16", nome: "Bonsai Shimpaku · 16 anos", especie: "Juniperus chinensis 'Shimpaku' · 30 a 40 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "Junípero de folha escamosa e macia, madeira que aceita torção. O clássico dos jardins japoneses, em escala de mesa.", preco: 1500, img: IMG("bonsai-shimpaku-16") },
  { id: "bonsai-shimpaku-5", nome: "Bonsai Shimpaku · 5 anos", especie: "Juniperus chinensis 'Shimpaku' · aprox. 30 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "Cinco anos de condução num tronco já curvado, de casca fina e folhagem escamosa verde-clara. O junípero clássico dos jardins japoneses, no ponto em que ainda se deixa moldar — para acompanhar a árvore ganhar forma.", preco: 600, img: IMG("bonsai-shimpaku-5") },
  { id: "bonsai-ficus-6", nome: "Bonsai Fícus · 6 anos", especie: "Ficus microcarpa · aprox. 30 cm", categoria: "bonsai", ambiente: "interno", pet: "toxic",
    descricao: "Seis anos num fícus de raízes engrossadas que emergem da esfera como um pequeno tronco de várias pernas. Folha pequena, lustrosa e verde-escura, copa densa. O bonsai de interior mais generoso — aceita luz indireta e perdoa esquecimento.", preco: 550, img: IMG("bonsai-ficus-6") },
  { id: "bonsai-ligustro-15", nome: "Bonsai Ligustro · 15 anos", especie: "Ligustrum sinense · aprox. 50 cm", categoria: "bonsai", ambiente: "ambos", pet: "toxic",
    descricao: "Folhagem miúda e densa, tronco que engrossa rápido. Perdoa erro de rega — o bonsai mais generoso para quem está começando.", preco: 900, img: IMG("bonsai-ligustro-15") },
  { id: "bonsai-caliandra-9", nome: "Bonsai Caliandra Rosa · 9 anos", especie: "Calliandra brevipes · aprox. 50 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "Tronco engrossado, casca rugosa e ramificação já aberta. Flor em pompom rosado quase o ano inteiro.", preco: 800, img: IMG("bonsai-caliandra-9") },
  { id: "bonsai-caliandra-4", nome: "Bonsai Caliandra Rosa · 4 anos", especie: "Calliandra brevipes · 40 a 50 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "Flor em pompom rosado sobre folhagem fina que se fecha ao anoitecer. Nativa, floresce quase o ano inteiro.", preco: 600, img: IMG("bonsai-caliandra-4") },
  { id: "bonsai-sakura", nome: "Bonsai Sakura", especie: "Prunus serrulata · aprox. 20 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "A cerejeira japonesa em vinte centímetros. Floresce antes de folhar, e a flor dura poucos dias — é a imagem exata de nagori.", preco: 900, img: IMG("bonsai-sakura") },
  { id: "bonsai-cerejeira-rg-6", nome: "Bonsai Cerejeira-do-Rio-Grande · 7 anos", especie: "Eugenia involucrata · 30 a 40 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "Nativa da mata atlântica, prima da jabuticabeira. Folha miúda e lustrosa. Dá flores brancas de estames finos e frutos vermelho-escuros comestíveis, de sabor doce — colheita numa árvore de mesa.", preco: 800, img: IMG("bonsai-cerejeira-rg-6") },
  { id: "bonsai-cambui-8", nome: "Bonsai Cambuí · 8 anos", especie: "Myrciaria tenella · aprox. 20 cm", categoria: "bonsai", ambiente: "externo", pet: "safe",
    descricao: "Nativa da mata atlântica, de folha minúscula e casca clara que descama sozinha. Dá frutinha vermelha comestível.", preco: 800, img: IMG("bonsai-cambui-8") },
  { id: "bonsai-serissa-8", nome: "Bonsai Serissa · 8 a 9 anos", especie: "Serissa japonica · 20 a 30 cm", categoria: "bonsai", ambiente: "ambos", pet: "toxic",
    descricao: "Conhecida como árvore das mil estrelas — cobre-se de flores brancas miúdas em ondas sucessivas. Tronco claro e retorcido.", preco: 800, img: IMG("bonsai-serissa-8") },
  { id: "bonsai-buxus-9", nome: "Bonsai Buxus · 9 anos", especie: "Buxus harlandii · aprox. 20 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "Folha pequena e coriácea, casca cortiçosa e clara. Aceita poda severa e mantém a forma por muito tempo.", preco: 800, img: IMG("bonsai-buxus-9") },
  { id: "bonsai-azaleia-4", nome: "Bonsai Azaleia · 4 anos", especie: "Rhododendron simsii · aprox. 80 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "Tronco fino e alto, conduzido em espiral ao longo de quatro anos. Na primavera a copa desaparece sob a floração — é isso que a peça vem entregar.", preco: 450, img: IMG("bonsai-azaleia-4") },
  { id: "bonsai-pinheirinho-tuia-3", nome: "Bonsai Pinheirinho Tuia · 3 anos", especie: "Thuja sp. · aprox. 25 cm · musgo vivo", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "Conífera de folhagem macia verde-azulada, montada sobre esfera de musgo vivo. Três anos de formação num tronco esguio que já ramifica — o pinheirinho em miniatura, no ponto de começar a ganhar copa.", preco: 400, img: IMG("bonsai-pinheirinho-tuia-3") },

  /* ---------- 05 · BONSAIS (antes raridades) ---------- */
  { id: "bonsai-jasmim-anao-6", nome: "Bonsai Jasmim Anão · 6 anos", especie: "Jasminum sp. · anão · aprox. 30 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "Seis anos de condução num tronco que já engrossou, criou casca e recebeu líquen. Floresce branco ao entardecer e perfuma um ambiente inteiro. Espécie difícil de encontrar já formada.", preco: 800, img: IMG("bonsai-jasmim-anao-6") },
  { id: "bonsai-piteco-2", nome: "Bonsai Piteco · 2 anos", especie: "Pithecellobium tortum · aprox. 30 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "Folha composta de folíolos minúsculos que se fecham ao anoitecer. Tronco de casca clara e madeira dura. Espécie difícil de encontrar já formada.", preco: 700, img: IMG("bonsai-piteco-2") },

  /* ---------- 06 · GRANDE PORTE (maxi kokedamas · em estoque) ---------- */
  { id: "oliveira-grande", nome: "Oliveira", especie: "Olea europaea · 1,60 m a 1,80 m", categoria: "grande", ambiente: "externo", pet: "safe",
    descricao: "Oliveira adulta sustentada por uma única esfera de musgo. Tronco e folha prateada em escala de árvore — peça de chão, para hall e canto de sala.", preco: 2000, img: IMG("oliveira-grande") },
  { id: "jabuticabeira-grande", nome: "Jabuticabeira", especie: "Plinia cauliflora · 1,20 m a 1,60 m · frutificando", categoria: "grande", ambiente: "externo", pet: "safe",
    descricao: "Árvore em idade de produzir, suspensa ou apoiada. Muda o eixo de um hall inteiro — e dá fruta.", preco: 1500, img: IMG("jabuticabeira-grande") },
  { id: "pau-dagua-grande", nome: "Pau d'Água", especie: "Dracaena fragrans · 1,20 m a 1,50 m", categoria: "grande", ambiente: "interno", pet: "toxic",
    descricao: "Colunas de folha listrada, verticais e limpas, em escala de árvore. Resolve o vazio de um canto de sala sem pedir nada em troca.", preco: 900, img: IMG("pau-dagua-grande") },
  { id: "arvore-felicidade", nome: "Árvore da Felicidade", especie: "Polyscias sp. · fêmea e macho · 80 cm a 1 m", categoria: "grande", ambiente: "interno", pet: "toxic",
    descricao: "Sai em dois desenhos de folha: a fêmea, de folíolo largo e arredondado, e o macho, de folha recortada e fina. Tronco lenhoso e porte ereto — peça de canto e de entrada.", preco: 1200, img: IMG("arvore-felicidade") },

  /* ---------- 07 · SUPORTES (vendidos à parte, como as peças) ---------- */
  { id: "suporte-madeira-lisa", nome: "Madeira lisa", especie: "Suporte · madeira · 15 × 15 cm", categoria: "suporte", suporte: true,
    descricao: "Bloco de madeira com encaixe côncavo. A esfera assenta direto, sem haste — o apoio mais discreto de todos.", preco: 50, img: "assets/bases/madeira-lisa.jpg" },
  { id: "suporte-madeira-aro", nome: "Madeira com aro", especie: "Suporte · madeira e ferro · base 15×15 cm · aro 9 cm · altura 10 cm", categoria: "suporte", suporte: true,
    descricao: "Aro de ferro preto sobre haste, em base de madeira. Levanta a esfera do móvel e deixa o musgo respirar por baixo.", preco: 60, img: "assets/bases/madeira-aro.jpg" },
  { id: "suporte-madeira-aro-duplo", nome: "Madeira com aro duplo", especie: "Suporte · madeira e ferro · dois aros em alturas diferentes", categoria: "suporte", suporte: true,
    descricao: "Duas hastes na mesma base, em alturas distintas. Para montar duas peças pequenas juntas, em composição.", preco: 85, img: "assets/bases/madeira-aro-duplo.jpg" },
  { id: "suporte-madeira-gancho", nome: "Madeira com gancho", especie: "Suporte · madeira e ferro · base 15×15 cm", categoria: "suporte", suporte: true,
    descricao: "Haste alta curvada em gancho. A esfera fica suspensa e a folhagem cai livre — a escolha das pendentes.", preco: 65, img: "assets/bases/madeira-gancho.jpg" },
  { id: "suporte-tripe-30", nome: "Tripé de ferro · 30 cm", especie: "Suporte de chão · ferro preto · aro 18 cm · altura 30 cm", categoria: "suporte", suporte: true,
    descricao: "Fica no chão, não sobre móvel. Levanta a árvore do piso — feito para as peças de grande porte e as maxi kokedamas.", preco: 75, img: "assets/bases/tripe-ferro.jpg" },
  { id: "suporte-tripe-45", nome: "Tripé de ferro · 45 cm", especie: "Suporte de chão · ferro preto · aro 18 cm · altura 45 cm", categoria: "suporte", suporte: true,
    descricao: "A altura intermediária do tripé de chão. Ergue a esfera bem acima do piso, com presença de escultura.", preco: 85, img: "assets/bases/tripe-ferro.jpg" },
  { id: "suporte-tripe-60", nome: "Tripé de ferro · 60 cm", especie: "Suporte de chão · ferro preto · aro 18 cm · altura 60 cm", categoria: "suporte", suporte: true,
    descricao: "O tripé mais alto, para as maxi kokedamas e peças de grande porte ganharem destaque de canto de sala.", preco: 150, img: "assets/bases/tripe-ferro.jpg" },
  { id: "suporte-ferro-aro-base", nome: "Ferro · aro sobre base quadrada", especie: "Suporte · ferro preto", categoria: "suporte", suporte: true,
    descricao: "Aro de ferro preto suspenso sobre base quadrada. A esfera flutua acima do apoio, com ar de escultura.", preco: 39, img: "assets/bases/ferro-aro-base.jpg" },
  { id: "suporte-ferro-esfera", nome: "Ferro · esfera de arame", especie: "Suporte · ferro preto", categoria: "suporte", suporte: true,
    descricao: "Esfera de arame de ferro preto. A kokedama se aninha entre as linhas curvas, num desenho escultórico.", preco: 39, img: "assets/bases/ferro-esfera.jpg" },
  { id: "suporte-ferro-cone", nome: "Ferro · cone", especie: "Suporte · ferro preto", categoria: "suporte", suporte: true,
    descricao: "Estrutura cônica de ferro preto, mais larga na base. Apoio estável e geométrico, ergue a esfera do móvel.", preco: 39, img: "assets/bases/ferro-cone.jpg" },
  { id: "suporte-ferro-tripe-v", nome: "Ferro · tripé pés em V", especie: "Suporte · ferro preto", categoria: "suporte", suporte: true,
    descricao: "Tripé de ferro preto com pés finos em V e aro no topo. Leve e moderno, levanta a esfera do móvel.", preco: 39, img: "assets/bases/ferro-tripe-v.jpg" },
  { id: "suporte-ferro-cruzado", nome: "Ferro · aros cruzados", especie: "Suporte · ferro preto", categoria: "suporte", suporte: true,
    descricao: "Dois aros de ferro preto unidos por hastes que se cruzam na cintura. A esfera assenta no aro de cima, num jogo de linhas que lembra escultura.", preco: 39, img: "assets/bases/ferro-cruzado.jpg" },
  { id: "suporte-ferro-dois-aros", nome: "Ferro · dois aros", especie: "Suporte · ferro preto", categoria: "suporte", suporte: true,
    descricao: "Dois aros de ferro preto ligados por uma haste reta, em dois níveis. Apoio simples e firme, ergue a esfera do móvel.", preco: 39, img: "assets/bases/ferro-dois-aros.jpg" },
  { id: "suporte-ferro-espiral", nome: "Ferro · espiral", especie: "Suporte · ferro preto", categoria: "suporte", suporte: true,
    descricao: "Uma única linha de ferro preto que sobe em espiral, do aro da base ao aro do topo. Movimento e leveza — a mais gráfica da linha.", preco: 39, img: "assets/bases/ferro-espiral.jpg" },
  { id: "suporte-cumbuquinha", nome: "Cumbuquinha", especie: "Suporte · bambu", categoria: "suporte", suporte: true,
    descricao: "Cumbuca de bambu torneado, com os veios naturais à mostra. A esfera assenta dentro dela — o apoio mais quentinho e orgânico da linha, perfeito para as kokedamas menores.", preco: 49, img: "assets/bases/cumbuquinha.jpg" },
  { id: "suporte-tronco-natural", nome: "Tronco natural", especie: "Suporte especial · tronco 13 cm · altura 8,5 cm · aro 11 cm", categoria: "suporte", suporte: true,
    descricao: "Tronco com casca, cada um diferente do outro. Combina com bonsai de casca rugosa, e o peso sustenta maxi kokedama.", preco: 150, img: "assets/bases/tronco-natural.jpg" },
  { id: "suporte-tronco-alto", nome: "Tronco alto", especie: "Suporte especial · madeira clara · medidas variáveis", categoria: "suporte", suporte: true,
    descricao: "Cilindro de madeira clara com haste fina. Eleva a esfera bem acima da superfície — a base mais vertical da linha.", preco: 120, img: "assets/bases/tronco-alto.jpg" },
  { id: "suporte-cubo-ferro-baixo", nome: "Cubo de ferro · baixo", especie: "Suporte especial · ferro preto · aro interno", categoria: "suporte", suporte: true,
    descricao: "Estrutura vazada com aro suspenso no centro. A esfera flutua dentro do quadro, na altura do olhar sentado.", preco: 75, img: "assets/bases/cubo-ferro-baixo.jpg" },
  { id: "suporte-cubo-ferro-alto", nome: "Cubo de ferro · alto", especie: "Suporte especial · ferro preto · aro interno", categoria: "suporte", suporte: true,
    descricao: "Mesmo desenho, mais alto e mais estreito. Para peça de folhagem longa, que precisa de espaço para cair.", preco: 190, img: "assets/bases/cubo-ferro-alto.jpg" },
];

/* Bases — escolhidas no carrinho.
   preco 0 = inclusa (vem com o pedido, sem custo).
   preco > 0 = base especial, feita sob encomenda, com custo à parte.   */
const BASES = [
  { id: "madeira-lisa", nome: "Madeira lisa", preco: 0, specs: "15 × 15 cm",
    desc: "Bloco de madeira com encaixe côncavo. A esfera assenta direto, sem haste — o apoio mais discreto de todos." },
  { id: "madeira-aro", nome: "Madeira com aro", preco: 0, specs: "base 15×15 cm · aro 9 cm · altura 10 cm",
    desc: "Aro de ferro preto sobre haste, em base de madeira. Levanta a esfera do móvel e deixa o musgo respirar por baixo." },
  { id: "madeira-aro-duplo", nome: "Madeira com aro duplo", preco: 0, specs: "base 15×15 cm · dois aros em alturas diferentes",
    desc: "Duas hastes na mesma base, em alturas distintas. Para montar duas peças pequenas juntas, em composição." },
  { id: "madeira-gancho", nome: "Madeira com gancho", preco: 0, specs: "base 15×15 cm",
    desc: "Haste alta curvada em gancho. A esfera fica suspensa e a folhagem cai livre — a escolha das pendentes." },
  { id: "tripe-ferro-p", nome: "Tripé de ferro · Pequeno (30 cm)", preco: 0, imgId: "tripe-ferro", grupo: "tripe", specs: "de chão · aro 18 cm · alturas 30, 45 e 60 cm",
    desc: "Fica no chão, não sobre móvel. Para as peças de grande porte e as maxi kokedamas — levanta a árvore do piso. Disponível em três alturas." },
  { id: "tripe-ferro-m", nome: "Tripé de ferro · Médio (45 cm)", preco: 0, imgId: "tripe-ferro", grupo: "tripe", specs: "de chão · aro 18 cm · altura 45 cm",
    desc: "Fica no chão, não sobre móvel. Para as peças de grande porte e as maxi kokedamas — levanta a árvore do piso." },
  { id: "tripe-ferro-g", nome: "Tripé de ferro · Grande (60 cm)", preco: 0, imgId: "tripe-ferro", grupo: "tripe", specs: "de chão · aro 18 cm · altura 60 cm",
    desc: "Fica no chão, não sobre móvel. Para as peças de grande porte e as maxi kokedamas — levanta a árvore do piso." },
  { id: "ferro-aro-base", nome: "Ferro · aro sobre base quadrada", preco: 0, specs: "ferro preto",
    desc: "Aro de ferro preto suspenso sobre base quadrada. A esfera flutua acima do apoio, com ar de escultura." },
  { id: "ferro-esfera", nome: "Ferro · esfera de arame", preco: 0, specs: "ferro preto",
    desc: "Esfera de arame de ferro preto. A kokedama se aninha entre as linhas curvas, num desenho escultórico." },
  { id: "ferro-cone", nome: "Ferro · cone", preco: 0, specs: "ferro preto",
    desc: "Estrutura cônica de ferro preto, mais larga na base. Apoio estável e geométrico, ergue a esfera do móvel." },
  { id: "ferro-tripe-v", nome: "Ferro · tripé pés em V", preco: 0, specs: "ferro preto",
    desc: "Tripé de ferro preto com pés finos em V e aro no topo. Leve e moderno, levanta a esfera do móvel." },
  { id: "tronco-natural", nome: "Tronco natural", preco: 120, encomenda: true, specs: "tronco 13 cm · altura 8,5 cm · aro 11 cm",
    desc: "Tronco com casca, cada um diferente do outro. Combina com bonsai de casca rugosa, e o peso sustenta maxi kokedama.", addId: "suporte-tronco-natural" },
  { id: "tronco-alto", nome: "Tronco alto", preco: 100, encomenda: true, specs: "madeira clara · medidas variáveis",
    desc: "Cilindro de madeira clara com haste fina. Eleva a esfera bem acima da superfície — a base mais vertical da linha.", addId: "suporte-tronco-alto" },
  { id: "cubo-ferro-baixo", nome: "Cubo de ferro (baixo)", preco: 90, encomenda: true, specs: "ferro preto · aro interno",
    desc: "Estrutura vazada com aro suspenso no centro. A esfera flutua dentro do quadro, na altura do olhar sentado.", addId: "suporte-cubo-ferro-baixo" },
  { id: "cubo-ferro-alto", nome: "Cubo de ferro (alto)", preco: 120, encomenda: true, specs: "ferro preto · aro interno",
    desc: "Mesmo desenho, mais alto e mais estreito. Para peça de folhagem longa, que precisa de espaço para cair.", addId: "suporte-cubo-ferro-alto" },
];
