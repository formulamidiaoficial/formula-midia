# PROGRESS.md

## Status (atualizar a cada sessão)
Fase 3 100% concluída — CNPJ real (55.777.659/0001-40) preenchido em `/privacidade`, `/termos` e no schema.org (`taxID`), removendo o último bloqueio de publicação. Auditoria completa de SEO/OG/meta feita e corrigida (ver "Auditoria de SEO/OG" abaixo). Gap de paridade de conteúdo encontrado e corrigido: carrossel de 25 logos de clientes (existia no site antigo, nunca portado) agora está na Home (`LogoCarousel.astro`, zero-JS). Build de produção rodado (17 páginas), commit `c9feaf1` enviado ao GitHub, pacote de deploy regenerado em `Downloads/formula-midia-astro-deploy.zip` (141 arquivos, ~1.99MB, inclui `.htaccess`). **Site novo pronto para publicar — falta apenas o cliente fazer o upload no Hostinger** (instruções passo a passo entregues nesta sessão).

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
- 2026-07-16 — Catálogo de produtos expandido, definido com o cliente:
  - **Consultoria** = Consultoria de Tráfego, já coberta em `/servicos` — sem página nova.
  - **Growth** = produto novo e distinto: "Gestão de Growth & Performance", um gestor de crescimento que acompanha todos os números do funil, com copy estruturada em SPIN Selling. Construído em `/growth` + `/simulador-de-funil`.
  - **Criação de Sites** = produto novo, sem página no site antigo. Construído em `/criacao-de-sites` + `/simulador-de-site`.
  - **Mentoria** = ensina tráfego pago e growth. Ainda sem confirmação de que a entrega está pronta para venda direta — construída em `/mentoria` com CTA de "lista de interesse", não venda com preço fechado.
  - **WhatsApp Bot** = continua adiado. Quando construir, será UMA página só mostrando duas entregas: Typebot embutido no site (demo ao vivo) + BotConversa (WhatsApp). Depende de decisão de stack do Typebot (cliente vai pesquisar no GitHub/Reddit).
- 2026-07-16 — Criado um conjunto de componentes de seção reutilizáveis (`src/components/sections/`: PageHero, SectionHeading, DiffGrid, OfferGrid, ToolBanner, FinalCta, HeroBlobs) para acelerar a criação de landing pages — cada página nova agora é praticamente só conteúdo, não design do zero.
- 2026-07-16 — `/links` reorganizado em grupos: Fale Conosco, Nossas Redes, Nossos Serviços (todas as landing pages), Ferramentas Gratuitas (todos os simuladores/calculadoras). Ideia de longo prazo: qualquer coisa vendável ou qualquer ferramenta/conteúdo gratuito (calculadoras, análises, auditorias, checklists, e-books, cursos, vídeos) ganha um botão aqui.
- 2026-07-16 — CNPJ real da Fórmula Mídia confirmado pelo cliente: **55.777.659/0001-40**. Preenchido em `/privacidade`, `/termos` e em `organizationSchema()` (`taxID`).
- 2026-07-16 — Auditoria de SEO/OG/meta feita a pedido do cliente ("já temos description e open graph? quer fazer uma auditoria?"). Achados e correções: título da Home (93→50 chars) e do Manifesto (118→54 chars) encurtados para exibição ideal em SERP; `robots: noindex` adicionado (só na 404, que não existia antes); títulos genéricos das subpáginas de `/servicos/[slug]` enriquecidos com o diferencial de cada serviço; `og:image:alt` adicionado ao Meta.astro; meta tags de PWA (theme-color, apple-mobile-web-app-*, format-detection) adicionadas ao BaseLayout; skip-link de acessibilidade adicionado. Também corrigidos 2 bugs reais encontrados durante a auditoria: `manifest.webmanifest` referenciado no BaseLayout mas nunca criado (404 real), e favicon.ico/favicon.svg ainda eram o placeholder padrão do Astro.
- 2026-07-16 — Gap de paridade de conteúdo encontrado: o site antigo tinha um carrossel de 25 logos de clientes na Home (`inject-carousel.js`) que nunca foi portado, apesar dos arquivos já estarem em `public/assets/logos/` desde a Fase 0. Corrigido com `LogoCarousel.astro` (puro CSS, sem JS, pausa no hover, respeita `prefers-reduced-motion`). Removido `loading="lazy"` das imagens do carrossel — são só 25 arquivos únicos (~12KB cada, cacheados entre as 50 tags duplicadas), custo de banda mínimo, e elimina qualquer risco de o carregamento lazy não disparar corretamente dentro de um container com animação CSS via `transform`.

