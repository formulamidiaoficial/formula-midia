# Simulador de Site

> Status: 🟢 no ar
> Última atualização: 2026-07-25

## Resumo
Ajuda quem quer um site/loja a dimensionar o escopo (nº de páginas, e-commerce, blog, área de membros) e devolve um porte estimado, gerando um lead no WhatsApp com o resumo.

## Onde vive o código
- **Rota:** `/simulador-de-site`
- **Página:** `src/pages/simulador-de-site.astro`
- **Island:** `src/components/islands/SiteSimulator.tsx`
- **Renderização:** `client:load`
- **Compartilhado:** `WHATSAPP_NUMBER` de `src/data/schema.ts`

## Inputs
| Campo | Tipo | Faixa / opções | Peso no score |
|---|---|---|---|
| Quantas páginas | slider | 1–15 | × 3 |
| Tipo de projeto | pills | Site novo · Redesign | 0 · 8 |
| Loja virtual (e-commerce) | toggle | sim/não | +30 |
| Blog / conteúdo | toggle | sim/não | +12 |
| Área de membros / login | toggle | sim/não | +18 |

## Lógica / fórmula
`score = páginas×3 + (e-commerce ? 30 : 0) + (blog ? 12 : 0) + (membros ? 18 : 0) + tipo`

Usa **os mesmos limiares de tier da Calculadora SEO** (para consistência entre as ferramentas), mudando só a unidade do prazo (semanas em vez de meses):

| Score | Porte | Barra | Prazo |
|---|---|---|---|
| < 30 | Essencial | 28% | 2 a 3 semanas |
| < 60 | Avançado | 58% | 3 a 5 semanas |
| < 90 | Estruturado | 80% | 5 a 8 semanas |
| ≥ 90 | Enterprise | 100% | 8+ semanas |

## Output
Painel-resumo das escolhas, "Porte estimado do projeto" (tier, barra, prazo) e CTA **"Falar com especialista sobre este projeto"** abrindo o WhatsApp com o resumo pré-preenchido.

## Dependências e limitações
100% client-side. Não persiste dados nem captura e-mail. Estimativa comercial/educativa.

## Decisões e histórico
Construído na Fase 1.5 (catálogo expandido, produto "Criação de Sites"), par da página `/criacao-de-sites`. Ver `PROGRESS.md`.
