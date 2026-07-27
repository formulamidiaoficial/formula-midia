---
title: "Quanto o seu cliente realmente custa (e quanto ele vale)"
description: "CAC, LTV, MER, Meta Reversa e Custo do Lead Perdido explicados como um fluxo único: a conta completa que a maioria dos negócios nunca fecha."
pilar: "P1"
ferramentasRelacionadas: ["custo-real-da-midia", "cac-ltv-payback", "mer-vs-roas", "custo-do-lead-perdido", "meta-reversa", "capacidade-comercial"]
artigosRelacionados: ["sua-operacao-aguenta-crescer", "presenca-local-e-conformidade"]
datePublished: 2026-08-03
faq:
  - question: "Preciso calcular os 5 números toda semana?"
    answer: "Não. CAC/LTV/Payback e MER×ROAS fazem sentido revisar mensalmente. Meta Reversa é pontual, no planejamento de orçamento. Custo do Lead Perdido vale revisar sempre que o processo de atendimento mudar (nova pessoa, novo CRM, novo horário)."
  - question: "Esses benchmarks (3:1, 21x) valem pro meu nicho específico?"
    answer: "São hipóteses com fonte, não medição do seu negócio — cada ferramenta linkada deixa isso explícito na tela, com a fonte e a data de verificação. Use como ponto de partida, não como diagnóstico final."
  - question: "Por onde eu começo, se nunca calculei nenhum desses números?"
    answer: "Por CAC e LTV — é a base de tudo o resto. Depois MER×ROAS, pra confirmar se o CAC que você calculou bate com a realidade do caixa."
---

A maioria dos negócios que anuncia sabe responder duas perguntas: quanto investiu em mídia no mês, e quantas vendas isso trouxe. É a conta mais simples de fazer — e a mais incompleta. Ela não diz se esse cliente **se pagou**, em quanto tempo, nem se o número que a plataforma de anúncios mostra bate com o que realmente entrou no caixa.

Este artigo junta as cinco perguntas que fecham essa conta de verdade — e cada uma delas já virou uma calculadora gratuita, então você não precisa fazer nenhuma continha na mão.

## CAC: o que você realmente pagou por cada cliente

CAC (Custo de Aquisição de Cliente) é o quanto você investiu em mídia dividido pelo número de clientes novos que isso trouxe naquele período:

```
CAC = investimento em aquisição ÷ novos clientes
```

O erro mais comum: calcular CAC só com o valor gasto em anúncio, esquecendo comissão de vendedor, ferramenta de CRM, ou qualquer custo direto de conquistar aquele cliente. Quanto mais completo o numerador, mais honesto o número.

→ **Calcule o seu CAC agora:** [Calculadora de CAC, LTV e Payback](/ferramentas/cac-ltv-payback)

## LTV: o cliente vale mais do que a primeira venda

LTV (Lifetime Value) é o lucro total que um cliente gera enquanto continua comprando de você — não só na primeira compra:

```
LTV = ticket médio × margem × frequência de compra por mês × meses de retenção
```

Um erro comum na direção oposta do CAC: usar o ticket **bruto**, sem descontar a margem. Isso infla o LTV artificialmente e faz um investimento ruim parecer bom no papel.

## A razão LTV:CAC: o número que resume tudo

Divida o LTV pelo CAC. O mercado usa **3:1** como referência de saúde (benchmark popularizado por David Skok, "SaaS Metrics 2.0"):

- **Abaixo de 1:1** — cada cliente novo custa mais do que gera de lucro. Investir mais verba só aumenta o prejuízo.
- **Entre 1:1 e 3:1** — dá lucro, mas com pouca margem de segurança.
- **Acima de 3:1** — provavelmente há espaço pra escalar o investimento com segurança.

## Payback: quando o cliente "se paga"

Payback é quantos meses leva até o lucro mensal daquele cliente cobrir o que foi gasto pra conquistá-lo:

```
Payback (meses) = CAC ÷ lucro mensal por cliente
```

Isso importa pro caixa, não só pro resultado no papel: um negócio pode ter LTV:CAC saudável e ainda assim quebrar de caixa se o payback for muito longo e o investimento em aquisição continuar alto mês a mês.

## MER × ROAS: o painel e o caixa raramente concordam

O ROAS que o Gerenciador de Anúncios mostra só enxerga o que a própria plataforma consegue atribuir a si mesma. O MER (Marketing Efficiency Ratio) ignora essa disputa de atribuição: olha só duas coisas, quanto entrou no caixa e quanto saiu em mídia, somando todos os canais.

```
MER = receita total do caixa ÷ investimento total em mídia
```

Um gap pequeno entre MER e ROAS reportado (abaixo de 15%) é normal. Um gap grande (acima de 40%) é sinal forte de que vale auditar o rastreio — venda offline não contada, pixel quebrado, atribuição cruzada entre plataformas.

→ **Compare o seu MER com o ROAS reportado:** [MER × ROAS de plataforma](/ferramentas/mer-vs-roas)

## Meta Reversa: comece pela meta, não pelo tráfego disponível

Todas as contas acima partem do que você já investe hoje. A Meta Reversa inverte a lógica: você diz quanto quer faturar, e ela calcula de trás pra frente quantas vendas, quantos leads e quanta verba isso exige — junto com o gap entre a verba que você tem hoje e a que precisaria.

```
vendas necessárias = faturamento desejado ÷ ticket médio
leads necessários  = vendas necessárias ÷ taxa de conversão
verba necessária    = leads necessários × custo por lead
```

→ **Planeje sua verba a partir da meta:** [Meta Reversa](/ferramentas/meta-reversa)

## Custo do Lead Perdido: a variável que ninguém mede

Nenhuma das contas acima captura um fator que pesquisa de mercado mostra ser decisivo: **velocidade de resposta**. Responder um lead em até 5 minutos pode significar até 21 vezes mais chance de qualificá-lo do que esperar 30 minutos (estudo Oldroyd/McElheran/Elkington, HBR/MIT 2011). Um CAC ótimo na planilha não significa nada se metade dos leads esfria antes de alguém responder.

→ **Veja quanto isso custa no seu negócio:** [Custo do Lead Perdido](/ferramentas/custo-do-lead-perdido)

## Como os 5 números conversam entre si

```
Meta Reversa (quanto preciso investir pra bater a meta)
        ↓
Investimento real em mídia
        ↓
CAC (quanto cada cliente custou)  ←→  MER × ROAS (o painel bate com o caixa?)
        ↓
LTV (quanto esse cliente vale)  →  Razão LTV:CAC (saudável?)
        ↓
Payback (quando o caixa "libera" esse cliente)
        ↑
Custo do Lead Perdido (quanto desse resultado vazou por demora de resposta)
```

E antes de escalar qualquer um desses números, vale confirmar que a operação aguenta o volume — é o tema do próximo artigo: [Sua operação aguenta crescer?](/blog/sua-operacao-aguenta-crescer)
