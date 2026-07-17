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
- 2026-07-16 — **Decisão estratégica de modelo de negócio** (conversa longa com o cliente sobre "virar top 1 local / top 10 Brasil / top 100 mundo"): pesquisa de mercado feita (agências que escalaram — V4 Company, RD Station, Agência Mestre, Neil Patel, WebFX — nenhuma cresceu vendendo mais horas do fundador). Cliente esclareceu que a operação NÃO é solo: é CEO (cliente) + sócio (head da maior agência de CRM/performance do setor dele) + gestores + times jr/pleno, já operando white-label. Isso valida capacidade real de entrega em Growth & Performance e Tráfego Pago produtizado. Decisão de **enxugar posicionamento em vez de atender todos os tickets/públicos ao mesmo tempo**:
  - **Mantém e fortalece agora**: Tráfego Pago produtizado (médio ticket), Growth & Performance (alto ticket, alto touch — não produtizar), Criação de Sites, SEO & GEO (com GEO embutido no pacote, não vendido separado — mercado brasileiro de GEO ainda imaturo pra ticket próprio, ver pesquisa), Mentoria 1:1 com vagas limitadas por trimestre (decisão do cliente: mentoria fica 1:1, não vira curso/turma — aceito, escassez reforça ticket premium).
  - **Mapeado como visão, NÃO construir ainda**: (a) Atendimento a governos/prefeituras via licitação (chatbot WhatsApp API e afins) — motion de venda totalmente diferente (certidões, registro, portfólio de edital), merece fase/site próprio quando o cliente decidir investir nisso; (b) Programa de parceria/white-label para OUTRAS agências (B2B2B, cliente já faz internamente e quer expandir) — pode virar um 6º produto no molde do programa de parceiros da RD Station, mas só quando o modelo for validado; (c) Página pessoal do CEO (Fabiano de Medeiros — "Gestor de Crescimento, Growth Marketer & Sales Performance") como link-tree/bio dentro do site da Fórmula Mídia — item de backlog futuro, sem urgência.
  - **IA**: não vira produto/página própria — fica como fio condutor citado dentro dos serviços existentes (ex: "construído com Claude Code", otimização de campanha via IA), não como oferta separada.
  - **Wedge/diferencial único proposto**: a integração real entre tráfego pago + CRM (via expertise do sócio) + dados de growth de ponta a ponta — a maioria das agências brasileiras vende só uma dessas pernas isoladamente. Isso já existe em conteúdo na seção "Plataforma Completa" da Home; falta reforçar essa integração como o motivo de ser "top 1", não só como lista de features.
  - **Caso EMOPS confirmado como case de cliente**: o cliente esclareceu que qualquer papel executivo seu ou do sócio (ex: head de growth do Grupo EMOPS em 12 estados) pode ser usado como case da Fórmula Mídia. A Fase 4 (página própria do case) pode prosseguir sem restrição de confidencialidade. **Exceção confirmada**: a mentoria de oftalmologia premium que o cliente lidera (maior do Brasil no nicho) NUNCA deve ser citada em lugar nenhum do site — é papel pessoal fora do escopo da Fórmula Mídia.
