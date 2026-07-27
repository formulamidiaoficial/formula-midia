import { useEffect, useId, useMemo, useState } from "react";
import { waLink } from "../../data/schema";
import { trackEvent } from "../../lib/track";
import OptInPlacar from "./OptInPlacar";

// TOOL-001 (formula-foundation/CAPABILITIES/TOOL-001-custo-lead-perdido.md).
// 100% client-side. Multiplicadores derivados dos 3 achados do estudo
// Oldroyd/McElheran/Elkington ("The Short Life of Online Sales Leads",
// HBR/MIT 2011, dados replicados por InsideSales.com/Velocify):
//  - responder em <5min = ~21x mais chance de qualificar que esperar 30min
//  - responder na 1ª hora = ~7x mais chance que esperar mais 1 hora
//  - cada hora extra após os primeiros 60min reduz a chance em ~10x
// Não é medição — é hipótese com fonte (ver aviso na tela). Os 6 valores
// abaixo são uma curva de decaimento consistente com essas 3 âncoras,
// normalizada contra <5min = 1.0.

const REF = "lead-perdido-10";
const BENCHMARK_CONVERSAO = 3; // % — benchmark quando o usuário não informa o próprio número

type FaixaId = "5min" | "30min" | "1h" | "24h" | "mais24h" | "naosei";

interface Faixa {
  id: FaixaId;
  label: string;
  multiplicador: number;
}

const FAIXAS: Faixa[] = [
  { id: "5min", label: "Até 5 minutos", multiplicador: 1 },
  { id: "30min", label: "5 a 30 minutos", multiplicador: 0.048 },
  { id: "1h", label: "30 minutos a 1 hora", multiplicador: 0.03 },
  { id: "24h", label: "1 a 24 horas", multiplicador: 0.007 },
  { id: "mais24h", label: "Mais de 24 horas", multiplicador: 0.0007 },
  { id: "naosei", label: "Não sei", multiplicador: 0.007 }, // assume faixa 1-24h como típica
];

function fmtBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export default function CustoLeadPerdido() {
  const [leadsMes, setLeadsMes] = useState<number | "">(100);
  const [ticketMedio, setTicketMedio] = useState<number | "">(500);
  const [taxaInformada, setTaxaInformada] = useState<number | "">("");
  const [faixaId, setFaixaId] = useState<FaixaId>("24h");

  useEffect(() => {
    trackEvent("tool_started", { tool: REF });
  }, []);

  const taxaBase = (typeof taxaInformada === "number" ? taxaInformada : BENCHMARK_CONVERSAO) / 100;
  const faixaAtual = FAIXAS.find((f) => f.id === faixaId)!;
  const leads = typeof leadsMes === "number" ? leadsMes : 0;
  const ticket = typeof ticketMedio === "number" ? ticketMedio : 0;

  const taxaIdeal = taxaBase * 1; // <5min é a referência (multiplicador 1.0)
  const taxaAtual = taxaBase * faixaAtual.multiplicador;
  const leadsPerdidosMes = Math.max(0, leads * (taxaIdeal - taxaAtual));
  const custoMensal = leadsPerdidosMes * ticket;

  const vendasIdeal = Math.round(leads * taxaIdeal);
  const vendasAtual = Math.round(leads * taxaAtual);

  const [interagiu, setInteragiu] = useState(false);
  function marcarInteracao() {
    if (interagiu) return;
    setInteragiu(true);
    trackEvent("tool_completed", { tool: REF });
  }

  const waHref = useMemo(() => {
    const lines = [
      "Olá! Calculei o custo do lead perdido da Fórmula Mídia:",
      `• Leads/mês: ${leads}`,
      `• Tempo de resposta hoje: ${faixaAtual.label}`,
      `• Perda estimada: ${fmtBRL(custoMensal)}/mês`,
      "",
      "Quero ajuda para responder lead mais rápido.",
      `— ref: ${REF}`,
    ];
    return waLink(lines.join("\n"));
  }, [leads, faixaAtual, custoMensal]);

  return (
    <div className="mt-11 grid items-start gap-7 md:grid-cols-[1fr_1.15fr]">
      <div className="rounded-card border border-border bg-glass p-8">
        <NumField
          label="Leads por mês"
          value={leadsMes}
          onChange={setLeadsMes}
          onFocus={marcarInteracao}
          placeholder="100"
        />
        <NumField
          label="Ticket médio (R$)"
          value={ticketMedio}
          onChange={setTicketMedio}
          onFocus={marcarInteracao}
          placeholder="500"
        />
        <NumField
          label={`Taxa de conversão lead → venda hoje (%) — opcional, padrão ${BENCHMARK_CONVERSAO}%`}
          value={taxaInformada}
          onChange={setTaxaInformada}
          onFocus={marcarInteracao}
          placeholder={String(BENCHMARK_CONVERSAO)}
        />

        <div className="mb-2">
          <div className="mb-1.5 font-heading text-[15px] font-semibold">
            Tempo médio de resposta hoje
          </div>
          <div className="flex flex-wrap gap-2">
            {FAIXAS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setFaixaId(f.id);
                  marcarInteracao();
                }}
                className={
                  "rounded-xl border px-3.5 py-2.5 text-[12.5px] font-semibold transition-colors " +
                  (faixaId === f.id
                    ? "border-red bg-gradient-to-br from-red to-red-lo text-white"
                    : "border-border bg-glass text-mid hover:border-border-hi")
                }
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 text-[11.5px] leading-relaxed text-dim">
          <strong className="text-ink">Estimativa educativa</strong>, baseada em pesquisa de mercado
          (fonte abaixo) — não é diagnóstico do seu negócio. Os multiplicadores vêm de um estudo
          americano, não validado para o mercado brasileiro nem para nichos específicos.
        </p>
      </div>

      <div className="rounded-card border border-red/28 bg-gradient-to-b from-red/8 to-glass p-8">
        <h3 className="mb-5 font-heading text-xs font-semibold uppercase tracking-[.12em] text-red-hi">
          Estimativa de perda mensal
        </h3>

        <div className="mb-6 rounded-2xl border border-border-hi bg-glass-hi p-5 text-center">
          <div className="mb-1.5 text-[11px] uppercase tracking-[.08em] text-dim">
            Perda estimada por mês
          </div>
          <div className="font-heading text-[38px] font-bold leading-none text-red-hi">
            {fmtBRL(custoMensal)}
          </div>
          <div className="mt-1 text-[11px] text-dim">respondendo em "{faixaAtual.label.toLowerCase()}"</div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-glass p-4 text-center">
            <div className="mb-1 text-[10.5px] uppercase tracking-[.06em] text-dim">Se respondesse em 5min</div>
            <div className="font-heading text-[20px] font-bold text-ink">{vendasIdeal}</div>
            <div className="mt-0.5 text-[10px] text-dim">vendas/mês estimadas</div>
          </div>
          <div className="rounded-2xl border border-border bg-glass p-4 text-center">
            <div className="mb-1 text-[10.5px] uppercase tracking-[.06em] text-dim">Na faixa atual</div>
            <div className="font-heading text-[20px] font-bold text-ink">{vendasAtual}</div>
            <div className="mt-0.5 text-[10px] text-dim">vendas/mês estimadas</div>
          </div>
        </div>

        <a
          href={waHref}
          target="_blank"
          rel="noopener"
          onClick={() => trackEvent("cta_whatsapp", { tool: REF })}
          className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5"
        >
          Quero responder lead mais rápido →
        </a>
        <p className="mt-3.5 text-center text-[11.5px] leading-relaxed text-dim">
          Fonte: Oldroyd, McElheran & Elkington, "The Short Life of Online Sales Leads" (HBR/MIT,
          2011). Consultado em 2026-07-26.
        </p>

        <OptInPlacar
          ferramentaId="custo-do-lead-perdido"
          metrica="faixa_tempo_resposta_minutos"
          faixaDeValor={faixaAtual.id}
        />
      </div>
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
  onFocus,
  placeholder,
}: {
  label: string;
  value: number | "";
  onChange: (v: number | "") => void;
  onFocus: () => void;
  placeholder: string;
}) {
  const id = useId();
  return (
    <div className="mb-6">
      <label htmlFor={id} className="mb-2 block font-heading text-[14px] font-semibold">{label}</label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={0}
        value={value}
        placeholder={placeholder}
        onFocus={onFocus}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-full rounded-2xl border border-border bg-bg px-4 py-3.5 font-body text-[15px] text-ink outline-none focus:border-red focus:ring-2 focus:ring-red/35"
      />
    </div>
  );
}
