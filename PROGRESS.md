# PROGRESS.md

## Status (atualizar a cada sessão)
Fase 1 concluída — Home, /seo e /calculadora (com island React) portadas, testadas no navegador (desktop + mobile, sem overflow horizontal), build de produção limpo. Pronto para começar a Fase 2 (Manifesto, Serviços + subpáginas).

## Ambiente / Acesso
- Repositório: github.com/formulamidiaoficial/formula-midia
- Hospedagem: Hostinger (mesma do site atual), deploy manual (build → zip → upload no public_html)
- Site antigo (referência de conteúdo): pasta local `formula midia site 2026` (SPA compilada, sem código-fonte — usada só como fonte de conteúdo a migrar, não como base de código)

## Decisões tomadas
- 2026-07-15 — Stack: Astro + Tailwind CSS v4 + React (só a calculadora como island) + Content Collections. Aprovado pelo cliente.
- 2026-07-15 — Hospedagem: manter Hostinger (Vercel/Netlify não são gratuitos para uso comercial; performance vem da arquitetura Astro, não do host).
- 2026-07-15 — Fontes self-hospedadas via @fontsource (Space Grotesk + Inter), removendo dependência do Google Fonts.
- 2026-07-15 — Construir de verdade as 3 subpáginas de /servicos hoje mortas (google-ads, meta-ads, consultoria-trafego) em vez de removê-las do sitemap.
- 2026-07-15 — Auditoria de conteúdo feita (framework de páginas institucionais/legais/conversão comparado ao site atual). Achados prioritários: falta Política de Privacidade (risco legal LGPD), falta página própria pro case EMOPS, 3 subpáginas de serviço quebradas (ver acima), falta conteúdo pilar.
- 2026-07-15 — WhatsApp Bot (via BotConversa) é serviço real e vendido — vale página de vendas própria. Mentoria/Consultoria é real mas "precisa de ajustes na entrega" — NÃO construir página de vendas ainda, revisitar quando a oferta estiver madura.
- 2026-07-15 — Pixels de rastreamento (Meta Pixel, GTM, GA4, LinkedIn): adiado. CSP do Astro continua restrita (sem domínios de tracking liberados) até o cliente confirmar que vai instalar de verdade.

## Checklist de Fases
- [x] Fase 0 — Fundação (Astro/Tailwind/React, tokens, layout, Nav/Footer, UI atoms, Meta/Schema)
- [x] Fase 1 — /seo, /calculadora (island React), Home completa
- [ ] Fase 2 — /manifesto, /servicos + 4 subpáginas reais (google-ads, meta-ads, consultoria-trafego, whatsapp-bot/BotConversa), /servicos/gestao-anuncios-online
- [ ] Fase 3 — Páginas legais (Política de Privacidade, Termos de Uso — prioridade alta, risco LGPD) + Deploy no Hostinger
- [ ] Fase 4 — Content Collections + página própria do case EMOPS
- [ ] Fase 5 — Conteúdo de autoridade (primeiro guia pilar de SEO/GEO ou tráfego pago, clusters) — horizonte mais longo, começar só depois do site no ar

## Não construir ainda (aguardando decisão do cliente)
- Página de vendas de Mentoria/Consultoria — oferta ainda não está pronta pra ser vendida publicamente
- Qualquer pixel de rastreamento (Meta/GTM/GA4/LinkedIn) — CSP fica restrita até o cliente confirmar instalação real

## Tabela de paridade de conteúdo
| Página antiga | Componente/página novo | Status |
|---|---|---|
| Home | src/pages/index.astro | pendente (Fase 1) |
| /manifesto | src/pages/manifesto.astro | pendente (Fase 2) |
| /servicos | src/pages/servicos/index.astro | pendente (Fase 2) |
| /servicos/gestao-anuncios-online | src/pages/servicos/gestao-anuncios-online.astro | pendente (Fase 2) — já sem o bug de Manaus/WhatsApp, que foi corrigido no site antigo em 2026-07-15 |
| /servicos/google-ads, meta-ads, consultoria-trafego | src/pages/servicos/[slug].astro | pendente (Fase 2) — hoje são links mortos no site antigo |
| /servicos/whatsapp-bot (nova, não existia) | src/pages/servicos/[slug].astro | pendente (Fase 2) — serviço real via BotConversa, sem página própria ainda |
| Política de Privacidade / Termos de Uso (novas) | src/pages/privacidade.astro, src/pages/termos.astro | pendente (Fase 3) — não existem em nenhuma versão do site |
| Case EMOPS (página própria, não existia) | src/content/case-studies/emops.mdx + página de detalhe | pendente (Fase 4) — hoje só existe como blurb dentro de outras páginas |
| Home | src/pages/index.astro | ✅ portado, com FAQPage + ProfessionalService schema |
| /seo (já existia como HTML estático) | src/pages/seo.astro | ✅ portado, FAQPage JSON-LD adicionado (faltava no HTML original) |
| /calculadora (já existia como HTML estático) | src/pages/calculadora.astro + Calculator.tsx | ✅ portado, island React com `client:load` (não `client:visible` — é o conteúdo principal da página, precisa hidratar imediatamente) |
| /links | public/links/index.html | pendente — portar como está (fora do Tailwind/Astro) |

Os 16 FAQs originais (schema JSON-LD do site antigo) já estão salvos em `src/data/faq/{home,manifesto,servicos,gestao-anuncios-online}.ts` — os de manifesto/servicos/gestao-anuncios-online já estão prontos para a Fase 2, só falta usá-los nas páginas.

## Problemas conhecidos / carregados
- Nenhum pendente no momento — o bug de WhatsApp errado + resíduos de Manaus em /servicos/gestao-anuncios-online foi corrigido diretamente no site antigo em produção em 2026-07-15, antes de começar este rebuild.
- Drift de nome de manifest: o `manifest.json` antigo tinha `theme_color`/`background_color` fora dos tokens reais — corrigir ao portar (Fase 3).
- Bug encontrado e corrigido nesta fase: blobs decorativos (absolute, blur) sem `overflow-hidden` no container pai causavam overflow horizontal no mobile em `/seo` (seção de CTA final) — checar isso em qualquer nova seção com blobs decorativos nas próximas fases.

## Próxima tarefa concreta
Fase 2: portar `/manifesto` (usar `src/data/faq/manifesto.ts`, já pronto), depois `/servicos` + as 4 subpáginas reais.
