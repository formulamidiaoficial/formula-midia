# RUN-CONCIERGE — Concierge de IA embutido no site (Cloudflare Worker)

Responde perguntas de quem está navegando o site usando **só** o conteúdo público do site como
fonte de fato — o `/llms.txt` que o `formula-midia` já publica (construído antes, pra outro
motivo) vira o contexto do prompt de sistema, sem precisar de busca vetorial (RAG). Ver
`CONTENT-META-012` no `formula-foundation` para a pesquisa completa por trás desta escolha:
Ollama self-hospedado ficou mais caro que API paga nesse volume, então o Worker chama a API da
Anthropic (Claude Haiku) por trás, sem servidor pra manter no ar.

## Deploy (mesma conta Cloudflare do RUN-001/RUN-002)
```bash
cd worker-concierge
npx wrangler deploy     # login já feito antes; refaça só se a sessão expirou
```

Ao publicar, o Cloudflare mostra a URL, algo como:
`https://formula-concierge.<seu-subdominio>.workers.dev`

## Configurar a chave (OBRIGATÓRIO — sem isso o Worker responde 503)
```bash
npx wrangler secret put ANTHROPIC_API_KEY
```
Cole a chave quando pedir. **Só Fabiano pode criar essa chave** — precisa de uma conta com billing
em [console.anthropic.com](https://console.anthropic.com). O Worker usa `claude-haiku-4-5`, o
modelo mais barato da linha atual — custo estimado abaixo de US$10/mês no volume de tráfego atual
do site (ver pesquisa em `CONTENT-META-012`).

## Testar (confirma que responde)
```bash
curl -X POST "https://formula-concierge.<seu-subdominio>.workers.dev" \
  -H "Origin: https://formulamidia.com.br" \
  -H "Content-Type: application/json" \
  -d '{"message":"quanto custa a gestão de tráfego pago?"}'
```
Deve devolver `{"ok":true,"reply":"..."}`. Sem a chave configurada → `503 not_configured`.
Sem o header `Origin` correto → `403 origin_not_allowed`.

## Guardrails de segurança
1. Só aceita chamada do site da Fórmula (Origin allowlist).
2. Mensagem limitada a 600 caracteres, histórico limitado às últimas 6 trocas — controla custo de
   token por conversa.
3. `max_tokens: 400` na resposta — é um concierge objetivo, não um chat aberto sem limite.
4. `/llms.txt` cacheado por 1h (Cache API) — não busca a cada mensagem.
5. Rate limit por IP (opcional — ver `wrangler.toml`).
6. Prompt de sistema instrui: nunca inventar número/preço/prazo fora do `/llms.txt`, sempre
   direcionar pedido de orçamento/prazo pro WhatsApp, nunca fingir ser humano.

## Depois que estiver no ar
1. Guarde a URL do Worker → vira `PUBLIC_CONCIERGE_URL` no `.env` do `formula-midia`.
2. Liberar o domínio do Worker no `connect-src` do `public/.htaccess` (mesmo padrão do
   RUN-001/RUN-002) — sem isso o CSP bloqueia o `fetch()` do widget, o mesmo bug que já aconteceu
   uma vez em produção (27/07).
3. O widget (`ConciergeChat.tsx`, no cabeçalho via `BaseLayout.astro`) já está pronto pra usar essa
   URL assim que ela existir no `.env` — sem ela, o widget simplesmente não renderiza.

**Ordem certa:** deploy do Worker → chave configurada → teste via `curl` → só depois ligar no site
(mesma ordem que RUN-001/RUN-002 seguiram).
