# RUN-006 — Agregação anônima do `/placar` (Cloudflare Worker + Analytics Engine)

Recebe um ponto de dado anônimo (`{ferramenta_id, metrica, faixa_de_valor}`, nunca domínio, nome,
e-mail ou IP) e grava no **Cloudflare Workers Analytics Engine** — feito pra exatamente isto:
contagem agregada de alta cardinalidade, sem banco de dado pra provisionar, sem corrida de
contagem (cada chamada é um `writeDataPoint()`, um append, não um leitura-modifica-escreve). Ver
`RUN-006-placar-agregacao.md` no `formula-foundation` para a spec completa e a pesquisa por trás
da escolha técnica.

## Deploy (mesma conta Cloudflare do RUN-001/RUN-002/RUN-CONCIERGE)
```bash
cd worker-placar
npx wrangler deploy
```
A escrita (`writeDataPoint`) já funciona assim que o Worker é publicado — **Analytics Engine vem
incluso no plano gratuito do Workers**, sem chave nem conta separada.

## Testar (confirma que grava)
```bash
curl -X POST "https://formula-placar-stats.<seu-subdominio>.workers.dev" \
  -H "Origin: https://formulamidia.com.br" \
  -H "Content-Type: application/json" \
  -d '{"ferramenta_id":"cac-ltv-payback","metrica":"razao_ltv_cac","faixa_de_valor":"3-4"}'
```
Deve devolver `{"ok":true}`. `ferramenta_id`/`metrica` fora da whitelist fixa do código →
`400 metrica_invalida` (de propósito — não é bug, é o guardrail 3 da spec).

## Consultar o agregado (pra alimentar o `/placar` de verdade — passo seguinte, não feito ainda)
Diferente da escrita, **consultar** o Analytics Engine precisa de um **API Token do Cloudflare**
(conta → API Tokens → criar um com permissão `Account Analytics: Read`) — isso só Fabiano pode
criar. Com o token, a consulta é uma chamada SQL via
`https://api.cloudflare.com/client/v4/accounts/{account_id}/analytics_engine/sql`. Esse passo
ainda não foi construído — o `/placar` hoje mostra "coletando dados" honestamente, sem número
inventado, até esse token existir e a consulta ser implementada (próximo passo natural, registrado
em `ROADMAP/PENDENTES.md`).

## Guardrails de segurança
1. Só aceita chamada do site da Fórmula (Origin allowlist).
2. **Whitelist fixa** de `ferramenta_id`/`metrica` no código (`METRICAS_VALIDAS`) — o cliente não
   pode inventar uma métrica nova só enviando outra string. Hoje cobre as 4 ferramentas que o
   `/placar` já promete publicamente: CAC·LTV·Payback, MER×ROAS, Custo do Lead Perdido (tempo de
   resposta), Verificador de Acesso de IA (robots.txt). Adicionar ferramenta = adicionar linha
   nesse objeto, deploy de novo.
3. `writeDataPoint()` nunca recebe IP, domínio, e-mail ou qualquer campo de texto livre — só os 3
   campos fixos acima. É o que torna o dado anônimo por construção, não por promessa.
4. Rate limit por IP (opcional — ver `wrangler.toml`).

## Depois que estiver no ar
1. Guarde a URL do Worker → vira `PUBLIC_PLACAR_STATS_URL` no `.env` do `formula-midia`.
2. Liberar o domínio do Worker no `connect-src` do `public/.htaccess` (mesmo padrão dos outros 3
   Workers — sem isso o CSP bloqueia o `fetch()`, o mesmo bug que já aconteceu uma vez).
3. O componente `OptInPlacar.tsx` já está pronto pra usar essa URL assim que ela existir no `.env`.
