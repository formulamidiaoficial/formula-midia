# PROGRESS.md

## Status (atualizar a cada sessão)
Fase 0 concluída — fundação (Astro + Tailwind + React, tokens de design, layout base, Nav/Footer, componentes de UI, Meta/Schema) validada no navegador. Pronto para começar a Fase 1 (Home, /seo, /calculadora).

## Ambiente / Acesso
- Repositório: github.com/formulamidiaoficial/formula-midia
- Hospedagem: Hostinger (mesma do site atual), deploy manual (build → zip → upload no public_html)
- Site antigo (referência de conteúdo): pasta local `formula midia site 2026` (SPA compilada, sem código-fonte — usada só como fonte de conteúdo a migrar, não como base de código)

## Decisões tomadas
- 2026-07-15 — Stack: Astro + Tailwind CSS v4 + React (só a calculadora como island) + Content Collections. Aprovado pelo cliente.
- 2026-07-15 — Hospedagem: manter Hostinger (Vercel/Netlify não são gratuitos para uso comercial; performance vem da arquitetura Astro, não do host).
- 2026-07-15 — Fontes self-hospedadas via @fontsource (Space Grotesk + Inter), removendo dependência do Google Fonts.
- 2026-07-15 — Construir de verdade as 3 subpáginas de /servicos hoje mortas (google-ads, meta-ads, consultoria-trafego) em vez de removê-las do sitemap.

## Checklist de Fases
- [x] Fase 0 — Fundação (Astro/Tailwind/React, tokens, layout, Nav/Footer, UI atoms, Meta/Schema)
- [ ] Fase 1 — /seo, /calculadora (island React), Home completa
- [ ] Fase 2 — /manifesto, /servicos + 3 subpáginas novas, /servicos/gestao-anuncios-online
- [ ] Fase 3 — Deploy no Hostinger
- [ ] Fase 4 — Content Collections + case study EMOPS

## Tabela de paridade de conteúdo
| Página antiga | Componente/página novo | Status |
|---|---|---|
| Home | src/pages/index.astro | pendente (Fase 1) |
| /manifesto | src/pages/manifesto.astro | pendente (Fase 2) |
| /servicos | src/pages/servicos/index.astro | pendente (Fase 2) |
| /servicos/gestao-anuncios-online | src/pages/servicos/gestao-anuncios-online.astro | pendente (Fase 2) — já sem o bug de Manaus/WhatsApp, que foi corrigido no site antigo em 2026-07-15 |
| /servicos/google-ads, meta-ads, consultoria-trafego | src/pages/servicos/[slug].astro | pendente (Fase 2) — hoje são links mortos no site antigo |
| /seo (já existia como HTML estático) | src/pages/seo.astro | pendente (Fase 1) |
| /calculadora (já existia como HTML estático) | src/pages/calculadora.astro + Calculator.tsx | pendente (Fase 1) |
| /links | public/links/index.html | pendente — portar como está (fora do Tailwind/Astro) |

## Problemas conhecidos / carregados
- Nenhum pendente no momento — o bug de WhatsApp errado + resíduos de Manaus em /servicos/gestao-anuncios-online foi corrigido diretamente no site antigo em produção em 2026-07-15, antes de começar este rebuild.
- Drift de nome de manifest: o `manifest.json` antigo tinha `theme_color`/`background_color` fora dos tokens reais — corrigir ao portar (Fase 3).

## Próxima tarefa concreta
Fase 1: portar `seo/index.html` (site antigo) para `src/pages/seo.astro`, incluindo o FAQPage JSON-LD que faltava no HTML original (usar `faqPageSchema()` de `src/data/schema.ts`).
