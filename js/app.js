/* =====================================================================
   ATELIER NAGORI — LÓGICA DA LOJA
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- utilidades ---------- */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const BRL = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const onlyDigits = (s) => (s || "").replace(/\D/g, "");
  const maskCep = (v) => {
    const d = onlyDigits(v).slice(0, 8);
    return d.length > 5 ? d.slice(0, 5) + "-" + d.slice(5) : d;
  };
  const waBase = () => `https://wa.me/${onlyDigits(CONFIG.whatsapp)}`;

  /* ---------- produtos: helpers ---------- */
  const fotos = (p) => (p.imgs && p.imgs.length ? p.imgs : p.img ? [p.img] : []);
  const capa = (p) => fotos(p)[0] || null;
  const media = (p) => (capa(p) ? `<img src="${capa(p)}" alt="${p.nome}" loading="lazy">` : fotoEmBreve());
  const temVariantes = (p) => Array.isArray(p.variantes) && p.variantes.length > 0;
  const menorPreco = (p) => (temVariantes(p) ? Math.min(...p.variantes.map((v) => v.preco)) : p.preco);
  const precoDaVariante = (p, label) => {
    if (!temVariantes(p)) return p.preco;
    const v = p.variantes.find((x) => x.label === label) || p.variantes[0];
    return v.preco;
  };
  const precoCard = (p) =>
    temVariantes(p)
      ? `<span class="card-price"><small>a partir de</small> ${BRL(menorPreco(p))}</span>`
      : `<span class="card-price">${BRL(p.preco)}</span>`;

  const AMBIENTE = { interno: "Interno", externo: "Externo", ambos: "Interno e externo" };
  const petInfo = (pet) =>
    pet === "safe"
      ? { txt: "Convive com pets", cls: "pet-safe", ico: "🐾" }
      : { txt: "Manter longe de pets", cls: "pet-toxic", ico: "⚠️" };
  const chips = (p) => {
    const pet = petInfo(p.pet);
    return `<span class="tag tag-amb">${AMBIENTE[p.ambiente]}</span>
            <span class="tag ${pet.cls}">${pet.ico} ${pet.txt}</span>`;
  };

  const product = (id) => PRODUCTS.find((p) => p.id === id);
  const catNome = (id) => (CATEGORIAS.find((c) => c.id === id) || {}).nome || id;

  /* ---------- carrinho: estado ----------
     cada linha do carrinho: cart[key] = { q: quantidade, b: índice da base }
     assim cada peça tem a SUA própria base (ou a base dupla, à escolha).   */
  const STORE_KEY = "nagori_cart_v4";
  let cart = load();            // { cartKey: { q, b } }
  let selectedShip = null;      // { id, nome, preco }
  let shipCep = "";

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE_KEY)) || {};
      // saneia: garante formato { q, b }
      Object.keys(raw).forEach((k) => {
        if (typeof raw[k] === "number") raw[k] = { q: raw[k], b: 0 };
        if (!raw[k] || typeof raw[k].q !== "number") delete raw[k];
        else if (typeof raw[k].b !== "number" || !BASES[raw[k].b]) raw[k].b = 0;
      });
      return raw;
    } catch { return {}; }
  }
  function save() { localStorage.setItem(STORE_KEY, JSON.stringify(cart)); }

  // cartKey = id  ||  id + "|" + variantLabel
  const makeKey = (id, variant) => (variant ? `${id}|${variant}` : id);
  const parseKey = (key) => {
    const i = key.indexOf("|");
    return i === -1 ? { id: key, variant: null } : { id: key.slice(0, i), variant: key.slice(i + 1) };
  };
  const keyPreco = (key) => { const { id, variant } = parseKey(key); const p = product(id); return p ? precoDaVariante(p, variant) : 0; };
  const baseOf = (key) => BASES[(cart[key] && cart[key].b) || 0] || BASES[0];
  const cartCount = () => Object.values(cart).reduce((a, v) => a + v.q, 0);
  const subtotal = () => Object.entries(cart).reduce((a, [k, v]) => a + keyPreco(k) * v.q, 0);
  const baseCusto = () => Object.entries(cart).reduce((a, [k, v]) => a + baseOf(k).preco * v.q, 0);

  /* =================================================================
     CONFIG → DOM
     ================================================================= */
  function applyConfig() {
    $("#year").textContent = new Date().getFullYear();
    $("#freteGratisLabel").textContent = BRL(CONFIG.freteGratisAcima);
    $("#waLink").href = waBase();
    $("#igLink").href = `https://instagram.com/${CONFIG.instagram}`;
    $("#igLink").textContent = "@" + CONFIG.instagram;

    const mail = $("#mailLink");
    if (mail) {
      if (CONFIG.emailVisivel) { mail.href = `mailto:${CONFIG.email}`; mail.textContent = CONFIG.email; }
      else mail.closest("li")?.remove();
    }
    $$("[data-wa-link]").forEach((a) => (a.href = waBase()));
    $$("[data-origem]").forEach((el) => (el.textContent = CONFIG.origem.cidade));
    $$("[data-origem-uf]").forEach((el) => (el.textContent = `${CONFIG.origem.cidade}/${CONFIG.origem.uf}`));
  }

  // <option>s de base (usado em cada item do carrinho)
  function baseOptions(selIdx) {
    return BASES.map((b, i) => {
      const extra = b.preco > 0 ? ` (+${BRL(b.preco)} · encomenda)` : " (inclusa)";
      return `<option value="${i}" ${i === selIdx ? "selected" : ""}>${b.nome}${extra}</option>`;
    }).join("");
  }

  /* =================================================================
     PRODUTOS — galeria
     ================================================================= */
  function renderFilters() {
    const usados = CATEGORIAS.filter((c) => PRODUCTS.some((p) => p.categoria === c.id));
    const box = $("#filters");
    box.innerHTML =
      `<button class="chip active" data-cat="todos">Todos</button>` +
      usados.map((c) => `<button class="chip" data-cat="${c.id}">${c.nome}</button>`).join("");
    box.addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      $$(".chip", box).forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      renderGrid(b.dataset.cat);
    });
  }

  function botaoCard(p) {
    if (p.encomenda) return `<button class="btn btn-ghost btn-sm" data-encomenda="${p.id}">Encomendar</button>`;
    if (temVariantes(p)) return `<button class="btn btn-primary btn-sm" data-open="${p.id}">Escolher</button>`;
    return `<button class="btn btn-primary btn-sm" data-add="${p.id}">Adicionar</button>`;
  }

  function cardHTML(p) {
    return `
    <article class="card">
      <div class="card-media" data-open="${p.id}">
        <span class="card-cat">${catNome(p.categoria)}</span>
        ${p.raridade ? `<span class="card-flag">Raridade</span>` : ""}
        ${media(p)}
      </div>
      <div class="card-body">
        <h3>${p.nome}</h3>
        <p class="card-especie">${p.especie}</p>
        <p class="card-desc">${p.descricao}</p>
        <div class="card-tags">${chips(p)}</div>
        <div class="card-foot">${precoCard(p)}${botaoCard(p)}</div>
      </div>
    </article>`;
  }

  function renderGrid(cat = "todos") {
    const base = PRODUCTS.filter((p) => !p.suporte);
    const list = cat === "todos" ? base : base.filter((p) => p.categoria === cat);
    $("#productGrid").innerHTML = list.map(cardHTML).join("");
  }

  /* =================================================================
     SUPORTES (bases)
     ================================================================= */
  function renderSuportes() {
    const box = $("#suporteGrid");
    if (!box) return;
    const seen = new Set();
    box.innerHTML = BASES.filter((b) => {
      if (b.grupo) { if (seen.has(b.grupo)) return false; seen.add(b.grupo); }
      return true;
    }).map((b) => {
      const nome = b.grupo === "tripe" ? "Tripé de ferro (de chão)" : b.nome;
      const foot = b.preco > 0
        ? `<span class="sup-price">+ ${BRL(b.preco)} <small>encomenda</small></span>
           <button class="btn btn-primary btn-sm" data-add="${b.addId}">Adicionar</button>`
        : `<span class="sup-incl">✔ Inclusa com sua peça</span>`;
      const sizeNote = b.grupo === "tripe"
        ? `<p class="sup-note">Três alturas — Pequeno (30 cm), Médio (45 cm) e Grande (60 cm). Você escolhe no carrinho.</p>`
        : "";
      return `
        <article class="suporte-card">
          <div class="sup-media"><img src="assets/bases/${b.imgId || b.id}.jpg" alt="Suporte ${nome}" loading="lazy"></div>
          <div class="sup-body">
            <h3>${nome}</h3>
            <p class="sup-specs">${b.specs}</p>
            <p class="sup-desc">${b.desc}</p>
            ${sizeNote}
            <div class="sup-foot">${foot}</div>
          </div>
        </article>`;
    }).join("");
  }

  /* =================================================================
     MODAL DE PRODUTO
     ================================================================= */
  let modalVariant = null;
  let modalProductId = null;

  function openModal(id) {
    const p = product(id);
    if (!p) return;
    modalProductId = id;
    modalVariant = temVariantes(p) ? p.variantes[0].label : null;

    const variantesHTML = temVariantes(p)
      ? `<div class="modal-variants" id="modalVariants">
           ${p.variantes.map((v, i) =>
             `<button class="vbtn ${i === 0 ? "active" : ""}" data-v="${v.label}">
                <span>${v.label}</span><strong>${BRL(v.preco)}</strong></button>`).join("")}
         </div>`
      : "";

    const cta = p.encomenda
      ? `<a class="btn btn-primary btn-block" data-encomenda="${p.id}" href="#">Encomendar pelo WhatsApp</a>
         <p class="modal-hint">Peça de grande porte, feita sob encomenda — combinamos prazo e entrega pelo WhatsApp.</p>`
      : `<button class="btn btn-primary btn-block" data-add="${p.id}">Adicionar ao carrinho</button>`;

    const precoView = temVariantes(p)
      ? `<div class="modal-price" id="modalPrice">${BRL(p.variantes[0].preco)}</div>`
      : `<div class="modal-price">${BRL(p.preco)}</div>`;

    const gal = fotos(p);
    const galeriaHTML = gal.length
      ? `<img id="modalMainImg" src="${gal[0]}" alt="${p.nome}">
         ${gal.length > 1
           ? `<div class="modal-thumbs">${gal.map((src, i) =>
               `<button class="mthumb ${i === 0 ? "active" : ""}" data-src="${src}">
                  <img src="${src}" alt="${p.nome} — foto ${i + 1}" loading="lazy"></button>`).join("")}</div>`
           : ""}`
      : fotoEmBreve();

    $("#productModal").innerHTML = `
      <div class="modal-inner">
        <div class="modal-media">${galeriaHTML}</div>
        <div class="modal-info">
          <button class="modal-close" aria-label="Fechar">×</button>
          <span class="modal-cat">${catNome(p.categoria)}${p.raridade ? " · Raridade" : ""}</span>
          <h3>${p.nome}</h3>
          <p class="modal-especie">${p.especie}</p>
          ${precoView}
          <p class="modal-desc">${p.descricao}</p>
          ${variantesHTML}
          <div class="modal-tags">${chips(p)}</div>
          <p class="modal-base">✔ Acompanha base inclusa (madeira ou tripé de ferro), à sua escolha no carrinho. Bases especiais — tronco ou cubo de ferro — são feitas sob encomenda e têm custo à parte.</p>
          ${cta}
        </div>
      </div>`;
    $("#modalOverlay").classList.add("open");
    $("#productModal").classList.add("open");
  }
  function closeModal() {
    $("#modalOverlay").classList.remove("open");
    $("#productModal").classList.remove("open");
  }

  /* =================================================================
     CARRINHO
     ================================================================= */
  function addToCart(id, variant) {
    const p = product(id);
    if (!p) return;
    const v = variant !== undefined ? variant : (temVariantes(p) ? p.variantes[0].label : null);
    const key = makeKey(id, v);
    if (cart[key]) cart[key].q += 1;
    else cart[key] = { q: 1, b: 0 };
    save();
    renderCart();
    toast(`${p.nome}${v ? " · " + v : ""} adicionado ✓`);
    bump();
  }
  function setQty(key, qty) {
    if (!cart[key]) return;
    if (qty <= 0) delete cart[key];
    else cart[key].q = qty;
    save();
    renderCart();
  }
  function setBase(key, idx) {
    if (cart[key]) { cart[key].b = idx; save(); renderCart(); }
  }

  function renderCart() {
    const count = cartCount();
    $("#cartCount").textContent = count;
    $("#cartCount").style.display = count ? "grid" : "none";
    $("#cartDrawer").classList.toggle("empty", count === 0);

    $("#cartItems").innerHTML = Object.entries(cart).map(([key, v]) => {
      const { id, variant } = parseKey(key);
      const p = product(id);
      if (!p) return "";
      const unit = precoDaVariante(p, variant);
      const base = baseOf(key);
      const baseExtra = !p.suporte && base.preco > 0
        ? `<div class="ci-base-cost">+ ${BRL(base.preco)}${v.q > 1 ? " × " + v.q : ""} (base ${base.nome})</div>`
        : "";
      const baseSel = p.suporte
        ? `<div class="ci-suporte">Suporte avulso · encomenda</div>`
        : `<label class="ci-base-label">Base desta peça
            <select class="ci-base" data-base-key="${key}">${baseOptions(v.b)}</select>
          </label>`;
      return `
        <div class="cart-item">
          <div class="ci-media">${media(p)}</div>
          <div class="ci-info">
            <h4>${p.nome}</h4>
            ${variant ? `<div class="ci-var">${variant}</div>` : ""}
            <div class="ci-price">${BRL(unit)}</div>
            <div class="qty">
              <button data-dec="${key}" aria-label="Diminuir">−</button>
              <span>${v.q}</span>
              <button data-inc="${key}" aria-label="Aumentar">+</button>
            </div>
            ${baseSel}
            ${baseExtra}
          </div>
          <div class="ci-right">
            <div class="ci-line">${BRL(unit * v.q)}</div>
            <button class="ci-remove" data-rm="${key}">remover</button>
          </div>
        </div>`;
    }).join("");

    updateTotals();
  }

  function updateTotals() {
    const sub = subtotal();
    $("#sumSubtotal").textContent = BRL(sub);

    // bases especiais (com custo) — somadas de todas as peças
    const base = baseCusto();
    const lineBase = $("#lineBase");
    if (base > 0) {
      lineBase.hidden = false;
      const nEsp = Object.entries(cart).reduce((a, [k, v]) => a + (baseOf(k).preco > 0 ? v.q : 0), 0);
      $("#labelBase").textContent = `Bases especiais${nEsp > 1 ? " (" + nEsp + ")" : ""}`;
      $("#sumBase").textContent = BRL(base);
    } else {
      lineBase.hidden = true;
    }

    const frete = selectedShip ? selectedShip.preco : null;
    $("#sumFrete").textContent = frete === null ? "—" : frete === 0 ? "Grátis" : BRL(frete);
    $("#sumTotal").textContent = BRL(sub + base + (frete || 0));
  }

  function bump() {
    $("#cartBtn").animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.18)" }, { transform: "scale(1)" }],
      { duration: 320, easing: "ease" });
  }

  /* =================================================================
     FRETE (origem: Curitiba/PR)
     ================================================================= */
  function zoneFromCep(cep) {
    const d = onlyDigits(cep).charAt(0);
    const map = { "8": 1, "0": 2, "1": 2, "9": 2, "2": 3, "3": 3, "7": 3, "4": 4, "5": 4, "6": 5 };
    return map[d] || 3;
  }

  async function lookupCep(cep) {
    const digits = onlyDigits(cep);
    if (digits.length !== 8) return null;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const j = await r.json();
      return j.erro ? null : { cidade: j.localidade, uf: j.uf };
    } catch { return null; }
  }

  function quotesForCep(cep, qty) {
    const i = zoneFromCep(cep) - 1;
    const sub = subtotal();
    const q = Math.max(qty, 1);
    const list = CONFIG.transportadoras.map((t) => {
      let preco = t.base[i] + t.extra * (q - 1);
      let gratis = false;
      if (t.id === "correios-pac" && sub >= CONFIG.freteGratisAcima) { preco = 0; gratis = true; }
      return { id: t.id, nome: t.nome, obs: t.obs, preco, gratis, prazo: t.prazo[i] };
    });
    list.push({ id: "retirada", nome: "Retirada no ateliê", obs: "Grátis", preco: 0, gratis: true, prazo: "combinar" });
    return list.sort((a, b) => a.preco - b.preco);
  }

  async function calcFreteSection() {
    const cep = $("#freteCep").value;
    if (onlyDigits(cep).length !== 8) {
      $("#freteResults").innerHTML = `<p class="frete-placeholder">CEP incompleto — digite os 8 números.</p>`;
      return;
    }
    $("#freteResults").innerHTML = `<p class="frete-placeholder">Calculando…</p>`;
    const loc = await lookupCep(cep);
    $("#freteLocal").textContent = loc ? `📍 ${loc.cidade} — ${loc.uf}` : "";
    const q = Math.max(cartCount(), 1);
    const quotes = quotesForCep(cep, q);
    $("#freteResults").innerHTML = `
      <div class="ship-list">
        ${quotes.map((s) => `
          <div class="ship-row">
            <div>
              <span class="ship-name">${s.nome}</span><span class="ship-tag">${s.obs}</span>
              <div class="ship-meta">Prazo estimado: ${s.prazo}${s.prazo === "combinar" ? "" : " dias úteis"}</div>
            </div>
            <span class="ship-price ${s.gratis ? "ship-free" : ""}">${s.preco === 0 ? "Grátis" : BRL(s.preco)}</span>
          </div>`).join("")}
      </div>
      <p class="frete-note">Cálculo para ${q} ${q > 1 ? "peças" : "peça"} no carrinho.</p>`;
  }

  async function calcCartShip() {
    const cep = $("#cartCep").value;
    if (onlyDigits(cep).length !== 8) { toast("Digite um CEP válido (8 números)."); return; }
    shipCep = maskCep(cep);
    $("#cartShipOptions").innerHTML = `<p class="frete-placeholder">Calculando…</p>`;
    await lookupCep(cep);
    const q = Math.max(cartCount(), 1);
    const quotes = quotesForCep(cep, q);
    selectedShip = { id: quotes[0].id, nome: quotes[0].nome, preco: quotes[0].preco };
    $("#cartShipOptions").innerHTML = quotes.map((s, idx) => `
      <label class="ship-opt ${idx === 0 ? "selected" : ""}">
        <input type="radio" name="ship" value="${s.id}" ${idx === 0 ? "checked" : ""}
          data-price="${s.preco}" data-name="${s.nome}">
        <span><span class="so-name">${s.nome}</span>
          <span class="so-meta"> · ${s.prazo === "combinar" ? "a combinar" : s.prazo + " dias"}</span></span>
        <span class="so-price">${s.preco === 0 ? "Grátis" : BRL(s.preco)}</span>
      </label>`).join("");
    updateTotals();
  }

  /* =================================================================
     CHECKOUT — INFINITEPAY  /  WHATSAPP
     ================================================================= */
  function buildOrderItems() {
    const items = [];
    Object.entries(cart).forEach(([key, v]) => {
      const { id, variant } = parseKey(key);
      const p = product(id);
      const base = baseOf(key);
      const nome = p.suporte
        ? `${p.nome} (suporte avulso · encomenda)`
        : `${p.nome}${variant ? " · " + variant : ""} (base: ${base.nome})`;
      items.push({ name: nome, price: Math.round(precoDaVariante(p, variant) * 100), quantity: v.q });
      // base especial desta peça (com custo) — uma por unidade
      if (!p.suporte && base.preco > 0)
        items.push({ name: `Base especial — ${base.nome} p/ ${p.nome} (encomenda)`, price: Math.round(base.preco * 100), quantity: v.q });
    });
    if (selectedShip && selectedShip.preco > 0)
      items.push({ name: `Frete — ${selectedShip.nome}`, price: Math.round(selectedShip.preco * 100), quantity: 1 });
    return items;
  }

  function checkout() {
    if (cartCount() === 0) return;
    if (!selectedShip) { toast("Calcule o frete pelo seu CEP antes de finalizar."); $("#cartCep").focus(); return; }
    const handle = CONFIG.infinitePayHandle;
    if (!handle || handle === "SEU_USUARIO_INFINITEPAY") {
      alert("⚙️ O checkout do InfinitePay ainda não foi configurado (js/config.js). Você pode finalizar pelo WhatsApp.");
      return;
    }
    const items = buildOrderItems();
    const nsu = "NAGORI" + Date.now();
    const redirect = encodeURIComponent(window.location.origin + window.location.pathname);
    const url = `https://checkout.infinitepay.io/${encodeURIComponent(handle)}` +
      `?items=${encodeURIComponent(JSON.stringify(items))}&order_nsu=${nsu}&redirect_url=${redirect}`;
    window.location.href = url;
  }

  function whatsappOrder() {
    if (cartCount() === 0) return;
    let msg = "*Novo pedido — Atelier Nagori* 🌿%0A%0A";
    Object.entries(cart).forEach(([key, v]) => {
      const { id, variant } = parseKey(key);
      const p = product(id);
      const base = baseOf(key);
      msg += `• ${v.q}× ${p.nome}${variant ? " (" + variant + ")" : ""} — ${BRL(precoDaVariante(p, variant) * v.q)}%0A`;
      if (p.suporte) msg += `   (suporte avulso · encomenda)%0A`;
      else msg += `   base: ${base.nome}${base.preco > 0 ? " (+" + BRL(base.preco) + (v.q > 1 ? " × " + v.q : "") + ", encomenda)" : " (inclusa)"}%0A`;
    });
    const base = baseCusto();
    msg += `%0A*Subtotal:* ${BRL(subtotal())}%0A`;
    if (base > 0) msg += `*Bases especiais:* ${BRL(base)}%0A`;
    if (selectedShip) {
      msg += `*Frete (${selectedShip.nome}):* ${selectedShip.preco === 0 ? "Grátis" : BRL(selectedShip.preco)}%0A`;
      msg += `*Total:* ${BRL(subtotal() + base + selectedShip.preco)}%0A`;
    }
    if (shipCep) msg += `*CEP de entrega:* ${shipCep}%0A`;
    msg += `%0AGostaria de finalizar este pedido. 😊`;
    window.open(`${waBase()}?text=${msg}`, "_blank");
  }

  function encomendar(id) {
    const p = product(id);
    const msg = `Olá! Tenho interesse na peça *${p.nome}* (${p.especie}) — ${BRL(menorPreco(p))}.` +
      `%0AGostaria de saber sobre encomenda, prazo e entrega. 🌿`;
    window.open(`${waBase()}?text=${msg}`, "_blank");
  }

  /* =================================================================
     CONTATO
     ================================================================= */
  function submitContact(e) {
    e.preventDefault();
    const nome = $("#cNome").value.trim(), email = $("#cEmail").value.trim();
    const tel = $("#cTel").value.trim(), msg = $("#cMsg").value.trim();
    if (!nome || !email || !msg) return;
    const wa = `*Contato pelo site — Atelier Nagori*%0A%0A*Nome:* ${nome}%0A*E-mail:* ${email}%0A` +
      (tel ? `*WhatsApp:* ${tel}%0A` : "") + `%0A${encodeURIComponent(msg)}`;
    window.open(`${waBase()}?text=${wa}`, "_blank");
    const subject = encodeURIComponent("Contato pelo site — " + nome);
    const body = encodeURIComponent(`Nome: ${nome}\nE-mail: ${email}\n${tel ? "WhatsApp: " + tel + "\n" : ""}\n${msg}`);
    if ($("#mailLink")) $("#mailLink").href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
    $("#contactHint").textContent = "Abrindo o WhatsApp para enviar sua mensagem… 🌿";
    e.target.reset();
  }

  /* =================================================================
     DRAWER / OVERLAYS / TOAST / SPLASH
     ================================================================= */
  const openCart = () => { $("#cartDrawer").classList.add("open"); $("#drawerOverlay").classList.add("open"); $("#cartDrawer").setAttribute("aria-hidden", "false"); };
  const closeCart = () => { $("#cartDrawer").classList.remove("open"); $("#drawerOverlay").classList.remove("open"); $("#cartDrawer").setAttribute("aria-hidden", "true"); };

  let toastT;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2400);
  }

  function initSplash() {
    const splash = $("#splash");
    if (!splash) return;
    document.body.classList.add("splash-open");
    const enter = () => {
      splash.classList.add("hide");
      document.body.classList.remove("splash-open");
      setTimeout(() => (splash.style.display = "none"), 500);
    };
    $("#enterSite").addEventListener("click", enter);
    $(".splash-wa").addEventListener("click", () => setTimeout(enter, 400));
  }

  /* =================================================================
     EVENTOS
     ================================================================= */
  function bindEvents() {
    document.addEventListener("click", (e) => {
      const add = e.target.closest("[data-add]");
      const open = e.target.closest("[data-open]");
      const enc = e.target.closest("[data-encomenda]");
      const inc = e.target.closest("[data-inc]");
      const dec = e.target.closest("[data-dec]");
      const rm = e.target.closest("[data-rm]");
      const vb = e.target.closest(".vbtn");
      const mt = e.target.closest(".mthumb");

      if (mt) { $("#modalMainImg").src = mt.dataset.src; $$(".mthumb").forEach((b) => b.classList.remove("active")); mt.classList.add("active"); return; }
      if (enc) { e.preventDefault(); encomendar(enc.dataset.encomenda); }
      else if (add) { addToCart(add.dataset.add, modalContext(add)); if ($("#productModal").classList.contains("open")) closeModal(); openCart(); }
      else if (vb) selectVariant(vb);
      else if (open) openModal(open.dataset.open);
      else if (inc) setQty(inc.dataset.inc, (cart[inc.dataset.inc] || 0) + 1);
      else if (dec) setQty(dec.dataset.dec, (cart[dec.dataset.dec] || 0) - 1);
      else if (rm) setQty(rm.dataset.rm, 0);
      else if (e.target.closest(".modal-close")) closeModal();
    });

    $("#cartBtn").addEventListener("click", openCart);
    $("#cartClose").addEventListener("click", closeCart);
    $("#drawerOverlay").addEventListener("click", closeCart);
    $("#modalOverlay").addEventListener("click", (e) => { if (e.target === $("#modalOverlay")) closeModal(); });
    $("#cartEmptyBtn").addEventListener("click", () => { closeCart(); location.hash = "#produtos"; });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeCart(); closeModal(); } });

    ["#freteCep", "#cartCep"].forEach((sel) => {
      const el = $(sel);
      el.addEventListener("input", () => { el.value = maskCep(el.value); });
    });
    $("#freteCalc").addEventListener("click", calcFreteSection);
    $("#freteCep").addEventListener("keydown", (e) => { if (e.key === "Enter") calcFreteSection(); });
    $("#cartShipCalc").addEventListener("click", calcCartShip);
    $("#cartCep").addEventListener("keydown", (e) => { if (e.key === "Enter") calcCartShip(); });

    $("#cartShipOptions").addEventListener("change", (e) => {
      const r = e.target.closest('input[name="ship"]');
      if (!r) return;
      $$(".ship-opt").forEach((l) => l.classList.remove("selected"));
      r.closest(".ship-opt").classList.add("selected");
      selectedShip = { id: r.value, nome: r.dataset.name, preco: parseFloat(r.dataset.price) };
      updateTotals();
    });

    // base escolhida por peça (dentro de cada item do carrinho)
    $("#cartItems").addEventListener("change", (e) => {
      const s = e.target.closest(".ci-base");
      if (s) setBase(s.dataset.baseKey, parseInt(s.value, 10));
    });
    $("#checkoutBtn").addEventListener("click", checkout);
    $("#waOrderBtn").addEventListener("click", whatsappOrder);
    $("#contactForm").addEventListener("submit", submitContact);
  }

  // variante ativa no modal (para o botão Adicionar dentro do modal)
  function modalContext(addBtn) {
    if ($("#productModal").contains(addBtn) && modalVariant !== null) return modalVariant;
    return undefined;
  }
  function selectVariant(btn) {
    const p = product(modalProductId);
    modalVariant = btn.dataset.v;
    $$(".vbtn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    if (p) $("#modalPrice").textContent = BRL(precoDaVariante(p, modalVariant));
  }

  /* =================================================================
     INIT
     ================================================================= */
  document.addEventListener("DOMContentLoaded", () => {
    applyConfig();
    initSplash();
    renderFilters();
    renderGrid();
    renderSuportes();
    renderCart();
    bindEvents();
  });
})();
