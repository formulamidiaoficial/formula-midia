# Deploy no Hostinger — guia passo a passo

Este documento existe para o cliente conseguir publicar (ou re-publicar) o
site sozinho, sem depender de estar em uma sessão com o Claude Code.

**Isto substitui o site inteiro.** O site atual em produção é uma SPA
compilada (sem código-fonte); o novo é 100% HTML/CSS estático gerado pelo
Astro. Não é um ajuste incremental — é uma troca completa de arquitetura.
Por isso o passo 1 (backup) não é opcional.

## Aviso antes de publicar as 3 ferramentas novas

`velocidade-usuario-real` e `comparador-historico` usam a API do Google (PageSpeed
Insights / CrUX). Sem uma chave própria (`PUBLIC_PAGESPEED_API_KEY` configurada no build),
a cota anônima do Google já está esgotada e a maioria dos visitantes vai ver erro de
quota na `velocidade-usuario-real` (a `comparador-historico` testou sem esse problema, mas
usa a mesma chave — pode esgotar com uso real). Antes de anunciar essas duas, crie uma
chave gratuita em [console.cloud.google.com](https://console.cloud.google.com) (ativar
"PageSpeed Insights API"), configure no `.env` e rode `npm run build` de novo antes de
gerar o zip. `analise-de-log` não depende de nenhuma API — pode publicar sem essa etapa.

## Antes de começar

- Pacote pronto: `Downloads/formula-midia-astro-deploy.zip` (regenerado em 26/07, ~2.63MB, 166
  arquivos — inclui as 10 ferramentas em `/ferramentas/` (as 7 já publicadas + **velocidade-usuario-real**,
  **analise-de-log** e **comparador-historico**, ainda não publicadas) e o tema claro/nav corrigido.
- Ele já contém tudo: HTML de todas as páginas, `/links`, `.htaccess`,
  `robots.txt`, `sitemap-index.xml`, `manifest.webmanifest`, favicon, imagens,
  CSS/JS.
- Regenerar este zip no futuro (após qualquer mudança de código):
  ```
  cd formula-midia
  npm run build
  # depois compactar o conteúdo de dist/ (não a pasta dist em si, o CONTEÚDO dela)
  ```

## Passo 1 — Backup do site atual (obrigatório)

1. Entrar em [hpanel.hostinger.com](https://hpanel.hostinger.com) → **Sites** → selecionar `formulamidia.com.br` → **Gerenciador de Arquivos** (File Manager).
2. Entrar na pasta `public_html`.
3. Selecionar tudo (Ctrl+A / "Selecionar tudo") → botão **Comprimir** → gerar um `.zip` (ex.: `backup-site-antigo-2026-07-16.zip`).
4. Baixar esse zip para o computador (botão **Baixar**) e guardar em local seguro. **Não prossiga sem confirmar que o download terminou e o arquivo abre.**

Esse backup é o seu "botão de pânico" — se algo der errado depois de publicar,
dá pra restaurar o site antigo em minutos.

## Passo 2 — Limpar o `public_html`

1. Ainda dentro de `public_html`, selecionar todos os arquivos e pastas **exceto**
   pastas de sistema que a Hostinger às vezes mantém (ex. `cgi-bin`, se existir — não mexer nela).
2. Excluir tudo o que for do site antigo (`index.html`, `assets/`, `seo/`,
   `calculadora/`, `links/`, `site formula.html`, `site formula_files/`,
   `.htaccess`, `robots.txt`, `sitemap.xml`, `manifest.json`, `favicon.ico`, etc.).
3. Confirmar que `public_html` ficou vazia (ou só com pastas de sistema da Hostinger).

## Passo 3 — Subir o novo site

1. No Gerenciador de Arquivos, dentro de `public_html`, usar **Fazer Upload**
   (ou arrastar e soltar) e enviar `formula-midia-astro-deploy.zip`.
2. Depois do upload, clicar com o botão direito no zip → **Extrair** (Extract),
   extraindo direto dentro de `public_html` (não dentro de uma subpasta nova).
3. Apagar o arquivo `.zip` depois de extrair (não precisa ficar publicado).
4. Conferir que `public_html` agora tem, na raiz: `index.html`, `.htaccess`,
   `manifest.webmanifest`, `robots.txt`, `sitemap-index.xml`, `favicon.ico`,
   `_astro/`, `assets/`, `links/`, `seo/`, `manifesto/`,
   `servicos/`, `segmentos/`, `growth/`, `criacao-de-sites/`, `mentoria/`,
   `privacidade/`, `termos/`, `404.html`, `scripts/`, e a pasta `ferramentas/`
   (contendo `calculadora/`, `diagnostico/`, `simulador-de-site/`,
   `simulador-de-funil/`, `custo-real-da-midia/`, `auditor-de-perfil/`,
   `medir-trafego-de-ia/`, **`velocidade-usuario-real/`, `analise-de-log/`,
   `comparador-historico/`** — **26/07: as 4 primeiras foram movidas da raiz pra
   cá, com 301 real no `.htaccess`; não devem mais existir soltas na raiz. As 3
   últimas são novas, ainda não publicadas.**).

   Se o Gerenciador de Arquivos não mostrar arquivos começando com `.`
   (como `.htaccess`) por padrão, ativar "Mostrar arquivos ocultos" nas
   configurações do Gerenciador de Arquivos para confirmar que ele está lá —
   sem ele, os headers de segurança e o redirecionamento HTTPS não funcionam.

## Passo 4 — Validar em produção

Depois do upload, testar (idealmente em uma aba anônima, pra evitar cache):

1. `https://formulamidia.com.br/` — carrega a Home, sem erros visuais.
2. `https://formulamidia.com.br/links/` — abre a página de links (nota a
   barra `/` no final).
3. `https://formulamidia.com.br/ferramentas/calculadora/` — a calculadora abre e calcula
   (uma das páginas com JavaScript real: `/ferramentas/diagnostico`, `/ferramentas/simulador-de-site`
   e `/ferramentas/simulador-de-funil` também são islands React). Testar também que as URLs antigas
   (`/calculadora`, `/diagnostico`, `/simulador-de-site`, `/simulador-de-funil`, sem `/ferramentas/`)
   redirecionam com **301** para a nova URL — não devem dar 404 nem 200 direto.
4. Testar 2-3 links de WhatsApp — devem abrir com o número certo
   (5548991826577) e mensagem pré-preenchida.
5. `https://formulamidia.com.br/sitemap-index.xml` — deve abrir um XML válido.
6. Abrir o DevTools (F12) → aba Console em 3-4 páginas → confirmar zero erros.
7. Rodar o site em [securityheaders.com](https://securityheaders.com) e em
   [PageSpeed Insights](https://pagespeed.web.dev) — confirmar nota A/A+ em
   headers de segurança e 90+ no Lighthouse.
8. Forçar recarregar (Ctrl+F5) se alguma página parecer com estilo quebrado —
   é só cache do navegador/CDN, não do servidor.

## Se algo der errado (rollback)

1. No Gerenciador de Arquivos, apagar tudo de `public_html` de novo.
2. Fazer upload do `backup-site-antigo-2026-07-16.zip` do Passo 1.
3. Extrair na raiz de `public_html`.

O site antigo volta a funcionar exatamente como estava antes.

## Depois de publicar

- Reenviar o sitemap no Google Search Console
  (`https://formulamidia.com.br/sitemap-index.xml`), caso a propriedade já
  exista lá.
- Testar o preview do link no WhatsApp (colar `https://formulamidia.com.br`
  numa conversa) para confirmar que a imagem/descrição de Open Graph aparece
  certa.
