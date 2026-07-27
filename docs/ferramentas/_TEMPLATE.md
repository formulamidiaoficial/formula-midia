# <Nome da Ferramenta>

> Status: 🟡 em construção · 🟢 no ar · ⏸ pausada — **escolha um**
> Última atualização: AAAA-MM-DD

## Resumo
Uma frase: o que a ferramenta resolve e qual lead ela capta.

## Onde vive o código
- **Rota (URL):** `/<slug>`
- **Página:** `src/pages/<slug>.astro`
- **Island (React):** `src/components/islands/<Nome>.tsx`
- **Dados/config compartilhados:** `src/data/<arquivo>.ts` (ex.: `WHATSAPP_NUMBER` em `src/data/schema.ts`)
- **Renderização:** `client:load` / `client:visible` / `client:idle` — **qual?**

## Inputs (o que o usuário responde)
| Campo | Tipo | Opções / faixa | Peso na lógica |
|---|---|---|---|
| Ex.: Aquisição | escolha 0-3 | 4 opções | 1 dimensão |

## Lógica / fórmula
Como o input vira resultado. Seja explícito (é isto que faz a ferramenta ser "oficial" e reproduzível):
- Ex.: cada resposta = score 0-3 da dimensão; nota final = média × 100/3; menor dimensão = maior gargalo.

## Output (o que a ferramenta entrega)
- O que aparece na tela (nota, nível, gargalo, recomendação…).
- **CTA final:** ex.: botão de WhatsApp com o resultado embutido na mensagem.

## Dependências e limitações
- Ex.: 100% client-side, sem backend (roda na Hostinger estática). Não persiste dados. Não faz captura de e-mail ainda.

## Decisões e histórico
- AAAA-MM-DD — commit `xxxxxxx` — o que mudou. (Detalhe cronológico completo fica no `PROGRESS.md`.)
