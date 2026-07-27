---
title: "LCP, CLS e INP: o que cada métrica do Core Web Vitals realmente mede"
description: "Três siglas, três problemas diferentes. O que cada uma mede, por que o Google usa como sinal de ranking, e como melhorar cada uma."
pilar: "P5"
ferramentasRelacionadas: ["velocidade-usuario-real", "auditoria-tecnica-seo"]
artigosRelacionados: ["seu-site-e-rapido-e-bem-visto-pelo-google"]
datePublished: 2026-10-12
faq:
  - question: "As três métricas pesam igual no ranking do Google?"
    answer: "O Google não divulga o peso exato de cada uma — na prática, todas as três importam, e um site fraco em qualquer uma delas tende a perder posição."
  - question: "Dá pra melhorar as três ao mesmo tempo?"
    answer: "Sim, e frequentemente uma correção ajuda mais de uma métrica — otimizar imagens, por exemplo, costuma melhorar LCP e reduzir a chance de CLS causado por imagem sem dimensão definida."
---

[Core Web Vitals](/glossario/core-web-vitals) não é uma nota só — são três métricas independentes, cada uma medindo um tipo diferente de problema de experiência.

## LCP (Largest Contentful Paint) — velocidade percebida

Mede quanto tempo leva até o maior elemento visível da tela terminar de carregar. É a métrica mais próxima de "a página carregou", na percepção de quem visita.

**Causas comuns de LCP ruim:** imagem de destaque sem otimização, servidor lento pra responder, CSS bloqueando a renderização.

**Como melhorar:** comprimir e redimensionar imagens antes de subir ao site, usar carregamento prioritário na imagem principal, revisar a hospedagem se o servidor demora pra responder.

## CLS (Cumulative Layout Shift) — estabilidade visual

Mede o quanto os elementos da página se movem inesperadamente durante o carregamento — o clássico "cliquei no lugar errado porque algo pulou na última hora".

**Causas comuns de CLS ruim:** imagem ou anúncio carregando sem dimensão reservada no layout, fonte customizada trocando o tamanho do texto depois de carregar, conteúdo inserido dinamicamente acima do que já estava visível.

**Como melhorar:** sempre declarar largura e altura de imagens no HTML, reservar espaço para anúncios/embeds antes de carregarem, evitar inserir conteúdo novo acima do que o usuário já está vendo.

## INP (Interaction to Next Paint) — responsividade

Mede quanto tempo a página demora pra reagir visualmente depois que alguém clica ou toca em algo. Substituiu o antigo FID (First Input Delay) como métrica oficial do Core Web Vitals.

**Causas comuns de INP ruim:** JavaScript pesado bloqueando a thread principal, scripts de terceiros (chat, pixel, analytics) competindo por processamento no momento do clique.

**Como melhorar:** carregar scripts de terceiros de forma assíncrona, adiar o que não é essencial pro primeiro clique, revisar plugins/scripts acumulados ao longo do tempo.

Vale saber que essa é a métrica onde mais site brasileiro falha: medições de campo mostram algo perto de 40% das origens mobile não passando no limiar "bom" de INP — a métrica mais recente do trio, e a menos otimizada até agora. Boa parte da causa nem é código próprio: sites comerciais típicos carregam bem mais de uma dezena de scripts de terceiros (chat, pixel de anúncio, analytics, heatmap) antes mesmo do código do próprio site rodar — cada um concorrendo pela mesma thread principal no momento em que o visitante tenta clicar em algo.

## Como ver as três juntas no seu site

Em vez de calcular cada uma manualmente, a ferramenta de Velocidade + Usuário Real já traz as três métricas, tanto em laboratório quanto com dado de usuário real (campo).

→ **Veja as três agora:** [Velocidade + Usuário Real](/ferramentas/velocidade-usuario-real)
