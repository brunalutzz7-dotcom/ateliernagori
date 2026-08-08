/* =====================================================================
   ATELIER NAGORI — CATÁLOGO
   ---------------------------------------------------------------------
   55 peças · fonte: Catálogo Atelier Nagori (30/07/2026)
   Cada produto tem:
     nome, especie, categoria, ambiente, pet, descricao
     preco  → número único  OU  variantes: [{label, preco}]
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
  { id: "raridade",nome: "Raridades",      desc: "Edições especiais, fora da produção regular." },
  { id: "grande",  nome: "Grande porte",   desc: "Peças de chão para hall e pé-direito alto. Encomenda sob consulta." },
];

const PRODUCTS = [
  /* ---------- 01 · DENTRO DE CASA ---------- */
  { id: "arranjo-orquidea", nome: "Arranjo de Orquídea", especie: "Phalaenopsis com folhagens · composição única", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "Orquídea combinada com folhagens sobre a mesma esfera. A raiz da orquídea e o musgo se entendem naturalmente, e cada arranjo é montado de forma única.", preco: 360, imgs: [IMG("arranjo-orquidea"), IMG("arranjo-orquidea-2")] },
  { id: "anturio-vermelho", nome: "Antúrio Vermelho", especie: "Anthurium andraeanum", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Espata lacada, folha larga e escura. Floresce quase o ano inteiro em luz indireta.", variantes: [{ label: "Médio", preco: 170 }, { label: "Grande", preco: 285 }], img: IMG("anturio-vermelho") },
  { id: "anturio-rosa", nome: "Antúrio Rosa", especie: "Anthurium andraeanum · tamanho único", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Espata rosada e brilhante que dura semanas abertas, sobre folhagem verde-escura lustrosa. Floresce quase o ano todo em luz indireta.", preco: 185 },
  { id: "maranta-pavao", nome: "Maranta Pavão", especie: "Calathea makoyana", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "Desenho de pena em cada folha, translúcido contra a luz. Pede umidade — gosta de banheiro claro.", preco: 220 },
  { id: "alocasia-polly", nome: "Alocásia Polly", especie: "Alocasia × amazonica", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folha em ponta de flecha, verde quase preto com nervura branca em relevo. Desenho gráfico, quase artificial de tão marcado.", preco: 235, img: IMG("alocasia-polly") },
  { id: "begonia-maculata", nome: "Begônia Maculata", especie: "Begonia maculata", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folha em asa com pontos prateados sobre verde escuro e verso vinho. Uma das folhagens mais fotografadas que existem.", preco: 310, img: IMG("begonia-maculata") },
  { id: "maranta-white-fusion", nome: "Maranta White Fusion", especie: "Calathea 'White Fusion'", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "Manchas brancas irregulares que invadem o verde, cada folha com um desenho próprio. A mais delicada da família — pede umidade constante.", preco: 310, img: IMG("maranta-white-fusion") },
  { id: "asplenio", nome: "Asplênio", especie: "Asplenium nidus", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "Folhas inteiras em roseta, brilhantes. Cresce como um ninho aberto sobre a esfera.", preco: 365 },
  { id: "maranta-cascavel", nome: "Maranta Cascavel", especie: "Goeppertia insignis", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "Folha estreita e ondulada, salpicada de manchas escuras alternadas — o nome vem do desenho, que lembra pele de cobra. O par montado junto fica especialmente bonito.", variantes: [{ label: "Peça única", preco: 145 }, { label: "O par", preco: 250 }], img: IMG("maranta-cascavel") },
  { id: "maranta-triostar", nome: "Maranta Triostar", especie: "Stromanthe sanguinea 'Triostar'", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "Verde, creme e rosa na mesma folha, com verso inteiramente magenta. Levanta as folhas à noite e as baixa pela manhã.", preco: 235, img: IMG("maranta-triostar") },
  { id: "peperomia-raindrop", nome: "Peperomia Raindrop", especie: "Peperomia polybotrya", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "Folha em gota, grossa e envernizada, sobre haste alta e ereta. Mais vertical e mais rara que a peperomia comum.", variantes: [{ label: "Peça única", preco: 145 }, { label: "O par", preco: 250 }], img: IMG("peperomia-raindrop") },
  { id: "ficus-lyrata", nome: "Fícus Lyrata", especie: "Ficus lyrata", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folha grande em forma de lira, nervura marcada. Escolhe um lugar e não gosta de ser mudada dele.", preco: 230 },
  { id: "ficus-tineke", nome: "Fícus Tineke", especie: "Ficus elastica 'Tineke'", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folha grossa mesclada em creme e verde, nervura central rosada. Cada folha abre com um desenho diferente da anterior.", preco: 230 },
  { id: "ficus-ruby", nome: "Fícus Ruby", especie: "Ficus elastica 'Ruby'", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Variegação em rosa vivo sobre verde escuro, mais intensa nas folhas novas. Quanto mais luz recebe, mais forte fica o rosa.", preco: 230 },
  { id: "philodendron-birkin", nome: "Philodendron Birkin", especie: "Philodendron 'Birkin'", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Riscos brancos finos, nenhuma folha igual à outra. Compacta e discreta.", variantes: [{ label: "Pequeno", preco: 250 }, { label: "Médio", preco: 285 }] },
  { id: "monstera-adansonii", nome: "Monstera Adansonii", especie: "Monstera adansonii", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folha vazada de furos irregulares. Trepa ou pende, conforme você deixar.", variantes: [{ label: "Peça única", preco: 175 }, { label: "Médio", preco: 230 }, { label: "Grande", preco: 285 }] },
  { id: "aglaonema-vermelha", nome: "Aglaonema Vermelha", especie: "Aglaonema commutatum", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Nervura e pecíolo em vermelho vivo sobre folha verde. Cor sem depender de flor.", preco: 230 },
  { id: "aglaonema-rosa", nome: "Aglaonema Rosa", especie: "Aglaonema sp.", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folha salpicada de rosa e creme, como se tivesse sido pintada. Nenhuma repete o desenho da outra.", preco: 230 },
  { id: "aglaonema-branca", nome: "Aglaonema Branca", especie: "Aglaonema sp. · branca", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folha larga de centro branco cremoso e borda verde. A mais clara da família — clareia canto de pouca luz sem pedir sol.", preco: 230 },
  { id: "singonio", nome: "Singônio", especie: "Syngonium podophyllum", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folha em ponta de flecha que muda de forma conforme a planta amadurece.", preco: 220, img: IMG("singonio") },
  { id: "pau-dagua-60", nome: "Pau d'Água · 60 cm", especie: "Dracaena fragrans", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "A mesma folha listrada da grande, em escala de mesa e estante. Aceita canto pouco iluminado e esquecimento de rega.", preco: 230, img: IMG("pau-dagua-60") },
  { id: "aspargo-melindre", nome: "Aspargo Melindre", especie: "Asparagus setaceus", categoria: "dentro", ambiente: "ambos", pet: "toxic",
    descricao: "Ramos horizontais em camadas finíssimas, quase gráficos. Parece desenho a nanquim.", preco: 230, img: IMG("aspargo-melindre") },
  { id: "aspargo-alfinete", nome: "Aspargo Alfinete", especie: "Asparagus densiflorus 'Sprengeri'", categoria: "dentro", ambiente: "ambos", pet: "toxic",
    descricao: "Hastes arqueadas cobertas de folículos finos como agulhas, verde vivo. Mais volumoso e rústico que o melindre.", variantes: [{ label: "Peça única", preco: 90 }, { label: "O par", preco: 155 }], img: IMG("aspargo-alfinete") },
  { id: "maranta-burle-marx", nome: "Maranta Burle Marx", especie: "Ctenanthe burle-marxii · aprox. 25 cm", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "Folha listrada em espinha de peixe, verde-claro sobre verde escuro, com o verso vinho. Fecha as folhas à noite e reabre pela manhã.", preco: 130, img: IMG("maranta-burle-marx") },

  /* ---------- 02 · DENTRO OU FORA ---------- */
  { id: "costela-adao", nome: "Costela de Adão", especie: "Monstera deliciosa", categoria: "ambos", ambiente: "ambos", pet: "toxic",
    descricao: "Folha recortada que ganha novos vãos a cada broto. Cresce rápido e pede espaço.", variantes: [{ label: "Médio", preco: 285 }, { label: "Grande", preco: 365 }] },
  { id: "croton", nome: "Croton", especie: "Codiaeum variegatum", categoria: "ambos", ambiente: "ambos", pet: "toxic",
    descricao: "Folha coriácea listrada de verde, amarelo e vermelho, que ganha cor quanto mais luz recebe. Nenhuma folha repete a mistura da outra.", preco: 185 },
  { id: "pachira-aquatica", nome: "Pachira Aquática", especie: "Pachira aquatica · árvore do dinheiro", categoria: "ambos", ambiente: "ambos", pet: "safe",
    descricao: "Tronco trançado à mão e folhas em leque no topo. Conhecida como árvore do dinheiro — dizem que atrai prosperidade, e é por isso que sai tanto como presente.", preco: 230, img: IMG("pachira-aquatica") },
  { id: "palmeira-fenix", nome: "Palmeira Fênix", especie: "Phoenix roebelenii", categoria: "ambos", ambiente: "ambos", pet: "safe",
    descricao: "Fronde fina e arqueada, folíolos estreitos em duas fileiras. Cresce devagar e mantém o porte pequeno por anos: a palmeira que cabe dentro de casa.", preco: 200, img: IMG("palmeira-fenix") },
  { id: "pacova", nome: "Pacová", especie: "Philodendron martianum", categoria: "ambos", ambiente: "ambos", pet: "toxic",
    descricao: "Folha inteira e grossa sobre pecíolo inflado. Forma limpa, quase escultórica.", variantes: [{ label: "Médio", preco: 180 }, { label: "Grande", preco: 300 }] },
  { id: "pata-de-elefante", nome: "Pata de Elefante", especie: "Beaucarnea recurvata", categoria: "ambos", ambiente: "ambos", pet: "safe",
    descricao: "Base inchada que guarda água, folhas finas em cascata. Esquece a rega e ela não sente.", preco: 350, img: IMG("pata-de-elefante") },

  /* ---------- 03 · AO AR LIVRE ---------- */
  { id: "aveloz-palito-fogo", nome: "Aveloz Palito de Fogo", especie: "Euphorbia tirucalli 'Rosea'", categoria: "arlivre", ambiente: "externo", pet: "toxic",
    descricao: "Hastes cilíndricas sem folha, que passam de verde a laranja e coral conforme pegam sol. Escultura viva, e das que menos pedem água.", preco: 275, img: IMG("aveloz-palito-fogo") },

  /* ---------- 04 · BONSAIS ---------- */
  { id: "bonsai-oliveira-16", nome: "Bonsai Oliveira · 16 anos", especie: "Olea europaea · aprox. 40 cm", categoria: "bonsai", ambiente: "externo", pet: "safe",
    descricao: "Dezesseis anos de condução em um tronco que já carrega casca rugosa e curva definida. Folha prateada que troca de tom conforme a luz atravessa o dia.", preco: 2000, img: IMG("bonsai-oliveira-16") },
  { id: "bonsai-oliveira-12", nome: "Bonsai Oliveira · 12 anos", especie: "Olea europaea · aprox. 30 cm", categoria: "bonsai", ambiente: "externo", pet: "safe",
    descricao: "A mesma árvore, doze anos antes. Escala de mesa, estrutura já formada — e ainda com décadas de forma pela frente.", preco: 1300, img: IMG("bonsai-oliveira-12") },
  { id: "bonsai-jabuticabeira-12", nome: "Bonsai Jabuticabeira · 12 anos", especie: "Plinia cauliflora · aprox. 50 cm · frutificando", categoria: "bonsai", ambiente: "externo", pet: "safe",
    descricao: "Doze anos de formação, e já frutifica. A jabuticaba nasce colada ao tronco, como na árvore inteira — só que em meio metro de altura.", preco: 2000, img: IMG("bonsai-jabuticabeira-12") },
  { id: "bonsai-jabuticabeira-4", nome: "Bonsai Jabuticabeira · 4 anos", especie: "Plinia cauliflora · aprox. 40 cm", categoria: "bonsai", ambiente: "externo", pet: "safe",
    descricao: "Casca lisa e clara, folhagem miúda, estrutura ainda em desenho. A peça de quem quer acompanhar a árvore desde cedo.", preco: 700, img: IMG("bonsai-jabuticabeira-4") },
  { id: "bonsai-amora-17", nome: "Bonsai Amora · 17 anos", especie: "Morus nigra · aprox. 50 cm", categoria: "bonsai", ambiente: "externo", pet: "safe",
    descricao: "Dezessete anos em meio metro. Tronco engrossado, casca fissurada, e fruta escura na estação — árvore que dá colheita numa mesa de sala.", preco: 1400, img: IMG("bonsai-amora-17") },
  { id: "bonsai-amora-7", nome: "Bonsai Amora · 7 anos", especie: "Morus nigra · aprox. 50 cm", categoria: "bonsai", ambiente: "externo", pet: "safe",
    descricao: "Mesma altura da irmã mais velha, dez anos a menos de tronco. Cresce rápido e responde bem à poda — boa para quem quer aprender a conduzir.", preco: 700, img: IMG("bonsai-amora-7") },
  { id: "bonsai-pinheiro-negro-14", nome: "Bonsai Pinheiro Negro · 14 anos", especie: "Pinus thunbergii · 40 a 60 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "A espécie mais reverenciada da tradição japonesa. Agulha rígida, casca em placas, silhueta construída agulha por agulha ao longo de catorze anos.", preco: 2500, img: IMG("bonsai-pinheiro-negro-14") },
  { id: "bonsai-shimpaku-16", nome: "Bonsai Shimpaku · 16 anos", especie: "Juniperus chinensis 'Shimpaku' · 30 a 40 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "Junípero de folha escamosa e macia, madeira que aceita torção. O clássico dos jardins japoneses, em escala de mesa.", preco: 1500, img: IMG("bonsai-shimpaku-16") },
  { id: "bonsai-ligustro-15", nome: "Bonsai Ligustro · 15 anos", especie: "Ligustrum sinense · aprox. 50 cm", categoria: "bonsai", ambiente: "ambos", pet: "toxic",
    descricao: "Folhagem miúda e densa, tronco que engrossa rápido. Perdoa erro de rega — o bonsai mais generoso para quem está começando.", preco: 900, img: IMG("bonsai-ligustro-15") },
  { id: "bonsai-caliandra-9", nome: "Bonsai Caliandra Rosa · 9 anos", especie: "Calliandra brevipes · aprox. 50 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "Tronco engrossado, casca rugosa e ramificação já aberta. Flor em pompom rosado quase o ano inteiro.", preco: 800, img: IMG("bonsai-caliandra-9") },
  { id: "bonsai-caliandra-4", nome: "Bonsai Caliandra Rosa · 4 anos", especie: "Calliandra brevipes · 40 a 50 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "Flor em pompom rosado sobre folhagem fina que se fecha ao anoitecer. Nativa, floresce quase o ano inteiro.", preco: 600, img: IMG("bonsai-caliandra-4") },
  { id: "bonsai-sakura", nome: "Bonsai Sakura", especie: "Prunus serrulata · aprox. 20 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "A cerejeira japonesa em vinte centímetros. Floresce antes de folhar, e a flor dura poucos dias — é a imagem exata de nagori.", preco: 900 },
  { id: "bonsai-cerejeira-rg-6", nome: "Bonsai Cerejeira-do-Rio-Grande · 6 anos", especie: "Eugenia involucrata · 30 a 40 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "Nativa da mata atlântica, prima da jabuticabeira. Folha miúda e lustrosa, flor branca de estames finos, e fruta vermelho-escura de sabor doce.", preco: 800, img: IMG("bonsai-cerejeira-rg-6") },
  { id: "bonsai-cambui-8", nome: "Bonsai Cambuí · 8 anos", especie: "Myrciaria tenella · aprox. 20 cm", categoria: "bonsai", ambiente: "externo", pet: "safe",
    descricao: "Nativa da mata atlântica, de folha minúscula e casca clara que descama sozinha. Dá frutinha vermelha comestível.", preco: 800, img: IMG("bonsai-cambui-8") },
  { id: "bonsai-serissa-8", nome: "Bonsai Serissa · 8 a 9 anos", especie: "Serissa japonica · 20 a 30 cm", categoria: "bonsai", ambiente: "ambos", pet: "toxic",
    descricao: "Conhecida como árvore das mil estrelas — cobre-se de flores brancas miúdas em ondas sucessivas. Tronco claro e retorcido.", preco: 800, img: IMG("bonsai-serissa-8") },
  { id: "bonsai-buxus-9", nome: "Bonsai Buxus · 9 anos", especie: "Buxus harlandii · aprox. 20 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "Folha pequena e coriácea, casca cortiçosa e clara. Aceita poda severa e mantém a forma por muito tempo.", preco: 800, img: IMG("bonsai-buxus-9") },
  { id: "bonsai-azaleia-4", nome: "Bonsai Azaleia · 4 anos", especie: "Rhododendron simsii · aprox. 80 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "Tronco fino e alto, conduzido em espiral ao longo de quatro anos. Na primavera a copa desaparece sob a floração — é isso que a peça vem entregar.", preco: 800, img: IMG("bonsai-azaleia-4") },

  /* ---------- 05 · RARIDADE ---------- */
  { id: "bonsai-jasmim-anao-6", nome: "Bonsai Jasmim Anão · 6 anos", especie: "Jasminum sp. · anão · aprox. 30 cm", categoria: "raridade", raridade: true, ambiente: "externo", pet: "toxic",
    descricao: "Seis anos de condução num tronco que já engrossou, criou casca e recebeu líquen. Floresce branco ao entardecer e perfuma um ambiente inteiro. Espécie difícil de encontrar já formada.", preco: 800, img: IMG("bonsai-jasmim-anao-6") },
  { id: "bonsai-jasmim-anao-3", nome: "Bonsai Jasmim Anão · 3 anos", especie: "Jasminum sp. · anão", categoria: "raridade", raridade: true, ambiente: "externo", pet: "toxic",
    descricao: "Tronco esguio e copa aberta, no ponto em que a árvore ainda aceita ser conduzida. Floresce branco ao entardecer. Para quem prefere participar da formação.", preco: 600, img: IMG("bonsai-jasmim-anao-3") },
  { id: "bonsai-piteco-2", nome: "Bonsai Piteco · 2 anos", especie: "Pithecellobium tortum · aprox. 30 cm", categoria: "raridade", raridade: true, ambiente: "externo", pet: "toxic",
    descricao: "Folha composta de folíolos minúsculos que se fecham ao anoitecer. Tronco de casca clara e madeira dura. Espécie difícil de encontrar já formada.", preco: 700, img: IMG("bonsai-piteco-2") },

  /* ---------- 06 · GRANDE PORTE (encomenda) ---------- */
  { id: "oliveira-grande", nome: "Oliveira", especie: "Olea europaea · 1,60 m a 1,80 m", categoria: "grande", encomenda: true, ambiente: "externo", pet: "safe",
    descricao: "Oliveira adulta sustentada por uma única esfera de musgo. Tronco e folha prateada em escala de árvore — peça de chão, para hall e canto de sala.", preco: 1300, img: IMG("oliveira-grande") },
  { id: "jabuticabeira-grande", nome: "Jabuticabeira", especie: "Plinia cauliflora · 1,20 m a 1,60 m · frutificando", categoria: "grande", encomenda: true, ambiente: "externo", pet: "safe",
    descricao: "Árvore em idade de produzir, suspensa ou apoiada. Muda o eixo de um hall inteiro — e dá fruta.", preco: 1300, img: IMG("jabuticabeira-grande") },
  { id: "pau-dagua-grande", nome: "Pau d'Água", especie: "Dracaena fragrans · 1,20 m a 1,50 m", categoria: "grande", encomenda: true, ambiente: "interno", pet: "toxic",
    descricao: "Colunas de folha listrada, verticais e limpas, em escala de árvore. Resolve o vazio de um canto de sala sem pedir nada em troca.", preco: 780, img: IMG("pau-dagua-grande") },
  { id: "arvore-felicidade", nome: "Árvore da Felicidade", especie: "Polyscias sp. · fêmea e macho · 80 cm a 1 m", categoria: "grande", encomenda: true, ambiente: "interno", pet: "toxic",
    descricao: "Sai em dois desenhos de folha: a fêmea, de folíolo largo e arredondado, e o macho, de folha recortada e fina. Tronco lenhoso e porte ereto — peça de canto e de entrada.", preco: 780, img: IMG("arvore-felicidade") },
];

/* Bases inclusas (escolhidas no fechamento do pedido, sem custo) ------- */
const BASES = [
  "Madeira lisa",
  "Madeira com aro",
  "Madeira com aro duplo",
  "Madeira com gancho",
  "Tronco natural",
  "Tronco alto",
  "Cubo de ferro (baixo)",
  "Cubo de ferro (alto)",
  "Tripé de ferro (de chão)",
];
