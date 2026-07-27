# Calculadora de Projeto SEO & GEO

> Status: 🟢 no ar
> Última atualização: 2026-07-25

## Resumo
Dimensiona o porte de um projeto de SEO/GEO a partir de escolhas simples (páginas, cidades, objetivo de ranking) e gera um lead qualificado no WhatsApp já com o escopo simulado.

## Onde vive o código
- **Rota:** `/calculadora`
- **Página:** `src/pages/calculadora.astro`
- **Island:** `src/components/islands/Calculator.tsx`
- **Renderização:** `client:load`
- **Compartilhado:** `WHATSAPP_NUMBER` de `src/data/schema.ts`

## Inputs
| Campo | Tipo | Faixa / opções | Peso no score |
|---|---|---|---|
| Landing pages | slider | 1–20 | × 1.6 |
| Páginas de cidade | slider | 0–30 | × 0.9 |
| Objetivo de ranking | pills | Top 10 · Top 3 · Posição #1 | 10 · 20 · 32 |
| Concorrência | pills | Baixa · Média · Alta | 0 · 10 · 20 |
| GEO (busca por IA) | toggle (padrão: ligado) | sim/não | +8 se sim |
| Preciso de site novo | toggle (padrão: desligado) | sim/não | +10 se sim |

## Lógica / fórmula
`score = landing×1.6 + cidades×0.9 + ranking + concorrência + (GEO ? 8 : 0) + (site novo ? 10 : 0)`

O score cai numa faixa (tier):

| Score | Porte | Barra | Prazo |
|---|---|---|---|
| < 30 | Essencial | 28% | 3 a 4 meses |
| < 60 | Avançado | 58% | 4 a 6 meses |
| < 90 | Estruturado | 80% | 6 a 8 meses |
| ≥ 90 | Enterprise | 100% | 8+ meses |

> ⚠️ O comentário no código avisa: essa fórmula é a mesma da calculadora vanilla-JS original. Se o scoring mudar, manter as duas em sincronia.

## Output
Painel-resumo com as escolhas, bloco "Porte estimado do projeto" (nome do tier, barra de %, prazo) e CTA **"Falar com especialista sobre este projeto"**, que abre o WhatsApp com o escopo pré-preenchido.

## Dependências e limitações
100% client-side (roda na Hostinger estática). Não persiste dados nem captura e-mail. É estimativa comercial/educativa, não um orçamento fechado.

## Decisões e histórico
Portada do site antigo na Fase 1 (primeira island React do projeto). Detalhe cronológico completo no `PROGRESS.md`.