- 2026-07-16 — Implementado o primeiro passo da reorganização: Nav ganhou dropdown "Serviços" (Tráfego Pago, Growth, Criação de Sites, SEO & GEO — antes só descobertas via `/links`), Home ganhou seção "Nossos Serviços" (cards linkando as 4 ofertas core + faixa de Mentoria), `/mentoria` reposicionada de "lista de interesse" genérica para "vagas limitadas por trimestre" (1:1).
- 2026-07-17 — **Site publicado no Hostinger.** Cliente reportou não encontrar a maioria das páginas/ferramentas e ausência de botão de WhatsApp flutuante. Causa raiz confirmada testando o site ao vivo em mobile: o Nav escondia TODOS os links em telas `< md` sem alternativa nenhuma (só logo + botão de WhatsApp apareciam), e o rodapé só tinha Home/WhatsApp/Legal — não compensava em nenhum device. Corrigido: (1) menu hambúrguer mobile via `<details>/<summary>` (zero-JS, mesmo padrão do FaqAccordion) com todos os links do site; (2) botão flutuante de WhatsApp (fixed bottom-right, verde padrão) adicionado ao `BaseLayout` — não existia em lugar nenhum antes; (3) rodapé reestruturado em 3 colunas (Serviços, Ferramentas gratuitas, Empresa), funcionando como mapa do site em qualquer dispositivo. Testado em mobile (375px) e desktop (1280px), sem overflow, hambúrguer confirmado escondido em desktop e visível só em mobile.
- 2026-07-17 — Investigação de assets do site antigo (pasta `formula midia site 2026/site formula_files/`): encontradas 3 imagens de produto reais (screenshot de dashboard do Google Ads, screenshot de "lead rastreado" no CRM, screenshot de relatório automatizado via WhatsApp) que ilustravam a seção "Plataforma Completa" no site antigo — nunca portadas; hoje essa seção na Home só tem emoji, sem prova visual. **Achado de risco**: a imagem de "lead rastreado" expõe nomes reais e telefones reais de leads (ex: "Márcia Amorim (92) 8481-7970") — reuso direto violaria LGPD (dado pessoal de terceiro sem consentimento). Não usar essa imagem sem antes anonimizar/recriar com dados fictícios. As outras 2 imagens (Google Ads e relatório WhatsApp) não expõem PII de terceiros e podem ser reaproveitadas.
- 2026-07-17 — **Feedback do sócio pós-publicação**: (1) travessão (—) usado como conector de frase identificado como tique de escrita de IA — removido de todo o copy visível (títulos, descrições, FAQs, hints de UI) em 19 arquivos, substituído por vírgula/dois-pontos/ponto/"e" conforme o mais natural; mantidos os usos que são elemento de design deliberado (marcador de lista, indicador de "não" em tabela) e comentários de código (invisíveis). De brinde, corrigida uma FAQ da Mentoria que ainda falava em "lista de interesse"/"lançamento", desatualizada desde o reposicionamento pra vagas trimestrais. (2) Achou as ferramentas/calculadoras "não intuitivas" por causa das cores escuras — aplicado `.section-light` nas 3 páginas de ferramenta (`/calculadora`, `/simulador-de-site`, `/simulador-de-funil`), testado sem quebrar contraste dos componentes internos (range slider, cards). **Pendência a confirmar com o cliente**: ele disse não ter visto as seções claras da Home (Qualifier, conteúdo local de SEO) — preciso confirmar se o zip com bento grid/seções claras já foi de fato publicado no Hostinger antes desta observação, ou se é só cache do navegador.
- 2026-07-17 — **Pesquisa de benchmark de sites de alto nível** (agências de performance premiadas, SaaS de referência como Linear/Stripe/Vercel/Framer, Awwwards, hubs de conteúdo como HubSpot/Semrush, agências brasileiras como Agência Mestre/V4 Company) feita a pedido do cliente ("investigar item a item, maior lista possível"). Achados aplicados no mesmo dia:
  - Seção "Plataforma Completa" da Home virou **bento grid** (padrão 2026 confirmado em Apple/Microsoft/Spotify, 23% mais profundidade de scroll medida) — CSS Grid puro, zero JS. Célula grande usa o screenshot real do dashboard do Google Ads; célula alta usa o screenshot real do relatório automático via WhatsApp; a célula de "Rastreamento via WhatsApp" usa um mockup ilustrativo construído em HTML/CSS (sem nome/telefone reais) em vez da imagem com PII — resolve a pendência de LGPD e a falta de prova visual ao mesmo tempo.
  - **Reveal-on-scroll migrado de JS para CSS puro** (`animation-timeline: view()`, scroll-driven animations nativas do Chrome/Edge/Safari), com fallback via `@supports` para navegadores sem suporte (elemento fica visível, nunca mais preso em opacity:0 se o JS falhar — bug latente do sistema antigo, corrigido de graça). `reveal.js` virou `counter.js`, mantendo só a lógica de contador numérico (a única parte que realmente precisa de JS).
  - Token `.section-light` criado e aplicado em 2 seções da Home (Qualifier, conteúdo local de SEO) — quebra a monotonia do tema 100% escuro (`bg` e `bg-2` eram quase idênticos) no espírito do padrão "editorial" que a pesquisa identificou como uma das duas estéticas dominantes em 2026 (a outra é "techno-futurista", que já é a base do nosso tema escuro+vermelho).
  - **Achado importante da pesquisa**: sites premiados (Awwwards) com vídeo/animação pesada rodam bem em laptop mas prejudicam Core Web Vitals em celular real — confirma que a estratégia zero-JS/Lighthouse 90-100 já adotada desde a Fase 0 estava certa; a lição aplicada foi "roubar o efeito visual com técnica leve (CSS)", não copiar literalmente sites pesados.
  - Testado em mobile (375px) e desktop (1280px): sem overflow, sem erro de console, bento grid com auto-placement correto, `.section-light` com contraste correto propagando pra componentes filhos (bg-glass, border-border), scroll-timeline confirmado funcionando.

## Checklist de Fases
- [x] Fase 0 — Fundação (Astro/Tailwind/React, tokens, layout, Nav/Footer, UI atoms, Meta/Schema)
- [x] Fase 1 — /seo, /calculadora (island React), Home completa
- [x] Fase 1.5 (fora do plano original, adicionada a pedido do cliente) — Catálogo expandido: `/criacao-de-sites` + `/simulador-de-site`, `/growth` + `/simulador-de-funil`, `/mentoria`, componentes de seção reutilizáveis, `/links` reorganizado
- [x] Fase 2 — /manifesto, /servicos + 3 subpáginas reais (google-ads, meta-ads, consultoria-trafego), /servicos/gestao-anuncios-online
- [x] Fase 3 — Páginas legais (com CNPJ real), 404, .htaccess, manifest, favicon. Auditoria de SEO/OG feita. Pacote de deploy pronto — **falta apenas o upload de fato**
- [ ] Fase 4 — Content Collections + página própria do case EMOPS
- [ ] Fase 5 — Conteúdo de autoridade (primeiro guia pilar de SEO/GEO ou tráfego pago, clusters) — horizonte mais longo, começar só depois do site no ar