## Checklist de Fases
- [x] Fase 0 — Fundação (Astro/Tailwind/React, tokens, layout, Nav/Footer, UI atoms, Meta/Schema)
- [x] Fase 1 — /seo, /calculadora (island React), Home completa
- [x] Fase 1.5 (fora do plano original, adicionada a pedido do cliente) — Catálogo expandido: `/criacao-de-sites` + `/simulador-de-site`, `/growth` + `/simulador-de-funil`, `/mentoria`, componentes de seção reutilizáveis, `/links` reorganizado
- [x] Fase 2 — /manifesto, /servicos + 3 subpáginas reais (google-ads, meta-ads, consultoria-trafego), /servicos/gestao-anuncios-online
- [x] Fase 3 — Páginas legais (com CNPJ real), 404, .htaccess, manifest, favicon. Auditoria de SEO/OG feita. Pacote de deploy pronto — **falta apenas o upload de fato**
- [ ] Fase 4 — Content Collections + página própria do case EMOPS
- [ ] Fase 5 — Conteúdo de autoridade (primeiro guia pilar de SEO/GEO ou tráfego pago, clusters) — horizonte mais longo, começar só depois do site no ar

## Não construir ainda (aguardando decisão do cliente)
- Página de vendas de WhatsApp Bot (Typebot + BotConversa) — depende da decisão de stack do Typebot
- Preço/oferta fechada de Mentoria — página existe, mas com CTA de lista de interesse até a entrega estar madura
- Qualquer pixel de rastreamento (Meta/GTM/GA4/LinkedIn) — CSP fica restrita até o cliente confirmar instalação real

## Pendências do cliente antes de publicar
- ~~CNPJ real~~ — resolvido em 2026-07-16 (55.777.659/0001-40)
- Fazer o upload de `formula-midia-astro-deploy.zip` (em Downloads) no Hostinger, substituindo TUDO em `public_html` — isso troca a arquitetura inteira do site (SPA antiga → Astro estático), não é um ajuste incremental como as vezes anteriores. Instruções passo a passo entregues no chat em 2026-07-16.

## O que falta para a Fase 4 (página do case EMOPS)
- Decidir a URL: sugestão `/casos/emops` ou `/cases/grupo-emops`
- **Perguntar ao cliente**: tem mais detalhes do projeto EMOPS além do que já está na página de Gestão de Anúncios (contexto do nicho, prazo do resultado, alguma citação/depoimento do cliente)?
- **Confirmar com o cliente**: pode usar o nome "Grupo EMOPS" e os números (-45% CPL, +38% margem) publicamente numa página dedicada, com mais destaque do que hoje?
- Criar `src/content/config.ts` (Content Collections) com schema de case study
- Refatorar os blocos de EMOPS em `/manifesto` e `/servicos/gestao-anuncios-online` pra puxar da mesma fonte (Content Collection), evitando duplicar os números em 3 lugares

## O que falta para a Fase 5 (primeiro conteúdo pilar)
- Tópico já definido nesta sessão: "O Guia Definitivo de SEO e GEO para Empresas no Brasil"
- Precisa de collection de blog em `src/content/config.ts` (separada da de case studies) e uma rota `/blog/[slug].astro` ou `/recursos/[slug].astro`
- **Perguntar ao cliente**: prefere que o guia fique em `/blog/...` ou em algo como `/recursos/...`?
- Este é um texto longo (pillar content de verdade cobre o tema a fundo) — vou escrever com o conhecimento técnico que já usamos no `/seo`, mas sem dados de volume de busca reais (não tenho acesso a ferramentas de keyword research) — o foco é profundidade e autoridade, não otimização por volume de palavra-chave
- Depois do pilar, viriam os posts de cluster (ex: "O que é GEO na prática", "Core Web Vitals: o guia completo") — não fazer tudo de uma vez

