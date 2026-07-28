# Diagnóstico de Crescimento

> Status: 🟡 no build atual, aguardando re-deploy (entra no ar quando o cliente re-subir o zip — ver `DEPLOY.md`)
> Última atualização: 2026-07-25

## Resumo
Quiz guiado de 6 perguntas que dá uma nota 0–100 de maturidade de crescimento, aponta o maior gargalo do negócio e recomenda o próximo passo, gerando um lead no WhatsApp com o resultado embutido. É o gancho interativo mais forte da linha de growth.

## Onde vive o código
- **Rota:** `/diagnostico`
- **Página:** `src/pages/diagnostico.astro`
- **Island:** `src/components/islands/GrowthDiagnosis.tsx`
- **Renderização:** `client:load`
- **Compartilhado:** `WHATSAPP_NUMBER` de `src/data/schema.ts`

## Inputs
6 perguntas, uma por **dimensão de crescimento**, cada uma com 4 opções (score 0 a 3):

| # | Dimensão | Pergunta (resumo) |
|---|---|---|
| 1 | Aquisição | Como novos clientes chegam hoje? |
| 2 | Conversão | O que acontece quando alguém entra em contato? |
| 3 | Mensuração | Sabe quanto custa conquistar um cliente? |
| 4 | Previsibilidade | Consegue prever os clientes do próximo mês? |
| 5 | Presença digital | Como está o site/Google? |
| 6 | Relacionamento | Aproveita a base de clientes atual? |

## Lógica / fórmula
```
total = soma dos 6 scores (0..3 cada)
MAX   = 6 × 3 = 18
nota  = round(total / MAX × 100)     → 0 a 100
```
**Nível** pela nota: ≤ 40 → "Crescimento na sorte"; ≤ 70 → "Máquina em construção"; > 70 → "Máquina de crescimento".

**Maior gargalo** = dimensão com o **menor** score (a primeira, em caso de empate). A recomendação final é um texto fixo por dimensão (mapa `RECS` no código).

## Output
Nota /100, nível + descrição, breakdown por dimensão (barra `score/3`, destacando o gargalo), bloco "O próximo passo mais importante" (recomendação) e CTA **"Quero um diagnóstico completo com um especialista"** (WhatsApp com nível + gargalo embutidos). Tem botão "Refazer o diagnóstico".

## Dependências e limitações
100% client-side (foi a alternativa à "auditoria por URL", que exigiria backend e é inviável na Hostinger estática). Diagnóstico educativo/indicativo, não substitui análise completa. Sem persistência nem captura de e-mail (oportunidade futura: gatear o resultado por e-mail).

## Decisões e histórico
Criado em 2026-07-22 (commit `d9ef669`), dentro do pivot de posicionamento para growth. Ver `PROGRESS.md`.
