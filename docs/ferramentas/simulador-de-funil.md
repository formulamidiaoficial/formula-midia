# Simulador de Funil de Growth

> Status: 🟢 no ar
> Última atualização: 2026-07-25

## Resumo
Mostra ao dono do negócio quanto o funil dele fatura hoje e onde está o maior vazamento (topo ou fundo), comparando com benchmarks de mercado. Gera um lead no WhatsApp pedindo proposta de Growth.

## Onde vive o código
- **Rota:** `/simulador-de-funil`
- **Página:** `src/pages/simulador-de-funil.astro`
- **Island:** `src/components/islands/FunnelSimulator.tsx`
- **Renderização:** `client:load`
- **Compartilhado:** `WHATSAPP_NUMBER` de `src/data/schema.ts`

## Inputs
| Campo | Tipo | Faixa (passo) | Padrão |
|---|---|---|---|
| Tráfego mensal (visitantes) | slider | 300–30.000 (100) | 3.000 |
| Conversão visitante → lead | slider % | 0,5–10 (0,5) | 2% |
| Conversão lead → venda | slider % | 2–60 (1) | 15% |
| Ticket médio | slider R$ | 100–15.000 (100) | R$ 1.200 |

## Lógica / fórmula
```
leads       = tráfego × (conversão_lead / 100)
vendas      = leads   × (conversão_venda / 100)
faturamento = vendas  × ticket
```
**Benchmarks de mercado** usados como referência: visitante→lead **~3%** (`BENCHMARK_LEAD_CONV`), lead→venda **~25%** (`BENCHMARK_SALE_CONV`).

**Maior vazamento (gargalo):** compara `conversão_lead/3%` com `conversão_venda/25%`; a etapa com menor razão é o gargalo → **"topo"** (visitante→lead) ou **"fundo"** (lead→venda). A ferramenta mostra para quanto o faturamento subiria se essa etapa atingisse o benchmark.

## Output
Leads/mês, vendas/mês e faturamento estimado; bloco "Maior vazamento identificado" com o potencial de faturamento; CTA **"Falar com especialista sobre este funil"** (WhatsApp, mensagem "Quero uma proposta de Growth").

## Dependências e limitações
100% client-side. Estimativa educativa baseada em benchmarks genéricos, **não substitui um diagnóstico real do funil** (o próprio rodapé da ferramenta diz isso). Sem persistência nem captura de e-mail.

## Decisões e histórico
Construído na Fase 1.5, par da página flagship `/growth`. Ver `PROGRESS.md`.