## Tabela de paridade de conteúdo

**Migradas do site antigo:**
| Página antiga | Componente/página novo | Status |
|---|---|---|
| Home | src/pages/index.astro | ✅ portado, com FAQPage + ProfessionalService schema |
| /seo (já existia como HTML estático) | src/pages/seo.astro | ✅ portado, FAQPage JSON-LD adicionado (faltava no HTML original) |
| /calculadora (já existia como HTML estático) | src/pages/calculadora.astro + Calculator.tsx | ✅ portado, island React com `client:load` |
| /links | public/links/index.html | ✅ portado e reorganizado em grupos, com todos os botões novos |
| /manifesto | src/pages/manifesto.astro | ✅ portado, com case EMOPS (números reais -45%/+38% reaproveitados) |
| /servicos | src/pages/servicos/index.astro | ✅ portado |
| /servicos/gestao-anuncios-online | src/pages/servicos/gestao-anuncios-online.astro | ✅ portado, já sem o bug de Manaus/WhatsApp |
| /servicos/google-ads, meta-ads, consultoria-trafego | src/pages/servicos/[slug].astro + src/data/services.ts | ✅ criadas do zero (eram links mortos no site antigo) — rota dinâmica com getStaticPaths |

**Novas (não existiam no site antigo, catálogo expandido em 2026-07-16):**
| Página | Status |
|---|---|
| /criacao-de-sites + /simulador-de-site | ✅ construído, testado |
| /growth + /simulador-de-funil | ✅ construído, testado |
| /mentoria | ✅ construído, testado (CTA de lista de interesse) |
| /servicos/whatsapp-bot (Typebot + BotConversa) | ⏸ adiado — depende de decisão de stack |
| Política de Privacidade / Termos de Uso | ✅ construído, CNPJ real preenchido |
| Carrossel de logos de clientes (Home) | ✅ construído, corrige gap de paridade com site antigo |
| Case EMOPS (página própria) | pendente (Fase 4) |

Os 16 FAQs originais (schema JSON-LD do site antigo) já estão salvos em `src/data/faq/{home,manifesto,servicos,gestao-anuncios-online}.ts` — os de manifesto/servicos/gestao-anuncios-online já estão prontos para a Fase 2, só falta usá-los nas páginas. FAQs novos (criacao-de-sites, growth, mentoria) também já estão em `src/data/faq/`.

## Problemas conhecidos / carregados
- Nenhum pendente no momento — o bug de WhatsApp errado + resíduos de Manaus em /servicos/gestao-anuncios-online foi corrigido diretamente no site antigo em produção em 2026-07-15, antes de começar este rebuild.
- Drift de nome de manifest: o `manifest.json` antigo tinha `theme_color`/`background_color` fora dos tokens reais — corrigir ao portar (Fase 3).
- Bug encontrado e corrigido nesta fase: blobs decorativos (absolute, blur) sem `overflow-hidden` no container pai causavam overflow horizontal no mobile em `/seo` (seção de CTA final) — checar isso em qualquer nova seção com blobs decorativos nas próximas fases.

## Próxima tarefa concreta
Cliente vai fazer o upload de `formula-midia-astro-deploy.zip` no Hostinger (instruções passo a passo dadas no chat em 2026-07-16). Depois disso: (1) validar os headers de segurança em produção (securityheaders.com), (2) validar Lighthouse na URL real, (3) seguir para a Fase 4 (case EMOPS — falta decisão do cliente sobre detalhes extras e permissão de destaque do nome) ou Fase 5 (conteúdo pilar de SEO/GEO — falta decisão do cliente sobre `/blog/` vs `/recursos/`), conforme prioridade do cliente.
