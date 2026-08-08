# Atelier Nagori — Loja de Kokedamas 🌿

Site de e-commerce artesanal para o **Atelier Nagori**, feito com HTML, CSS e
JavaScript puros (sem frameworks, sem build). É só abrir o `index.html` no
navegador — ou publicar em qualquer hospedagem estática (GitHub Pages, Netlify,
Vercel, Hostinger…).

## O que o site tem

- **Página inicial** com hero, história do ateliê e selos de confiança.
- **Galeria de produtos** com filtro por categoria e página de detalhes (modal).
- **Carrinho de compras** (gaveta lateral) que salva os itens no navegador.
- **Cálculo de frete nacional** por CEP com várias transportadoras:
  Correios (PAC e SEDEX), Jadlog (Package e .Com), Azul Cargo Express, Loggi,
  além de retirada no ateliê. Busca a cidade automaticamente pelo CEP (ViaCEP).
- **Frete grátis** automático acima de um valor configurável.
- **Checkout com InfinitePay** — o carrinho monta o pedido e envia o cliente
  para o checkout seguro da InfinitePay (Pix, crédito e débito).
- **Pedido pelo WhatsApp** como alternativa ao checkout.
- **Formulário de contato** que envia a mensagem pelo WhatsApp (e e-mail).

## Como colocar no ar (3 passos)

### 1. Configurar seus dados
Abra **`js/config.js`** e preencha:

| Campo | O que colocar |
|-------|----------------|
| `infinitePayHandle` | Seu usuário do InfinitePay (o texto que vem depois de `checkout.infinitepay.io/`). |
| `whatsapp` | Seu WhatsApp com país e DDD, só números. Ex: `5511987654321`. |
| `email` | E-mail que recebe os contatos. |
| `instagram` | Seu @ do Instagram (sem o @). |
| `freteGratisAcima` | Valor mínimo (R$) para frete grátis. |
| `transportadoras` | Tabela de preços/prazos do frete — ajuste conforme sua negociação. |

> **InfinitePay:** o handle é o mesmo do seu link de pagamento. Se o seu link é
> `https://checkout.infinitepay.io/ateliernagori`, então o handle é
> `ateliernagori`. Enquanto não for configurado, o botão "Finalizar compra"
> avisa que falta configurar e o cliente pode pedir pelo WhatsApp.

### 2. Trocar os produtos e as fotos
Abra **`js/products.js`**. Cada produto tem nome, preço, descrição e cuidados.
As ilustrações são desenhadas em código (SVG) para o site já funcionar sem
fotos. Para usar **fotos reais**, coloque as imagens na pasta `assets/` e, no
produto, troque a linha `art: ...` por:

```js
img: "assets/samambaia.jpg",
```

O site usa a foto quando ela existe.

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
assets/             → coloque aqui as fotos dos produtos
```

## Observações sobre o frete

Os valores de frete são **estimativas** configuráveis, calculadas por zona de
distância a partir de São Paulo/SP. Para valores exatos em tempo real seria
preciso contratar a API de cada transportadora (Correios, Melhor Envio, etc.) —
o que exige um servidor. A tabela atual já dá um valor realista ao cliente e
pode ser ajustada a qualquer momento em `js/config.js`.

---

Feito com carinho para o Atelier Nagori. 名残
