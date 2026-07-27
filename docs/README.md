# Documentação — Fórmula Mídia

Documentação **oficial e estável** do projeto. Fica no repositório-fonte (`Downloads/formula-midia/`), versionada no git junto com o código.

> 🚫 **Nunca** documente na pasta `formula-midia-astro-deploy/` nem em `dist/`: são saída de build, apagadas e regeradas a cada `npm run build`.

## Onde vai cada tipo de coisa

| Tipo | Onde | Exemplo |
|---|---|---|
| **Spec oficial de uma ferramenta** (o que faz, inputs, lógica, output) | `docs/ferramentas/<slug>.md` | `docs/ferramentas/diagnostico-de-crescimento.md` |
| **Log/decisões por sessão** (cronológico, "fiz X em tal data") | `PROGRESS.md` (raiz) | — |
| **Runbook de deploy** | `DEPLOY.md` (raiz) | — |
| **Dados/config que a ferramenta consome** (não é doc, é código) | `src/data/*.ts` | `src/data/segments.ts` |
| **Ajuda pública / metodologia visível no site** (pro usuário final) | página em `src/pages/` ou Content Collection em `src/content/` | — |

Regra prática: **`docs/` = referência que não muda toda semana. `PROGRESS.md` = diário do que foi feito.**

## Ferramentas (stack atual)

Cada ferramenta = página `src/pages/<slug>.astro` + island `src/components/islands/<Nome>.tsx`.

| Ferramenta | Rota | Island | Doc |
|---|---|---|---|
| Calculadora de Projeto SEO & GEO | `/calculadora` | `Calculator.tsx` | [doc](ferramentas/calculadora-seo-geo.md) |
| Simulador de Site | `/simulador-de-site` | `SiteSimulator.tsx` | [doc](ferramentas/simulador-de-site.md) |
| Simulador de Funil | `/simulador-de-funil` | `FunnelSimulator.tsx` | [doc](ferramentas/simulador-de-funil.md) |
| Diagnóstico de Crescimento | `/diagnostico` | `GrowthDiagnosis.tsx` | [doc](ferramentas/diagnostico-de-crescimento.md) |

## Como documentar uma ferramenta nova

1. Copie `docs/ferramentas/_TEMPLATE.md` para `docs/ferramentas/<slug>.md`.
2. Preencha todos os campos.
3. Adicione a linha dela na tabela acima.
4. Registre no `PROGRESS.md` que a ferramenta foi criada (o log), linkando pra doc.
