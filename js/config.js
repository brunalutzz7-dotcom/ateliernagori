/* =====================================================================
   ATELIER NAGORI — CONFIGURAÇÃO DA LOJA
   ---------------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa editar para colocar a loja
   no ar. Troque os valores abaixo pelos dados reais do seu ateliê.
   ===================================================================== */

const CONFIG = {
  /* -------------------------------------------------------------------
     1. INFINITEPAY — recebimento dos pagamentos
     -------------------------------------------------------------------
     Coloque aqui o seu "handle" (usuário) do InfinitePay. É o mesmo
     nome que aparece no seu link, por exemplo:
        https://checkout.infinitepay.io/SEU_USUARIO
     Basta o texto depois da barra (sem @ e sem https).
     Enquanto estiver "SEU_USUARIO_INFINITEPAY" o checkout mostra um
     aviso pedindo para configurar.                                    */
  infinitePayHandle: "ateliernagori",

  /* -------------------------------------------------------------------
     2. CONTATO
     ------------------------------------------------------------------- */
  // WhatsApp no formato internacional, só números: 55 + DDD + número
  whatsapp: "5541992895505",
  // E-mail de contato. Deixado VAZIO de propósito: como o site é estático,
  // qualquer texto aqui ficaria visível no código para os clientes. Os
  // contatos chegam até você pelo WhatsApp. Se um dia quiser exibir um
  // e-mail público, preencha aqui e mude emailVisivel para true.
  email: "",
  emailVisivel: false, // não mostra o e-mail no site
  instagram: "ateliernagori",

  // Cidade de origem dos envios (afeta o cálculo de frete)
  origem: { cidade: "Curitiba", uf: "PR" },

  /* -------------------------------------------------------------------
     3. FRETE NACIONAL
     -------------------------------------------------------------------
     Preços estimados por transportadora e por zona de distância a
     partir da origem. Os valores são um ponto de partida realista —
     ajuste conforme a sua negociação com cada transportadora.

     Zonas (calculadas automaticamente pelo CEP de destino, a partir
     de Curitiba/PR):
       1 = Paraná e Santa Catarina (perto)
       2 = São Paulo e Rio Grande do Sul
       3 = Sudeste (RJ/MG/ES) e Centro-Oeste
       4 = Nordeste
       5 = Norte
     "extra" é o acréscimo por kokedama adicional no mesmo pacote.      */
  freteGratisAcima: 900, // pedidos acima deste valor (R$) ganham PAC grátis
  transportadoras: [
    {
      id: "correios-pac",
      nome: "Correios — PAC",
      obs: "Econômico",
      base: [22, 32, 42, 52, 62], extra: 8,
      prazo: ["3-6", "5-9", "7-12", "9-15", "10-18"],
    },
    {
      id: "correios-sedex",
      nome: "Correios — SEDEX",
      obs: "Expresso",
      base: [34, 48, 62, 78, 95], extra: 12,
      prazo: ["1-2", "2-4", "3-5", "4-7", "5-9"],
    },
    {
      id: "jadlog-package",
      nome: "Jadlog — Package",
      obs: "Econômico",
      base: [20, 28, 38, 48, 58], extra: 7,
      prazo: ["3-6", "4-8", "6-10", "8-13", "9-16"],
    },
    {
      id: "jadlog-com",
      nome: "Jadlog — .Com",
      obs: "Expresso",
      base: [30, 42, 55, 70, 85], extra: 10,
      prazo: ["2-3", "3-5", "4-6", "5-8", "6-10"],
    },
    {
      id: "azul-cargo",
      nome: "Azul Cargo Express",
      obs: "Aéreo rápido",
      base: [28, 40, 52, 60, 68], extra: 9,
      prazo: ["1-3", "2-4", "2-5", "3-6", "3-7"],
    },
    {
      id: "loggi",
      nome: "Loggi",
      obs: "Expresso",
      base: [25, 36, 48, 60, 72], extra: 8,
      prazo: ["1-3", "2-4", "3-5", "4-7", "5-8"],
    },
  ],
};
