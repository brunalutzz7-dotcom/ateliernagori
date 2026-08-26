/* =====================================================================
   ATELIER NAGORI — LÓGICA DA LOJA
   ===================================================================== */
(function () {
  "use strict";

  // O site sempre abre no topo (evita o navegador restaurar a rolagem anterior)
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

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
    if (p.suporte) return ""; // suportes não têm ambiente/pet
    const pet = petInfo(p.pet);
    return `<span class="tag tag-amb">${AMBIENTE[p.ambiente]}</span>
            <span class="tag ${pet.cls}">${pet.ico} ${pet.txt}</span>`;
  };

  const product = (id) => PRODUCTS.find((p) => p.id === id);
  const catNome = (id) => (CATEGORIAS.find((c) => c.id === id) || {}).nome || id;

  /* ---------- carrinho: estado ----------
     cada linha do carrinho: cart[key] = { q: quantidade, b: índice da base }
     assim cada peça tem a SUA própria base (ou a base dupla, à escolha).   */
  const STORE_KEY = "nagori_cart_v5";
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
  const baseThumb = (b) => `assets/bases/${b.imgId || b.id}.jpg`;
  const cartCount = () => Object.values(cart).reduce((a, v) => a + v.q, 0);
  const subtotal = () => Object.entries(cart).reduce((a, [k, v]) => a + keyPreco(k) * v.q, 0);
  const baseCusto = () => Object.entries(cart).reduce((a, [k, v]) => a + baseOf(k).preco * v.q, 0);

  // Peso estimado (kg) de cada peça — usado no cálculo de frete.
  // Se o produto tiver "peso" definido em products.js, usa ele; senão estima
  // pela categoria (bonsais e raridades são mais pesados; grande porte bem mais).
  const pesoDe = (p) => {
    if (!p) return 1.8;
    if (p.peso != null) return p.peso;
    const porCat = { bonsai: 3.5, raridade: 3.5, grande: 6, arlivre: 2.5, suporte: 1.2 };
    return porCat[p.categoria] || 1.8;
  };
  // Peso total do carrinho (kg), somando peça × quantidade.
  const cartWeight = () => Object.entries(cart).reduce((a, [k, v]) => {
    const { id } = parseKey(k);
    return a + pesoDe(product(id)) * v.q;
  }, 0);

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
    // "Todos" mostra as plantas; os suportes aparecem na própria categoria.
    const list = cat === "todos"
      ? PRODUCTS.filter((p) => p.categoria !== "suporte")
      : PRODUCTS.filter((p) => p.categoria === cat);
    $("#productGrid").innerHTML = list.map(cardHTML).join("");
  }

  /* =================================================================
     MODAL DE PRODUTO
     ================================================================= */
  let modalVariant = null;
  let modalProductId = null;
  let modalGallery = [];
  let modalGalIdx = 0;

  function showGalImage(i) {
    const n = modalGallery.length;
    if (!n) return;
    modalGalIdx = (i + n) % n;
    const img = $("#modalMainImg");
    if (img) img.src = modalGallery[modalGalIdx];
    if ($("#galIdx")) $("#galIdx").textContent = modalGalIdx + 1;
    $$(".mthumb").forEach((b, j) => b.classList.toggle("active", j === modalGalIdx));
  }

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
    modalGallery = gal;
    modalGalIdx = 0;
    const multi = gal.length > 1;
    const galeriaHTML = gal.length
      ? `<div class="modal-gallery">
           <img id="modalMainImg" src="${gal[0]}" alt="${p.nome}">
           ${multi ? `
             <button class="gal-nav gal-prev" data-gal="-1" aria-label="Foto anterior">‹</button>
             <button class="gal-nav gal-next" data-gal="1" aria-label="Próxima foto">›</button>
             <span class="gal-count"><b id="galIdx">1</b> / ${gal.length}</span>` : ""}
         </div>
         ${multi
           ? `<div class="modal-thumbs">${gal.map((src, i) =>
               `<button class="mthumb ${i === 0 ? "active" : ""}" data-thumb="${i}">
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
          ${p.suporte ? "" : `<p class="modal-base">A base é vendida à parte — escolha a sua na categoria <a href="#produtos" data-cat-link="suporte">Suportes</a>.</p>`}
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
      return `
        <div class="cart-item">
          <div class="ci-media">${media(p)}</div>
          <div class="ci-info">
            <h4>${p.nome}</h4>
            ${variant ? `<div class="ci-var">${variant}</div>` : ""}
            ${p.suporte ? `<div class="ci-var">Suporte</div>` : ""}
            <div class="ci-price">${BRL(unit)}</div>
            <div class="qty">
              <button data-dec="${key}" aria-label="Diminuir">−</button>
              <span>${v.q}</span>
              <button data-inc="${key}" aria-label="Aumentar">+</button>
            </div>
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

    const lineBase = $("#lineBase");
    if (lineBase) lineBase.hidden = true; // bases agora são itens normais do carrinho

    const frete = selectedShip ? selectedShip.preco : null;
    $("#sumFrete").textContent = frete === null ? "—" : frete === 0 ? "Grátis" : BRL(frete);
    $("#sumTotal").textContent = BRL(sub + (frete || 0));
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
      return j.erro ? null : { cidade: j.localidade, uf: j.uf, rua: j.logradouro, bairro: j.bairro };
    } catch { return null; }
  }

  // preenche os campos de endereço com o retorno do CEP (sem sobrescrever o que o cliente já digitou)
  function fillAddress(loc) {
    if (!loc) return;
    const set = (id, val) => { const el = $(id); if (el && !el.value && val) el.value = val; };
    set("#adCidade", loc.cidade); set("#adUf", loc.uf);
    set("#adRua", loc.rua); set("#adBairro", loc.bairro);
  }

  // totalKg = peso total do carrinho (kg). O preço "base" cobre até "pesoBase"
  // kg; cada kg extra (arredondado p/ cima) soma o "porKg" da transportadora.
  function quotesForCep(cep, totalKg) {
    const i = zoneFromCep(cep) - 1;
    const sub = subtotal();
    const acr = CONFIG.acrescimoFrete || 0;
    const pesoBase = CONFIG.pesoBase || 2;
    const kg = Math.max(totalKg || 0, 0.1);
    const extraKg = Math.max(0, Math.ceil(kg - pesoBase));
    const list = CONFIG.transportadoras.map((t) => {
      let preco = t.base[i] + (t.porKg || 0) * extraKg;
      let gratis = false;
      if (t.id === "correios-pac" && sub >= CONFIG.freteGratisAcima) { preco = 0; gratis = true; }
      else preco += acr; // acréscimo por transportadora (embalagem/manuseio)
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
    // Se houver carrinho, usa o peso real; senão estima uma peça média (1,8 kg).
    const kg = cartCount() ? cartWeight() : 1.8;
    const quotes = quotesForCep(cep, kg);
    const q = cartCount();
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
      <p class="frete-note">${q ? `Cálculo para ${q} ${q > 1 ? "peças" : "peça"} (~${kg.toFixed(1).replace(".", ",")} kg) no carrinho.` : "Estimativa para uma peça média (~1,8 kg). Adicione itens ao carrinho para o cálculo exato."}</p>`;
  }

  async function calcCartShip() {
    const cep = $("#cartCep").value;
    if (onlyDigits(cep).length !== 8) { toast("Digite um CEP válido (8 números)."); return; }
    shipCep = maskCep(cep);
    $("#cartShipOptions").innerHTML = `<p class="frete-placeholder">Calculando…</p>`;
    fillAddress(await lookupCep(cep));
    const quotes = quotesForCep(cep, cartWeight());
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
      const nome = p.suporte
        ? `${p.nome} (suporte)`
        : `${p.nome}${variant ? " · " + variant : ""}`;
      items.push({ name: nome, price: Math.round(precoDaVariante(p, variant) * 100), quantity: v.q });
    });
    if (selectedShip && selectedShip.preco > 0)
      items.push({ name: `Frete — ${selectedShip.nome}`, price: Math.round(selectedShip.preco * 100), quantity: 1 });
    return items;
  }

  /* ---------- endereço de entrega ---------- */
  function endereco() {
    return {
      nome: $("#adNome").value.trim(),
      tel: $("#adTel").value.trim(),
      rua: $("#adRua").value.trim(),
      num: $("#adNum").value.trim(),
      compl: $("#adCompl").value.trim(),
      bairro: $("#adBairro").value.trim(),
      cidade: $("#adCidade").value.trim(),
      uf: $("#adUf").value.trim().toUpperCase(),
      cep: shipCep || maskCep($("#cartCep").value),
    };
  }
  const enderecoValido = (e) => e.nome && e.tel && e.rua && e.num && e.bairro && e.cidade && e.uf && onlyDigits(e.cep).length === 8;
  const enderecoLinha = (e) => `${e.rua}, ${e.num}${e.compl ? " - " + e.compl : ""} - ${e.bairro} - ${e.cidade}/${e.uf} - CEP ${e.cep}`;

  function itensTexto() {
    let t = "";
    Object.entries(cart).forEach(([key, v]) => {
      const { id, variant } = parseKey(key);
      const p = product(id);
      t += `• ${v.q}x ${p.nome}${variant ? " (" + variant + ")" : ""}${p.suporte ? " [suporte]" : ""} — ${BRL(precoDaVariante(p, variant) * v.q)}`;
      t += "\n";
    });
    return t;
  }
  const totalPedido = () => subtotal() + (selectedShip ? selectedShip.preco : 0);

  // envia o pedido por e-mail (Web3Forms). Retorna true se enviou.
  async function sendOrderEmail(e, pagamento) {
    const key = CONFIG.web3formsKey;
    if (!key) return false; // e-mail ainda não configurado
    const payload = {
      access_key: key,
      subject: "🌿 Novo pedido — Atelier Nagori",
      from_name: "Site Atelier Nagori",
      Cliente: e.nome,
      WhatsApp: e.tel,
      Endereço: enderecoLinha(e),
      Itens: itensTexto(),
      Subtotal: BRL(subtotal()),
      Frete: selectedShip ? (selectedShip.preco === 0 ? "Grátis" : BRL(selectedShip.preco)) + " · " + selectedShip.nome : "—",
      Total: BRL(totalPedido()),
      Pagamento: pagamento,
    };
    try {
      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      return !!j.success;
    } catch { return false; }
  }

  async function checkout() {
    if (cartCount() === 0) return;
    if (!selectedShip) { toast("Calcule o frete pelo seu CEP antes de finalizar."); $("#cartCep").focus(); return; }
    const e = endereco();
    if (!enderecoValido(e)) { toast("Preencha seus dados de entrega para continuar."); $("#adNome").focus(); return; }
    const handle = CONFIG.infinitePayHandle;
    if (!handle || handle === "SEU_USUARIO_INFINITEPAY") {
      alert("⚙️ O checkout do InfinitePay ainda não foi configurado (js/config.js).");
      return;
    }
    const btn = $("#checkoutBtn");
    const prev = btn.textContent;
    btn.disabled = true; btn.textContent = "Enviando pedido…";
    await sendOrderEmail(e, "InfinitePay (cartão/Pix)");
    btn.disabled = false; btn.textContent = prev;

    const items = buildOrderItems();
    const nsu = "NAGORI" + Date.now();
    const redirect = encodeURIComponent(window.location.origin + window.location.pathname);
    const url = `https://checkout.infinitepay.io/${encodeURIComponent(handle)}` +
      `?items=${encodeURIComponent(JSON.stringify(items))}&order_nsu=${nsu}&redirect_url=${redirect}`;
    window.location.href = url;
  }

  // monta a URL do WhatsApp com o resumo do pedido
  function orderWhatsappUrl(nota) {
    let msg = "*Novo pedido — Atelier Nagori* 🌿%0A%0A";
    Object.entries(cart).forEach(([key, v]) => {
      const { id, variant } = parseKey(key);
      const p = product(id);
      msg += `• ${v.q}× ${p.nome}${variant ? " (" + variant + ")" : ""}${p.suporte ? " (suporte)" : ""} — ${BRL(precoDaVariante(p, variant) * v.q)}%0A`;
    });
    msg += `%0A*Subtotal:* ${BRL(subtotal())}%0A`;
    if (selectedShip) {
      msg += `*Frete (${selectedShip.nome}):* ${selectedShip.preco === 0 ? "Grátis" : BRL(selectedShip.preco)}%0A`;
      msg += `*Total:* ${BRL(subtotal() + selectedShip.preco)}%0A`;
    }
    const e = endereco();
    if (e.nome) msg += `%0A*Cliente:* ${encodeURIComponent(e.nome)}%0A`;
    if (e.tel) msg += `*WhatsApp:* ${encodeURIComponent(e.tel)}%0A`;
    if (e.rua) msg += `*Endereço:* ${encodeURIComponent(enderecoLinha(e))}%0A`;
    else if (shipCep) msg += `*CEP de entrega:* ${shipCep}%0A`;
    msg += `%0A${nota || "Gostaria de finalizar este pedido. 😊"}`;
    return `${waBase()}?text=${msg}`;
  }

  function whatsappOrder() {
    if (cartCount() === 0) return;
    // dispara o e-mail também (sem travar a abertura do WhatsApp)
    const e = endereco();
    if (enderecoValido(e)) sendOrderEmail(e, "Pedido pelo WhatsApp");
    window.open(orderWhatsappUrl(), "_blank");
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
      window.scrollTo(0, 0);
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
      const gn = e.target.closest(".gal-nav");

      if (gn) { showGalImage(modalGalIdx + parseInt(gn.dataset.gal, 10)); return; }
      if (mt) { showGalImage(parseInt(mt.dataset.thumb, 10)); return; }
      if (enc) { e.preventDefault(); encomendar(enc.dataset.encomenda); }
      else if (add) { addToCart(add.dataset.add, modalContext(add)); if ($("#productModal").classList.contains("open")) closeModal(); openCart(); }
      else if (vb) selectVariant(vb);
      else if (open) openModal(open.dataset.open);
      else if (inc) setQty(inc.dataset.inc, (cart[inc.dataset.inc] || 0) + 1);
      else if (dec) setQty(dec.dataset.dec, (cart[dec.dataset.dec] || 0) - 1);
      else if (rm) setQty(rm.dataset.rm, 0);
      else if (e.target.closest(".modal-close")) closeModal();
    });

    // menu (celular)
    const navToggle = $("#navToggle");
    const mainNav = $("#mainNav");
    const closeNav = () => { mainNav.classList.remove("open"); navToggle.setAttribute("aria-expanded", "false"); };
    if (navToggle && mainNav) {
      navToggle.addEventListener("click", () => {
        const open = mainNav.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      mainNav.addEventListener("click", (e) => { if (e.target.closest("a")) closeNav(); });
    }

    $("#cartBtn").addEventListener("click", openCart);
    $("#cartClose").addEventListener("click", closeCart);
    $("#drawerOverlay").addEventListener("click", closeCart);
    $("#modalOverlay").addEventListener("click", (e) => { if (e.target === $("#modalOverlay")) closeModal(); });
    $("#cartEmptyBtn").addEventListener("click", () => { closeCart(); location.hash = "#produtos"; });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeCart(); closeModal(); closeNav(); }
      if ($("#productModal").classList.contains("open") && modalGallery.length > 1) {
        if (e.key === "ArrowRight") showGalImage(modalGalIdx + 1);
        if (e.key === "ArrowLeft") showGalImage(modalGalIdx - 1);
      }
    });

    // swipe entre fotos no celular
    let touchX = null;
    $("#productModal").addEventListener("touchstart", (e) => {
      touchX = e.target.closest(".modal-gallery") ? e.changedTouches[0].clientX : null;
    }, { passive: true });
    $("#productModal").addEventListener("touchend", (e) => {
      if (touchX === null || modalGallery.length < 2) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) showGalImage(modalGalIdx + (dx < 0 ? 1 : -1));
      touchX = null;
    }, { passive: true });

    ["#freteCep", "#cartCep"].forEach((sel) => {
      const el = $(sel);
      el.addEventListener("input", () => { el.value = maskCep(el.value); });
    });
    $("#freteCalc").addEventListener("click", calcFreteSection);
    $("#freteCep").addEventListener("keydown", (e) => { if (e.key === "Enter") calcFreteSection(); });
    $("#cartShipCalc").addEventListener("click", calcCartShip);
    $("#cartCep").addEventListener("keydown", (e) => { if (e.key === "Enter") calcCartShip(); });
    $("#cartCep").addEventListener("blur", async () => {
      if (onlyDigits($("#cartCep").value).length === 8) fillAddress(await lookupCep($("#cartCep").value));
    });

    $("#cartShipOptions").addEventListener("change", (e) => {
      const r = e.target.closest('input[name="ship"]');
      if (!r) return;
      $$(".ship-opt").forEach((l) => l.classList.remove("selected"));
      r.closest(".ship-opt").classList.add("selected");
      selectedShip = { id: r.value, nome: r.dataset.name, preco: parseFloat(r.dataset.price) };
      updateTotals();
    });

    // link "Suportes" dentro do modal → ativa o filtro da categoria
    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-cat-link]");
      if (!link) return;
      e.preventDefault();
      closeModal();
      const chip = $(`.chip[data-cat="${link.dataset.catLink}"]`);
      if (chip) chip.click();
      $("#produtos").scrollIntoView({ behavior: "smooth" });
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
    renderCart();
    bindEvents();
  });
})();
