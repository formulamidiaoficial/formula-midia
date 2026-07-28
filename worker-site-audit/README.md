# TOOL-015 — Crawler de Auditoria Técnica de SEO (Cloudflare Worker)

Visita até **20 páginas** (a home + os links diretos dela — 2 níveis, teto aprovado por Fabiano em
27/07) de um site de terceiro e devolve um relatório consolidado por severidade: robots.txt/sitemap,
links internos quebrados, H1 ausente/duplicado, canonical ausente, dados estruturados ausentes,
meta description ausente, imagens sem `alt`.

Diferente do RUN-001 (que só lê 1 arquivo), este Worker **navega várias páginas** — por isso os
limites de página/nível são regra de negócio, não só guardrail técnico. Ver comentário no topo de
`site-audit-crawler.js` para o motivo completo.

## Deploy (grátis) — mesma conta Cloudflare do RUN-001
```bash
cd worker-site-audit
npx wrangler deploy     # login já feito durante o RUN-001; refaça só se a sessão expirou
```

Ao publicar, o Cloudflare mostra a URL, algo como:
`https://formula-site-audit-crawler.<seu-subdominio>.workers.dev`

## Testar (confirma que o crawler responde)
```bash
curl "https://formula-site-audit-crawler.<seu-subdominio>.workers.dev/?domain=exemplo.com.br" \
  -H "Origin: https://formulamidia.com.br"
```
Deve devolver um JSON com `paginasAuditadas`, `robots`, `sitemap` e `resumo` (crítico/importante/
secundário). Sem o header `Origin` correto → `403 origin_not_allowed`.

## Guardrails de segurança
1. Só aceita chamada do site da Fórmula (Origin allowlist).
2. **Nunca segue link externo** — só rastreia páginas do próprio domínio auditado. Não é proxy geral.
3. Timeout de 8s por página + limite de 1,5MB por página.
4. Teto **rígido** de 20 páginas / 2 níveis — não é um parâmetro que o cliente pode enviar pra
   aumentar; está fixo no código (`MAX_PAGINAS`, `MAX_NIVEL`).
5. Orçamento total de 22s pra auditoria inteira (evita travar em site lento).
6. Rate limit por IP (opcional — ver `wrangler.toml`).

## Depois que estiver no ar
1. Guarde a URL do Worker → vira `PUBLIC_SITE_AUDIT_URL` no `.env` do `formula-midia`.
2. A **Ferramenta 05** (Auditoria Técnica de SEO) chama esse endpoint em vez de tentar crawlear
   direto do navegador (CORS impede).

**Ordem certa:** prove a camada primeiro (este endpoint respondendo em produção contra 2-3 sites
reais), só depois construa a ferramenta em cima dele — mesma ordem que o RUN-001 seguiu.