## Não construir ainda (aguardando decisão do cliente / fases futuras)
- Página de vendas de WhatsApp Bot (Typebot + BotConversa) — depende da decisão de stack do Typebot
- Qualquer pixel de rastreamento (Meta/GTM/GA4/LinkedIn) — CSP fica restrita até o cliente confirmar instalação real
- Atendimento a governos/prefeituras (licitação, chatbot WhatsApp API) — fase/site próprio futuro, motion de venda diferente do site atual
- Programa de parceria/white-label para outras agências (B2B2B) — validar modelo internamente antes de ter página pública
- Página pessoal do CEO (Fabiano de Medeiros, link-tree/bio dentro do site) — backlog futuro, sem data
- GEO como produto/ticket separado — hoje embutido no pacote de SEO; revisitar quando o mercado brasileiro amadurecer (ver decisão de 2026-07-16)
- **NUNCA citar**: a mentoria de oftalmologia premium liderada pelo cliente (fora do escopo da Fórmula Mídia, confidencial)

## Pendências do cliente antes de publicar
- ~~CNPJ real~~ — resolvido em 2026-07-16 (55.777.659/0001-40)
- Fazer o upload de `formula-midia-astro-deploy.zip` (em Downloads) no Hostinger, substituindo TUDO em `public_html` — isso troca a arquitetura inteira do site (SPA antiga → Astro estático), não é um ajuste incremental como as vezes anteriores. Instruções passo a passo entregues no chat em 2026-07-16.

## O que falta para a Fase 4 (página do case EMOPS)
- ~~Confirmar permissão de citar "Grupo EMOPS" publicamente~~ — resolvido em 2026-07-16: cliente confirmou que papéis executivos seus/do sócio podem ser usados como case da Fórmula Mídia
- Decidir a URL: sugestão `/casos/emops` ou `/cases/grupo-emops`
- **Perguntar ao cliente**: tem mais detalhes do projeto EMOPS além do que já está na página de Gestão de Anúncios (contexto do nicho, prazo do resultado, alguma citação/depoimento, a escala real — cliente mencionou growth em 12 estados, vale destacar isso na página)?
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
| /mentoria | ✅ construído, testado (reposicionado 2026-07-16: 1:1, vagas limitadas por trimestre) |
| /servicos/whatsapp-bot (Typebot + BotConversa) | ⏸ adiado — depende de decisão de stack |
| Política de Privacidade / Termos de Uso | ✅ construído, CNPJ real preenchido |
| Carrossel de logos de clientes (Home) | ✅ construído, corrige gap de paridade com site antigo |
| Case EMOPS (página própria) | pendente (Fase 4) |

Os 16 FAQs originais (schema JSON-LD do site antigo) já estão salvos em `src/data/faq/{home,manifesto,servicos,gestao-anuncios-online}.ts` — os de manifesto/servicos/gestao-anuncios-online já estão prontos para a Fase 2, só falta usá-los nas páginas. FAQs novos (criacao-de-sites, growth, mentoria) também já estão em `src/data/faq/`.

## Problemas conhecidos / carregados
- **Nav mobile não tem menu nenhum** — em telas `< md` o `<nav>` esconde todos os links (`hidden md:flex`), sobrando só logo + botão de WhatsApp. Isso é anterior a esta sessão (não introduzido agora), mas ficou mais visível ao adicionar o dropdown de Serviços (que também some no mobile). Precisa de um menu hambúrguer mobile antes do site crescer mais em número de páginas — ainda não resolvido, registrar como próxima melhoria de UX.
- Drift de nome de manifest: o `manifest.json` antigo tinha `theme_color`/`background_color` fora dos tokens reais — corrigido na Fase 3.
- Bug encontrado e corrigido na Fase 1: blobs decorativos (absolute, blur) sem `overflow-hidden` no container pai causavam overflow horizontal no mobile em `/seo` (seção de CTA final) — checar isso em qualquer nova seção com blobs decorativos nas próximas fases.

## Próxima tarefa concreta
Cliente vai fazer o upload de `formula-midia-astro-deploy.zip` no Hostinger (instruções passo a passo dadas no chat em 2026-07-16). Depois disso: (1) validar os headers de segurança em produção (securityheaders.com), (2) validar Lighthouse na URL real, (3) seguir para a Fase 4 (case EMOPS — permissão já confirmada, falta só detalhes extras do case) ou Fase 5 (conteúdo pilar de SEO/GEO — falta decisão do cliente sobre `/blog/` vs `/recursos/`), conforme prioridade do cliente. Menu mobile (hambúrguer) também é candidato a próxima melhoria — hoje não existe navegação nenhuma em telas pequenas.
