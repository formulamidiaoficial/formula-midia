---
title: "GPTBot, ClaudeBot, PerplexityBot: guia rápido de quem é quem entre os robôs de IA"
description: "Seis robôs, dois grupos, um erro fácil de cometer. Um guia de referência rápida pra não bloquear o robô errado sem perceber."
pilar: "P4"
ferramentasRelacionadas: ["verificador-acesso-ia"]
artigosRelacionados: ["a-ia-esta-lendo-e-citando-seu-site"]
datePublished: 2026-10-05
faq:
  - question: "Essa lista de robôs é definitiva?"
    answer: "Não — novos motores de IA lançam robôs novos com frequência. Trate como referência de julho de 2026, revalidada a cada trimestre."
  - question: "Todo robô de IA respeita o robots.txt?"
    answer: "Os grandes provedores (OpenAI, Anthropic, Google, Perplexity) declaram respeitar — é assim que o bloqueio funciona. Robôs desconhecidos ou maliciosos podem ignorar a regra, mas esses não costumam se identificar corretamente de qualquer forma."
---

Seis nomes, dois grupos, uma regra simples: cada provedor de IA roda um robô para **treinar** seus modelos e outro robô, separado, para **buscar em tempo real** e citar fontes. Confundir os dois é a causa mais comum do erro "bloqueei sem querer".

## Grupo 1 — Robôs de treino

Alimentam o aprendizado dos modelos de IA. Bloquear estes não afeta se o site aparece citado numa resposta — só afeta se o conteúdo vira dado de treinamento futuro.

- **GPTBot** — treina os modelos da OpenAI (ChatGPT).
- **ClaudeBot** — treina os modelos da Anthropic (Claude).
- **Google-Extended** — treina o Gemini e alimenta o AI Overviews do Google.

## Grupo 2 — Robôs de busca/citação

Buscam ao vivo, no momento em que alguém faz uma pergunta, para decidir o que citar na resposta. Bloquear estes **corta a visibilidade da marca** nas respostas de IA — geralmente sem ninguém perceber, porque nada mais quebra visivelmente.

- **OAI-SearchBot** — busca ao vivo para o ChatGPT Search.
- **Claude-SearchBot** — busca ao vivo para as respostas do Claude.
- **PerplexityBot** — rastreia e cita sites nas respostas da Perplexity.

## O erro mais comum

Copiar um robots.txt "de proteção contra IA" encontrado pronto na internet, sem checar linha por linha quem está sendo bloqueado. Muitos desses modelos prontos bloqueiam os dois grupos ao mesmo tempo — o que pode ser intencional (evitar treino) ou pode estar cortando citação sem essa intenção.

## O erro técnico que quase ninguém avisa

Existe uma armadilha mais sutil que o erro de copiar regra pronta: ao criar um bloco específico para `User-agent: GPTBot`, algumas implementações de robots.txt **param de aplicar a regra geral (`User-agent: *`)** para esse robô especificamente — o oposto do que a maioria espera. O resultado prático: alguém tenta reforçar o bloqueio a um robô específico e, sem perceber, libera caminhos que a regra geral bloqueava para todo mundo. Depois de editar o robots.txt pra tratar um robô de IA à parte, vale reconferir se as regras gerais continuam valendo pros outros caminhos do site.

Há ainda um terceiro problema, fora do robots.txt: alguns sites bloqueiam o GPTBot sem querer através de regras de firewall (WAF) ou limite de requisições — o robô é classificado como tráfego suspeito e descartado com erro 429, mesmo com o robots.txt liberando o acesso. Se o robots.txt está correto e o bloqueio persiste, vale checar o WAF também.

## Como conferir o seu

Em vez de decorar os seis nomes e ler o robots.txt manualmente, a forma mais rápida é rodar a verificação automática, que já separa os dois grupos e mostra o status de cada robô.

→ **Confira agora:** [Verificador de Acesso de IA](/ferramentas/verificador-acesso-ia)
