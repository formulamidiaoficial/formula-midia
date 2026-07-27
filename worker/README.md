# RUN-001 — Proxy de robots.txt (Cloudflare Worker)

Busca o `robots.txt` de um domínio **do lado do servidor** (o navegador não pode, por CORS).
É a base da **Ferramenta 02 — Verificador de Acesso de IA** (robô de treino × robô de busca).

## Deploy (grátis) — depois de criar a conta no Cloudflare
Não precisa instalar nada; o `wrangler` roda via `npx`.

```bash
cd worker
npx wrangler login      # abre o navegador pra autorizar a conta
npx wrangler deploy     # publica o Worker
```

Ao publicar, o Cloudflare mostra a URL, algo como:
`https://formula-robots-proxy.<seu-subdominio>.workers.dev`

## Testar (confirma que o proxy responde)
```bash
curl "https://formula-robots-proxy.<seu-subdominio>.workers.dev/?domain=globo.com" \
  -H "Origin: https://formulamidia.com.br"
```
Deve devolver o `robots.txt` em JSON: `{ "ok": true, "found": true, "robotsTxt": "...", ... }`.
Sem o header `Origin` correto → `403 origin_not_allowed` (é o guardrail funcionando).

## Guardrails de segurança
1. Só aceita chamada do site da Fórmula (Origin allowlist).
2. Só busca `/robots.txt` — nunca uma URL arbitrária (não é proxy geral).
3. Timeout 8s + limite de 512 KB na resposta.
4. Rate limit por IP (opcional — ver `wrangler.toml`).

## Depois que estiver no ar
1. Guarde a URL do Worker → vira `PUBLIC_ROBOTS_PROXY_URL` no `.env` do `formula-midia`.
2. A **Ferramenta 02** se escreve em cima dela (a ilha chama esse endpoint em vez de
   tentar buscar o robots.txt direto do navegador).

**Ordem certa:** prove a camada primeiro (este endpoint respondendo em produção),
só depois construa a ferramenta em cima dele.
