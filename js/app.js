/* =====================================================================
   ATELIER NAGORI — LÓGICA DA LOJA
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- utilidades ---------- */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const BRL = (n) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const onlyDigits = (s) => (s || "").replace(/\D/g, "");
  const maskCep = (v) => {
    const d = onlyDigits(v).slice(0, 8);
    return d.length > 5 ? d.slice(0, 5) + "-" + d.slice(5) : d;
  };

  /* ---------- estado ---------- */
  const STORE_KEY = "nagori_cart_v1";
  let cart = load();
  let selectedShip = null;   // { id, nome, preco }
  let shipCep = "";

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch { return {}; }
  }
  function save() { localStorage.setItem(STORE_KEY, JSON.stringify(cart)); }
  const product = (id) => PRODUCTS.find((p) => p.id === id);
  const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = () =>
    Object.entries(cart).reduce((a, [id, q]) => a + (product(id)?.preco || 0) * q, 0);

  /* =================================================================
     CONFIG → DOM
     ================================================================= */
  function applyConfig() {
    $("#year").textContent = new Date().getFullYear();
    $("#freteGratisLabel").textContent = BRL(CONFIG.freteGratisAcima);
    const waBase = `https://wa.me/${onlyDigits(CONFIG.whatsapp)}`;
    $("#waLink").href = waBase;
    $("#waLink").textContent = "WhatsApp";
    $("#mailLink").href = `mailto:${CONFIG.email}`;
    $("#mailLink").textContent = CONFIG.email;
    $("#igLink").href = `https://instagram.com/${CONFIG.instagram}`;
    $("#igLink").textContent = "@" + CONFIG.instagram;
  }

  /* =================================================================
     PRODUTOS
     ================================================================= */
  const media = (p) =>
    p.img ? `<img src="${p.img}" alt="${p.nome}" loading="lazy">` : p.art;

  function renderFilters() {
    const cats = ["Todos", ...new Set(PRODUCTS.map((p) => p.categoria))];
    const box = $("#filters");
    box.innerHTML = cats
      .map((c, i) => `<button class="chip ${i === 0 ? "active" : ""}" data-cat="${c}">${c}</button>`)
      .join("");
    box.addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      $$(".chip", box).forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      renderGrid(b.dataset.cat);
    });
  }

  function renderGrid(cat = "Todos") {
    const list = cat === "Todos" ? PRODUCTS : PRODUCTS.filter((p) => p.categoria === cat);
    $("#productGrid").innerHTML = list
      .map(
        (p) => `
      <article class="card">
        <div class="card-media" data-open="${p.id}">
          <span class="card-cat">${p.categoria}</span>
          ${media(p)}
        </div>
        <div class="card-body">
          <h3>${p.nome}</h3>
          <p class="card-desc">${p.descricao}</p>
          <div class="card-foot">
            <span class="card-price">${BRL(p.preco)}</span>
            <button class="btn btn-primary btn-sm" data-add="${p.id}">Adicionar</button>
          </div>
        </div>
      </article>`
      )
      .join("");
  }

  /* =================================================================
     MODAL DE PRODUTO
     ================================================================= */
  function openModal(id) {
    const p = product(id);
    if (!p) return;
    $("#productModal").innerHTML = `
      <div class="modal-inner">
        <div class="modal-media">${media(p)}</div>
        <div class="modal-info">
          <button class="modal-close" aria-label="Fechar">×</button>
          <span class="modal-cat">${p.categoria}</span>
          <h3>${p.nome}</h3>
          <div class="modal-price">${BRL(p.preco)}</div>
          <p>${p.descricao}</p>
          <div class="modal-care"><strong>Cuidados</strong>${p.cuidados}</div>
          <button class="btn btn-primary btn-block" data-add="${p.id}">Adicionar ao carrinho</button>
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
  function addToCart(id, qty = 1) {
    cart[id] = (cart[id] || 0) + qty;
    save();
    renderCart();
    toast(`${product(id).nome} adicionado ✓`);
    bump();
  }
  function setQty(id, qty) {
    if (qty <= 0) delete cart[id];
    else cart[id] = qty;
    save();
    renderCart();
  }

  function renderCart() {
    const count = cartCount();
    $("#cartCount").textContent = count;
    $("#cartCount").style.display = count ? "grid" : "none";
    const drawer = $("#cartDrawer");
    drawer.classList.toggle("empty", count === 0);

    $("#cartItems").innerHTML = Object.entries(cart)
      .map(([id, q]) => {
        const p = product(id);
        if (!p) return "";
        return `
        <div class="cart-item">
          <div class="ci-media">${media(p)}</div>
          <div>
            <h4>${p.nome}</h4>
            <div class="ci-price">${BRL(p.preco)}</div>
            <div class="qty">
              <button data-dec="${id}" aria-label="Diminuir">−</button>
              <span>${q}</span>
              <button data-inc="${id}" aria-label="Aumentar">+</button>
            </div>
          </div>
          <div class="ci-right">
            <div class="ci-line">${BRL(p.preco * q)}</div>
            <button class="ci-remove" data-rm="${id}">remover</button>
          </div>
        </div>`;
      })
      .join("");

    updateTotals();
  }

  function updateTotals() {
    const sub = subtotal();
    $("#sumSubtotal").textContent = BRL(sub);

    // frete grátis anula a seleção paga do PAC quando aplicável
    let frete = null;
    if (selectedShip) frete = selectedShip.preco;
    $("#sumFrete").textContent =
      frete === null ? "—" : frete === 0 ? "Grátis" : BRL(frete);
    $("#sumTotal").textContent = BRL(sub + (frete || 0));
  }

  function bump() {
    const b = $("#cartBtn");
    b.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.18)" }, { transform: "scale(1)" }],
      { duration: 320, easing: "ease" }
    );
  }

  /* =================================================================
     FRETE
     ================================================================= */
  // zona 1..5 a partir do CEP (origem São Paulo/SP)
  function zoneFromCep(cep) {
    const d = onlyDigits(cep).charAt(0);
    const map = { "0": 1, "1": 1, "2": 2, "3": 2, "8": 2, "4": 3, "7": 3, "9": 3, "5": 4, "6": 5 };
    return map[d] || 3;
  }

  // busca cidade/UF no ViaCEP (com fallback silencioso)
  async function lookupCep(cep) {
    const digits = onlyDigits(cep);
    if (digits.length !== 8) return null;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const j = await r.json();
      if (j.erro) return null;
      return { cidade: j.localidade, uf: j.uf };
    } catch { return null; }
  }

  function quotesForCep(cep, qty) {
    const zone = zoneFromCep(cep);
    const i = zone - 1;
    const sub = subtotal();
    const q = Math.max(qty, 1);
    const list = CONFIG.transportadoras.map((t) => {
      let preco = t.base[i] + t.extra * (q - 1);
      let gratis = false;
      if (t.id === "correios-pac" && sub >= CONFIG.freteGratisAcima) {
        preco = 0; gratis = true;
      }
      return {
        id: t.id, nome: t.nome, obs: t.obs, preco, gratis,
        prazo: t.prazo[i],
      };
    });
    // opção de retirada local (grátis)
    list.push({
      id: "retirada", nome: "Retirada no ateliê", obs: "Grátis",
      preco: 0, gratis: true, prazo: "combinar",
    });
    return list.sort((a, b) => a.preco - b.preco);
  }

  // --- calculadora da seção Frete ---
  async function calcFreteSection() {
    const cep = $("#freteCep").value;
    if (onlyDigits(cep).length !== 8) {
      $("#freteResults").innerHTML =
        `<p class="frete-placeholder">CEP incompleto — digite os 8 números.</p>`;
      return;
    }
    $("#freteResults").innerHTML = `<p class="frete-placeholder">Calculando…</p>`;
    const loc = await lookupCep(cep);
    $("#freteLocal").textContent = loc ? `📍 ${loc.cidade} — ${loc.uf}` : "";
    const q = Math.max(cartCount(), 1);
    const quotes = quotesForCep(cep, q);
    $("#freteResults").innerHTML = `
      <div class="ship-list">
        ${quotes
          .map(
            (s) => `
          <div class="ship-row">
            <div>
              <span class="ship-name">${s.nome}</span><span class="ship-tag">${s.obs}</span>
              <div class="ship-meta">Prazo estimado: ${s.prazo} ${s.prazo === "combinar" ? "" : "dias úteis"}</div>
            </div>
            <span class="ship-price ${s.gratis ? "ship-free" : ""}">${s.preco === 0 ? "Grátis" : BRL(s.preco)}</span>
          </div>`
          )
          .join("")}
      </div>
      <p class="frete-note">Cálculo para ${q} ${q > 1 ? "kokedamas" : "kokedama"} no carrinho.</p>`;
  }

  // --- calculadora dentro do carrinho ---
  async function calcCartShip() {
    const cep = $("#cartCep").value;
    if (onlyDigits(cep).length !== 8) {
      toast("Digite um CEP válido (8 números).");
      return;
    }
    shipCep = maskCep(cep);
    $("#cartShipOptions").innerHTML = `<p class="frete-placeholder">Calculando…</p>`;
    await lookupCep(cep); // aquece cache / valida
    const q = Math.max(cartCount(), 1);
    const quotes = quotesForCep(cep, q);
    selectedShip = { id: quotes[0].id, nome: quotes[0].nome, preco: quotes[0].preco };
    $("#cartShipOptions").innerHTML = quotes
      .map(
        (s, idx) => `
      <label class="ship-opt ${idx === 0 ? "selected" : ""}">
        <input type="radio" name="ship" value="${s.id}" ${idx === 0 ? "checked" : ""}
          data-price="${s.preco}" data-name="${s.nome}">
        <span>
          <span class="so-name">${s.nome}</span>
          <span class="so-meta"> · ${s.prazo === "combinar" ? "a combinar" : s.prazo + " dias"}</span>
        </span>
        <span class="so-price">${s.preco === 0 ? "Grátis" : BRL(s.preco)}</span>
      </label>`
      )
      .join("");
    updateTotals();
  }

  /* =================================================================
     CHECKOUT — INFINITEPAY
     ================================================================= */
  function buildOrderItems() {
    const items = Object.entries(cart).map(([id, q]) => {
      const p = product(id);
      return { name: p.nome, price: Math.round(p.preco * 100), quantity: q };
    });
    if (selectedShip && selectedShip.preco > 0) {
      items.push({
        name: `Frete — ${selectedShip.nome}`,
        price: Math.round(selectedShip.preco * 100),
        quantity: 1,
      });
    }
    return items;
  }

  function checkout() {
    if (cartCount() === 0) return;
    if (!selectedShip) {
      toast("Calcule o frete pelo seu CEP antes de finalizar.");
      $("#cartCep").focus();
      return;
    }
    const handle = CONFIG.infinitePayHandle;
    if (!handle || handle === "SEU_USUARIO_INFINITEPAY") {
      alert(
        "⚙️ Configuração pendente\n\n" +
        "O checkout do InfinitePay ainda não foi configurado. " +
        "Abra o arquivo js/config.js e coloque o seu usuário do InfinitePay " +
        'em "infinitePayHandle".\n\n' +
        "Enquanto isso, você pode finalizar o pedido pelo WhatsApp."
      );
      return;
    }
    const items = buildOrderItems();
    const nsu = "NAGORI" + Date.now();
    const redirect = encodeURIComponent(window.location.origin + window.location.pathname);
    const url =
      `https://checkout.infinitepay.io/${encodeURIComponent(handle)}` +
      `?items=${encodeURIComponent(JSON.stringify(items))}` +
      `&order_nsu=${nsu}&redirect_url=${redirect}`;
    window.location.href = url;
  }

  function whatsappOrder() {
    if (cartCount() === 0) return;
    let msg = "*Novo pedido — Atelier Nagori* 🌿%0A%0A";
    Object.entries(cart).forEach(([id, q]) => {
      const p = product(id);
      msg += `• ${q}× ${p.nome} — ${BRL(p.preco * q)}%0A`;
    });
    msg += `%0A*Subtotal:* ${BRL(subtotal())}%0A`;
    if (selectedShip) {
      msg += `*Frete (${selectedShip.nome}):* ${selectedShip.preco === 0 ? "Grátis" : BRL(selectedShip.preco)}%0A`;
      msg += `*Total:* ${BRL(subtotal() + selectedShip.preco)}%0A`;
    }
    if (shipCep) msg += `*CEP de entrega:* ${shipCep}%0A`;
    msg += `%0AGostaria de finalizar este pedido. 😊`;
    window.open(`https://wa.me/${onlyDigits(CONFIG.whatsapp)}?text=${msg}`, "_blank");
  }

  /* =================================================================
     CONTATO
     ================================================================= */
  function submitContact(e) {
    e.preventDefault();
    const nome = $("#cNome").value.trim();
    const email = $("#cEmail").value.trim();
    const tel = $("#cTel").value.trim();
    const msg = $("#cMsg").value.trim();
    if (!nome || !email || !msg) return;

    const wa =
      `*Contato pelo site — Atelier Nagori*%0A%0A` +
      `*Nome:* ${nome}%0A*E-mail:* ${email}%0A` +
      (tel ? `*WhatsApp:* ${tel}%0A` : "") +
      `%0A${encodeURIComponent(msg)}`;
    window.open(`https://wa.me/${onlyDigits(CONFIG.whatsapp)}?text=${wa}`, "_blank");

    // fallback por e-mail
    const subject = encodeURIComponent("Contato pelo site — " + nome);
    const body = encodeURIComponent(
      `Nome: ${nome}\nE-mail: ${email}\n${tel ? "WhatsApp: " + tel + "\n" : ""}\n${msg}`
    );
    $("#mailLink").href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;

    $("#contactHint").textContent = "Abrindo o WhatsApp para enviar sua mensagem… 🌿";
    e.target.reset();
  }

  /* =================================================================
     DRAWER / OVERLAYS
     ================================================================= */
  const openCart = () => {
    $("#cartDrawer").classList.add("open");
    $("#drawerOverlay").classList.add("open");
    $("#cartDrawer").setAttribute("aria-hidden", "false");
  };
  const closeCart = () => {
    $("#cartDrawer").classList.remove("open");
    $("#drawerOverlay").classList.remove("open");
    $("#cartDrawer").setAttribute("aria-hidden", "true");
  };

  let toastT;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("show"), 2400);
  }

  /* =================================================================
     EVENTOS
     ================================================================= */
  function bindEvents() {
    // delegação global de cliques
    document.addEventListener("click", (e) => {
      const add = e.target.closest("[data-add]");
      const open = e.target.closest("[data-open]");
      const inc = e.target.closest("[data-inc]");
      const dec = e.target.closest("[data-dec]");
      const rm = e.target.closest("[data-rm]");
      if (add) { addToCart(add.dataset.add); if ($("#productModal").classList.contains("open")) closeModal(); }
      else if (open) openModal(open.dataset.open);
      else if (inc) setQty(inc.dataset.inc, (cart[inc.dataset.inc] || 0) + 1);
      else if (dec) setQty(dec.dataset.dec, (cart[dec.dataset.dec] || 0) - 1);
      else if (rm) setQty(rm.dataset.rm, 0);
      else if (e.target.closest(".modal-close")) closeModal();
    });

    $("#cartBtn").addEventListener("click", openCart);
    $("#cartClose").addEventListener("click", closeCart);
    $("#drawerOverlay").addEventListener("click", closeCart);
    $("#modalOverlay").addEventListener("click", (e) => {
      if (e.target === $("#modalOverlay")) closeModal();
    });
    $("#cartEmptyBtn").addEventListener("click", () => { closeCart(); location.hash = "#produtos"; });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeCart(); closeModal(); }
    });

    // máscara de CEP
    ["#freteCep", "#cartCep"].forEach((sel) => {
      const el = $(sel);
      el.addEventListener("input", () => { el.value = maskCep(el.value); });
    });

    $("#freteCalc").addEventListener("click", calcFreteSection);
    $("#freteCep").addEventListener("keydown", (e) => { if (e.key === "Enter") calcFreteSection(); });
    $("#cartShipCalc").addEventListener("click", calcCartShip);
    $("#cartCep").addEventListener("keydown", (e) => { if (e.key === "Enter") calcCartShip(); });

    // seleção de frete no carrinho
    $("#cartShipOptions").addEventListener("change", (e) => {
      const r = e.target.closest('input[name="ship"]');
      if (!r) return;
      $$(".ship-opt").forEach((l) => l.classList.remove("selected"));
      r.closest(".ship-opt").classList.add("selected");
      selectedShip = { id: r.value, nome: r.dataset.name, preco: parseFloat(r.dataset.price) };
      updateTotals();
    });

    $("#checkoutBtn").addEventListener("click", checkout);
    $("#waOrderBtn").addEventListener("click", whatsappOrder);
    $("#contactForm").addEventListener("submit", submitContact);
  }

  /* =================================================================
     INIT
     ================================================================= */
  document.addEventListener("DOMContentLoaded", () => {
    applyConfig();
    renderFilters();
    renderGrid();
    renderCart();
    bindEvents();
  });
})();
