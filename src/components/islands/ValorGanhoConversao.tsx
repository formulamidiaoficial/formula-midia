import { useEffect, useId, useMemo, useState } from "react";
import { waLink } from "../../data/schema";
import { trackEvent } from "../../lib/track";

// TOOL-006 (formula-foundation/CAPABILITIES/TOOL-006-valor-ganho-conversao.md).
// Matemática direta, mesma aritmética do Simulador de Funil, aplicada a uma
// pergunta específica: quanto vale meio ponto percentual de conversão.

const REF = "ganho-conversao-12";
const GANHO_PP = 0.5;

function fmtBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export default function ValorGanhoConversao() {
  const [trafego, setTrafego] = useState<number | "">(5000);
  const [taxaAtual, setTaxaAtual] = useState<number | "">(2);
  const [ticketMedio, setTicketMedio] = useState<number | "">(300);

  useEffect(() => {
    trackEvent("tool_started", { tool: REF });
  }, []);

  const [interagiu, setInteragiu] = useState(false);
  function marcarInteracao() {
    if (interagiu) return;
    setInteragiu(true);
    trackEvent("tool_completed", { tool: REF });
  }

  const trafegoNum = typeof trafego === "number" ? trafego : 0;
  const taxa = typeof taxaAtual === "number" ? taxaAtual : 0;
  const ticket = typeof ticketMedio === "number" ? ticketMedio : 0;

  const vendasAtual = trafegoNum * (taxa / 100);
  const vendasNova = trafegoNum * ((taxa + GANHO_PP) / 100);
  const ganhoMensal = (vendasNova - vendasAtual) * ticket;
  const ganhoAnual = ganhoMensal * 12;

  const waHref = useMemo(() => {
    const lines = [
      "Olá! Calculei o valor do ganho de conversão na Fórmula Mídia:",
      `• Taxa atual: ${taxa}% → ${(taxa + GANHO_PP).toFixed(1)}%`,
      `• Ganho estimado: ${fmtBRL(ganhoMensal)}/mês (${fmtBRL(ganhoAnual)}/ano)`,
      "",
      "Quero saber como subir minha taxa de conversão.",
      `— ref: ${REF}`,
    ];
    return waLink(lines.join("\n"));
  }, [taxa, ganhoMensal, ganhoAnual]);

  return (
    <div className="mt-11 grid items-start gap-7 md:grid-cols-[1fr_1.15fr]">
      <div className="rounded-card border border-border bg-glass p-8">
        <NumField label="Tráfego mensal (visitas)" value={trafego} onChange={setTrafego} onFocus={marcarInteracao} placeholder="5000" />
        <NumField label="Taxa de conversão atual (%)" value={taxaAtual} onChange={setTaxaAtual} onFocus={marcarInteracao} placeholder="2" />
        <NumField label="Ticket médio (R$)" value={ticketMedio} onChange={setTicketMedio} onFocus={marcarInteracao} placeholder="300" />

        <p className="mt-2 text-[11.5px] leading-relaxed text-dim">
          Meio ponto percentual não custa o mesmo em qualquer patamar: sair de 1% para 1,5% costuma
          ser mais fácil do que sair de 8% para 8,5%.
        </p>
      </div>

      <div className="rounded-card border border-red/28 bg-gradient-to-b from-red/8 to-glass p-8">
        <h3 className="mb-5 font-heading text-xs font-semibold uppercase tracking-[.12em] text-red-hi">
          O que meio ponto vale
        </h3>

        <div className="mb-6 rounded-2xl border border-border-hi bg-glass-hi p-5 text-center">
          <div className="mb-1.5 text-[11px] uppercase tracking-[.08em] text-dim">Ganho mensal estimado</div>
          <div className="font-heading text-[38px] font-bold leading-none text-red-hi">{fmtBRL(ganhoMensal)}</div>
          <div className="mt-1 text-[11px] text-dim">só subindo {taxa}% → {(taxa + GANHO_PP).toFixed(1)}%</div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <MetricCard label="Vendas hoje" value={Math.round(vendasAtual).toString()} sub="por mês" />
          <MetricCard label="Vendas com o ganho" value={Math.round(vendasNova).toString()} sub="por mês" />
        </div>

        <div className="mb-6 rounded-2xl border border-border bg-glass p-5 text-center">
          <div className="mb-1 text-[11px] uppercase tracking-[.08em] text-dim">Projeção anual</div>
          <div className="font-heading text-[22px] font-bold text-ink">{fmtBRL(ganhoAnual)}</div>
        </div>

        <a
          href={waHref}
          target="_blank"
          rel="noopener"
          onClick={() => trackEvent("cta_whatsapp", { tool: REF })}
          className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5"
        >
          Quero subir minha conversão →
        </a>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-border bg-glass p-4 text-center">
      <div className="mb-1 text-[10.5px] uppercase tracking-[.06em] text-dim">{label}</div>
      <div className="font-heading text-[20px] font-bold text-ink">{value}</div>
      <div className="mt-0.5 text-[10px] text-dim">{sub}</div>
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
