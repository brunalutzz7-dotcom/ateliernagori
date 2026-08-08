# Atelier Nagori — Loja de Kokedamas e Bonsais 🌿

Site de e-commerce artesanal para o **Atelier Nagori**, feito com HTML, CSS e
JavaScript puros (sem frameworks, sem build). É só abrir o `index.html` no
navegador — ou publicar em qualquer hospedagem estática (GitHub Pages, Netlify,
Vercel, Hostinger…).

## O que o site tem

- **Tela de entrada** com duas opções: comprar pelo WhatsApp (abre o contato
  direto) ou comprar no site.
- **Página inicial** com hero, história do ateliê e selos de confiança.
- **Catálogo com as 55 peças** (folhagens, floridas e bonsais), com filtro por
  categoria, ícones de ambiente (interno/externo) e de pets, nome científico e
  página de detalhes (modal) com fotos reais.
- **Tamanhos/variações** (ex.: Médio/Grande, O par) com preço próprio.
- **Base inclusa** — o cliente escolhe o modelo da base no carrinho, sem custo.
- **Peças de grande porte** entram como *encomenda* (vão direto ao WhatsApp).
- **Carrinho de compras** (gaveta lateral) que salva os itens no navegador.
- **Cálculo de frete nacional** por CEP a partir de Curitiba, com várias
  transportadoras: Correios (PAC e SEDEX), Jadlog (Package e .Com), Azul Cargo
  Express, Loggi, além de retirada no ateliê. Busca a cidade pelo CEP (ViaCEP).
- **Frete grátis** automático acima de um valor configurável.
- **Checkout com InfinitePay** — o carrinho monta o pedido (com tamanho e base)
  e envia o cliente para o checkout seguro da InfinitePay (Pix, crédito, débito).
- **Pedido pelo WhatsApp** como alternativa ao checkout.
- **Formulário de contato** que chega no seu WhatsApp (o e-mail fica oculto).

## Como colocar no ar (3 passos)

### 1. Configurar seus dados
Abra **`js/config.js`** e preencha:

| Campo | O que colocar |
|-------|----------------|
| `infinitePayHandle` | Seu usuário do InfinitePay (o texto que vem depois de `checkout.infinitepay.io/`). |
| `whatsapp` | Seu WhatsApp com país e DDD, só números. Ex: `5511987654321`. |
| `email` | E-mail que **recebe** os contatos (fica oculto dos clientes; `emailVisivel: false`). |
| `instagram` | Seu @ do Instagram (sem o @). |
| `freteGratisAcima` | Valor mínimo (R$) para frete grátis. |
| `transportadoras` | Tabela de preços/prazos do frete — ajuste conforme sua negociação. |

> **InfinitePay:** o handle é o mesmo do seu link de pagamento. Se o seu link é
> `https://checkout.infinitepay.io/ateliernagori`, então o handle é
> `ateliernagori`. Enquanto não for configurado, o botão "Finalizar compra"
> avisa que falta configurar e o cliente pode pedir pelo WhatsApp.

### 2. Produtos e fotos
Os **55 produtos** já estão em **`js/products.js`**, montados a partir do seu
catálogo (30/07/2026). As **40 fotos** ficam em `assets/produtos/`. As 15 peças
que estavam como *"foto em preparo"* usam um placeholder elegante até você tirar
a foto.

Para **adicionar a foto** de uma dessas peças:
1. Salve a foto em `assets/produtos/` (ex.: `asplenio.jpg`).
2. No produto correspondente em `js/products.js`, adicione a linha:
   ```js
   img: IMG("asplenio"),
   ```
   (o `IMG("asplenio")` aponta para `assets/produtos/asplenio.jpg`).

Cada produto aceita: `nome`, `especie`, `categoria`, `ambiente`
(`interno`/`externo`/`ambos`), `pet` (`safe`/`toxic`), `descricao`, e o preço
como `preco: 230` **ou** com tamanhos:
```js
variantes: [{ label: "Médio", preco: 170 }, { label: "Grande", preco: 285 }],
```
Peças de grande porte levam `encomenda: true` (vão ao WhatsApp em vez do
carrinho); raridades levam `raridade: true`.

### 3. Publicar
- **GitHub Pages:** em *Settings → Pages*, publique a partir da branch. Pronto.
- **Netlify / Vercel:** arraste a pasta ou conecte o repositório. Sem build.
- **Local:** basta abrir o `index.html` no navegador.

## Estrutura dos arquivos

```
index.html          → estrutura da página
css/styles.css      → aparência (paleta natural: musgo, areia, terracota)
js/config.js        → ⚙️ SUAS CONFIGURAÇÕES (edite este)
js/products.js      → 🪴 catálogo de produtos (edite este)
js/app.js           → lógica: carrinho, frete, checkout, contato
assets/produtos/    → 40 fotos reais dos produtos (troque/adicione aqui)
```

## Observações sobre o frete

Os valores de frete são **estimativas** configuráveis, calculadas por zona de
distância a partir de Curitiba/PR. Para valores exatos em tempo real seria
preciso contratar a API de cada transportadora (Correios, Melhor Envio, etc.) —
o que exige um servidor. A tabela atual já dá um valor realista ao cliente e
pode ser ajustada a qualquer momento em `js/config.js`.

---

Feito com carinho para o Atelier Nagori. 名残
