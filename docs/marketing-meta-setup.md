# 📣 Marketing — como ligar a sincronização automática da Meta

O painel de **Marketing & Tráfego Pago** (aba 📣 Mkt no app) já funciona **hoje**:
você pode lançar os números dos anúncios à mão e ele cruza tudo com as vendas
reais do app (Site + WhatsApp = Instagram), calcula ROAS, CAC, lucro, compara
set/out/nov e gera o relatório semanal.

Este guia é pra deixar isso **automático**: um robô puxa os números da Meta
todo dia e preenche o painel sozinho. Você faz isso **uma vez**.

> 🔒 Segurança: o token da Meta **nunca** fica no site nem no app (que abre no
> navegador de qualquer pessoa). Ele fica guardado como "secret" no GitHub, e só
> o robô enxerga. O robô **só lê** números — não cria campanha, não mexe em
> orçamento, não gasta nada.

---

## Passo 1 — Criar a tabela no Supabase (2 min)

1. Entre no [Supabase](https://supabase.com) → seu projeto **Atelier Nagori**.
2. Menu lateral: **SQL Editor** → **New query**.
3. Abra o arquivo `painel/sql/marketing.sql` deste repositório, copie **tudo** e cole.
4. Clique em **Run**. Deve aparecer "Success".

Pronto: a tabela `mkt_metricas` existe. A partir daí, o que você lançar no app
já sincroniza entre o celular e o computador.

---

## Passo 2 — Pegar os dados da Meta (10–15 min)

Você precisa de **dois** valores:

### a) O ID da conta de anúncios
1. Entre no [Gerenciador de Anúncios](https://adsmanager.facebook.com).
2. No topo, ao lado do nome da conta, aparece algo como `act_1234567890`.
3. Anote só os **números** (sem o `act_`). Esse é o `META_AD_ACCOUNT_ID`.

### b) Um token de acesso com permissão `ads_read`
O jeito mais simples e duradouro:
1. Acesse o [Facebook Developers](https://developers.facebook.com/apps) e crie um
   app do tipo **Empresa/Business** (se ainda não tiver).
2. No [Business Settings](https://business.facebook.com/settings) → **Usuários** →
   **Usuários do sistema** → crie um **usuário do sistema** (System User).
3. Dê a ele acesso à sua **conta de anúncios** (função: Ver desempenho / Analista).
4. Clique em **Gerar novo token**, escolha seu app e marque a permissão
   **`ads_read`**. Gere e **copie o token** (guarde num lugar seguro — a Meta só
   mostra uma vez).

> Token de usuário do sistema não expira sozinho, por isso é o ideal pra automação.
> (Dá pra usar um token comum de teste no [Graph API Explorer](https://developers.facebook.com/tools/explorer)
> com `ads_read` só pra experimentar, mas ele expira em ~1–2 meses.)

---

## Passo 3 — Guardar os segredos no GitHub (3 min)

No GitHub, no repositório do Atelier:
**Settings** → **Secrets and variables** → **Actions** → **New repository secret**.

Crie **4 secrets** (nome exatamente assim):

| Nome | Valor |
|------|-------|
| `META_ACCESS_TOKEN` | o token do Passo 2b |
| `META_AD_ACCOUNT_ID` | só os números (Passo 2a) |
| `SUPABASE_URL` | `https://subgukjjnmqrkunyabxp.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | no Supabase: **Settings → API → service_role** (a chave **secreta**, não a pública) |

> ⚠️ A `service_role` é poderosa. Por isso ela só entra aqui, como secret — nunca
> no app, nunca numa mensagem.

---

## Passo 4 — Ligar e fazer a primeira carga

O robô está em `.github/workflows/meta-insights.yml`. Ele roda **sozinho todo dia
de manhã**, mas pra isso o arquivo precisa estar no branch principal do repositório
(ou seja: depois que estas mudanças forem mescladas / publicadas).

Para a **primeira carga** (puxar o histórico de set/out/nov):
1. GitHub → aba **Actions** → workflow **"Meta Insights -> Supabase"**.
2. Botão **Run workflow** → em "dias" digite **90** → **Run**.
3. Espere ~1 min. Se ficar verde ✅, abra o app → aba **Mkt**: os números da Meta
   estarão lá, já cruzados com suas vendas.

A partir daí ele atualiza sozinho todo dia (últimos 7 dias). Você não precisa
fazer mais nada — é só abrir o painel e ler as recomendações.

---

## E se algo der errado?
- **Workflow vermelho ❌:** clique nele e veja a mensagem. Quase sempre é um secret
  com nome errado, o token sem `ads_read`, ou o ID da conta com o `act_` junto.
- **Token expirou:** gere outro (Passo 2b) e atualize o secret `META_ACCESS_TOKEN`.
- **Enquanto não ligar:** o painel continua 100% útil no modo manual (lançar os
  números 1x por semana). Nada trava.

Qualquer dúvida, me chama que eu faço junto com você. 🌿
