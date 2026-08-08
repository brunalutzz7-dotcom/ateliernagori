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
  infinitePayHandle: "SEU_USUARIO_INFINITEPAY",

  /* -------------------------------------------------------------------
     2. CONTATO
     ------------------------------------------------------------------- */
  // WhatsApp no formato internacional, só números: 55 + DDD + número
  whatsapp: "5511999999999",
  // E-mail que recebe os formulários de contato
  email: "contato@ateliernagori.com.br",
  instagram: "ateliernagori",

  // Cidade de origem dos envios (afeta o cálculo de frete)
  origem: { cidade: "São Paulo", uf: "SP" },

  /* -------------------------------------------------------------------
     3. FRETE NACIONAL
     -------------------------------------------------------------------
     Preços estimados por transportadora e por zona de distância a
     partir da origem. Os valores são um ponto de partida realista —
     ajuste conforme a sua negociação com cada transportadora.

     Zonas (calculadas automaticamente pelo CEP de destino):
       1 = mesmo estado de origem
       2 = estados vizinhos / Sul e Sudeste
       3 = Centro-Oeste e Bahia
       4 = Nordeste
       5 = Norte
     "extra" é o acréscimo por kokedama adicional no mesmo pacote.      */
  freteGratisAcima: 350, // pedidos acima deste valor (R$) ganham PAC grátis
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
