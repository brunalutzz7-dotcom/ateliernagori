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

/* Versão das fotos: incremente ao trocar qualquer imagem para o navegador buscar a nova (evita cache). */
const ASSET_V = "216";
const IMG = (id) => `assets/produtos/${id}.jpg?v=${ASSET_V}`;

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
  /* ---------- 00 · COLEÇÃO DE NATAL ---------- */
  { id: "tuia", nome: "Tuia Holandesa · Coleção de Natal", peso: 3, especie: "Cupressus macrocarpa 'Goldcrest' · edição de Natal", categoria: "ambos", ambiente: "ambos", pet: "safe", natal: true,
    descricao: "Nossa tuia holandesa montada em kokedama e decorada à mão para o Natal — enfeites, laço de veludo vinho e luzinhas. Folhagem densa, perfumada e de um verde-limão luminoso. Depois das festas continua linda o ano todo: é só retirar os enfeites.", significado: "A árvore de Natal que não se joga fora — símbolo de renovação, esperança e de um Natal que permanece vivo ano após ano.", preco: 450, img: IMG("tuia") },
  /* ---------- 01 · FOLHAGENS ---------- */
  { id: "arranjo-orquidea", nome: "Tamandama Orquídea", peso: 3, especie: "Phalaenopsis com folhagens · composição única", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "Uma orquídea de porte menor combinada com folhagens delicadas sobre a mesma esfera de musgo vivo. A raiz da orquídea e o musgo se entendem naturalmente, e cada arranjo é montado de forma única.", significado: "A orquídea simboliza beleza rara, elegância e um amor que floresce com paciência.", preco: 400, imgs: [IMG("arranjo-orquidea"), IMG("arranjo-orquidea-2"), IMG("arranjo-orquidea-3")] },
  { id: "maxi-tamandama", nome: "Maxi Tamandama Orquídea", peso: 4, especie: "Phalaenopsis de grande porte com folhagens · composição única", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "A versão grande do nosso Tamandama: uma orquídea de maior porte — cerca de 30 cm mais alta — combinada com folhagens generosas sobre a mesma esfera de musgo vivo. Uma peça imponente, que leva mais tempo e mais cuidado para montar. Cada arranjo é único.", significado: "A orquídea simboliza beleza rara, elegância e um amor que floresce com paciência.", preco: 490, imgs: [IMG("maxi-tamandama"), IMG("maxi-tamandama-2"), IMG("maxi-tamandama-3"), IMG("maxi-tamandama-4"), IMG("maxi-tamandama-5")] },
  { id: "tamandama-diversos", nome: "Tamandama Diversos", peso: 3, especie: "Composição de folhagens diversas · peça única", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Uma composição de folhagens variadas montadas juntas sobre a mesma esfera de musgo vivo — samambaias, heras, palmeirinhas e o que a estação trouxer. Cada peça é única, pensada na hora para equilibrar formas e texturas.", significado: "A reunião de muitas folhagens num só ninho verde — símbolo de abundância, variedade e harmonia no lar.", preco: 290, imgs: [IMG("tamandama-diversos"), IMG("tamandama-diversos-2"), IMG("tamandama-diversos-3"), IMG("tamandama-diversos-4"), IMG("tamandama-diversos-5"), IMG("tamandama-diversos-6")] },
  { id: "aglaonema-vermelha", nome: "Aglaonema Vermelha", especie: "Aglaonema sp.", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folhagem de vermelho intenso sobre o verde, cor viva o ano inteiro sem depender de flor. Fácil de cuidar, gosta de luz indireta.", significado: "Conhecida como planta da sorte: simboliza prosperidade e boas energias, atraindo fortuna para a casa.", preco: 240, img: IMG("aglaonema-vermelha") },
  { id: "aglaonema-branca-rosada", nome: "Aglaonema Rosa", especie: "Aglaonema sp.", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folhas em tons de rosa e verde, cor o ano todo sem depender de flor. Fácil de cuidar, gosta de luz indireta.", significado: "Conhecida como planta da sorte: simboliza prosperidade e boas energias, atraindo fortuna para a casa.", preco: 240, img: IMG("aglaonema-branca-rosada") },
  { id: "aglaonema-rosa", nome: "Aglaonema Lima", especie: "Aglaonema sp.", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folhagem verde-limão clara e luminosa, cor o ano todo sem depender de flor. Fácil de cuidar, gosta de luz indireta.", significado: "Conhecida como planta da sorte: simboliza prosperidade e boas energias, atraindo fortuna para a casa.", preco: 240, img: IMG("aglaonema-rosa") },
  { id: "aglaonema-branca", nome: "Aglaonema Branca", especie: "Aglaonema sp.", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folhas quase totalmente creme salpicadas de verde — delicada e luminosa. Cor o ano todo sem depender de flor, gosta de luz indireta.", significado: "Conhecida como planta da sorte: simboliza prosperidade e boas energias, atraindo fortuna para a casa.", preco: 240, img: IMG("aglaonema-branca") },
  { id: "aglaonema-creta", nome: "Aglaonema Creta", especie: "Aglaonema sp.", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folhas marmorizadas em verde, creme e rosado — colorida o ano todo sem depender de flor. Fácil de cuidar, gosta de luz indireta clara.", significado: "Conhecida como planta da sorte: simboliza prosperidade e boas energias, atraindo fortuna para a casa.", preco: 240, img: IMG("aglaonema-creta") },  { id: "maranta-triostar-grande", nome: "Maranta Triostar", especie: "Stromanthe sanguinea 'Triostar'", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "A Triostar em tamanho cheio: folhas longas pintadas de verde, creme e rosa, com o verso magenta vibrante. Uma folhagem de presença, das mais desejadas.", significado: "Planta da oração — ergue e baixa as folhas como em prece. Símbolo de gratidão e proteção do lar.", preco: 220, img: IMG("maranta-triostar-grande") },
  { id: "maranta-triostar", nome: "Mini Maranta Triostar", especie: "Stromanthe sanguinea 'Triostar'", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "Verde, creme e rosa na mesma folha, com verso inteiramente magenta. Levanta as folhas à noite e as baixa pela manhã.", significado: "Planta da oração — ergue e baixa as folhas como em prece. Símbolo de gratidão e proteção do lar.", preco: 155, img: IMG("maranta-triostar") },
  { id: "maranta-cascavel-grande", nome: "Maranta Cascavel", especie: "Goeppertia lancifolia", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "Folhas longas e onduladas com o desenho de manchas escuras que lembra pele de cobra, e o verso vinho. Tamanho cheio, cheia de folhas — uma das marantas mais marcantes.", significado: "Planta da oração: fecha as folhas à noite. Símbolo de gratidão, calma e proteção.", preco: 200, img: IMG("maranta-cascavel-grande") },
  { id: "maranta-cascavel", nome: "Mini Maranta Cascavel", especie: "Goeppertia insignis", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "Folha estreita e ondulada, salpicada de manchas escuras alternadas — o nome vem do desenho, que lembra pele de cobra.", significado: "Planta da oração: fecha as folhas à noite. Símbolo de gratidão, calma e proteção.", preco: 155, img: IMG("maranta-cascavel") },  { id: "singonio", nome: "Singônio Rosa", especie: "Syngonium podophyllum", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folha em ponta de flecha que muda de forma conforme a planta amadurece.", significado: "Símbolo de renovação e crescimento — dizem que atrai energia positiva para os novos começos.", preco: 220, img: IMG("singonio") },
  { id: "singonio-estrelado", nome: "Singônio Estrelado", especie: "Syngonium podophyllum", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folhas recortadas em ponta de estrela, que mudam de forma conforme a planta cresce. Compacto e cheio.", significado: "Símbolo de renovação e de novos ciclos — atrai energia positiva e leveza para a casa.", preco: 265, img: IMG("singonio-estrelado") },
  { id: "philodendron-birkin", nome: "Philodendron Birkin", especie: "Philodendron 'Birkin'", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Riscos brancos finos, nenhuma folha igual à outra. Compacta e discreta.", significado: "Seu nome vem do grego 'amor às árvores' — símbolo de amor que cresce, saúde e abundância.", preco: 350, img: IMG("philodendron-birkin") },
  { id: "philodendron-pink", nome: "Philodendron Pink Princess", especie: "Philodendron erubescens 'Pink Princess'", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folhas verde-escuras lustrosas marcadas por manchas rosa, cada broto com um desenho diferente — nenhuma folha igual à outra. Uma das folhagens mais desejadas pelos colecionadores.", significado: "Seu nome vem do grego 'amor às árvores' — símbolo de amor raro que cresce com o tempo, saúde e abundância.", preco: 250, img: IMG("philodendron-pink") },
  { id: "jiboia-suspensa", nome: "Jiboia Suspensa", especie: "Epipremnum aureum · pendente", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folhas em coração, variegadas de verde e creme, que caem livres da esfera. Perfeita para prateleira alta ou suporte de gancho.", significado: "Conhecida como planta do dinheiro no oriente — símbolo de prosperidade, e ainda purifica o ar." , preco: 340, img: IMG("jiboia-suspensa") },
  { id: "mini-jiboia", nome: "Mini Jiboia", especie: "Epipremnum aureum · mini", categoria: "dentro", ambiente: "ambos", pet: "toxic",
    descricao: "A jiboia em versão pequena, de folhas coração. Resistente e fácil de cuidar — cresce em cascata conforme se acostuma com o cantinho. Escolha a variedade abaixo (sujeito à disponibilidade do momento).", significado: "Conhecida como planta do dinheiro — símbolo de prosperidade e purificação, boa sorte fácil de cuidar.", preco: 135, variantes: [{ label: "Jade", preco: 135 }, { label: "Filodendro Brasil", preco: 135 }, { label: "Marmorizada", preco: 135 }, { label: "Prateada", preco: 135 }, { label: "Pérola", preco: 135 }], imgs: [IMG("mini-jiboia-3"), IMG("filodendro-brasil"), IMG("mini-jiboia-2"), IMG("mini-jiboia-4"), IMG("mini-jiboia-5")] },
  { id: "hera-estrelada", oculto: true, nome: "Hera Estrelada", especie: "Hedera helix", categoria: "ambos", ambiente: "ambos", pet: "toxic",
    descricao: "Folhas recortadas em estrela que descem em cascata. Linda em suporte alto ou pendente, deixando as pontas caírem.", significado: "A hera simboliza laços eternos, fidelidade e amizade que perdura — presente de quem fica junto.", preco: 205, img: IMG("hera-estrelada") },
  { id: "monstera-adansonii", nome: "Monstera Adansonii", especie: "Monstera adansonii", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folha vazada de furos irregulares. Trepa ou pende, conforme você deixar.", significado: "Símbolo de longevidade e respeito — no oriente representa vida longa e prosperidade duradoura.", preco: 185, img: IMG("monstera-adansonii") },
  { id: "costela-adao", nome: "Costela de Adão", peso: 3, especie: "Monstera deliciosa", categoria: "ambos", ambiente: "ambos", pet: "toxic",
    descricao: "Folha recortada que ganha novos vãos a cada broto. Cresce rápido e pede espaço.", significado: "Símbolo de longevidade e prosperidade — as folhas que se abrem representam crescimento e boas oportunidades.", preco: 390, imgs: [IMG("costela-adao"), IMG("costela-adao-2"), IMG("costela-adao-3")] },
  { id: "costela-adao-constellation", nome: "Costela de Adão Constellation", especie: "Monstera deliciosa 'Thai Constellation'", categoria: "ambos", ambiente: "ambos", pet: "toxic",
    descricao: "A variegada mais desejada: folhas grandes salpicadas de creme, cada uma um desenho único. Peça de colecionador.", significado: "Símbolo de longevidade e prosperidade — cada nova folha aberta representa crescimento e boas oportunidades.", preco: 490, imgs: [IMG("costela-adao-constellation"), IMG("costela-adao-constellation-2")] },
  { id: "mini-costela-adao", nome: "Mini Costela de Adão", especie: "Monstera deliciosa · mini", categoria: "ambos", ambiente: "ambos", pet: "toxic",
    descricao: "A costela de Adão em tamanho de mesa, com os recortes que todo mundo ama já começando a aparecer.", significado: "Símbolo de longevidade e prosperidade — cada nova folha aberta representa crescimento e boas oportunidades.", preco: 225, img: IMG("mini-costela-adao") },
  { id: "alocasia-polly", nome: "Alocásia Polly", peso: 3, especie: "Alocasia × amazonica", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folha em ponta de flecha, verde quase preto com nervura branca em relevo. Desenho gráfico, quase artificial de tão marcado.", significado: "Símbolo de boas-vindas e proteção do lar — suas folhas em flecha representam caminhos que se abrem.", preco: 245, img: IMG("alocasia-polly") },
  { id: "alocasia-golden-bone", nome: "Alocásia Golden Bone", especie: "Alocasia sp. 'Golden Bone'", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folhas verde-claras em ponta de flecha sobre caules dourados marcantes, que dão nome e personalidade à peça. Uma alocásia de presença, cheia de vigor.", significado: "As alocásias são símbolo de proteção e prosperidade — suas folhas em flecha representam caminhos que se abrem.", preco: 220, img: IMG("alocasia-golden-bone") },
  { id: "begonia", nome: "Begônia Maculata", especie: "Begonia maculata", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folhas em asa de anjo, verde-escuras salpicadas de prata por cima e vinho por baixo. Uma folhagem de desenho único, cheia de charme.", significado: "A begônia simboliza delicadeza e gratidão sincera — um gesto de carinho e apreço por quem se recebe.", preco: 250, imgs: [IMG("begonia"), IMG("begonia-2")] },
  { id: "zamioculca-mini", nome: "Zamioculca Mini", especie: "Zamioculcas zamiifolia · mini", categoria: "dentro", ambiente: "ambos", pet: "toxic",
    descricao: "Folhas lustrosas e firmes em versão compacta. Resistente e fácil de cuidar, tolera meia-luz e esquecimentos — a planta ideal para começar.", significado: "A zamioculca é a planta da prosperidade: representa crescimento constante e fortuna que chega aos poucos.", preco: 185, img: IMG("zamioculca-mini") },
  { id: "pata-de-elefante", nome: "Mini Pata de Elefante", peso: 3, especie: "Beaucarnea recurvata", categoria: "ambos", ambiente: "ambos", pet: "safe",
    descricao: "Base inchada que guarda água, folhas finas em cascata. Esquece a rega e ela não sente.", significado: "Guarda água no tronco — símbolo de resiliência, longevidade e prosperidade que se acumula com o tempo.", preco: 250, img: IMG("pata-de-elefante") },
  { id: "pacova", nome: "Pacová", peso: 3, especie: "Philodendron martianum", categoria: "ambos", ambiente: "ambos", pet: "toxic",
    descricao: "Folha inteira e grossa sobre pecíolo inflado. Forma limpa, quase escultórica.", significado: "Da família dos filodendros — símbolo de saúde, força e abundância, o verde que traz bem-estar ao ambiente.", preco: 365, imgs: [IMG("pacova"), IMG("pacova-2")] },
  { id: "pachira-aquatica", nome: "Pachira · Árvore do Dinheiro", peso: 3, especie: "Pachira aquatica · a árvore do dinheiro", categoria: "ambos", ambiente: "ambos", pet: "safe",
    descricao: "Tronco trançado à mão e folhas em leque no topo. É a famosa árvore do dinheiro — dizem que atrai prosperidade, e é por isso que sai tanto como presente.", significado: "A famosa árvore do dinheiro — símbolo de prosperidade, fortuna e boa sorte. O presente clássico para atrair abundância para a casa.", preco: 275, imgs: [IMG("pachira-aquatica-2"), IMG("pachira-aquatica")] },
  { id: "mini-arvore-felicidade", nome: "Árvore da Felicidade", especie: "Polyscias sp.", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Árvore da felicidade em tamanho médio. Tronco lenhoso e folhagem recortada — dizem que atrai boas energias, e é por isso que sai tanto como presente.", significado: "A árvore da felicidade — símbolo de boas energias, harmonia e alegria no lar.", preco: 340, img: IMG("mini-arvore-felicidade") },
  { id: "ficus-shivereana", nome: "Fícus Elástica Shivereana", peso: 3, especie: "Ficus elastica 'Shivereana'", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Borracha variegada de folhas grandes salpicadas de verde e creme, cada uma diferente. Lustrosa e cheia de presença, gosta de luz indireta.", significado: "O fícus simboliza abundância, unidade e novos começos — árvore sagrada que atrai prosperidade e paz.", preco: 400, img: IMG("ficus-shivereana") },
  { id: "ficus-lyrata", nome: "Fícus Lyrata", peso: 3, especie: "Ficus lyrata", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "A folha-de-lira: folhas grandes em forma de violino, com nervuras marcadas. Porte escultural que enche o ambiente. Gosta de luz clara indireta.", significado: "O fícus simboliza abundância, unidade e novos começos — árvore sagrada que atrai prosperidade e paz.", preco: 390, img: IMG("ficus-lyrata") },
  { id: "ficus-burgundy", nome: "Fícus Elástica Burgundy", peso: 3, especie: "Ficus elastica 'Burgundy'", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Borracha de folhas grandes verde-escuras com brilho vinho, quase pretas na luz. Elegante e fácil de cuidar.", significado: "O fícus simboliza abundância, unidade e novos começos — árvore sagrada que atrai prosperidade e paz.", preco: 400, img: IMG("ficus-burgundy") },
  { id: "ficus-tineke", nome: "Fícus Elástica Tineke", peso: 3, especie: "Ficus elastica 'Tineke'", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Borracha variegada de creme, verde e rosa nas folhas novas, cada uma única. Lustrosa e cheia de charme, gosta de luz indireta.", significado: "O fícus simboliza abundância, unidade e novos começos — árvore sagrada que atrai prosperidade e paz.", preco: 400, img: IMG("ficus-tineke") },
  { id: "ficus-ruby", nome: "Fícus Elástica Ruby", peso: 3, especie: "Ficus elastica 'Ruby'", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Borracha variegada de tons rosados e vinho sobre o verde, cada folha um desenho. Quanto mais luz filtrada, mais o rosa aparece.", significado: "O fícus simboliza abundância, unidade e novos começos — árvore sagrada que atrai prosperidade e paz.", preco: 400, img: IMG("ficus-ruby") },

  /* ---------- 01b · FOLHAGENS NOVAS (foto em breve) ---------- */
  { id: "anturio-rosa", nome: "Antúrio Rosa", especie: "Anthurium andraeanum · tamanho médio", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Espata rosada e brilhante que dura semanas abertas, sobre folhagem verde-escura lustrosa. Floresce quase o ano todo em luz indireta.", significado: "O antúrio simboliza hospitalidade, abundância e um amor caloroso — de coração aberto para quem chega.", preco: 250, imgs: [IMG("anturio-rosa"), IMG("anturio-rosa-2")] },
  { id: "anturio-coracao", nome: "Antúrio Coração", especie: "Anthurium clarinervium", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folhas grandes em forma de coração, aveludadas e verde-escuras, com nervuras brancas bem marcadas. Uma folhagem de colecionador — pede luz indireta e umidade.", significado: "Suas folhas em coração são símbolo de amor, hospitalidade e afeto cultivado com carinho.", preco: 270, img: IMG("anturio-coracao") },
  { id: "lirio-da-paz", nome: "Lírio da Paz", especie: "Spathiphyllum wallisii", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Folhagem verde-escura e lustrosa que abre espatas brancas elegantes ao longo do ano. Resistente, floresce mesmo em luz baixa e ainda purifica o ar.", significado: "Símbolo de paz, harmonia e recomeços — a flor branca que traz serenidade para a casa.", preco: 240, img: IMG("lirio-da-paz") },
  { id: "calathea", nome: "Calathea", especie: "Goeppertia sp.", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "Folhas largas com desenho de penas em tons de verde e verso vinho. Planta da oração: ergue e baixa as folhas conforme o dia. Gosta de luz indireta e umidade.", significado: "Planta da oração — símbolo de gratidão, calma e proteção do lar.", preco: 225, img: IMG("calathea") },
  { id: "pau-dagua", nome: "Pau d'água", especie: "Dracaena fragrans", categoria: "dentro", ambiente: "interno", pet: "toxic",
    descricao: "Tronco lenhoso coroado por um tufo de folhas largas e arqueadas, verde-vivas. Resistente e fácil, tolera luz baixa e ainda purifica o ar — o clássico das casas.", significado: "Conhecida como pau-d'água ou árvore da felicidade: símbolo de sorte, prosperidade e boas energias no lar.", preco: 230, img: IMG("pau-dagua") },
  { id: "aspargo-melindre", nome: "Aspargo Melindre", especie: "Asparagus setaceus", categoria: "dentro", ambiente: "ambos", pet: "toxic",
    descricao: "Ramos horizontais em camadas finíssimas, quase gráficos. Parece desenho a nanquim.", significado: "Símbolo de leveza e renovação — folhagem delicada que traz frescor e bons ares ao ambiente.", preco: 220, imgs: [IMG("aspargo-melindre"), IMG("aspargo-melindre-2")] },
  { id: "avenca", nome: "Avenca", especie: "Adiantum sp.", categoria: "dentro", ambiente: "interno", pet: "safe",
    descricao: "Frondes delicadas de folíolos miúdos, verde vivo. Adora umidade — ótima em banheiro claro ou pertinho de outras plantas.", significado: "A avenca simboliza delicadeza, sinceridade e a beleza discreta — presente de carinho verdadeiro.", preco: 220, img: IMG("avenca") },
  { id: "samambaia-estrela-azul", nome: "Samambaia Estrela Azul", especie: "Phlebodium aureum 'Blue Star'", categoria: "dentro", ambiente: "ambos", pet: "safe",
    descricao: "Frondes largas em tom verde-azulado, bem diferentes da samambaia comum. Adora umidade e luz filtrada.", significado: "A samambaia simboliza proteção, prosperidade e vínculos que se renovam — tradição de casa protegida.", preco: 265, img: IMG("samambaia-estrela-azul") },
  { id: "renda-francesa", nome: "Renda Francesa · grande", especie: "Davallia · samambaia renda francesa · peça grande", categoria: "dentro", ambiente: "ambos", pet: "safe",
    descricao: "Frondes finíssimas e muito recortadas, leves como renda, caindo em cascata — peça de grande porte, cheia de movimento. Adora umidade e luz indireta.", significado: "A samambaia simboliza proteção e prosperidade, e vínculos que se renovam ao longo do tempo.", preco: 270, img: IMG("renda-francesa") },
  { id: "jade", nome: "Jade · Árvore da Amizade", especie: "Crassula ovata · a árvore da amizade", categoria: "ambos", ambiente: "ambos", pet: "toxic",
    descricao: "Suculenta de folhas gordinhas e brilhantes. Conhecida como a árvore da amizade, quase não pede água — só bastante luz.", significado: "Conhecida como a árvore da amizade — símbolo de amizade verdadeira, prosperidade e boa sorte. Um presente cheio de significado para quem se quer bem.", preco: 250, img: IMG("jade") },
  { id: "croton", nome: "Croton", especie: "Codiaeum variegatum · tamanho P", categoria: "ambos", ambiente: "ambos", pet: "toxic",
    descricao: "Folha coriácea listrada de verde, amarelo e vermelho, que ganha cor quanto mais luz recebe. Nenhuma folha repete a mistura da outra.", significado: "Croton simboliza energia, transformação e alegria — muda de cor com a luz, como a vida em movimento.", preco: 200, img: IMG("croton") },
  { id: "maxi-croton", nome: "Maxi Croton", especie: "Codiaeum variegatum · porte grande", categoria: "ambos", ambiente: "ambos", pet: "toxic",
    descricao: "A versão grande do nosso croton: folhas largas e coriáceas listradas de verde, amarelo, laranja e vermelho, cheias de cor. Uma peça de presença, que fica ainda mais vibrante quanto mais luz recebe.", significado: "Croton simboliza energia, transformação e alegria — muda de cor com a luz, como a vida em movimento.", preco: 360, imgs: [IMG("maxi-croton"), IMG("maxi-croton-2")] },
  /* ---------- 04 · BONSAIS ---------- */
  { id: "bonsai-ligustro-15", nome: "Bonsai Ligustro · 15 anos", especie: "Ligustrum sinense · aprox. 50 cm", categoria: "bonsai", ambiente: "ambos", pet: "toxic",
    descricao: "Folhagem miúda e densa, tronco que engrossa rápido. Perdoa erro de rega — o bonsai mais generoso para quem está começando.", significado: "Bonsai de ligustro: símbolo de proteção e vida longa, cultivado para trazer harmonia ao lar.", preco: 1400, imgs: [IMG("bonsai-ligustro-15-2"), IMG("bonsai-ligustro-15")] },
  { id: "bonsai-serissa-8", nome: "Bonsai Serissa · 8 a 9 anos", especie: "Serissa japonica · 20 a 30 cm", categoria: "bonsai", ambiente: "ambos", pet: "toxic",
    descricao: "Conhecida como árvore das mil estrelas — cobre-se de flores brancas miúdas em ondas sucessivas. Tronco claro e retorcido.", significado: "A serissa, 'árvore das mil estrelas', simboliza renascimento e a beleza dos pequenos recomeços.", preco: 900, imgs: [IMG("bonsai-serissa-8"), IMG("bonsai-serissa-8-2"), IMG("bonsai-serissa-8-3")] },
  { id: "bonsai-ficus-6", nome: "Bonsai Fícus · 7 anos", especie: "Ficus microcarpa · aprox. 30 cm", categoria: "bonsai", ambiente: "interno", pet: "toxic",
    descricao: "Sete anos num fícus de raízes engrossadas que emergem da esfera como um pequeno tronco de várias pernas. Folha pequena, lustrosa e verde-escura, copa densa. O bonsai de interior mais generoso — aceita luz indireta e perdoa esquecimento.", significado: "Fícus em bonsai — símbolo de abundância, unidade e prosperidade duradoura.", preco: 950, img: IMG("bonsai-ficus-6") },
  { id: "bonsai-jabuticabeira-12", nome: "Bonsai Jabuticabeira · 16 anos", especie: "Plinia cauliflora · aprox. 50 cm · frutificando", categoria: "bonsai", ambiente: "externo", pet: "safe",
    descricao: "Dezesseis anos de formação, e já frutifica. A jabuticaba nasce colada ao tronco, como na árvore inteira — só que em meio metro de altura.", significado: "A jabuticabeira simboliza fartura, raízes e paciência — a árvore de quem valoriza o tempo.", preco: 2500, imgs: [IMG("bonsai-jabuticabeira-12"), IMG("bonsai-jabuticabeira-12-2"), IMG("bonsai-jabuticabeira-12-3"), IMG("bonsai-jabuticabeira-12-4")] },
  { id: "bonsai-jabuticabeira-4", nome: "Bonsai Jabuticabeira · 4 anos", especie: "Plinia cauliflora · aprox. 40 cm", categoria: "bonsai", ambiente: "externo", pet: "safe",
    descricao: "Casca lisa e clara, folhagem miúda, estrutura ainda em desenho. A peça de quem quer acompanhar a árvore desde cedo.", significado: "A jabuticabeira simboliza fartura, raízes e paciência — a árvore de quem valoriza o tempo.", preco: 1000, img: IMG("bonsai-jabuticabeira-4") },
  { id: "bonsai-amora-17", nome: "Bonsai Amora · 16 anos", especie: "Morus nigra · aprox. 50 cm", categoria: "bonsai", ambiente: "externo", pet: "safe",
    descricao: "Dezesseis anos em meio metro. Tronco engrossado, casca fissurada, e fruta escura na estação — árvore que dá colheita numa mesa de sala.", significado: "A amoreira simboliza sabedoria, fartura e a doçura da vida colhida com paciência.", preco: 2200, img: IMG("bonsai-amora-17") },
  { id: "bonsai-amora-7", nome: "Bonsai Amora · 7 anos", especie: "Morus nigra · aprox. 50 cm", categoria: "bonsai", ambiente: "externo", pet: "safe",
    descricao: "Mesma altura da irmã mais velha, dez anos a menos de tronco. Cresce rápido e responde bem à poda — boa para quem quer aprender a conduzir.", significado: "A amoreira simboliza sabedoria, fartura e a doçura da vida colhida com paciência.", preco: 800, img: IMG("bonsai-amora-7") },
  { id: "bonsai-oliveira-16", nome: "Bonsai Oliveira · 16 anos", especie: "Olea europaea · aprox. 40 cm", categoria: "bonsai", ambiente: "externo", pet: "safe",
    descricao: "Dezesseis anos de condução em um tronco que já carrega casca rugosa e curva definida. Folha prateada que troca de tom conforme a luz atravessa o dia.", significado: "A oliveira é símbolo universal de paz, sabedoria e prosperidade — a árvore da longevidade.", preco: 2700, img: IMG("bonsai-oliveira-16") },
  { id: "bonsai-pinheiro-negro-14", nome: "Bonsai Pinheiro Negro · 14 anos", especie: "Pinus thunbergii · 40 a 60 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "A espécie mais reverenciada da tradição japonesa. Agulha rígida, casca em placas, silhueta construída agulha por agulha ao longo de catorze anos.", significado: "O pinheiro simboliza longevidade, força e imortalidade — a árvore mais reverenciada da tradição japonesa.", preco: 3000, img: IMG("bonsai-pinheiro-negro-14") },
  { id: "bonsai-shimpaku-16", nome: "Bonsai Shimpaku · 16 anos", especie: "Juniperus chinensis 'Shimpaku' · 30 a 40 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "Junípero de folha escamosa e macia, madeira que aceita torção. O clássico dos jardins japoneses, em escala de mesa.", significado: "O junípero simboliza proteção, purificação e vida longa — guardião dos jardins japoneses.", preco: 2500, img: IMG("bonsai-shimpaku-16") },
  { id: "bonsai-shimpaku-5", nome: "Bonsai Shimpaku · 4 anos", especie: "Juniperus chinensis 'Shimpaku' · aprox. 30 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "Quatro anos de condução num tronco já curvado, de casca fina e folhagem escamosa verde-clara. O junípero clássico dos jardins japoneses, no ponto em que ainda se deixa moldar — para acompanhar a árvore ganhar forma.", significado: "O junípero simboliza proteção, purificação e vida longa — guardião dos jardins japoneses.", preco: 800, img: IMG("bonsai-shimpaku-5") },
  { id: "bonsai-sakura", nome: "Bonsai Sakura", especie: "Prunus serrulata · aprox. 20 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "A cerejeira japonesa em vinte centímetros. Floresce antes de folhar, e a flor dura poucos dias — é a imagem exata de nagori.", significado: "A cerejeira simboliza a beleza efêmera da vida — viver intensamente o instante que passa.", preco: 990, img: IMG("bonsai-sakura") },
  { id: "bonsai-caliandra-9", nome: "Bonsai Caliandra Rosa · 9 anos", especie: "Calliandra brevipes · aprox. 50 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "Tronco engrossado, casca rugosa e ramificação já aberta. Flor em pompom rosado quase o ano inteiro.", significado: "A caliandra, de flor em pompom, simboliza afeto, delicadeza e alegria que se renova.", preco: 1100, img: IMG("bonsai-caliandra-9") },
  { id: "bonsai-jasmim-anao-6", nome: "Bonsai Jasmim Anão · 6 anos", especie: "Jasminum sp. · anão · aprox. 30 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "Seis anos de condução num tronco que já engrossou, criou casca e recebeu líquen. Floresce branco ao entardecer e perfuma um ambiente inteiro. Espécie difícil de encontrar já formada.", significado: "O jasmim simboliza amor puro, doçura e boas energias — seu perfume traz paz ao lar.", preco: 800, img: IMG("bonsai-jasmim-anao-6") },
  { id: "bonsai-buxus-9", nome: "Bonsai Buxus · 9 anos", especie: "Buxus harlandii · aprox. 20 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "Folha pequena e coriácea, casca cortiçosa e clara. Aceita poda severa e mantém a forma por muito tempo.", significado: "O buxinho simboliza permanência e proteção — cultivado há séculos como guardião de jardins.", preco: 1000, img: IMG("bonsai-buxus-9") },
  { id: "bonsai-cerejeira-rg-6", nome: "Bonsai Cerejeira-do-Rio-Grande · 7 anos", especie: "Eugenia involucrata · 30 a 40 cm", categoria: "bonsai", ambiente: "externo", pet: "toxic",
    descricao: "Nativa da mata atlântica, prima da jabuticabeira. Folha miúda e lustrosa. Dá flores brancas de estames finos e frutos vermelho-escuros comestíveis, de sabor doce — colheita numa árvore de mesa.", significado: "Nativa da mata atlântica — símbolo de raízes, fartura e pertencimento à terra.", preco: 800, img: IMG("bonsai-cerejeira-rg-6") },
  { id: "bonsai-cambui-8", nome: "Bonsai Cambuí · 8 anos", especie: "Myrciaria tenella · aprox. 20 cm", categoria: "bonsai", ambiente: "externo", pet: "safe",
    descricao: "Nativa da mata atlântica, de folha minúscula e casca clara que descama sozinha. Dá frutinha vermelha comestível.", significado: "Nativa que dá fruto — símbolo de fartura, raízes brasileiras e a doçura das coisas simples.", preco: 1100, img: IMG("bonsai-cambui-8") },

  /* ---------- 06 · GRANDE PORTE (maxi kokedamas · em estoque) ---------- */
  { id: "oliveira-grande", encomenda: true, nome: "Oliveira", especie: "Olea europaea · 1,60 m a 1,80 m", categoria: "grande", ambiente: "externo", pet: "safe",
    descricao: "Oliveira adulta sustentada por uma única esfera de musgo. Tronco e folha prateada em escala de árvore — peça de chão, para hall e canto de sala.", significado: "A oliveira é símbolo universal de paz, sabedoria e prosperidade — a árvore da longevidade.", preco: 2500, img: IMG("oliveira-grande") },
  { id: "jabuticabeira-grande", encomenda: true, nome: "Jabuticabeira", especie: "Plinia cauliflora · 1,20 m a 1,60 m · frutificando", categoria: "grande", ambiente: "externo", pet: "safe",
    descricao: "Árvore em idade de produzir, suspensa ou apoiada. Muda o eixo de um hall inteiro — e dá fruta.", significado: "A jabuticabeira simboliza fartura, raízes e paciência — a árvore de quem valoriza o tempo.", preco: 2000, img: IMG("jabuticabeira-grande") },
  { id: "arvore-felicidade", encomenda: true, nome: "Árvore da Felicidade", especie: "Polyscias sp. · fêmea e macho · 80 cm a 1 m", categoria: "grande", ambiente: "interno", pet: "toxic",
    descricao: "Sai em dois desenhos de folha: a fêmea, de folíolo largo e arredondado, e o macho, de folha recortada e fina. Tronco lenhoso e porte ereto — peça de canto e de entrada.", significado: "A árvore da felicidade — símbolo de boas energias, harmonia e alegria no lar.", preco: 1800, img: IMG("arvore-felicidade") },

  /* ---------- 07 · SUPORTES (vendidos à parte, como as peças) ---------- */
  { id: "suporte-ferro-curvo-cobre", nome: "Base de ferro curva · cobre", especie: "Suporte · ferro curvo · acabamento cobre · aro para a esfera", categoria: "suporte", suporte: true,
    descricao: "Lâmina de ferro curvada como uma onda, com um aro suspenso que segura a esfera no alto — a kokedama parece flutuar sobre a base. Acabamento cobre.", preco: 100, img: "assets/bases/ferro-curvo-cobre.jpg" },
  { id: "suporte-ferro-curvo-dourado", nome: "Base de ferro curva · dourada", especie: "Suporte · ferro curvo · acabamento dourado · aro para a esfera", categoria: "suporte", suporte: true,
    descricao: "Lâmina de ferro curvada como uma onda, com um aro suspenso que segura a esfera no alto — a kokedama parece flutuar sobre a base. Acabamento dourado.", preco: 100, img: "assets/bases/ferro-curvo-dourado.jpg" },
  { id: "suporte-ferro-curvo-preto", nome: "Base de ferro curva · preta", especie: "Suporte · ferro curvo · acabamento preto · aro para a esfera", categoria: "suporte", suporte: true,
    descricao: "Lâmina de ferro curvada como uma onda, com um aro suspenso que segura a esfera no alto — a kokedama parece flutuar sobre a base. Acabamento preto brilhante.", preco: 100, img: "assets/bases/ferro-curvo-preto.jpg" },
  { id: "suporte-aros-dourado", nome: "Suporte de aros · dourado", especie: "Suporte · dois aros em ferro · acabamento dourado", categoria: "suporte", suporte: true,
    descricao: "Dois aros de ferro ligados por uma curva única: um apoia a esfera, o outro dá base. Desenho leve e circular, que valoriza a peça de todos os ângulos. Acabamento dourado.", preco: 75, img: "assets/bases/aros-dourado.jpg" },
  { id: "suporte-aros-preto", nome: "Suporte de aros · preto", especie: "Suporte · dois aros em ferro · acabamento preto", categoria: "suporte", suporte: true,
    descricao: "Dois aros de ferro ligados por uma curva única: um apoia a esfera, o outro dá base. Desenho leve e circular, que valoriza a peça de todos os ângulos. Acabamento preto brilhante.", preco: 75, img: "assets/bases/aros-preto.jpg" },
  { id: "suporte-aros-cobre", nome: "Suporte de aros · cobre", especie: "Suporte · dois aros em ferro · acabamento cobre", categoria: "suporte", suporte: true,
    descricao: "Dois aros de ferro ligados por uma curva única: um apoia a esfera, o outro dá base. Desenho leve e circular, que valoriza a peça de todos os ângulos. Acabamento cobre.", preco: 75, img: "assets/bases/aros-cobre.jpg" },
  { id: "suporte-coluna-bronze-80", nome: "Coluna de ferro · bronze · 80 cm", especie: "Suporte de chão · ferro bronze · torre vazada · altura 80 cm", categoria: "suporte", suporte: true,
    descricao: "Torre vazada de ferro, alta e esguia, em acabamento bronze. Leva a kokedama à altura do olhar e vira peça de decoração por si só — ideal para canto de sala ou entrada. 80 cm de altura.", preco: 220, imgs: ["assets/bases/coluna-bronze-80.jpg", "assets/bases/coluna-bronze-80-uso.jpg"] },
  { id: "suporte-coluna-preta-80", oculto: true, nome: "Coluna de ferro · preta · 80 cm", especie: "Suporte de chão · ferro preto · torre vazada · altura 80 cm", categoria: "suporte", suporte: true,
    descricao: "Torre vazada de ferro, alta e esguia, em acabamento preto. Leva a kokedama à altura do olhar e vira peça de decoração por si só — ideal para canto de sala ou entrada. 80 cm de altura.", preco: 220, img: "assets/bases/coluna-preta-80.jpg" },
  { id: "suporte-cubo-ferro-alto", nome: "Cubo de ferro · alto", especie: "Suporte especial · ferro preto · aro interno", categoria: "suporte", suporte: true,
    descricao: "Mesmo desenho, mais alto e mais estreito. Para peça de folhagem longa, que precisa de espaço para cair.", preco: 190, imgs: ["assets/bases/cubo-ferro-alto.jpg", "assets/bases/cubo-ferro-alto-uso.jpg"] },
  { id: "suporte-tronco-natural", nome: "Tronco natural", especie: "Suporte especial · tronco 13 cm · altura 8,5 cm · aro 11 cm", categoria: "suporte", suporte: true,
    descricao: "Tronco com casca, cada um diferente do outro. Combina com bonsai de casca rugosa, e o peso sustenta maxi kokedama.", preco: 170, imgs: ["assets/bases/tronco-natural.jpg", "assets/bases/tronco-natural-uso.jpg"] },
  { id: "suporte-tripe-60", nome: "Tripé de ferro · 60 cm", especie: "Suporte de chão · ferro preto · aro 18 cm · altura 60 cm", categoria: "suporte", suporte: true,
    descricao: "O tripé mais alto, para as maxi kokedamas e peças de grande porte ganharem destaque de canto de sala.", preco: 150, imgs: ["assets/bases/tripe-60.jpg", "assets/bases/tripe-60-uso.jpg"] },
  { id: "suporte-tronco-alto", nome: "Tronco alto", especie: "Suporte especial · madeira clara · medidas variáveis", categoria: "suporte", suporte: true,
    descricao: "Cilindro de madeira clara com haste fina. Eleva a esfera bem acima da superfície — a base mais vertical da linha.", preco: 130, img: "assets/bases/tronco-alto-uso.jpg" },
  { id: "suporte-madeira-aro-duplo", nome: "Madeira com aro duplo", especie: "Suporte · madeira e ferro · dois aros em alturas diferentes", categoria: "suporte", suporte: true,
    descricao: "Duas hastes na mesma base, em alturas distintas. Para montar duas peças pequenas juntas, em composição.", preco: 85, imgs: ["assets/bases/madeira-aro-duplo.jpg", "assets/bases/madeira-aro-duplo-uso.jpg"] },
  { id: "suporte-tripe-45", nome: "Tripé de ferro · 45 cm", especie: "Suporte de chão · ferro preto · aro 18 cm · altura 45 cm", categoria: "suporte", suporte: true,
    descricao: "A altura intermediária do tripé de chão. Ergue a esfera bem acima do piso, com presença de escultura.", preco: 85, imgs: ["assets/bases/tripe-45.jpg", "assets/bases/tripe-45-uso.jpg"] },
  { id: "suporte-cubo-ferro-baixo", nome: "Cubo de ferro · baixo", especie: "Suporte especial · ferro preto · aro interno", categoria: "suporte", suporte: true,
    descricao: "Estrutura vazada com aro suspenso no centro. A esfera flutua dentro do quadro, na altura do olhar sentado.", preco: 100, imgs: ["assets/bases/cubo-ferro-baixo.jpg", "assets/bases/cubo-ferro-baixo-uso.jpg"] },
  { id: "suporte-tripe-30", nome: "Tripé de ferro · 30 cm", especie: "Suporte de chão · ferro preto · aro 18 cm · altura 30 cm", categoria: "suporte", suporte: true,
    descricao: "Fica no chão, não sobre móvel. Levanta a árvore do piso — feito para as peças de grande porte e as maxi kokedamas.", preco: 75, imgs: ["assets/bases/tripe-30.jpg", "assets/bases/tripe-30-uso.jpg"] },
  { id: "suporte-madeira-gancho", nome: "Madeira com gancho · clara", especie: "Suporte · madeira clara e ferro · base 15×15 cm · gancho preto", categoria: "suporte", suporte: true,
    descricao: "Haste alta curvada em gancho sobre base de madeira clara. A esfera fica suspensa e a folhagem cai livre — a escolha das pendentes.", preco: 80, imgs: ["assets/bases/madeira-gancho.jpg?v=232", "assets/bases/madeira-gancho-uso.jpg"] },
  { id: "suporte-madeira-gancho-escura", nome: "Madeira com gancho · escura", especie: "Suporte · madeira escura (nogueira) e ferro · base 15×15 cm · gancho preto", categoria: "suporte", suporte: true,
    descricao: "Haste alta curvada em gancho sobre base de madeira escura (nogueira). A esfera fica suspensa e a folhagem cai livre — a escolha das pendentes.", preco: 80, img: "assets/bases/madeira-gancho-escura.jpg" },
  { id: "suporte-madeira-gancho-alto-escura", nome: "Madeira com gancho alto · escura", especie: "Suporte · madeira escura (nogueira) e ferro · gancho preto alto", categoria: "suporte", suporte: true,
    descricao: "A versão mais alta do pendente, sobre base de madeira escura (nogueira). A haste sobe bem mais, para a folhagem cair em cascata com fôlego — ideal para pendentes longas.", preco: 100, img: "assets/bases/madeira-gancho-alto-escura.jpg" },
  { id: "suporte-triangulo-madeira", nome: "Base triângulo · madeira e ferro", especie: "Suporte · base triangular de madeira clara · armação de ferro preto · aro superior", categoria: "suporte", suporte: true,
    descricao: "Base triangular de madeira clara com armação de ferro preto que sobe até um aro — a esfera assenta no alto, numa composição geométrica e moderna. Peça de desenho marcante.", preco: 85, img: "assets/bases/triangulo-madeira.jpg" },
  { id: "suporte-madeira-aro-alto", nome: "Madeira com aro alto · pendente", especie: "Suporte · madeira clara e ferro · haste alta com aro no topo", categoria: "suporte", suporte: true,
    descricao: "A versão mais alta do Madeira com aro: haste de ferro trabalhada que sobe até um aro aberto no topo, onde a esfera assenta. Eleva a peça bem acima da base — ótimo para folhagem que cai.", preco: 75, img: "assets/bases/madeira-aro-alto.jpg" },
  { id: "suporte-madeira-aro", nome: "Madeira com aro · clara", especie: "Suporte · madeira clara e ferro · base 15×15 cm · aro 9 cm · altura 10 cm", categoria: "suporte", suporte: true,
    descricao: "Aro de ferro preto sobre haste, em base de madeira clara. Levanta a esfera do móvel e deixa o musgo respirar por baixo.", preco: 65, imgs: ["assets/bases/madeira-aro.jpg?v=237", "assets/bases/madeira-aro-uso.jpg"] },
  { id: "suporte-madeira-aro-escura", nome: "Madeira com aro · escura", especie: "Suporte · madeira escura (nogueira) e ferro · base 15×15 cm · aro 9 cm", categoria: "suporte", suporte: true,
    descricao: "O mesmo Madeira com aro, em base de madeira escura (nogueira). Aro de ferro preto sobre haste — levanta a esfera e deixa o musgo respirar por baixo.", preco: 65, img: "assets/bases/madeira-aro-escura.jpg" },
  { id: "suporte-madeira-lisa", nome: "Madeira lisa", especie: "Suporte · madeira · 15 × 15 cm", categoria: "suporte", suporte: true,
    descricao: "Bloco de madeira com encaixe côncavo. A esfera assenta direto, sem haste — o apoio mais discreto de todos.", preco: 60, imgs: ["assets/bases/madeira-lisa.jpg", "assets/bases/madeira-lisa-uso.jpg"] },
  { id: "suporte-ferro-aro-base", nome: "Ferro · aro sobre base quadrada", especie: "Suporte · ferro preto", categoria: "suporte", suporte: true,
    descricao: "Aro de ferro preto suspenso sobre base quadrada. A esfera flutua acima do apoio, com ar de escultura.", preco: 50, imgs: ["assets/bases/ferro-aro-base.jpg", "assets/bases/ferro-aro-base-uso.jpg"] },
  { id: "suporte-ferro-esfera", nome: "Ferro · esfera de arame", especie: "Suporte · ferro preto", categoria: "suporte", suporte: true,
    descricao: "Esfera de arame de ferro preto. A kokedama se aninha entre as linhas curvas, num desenho escultórico.", preco: 50, imgs: ["assets/bases/ferro-esfera.jpg", "assets/bases/ferro-esfera-uso.jpg"] },
  { id: "suporte-ferro-cone", nome: "Ferro · cone", especie: "Suporte · ferro preto", categoria: "suporte", suporte: true,
    descricao: "Estrutura cônica de ferro preto, mais larga na base. Apoio estável e geométrico, ergue a esfera do móvel.", preco: 50, imgs: ["assets/bases/ferro-cone.jpg", "assets/bases/ferro-cone-uso.jpg"] },
  { id: "suporte-ferro-tripe-v", nome: "Ferro · tripé pés em V", especie: "Suporte · ferro preto", categoria: "suporte", suporte: true,
    descricao: "Tripé de ferro preto com pés finos em V e aro no topo. Leve e moderno, levanta a esfera do móvel.", preco: 50, imgs: ["assets/bases/ferro-tripe-v.jpg", "assets/bases/ferro-tripe-v-uso.jpg"] },
  { id: "suporte-ferro-cruzado", nome: "Ferro · aros cruzados", especie: "Suporte · ferro preto", categoria: "suporte", suporte: true,
    descricao: "Dois aros de ferro preto unidos por hastes que se cruzam na cintura. A esfera assenta no aro de cima, num jogo de linhas que lembra escultura.", preco: 50, imgs: ["assets/bases/ferro-cruzado.jpg", "assets/bases/ferro-cruzado-uso.jpg"] },
  { id: "suporte-ferro-dois-aros", nome: "Ferro · dois aros", especie: "Suporte · ferro preto", categoria: "suporte", suporte: true,
    descricao: "Dois aros de ferro preto ligados por uma haste reta, em dois níveis. Apoio simples e firme, ergue a esfera do móvel.", preco: 50, imgs: ["assets/bases/ferro-dois-aros.jpg", "assets/bases/ferro-dois-aros-uso.jpg"] },
  { id: "suporte-ferro-espiral", nome: "Ferro · espiral", especie: "Suporte · ferro preto", categoria: "suporte", suporte: true,
    descricao: "Uma única linha de ferro preto que sobe em espiral, do aro da base ao aro do topo. Movimento e leveza — a mais gráfica da linha.", preco: 50, imgs: ["assets/bases/ferro-espiral.jpg", "assets/bases/ferro-espiral-uso.jpg"] },
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
  { id: "tronco-natural", nome: "Tronco natural", preco: 170, encomenda: true, specs: "tronco 13 cm · altura 8,5 cm · aro 11 cm",
    desc: "Tronco com casca, cada um diferente do outro. Combina com bonsai de casca rugosa, e o peso sustenta maxi kokedama.", addId: "suporte-tronco-natural" },
  { id: "tronco-alto", nome: "Tronco alto", preco: 130, encomenda: true, specs: "madeira clara · medidas variáveis",
    desc: "Cilindro de madeira clara com haste fina. Eleva a esfera bem acima da superfície — a base mais vertical da linha.", addId: "suporte-tronco-alto" },
  { id: "cubo-ferro-baixo", nome: "Cubo de ferro (baixo)", preco: 100, encomenda: true, specs: "ferro preto · aro interno",
    desc: "Estrutura vazada com aro suspenso no centro. A esfera flutua dentro do quadro, na altura do olhar sentado.", addId: "suporte-cubo-ferro-baixo" },
  { id: "cubo-ferro-alto", nome: "Cubo de ferro (alto)", preco: 190, encomenda: true, specs: "ferro preto · aro interno",
    desc: "Mesmo desenho, mais alto e mais estreito. Para peça de folhagem longa, que precisa de espaço para cair.", addId: "suporte-cubo-ferro-alto" },
];
