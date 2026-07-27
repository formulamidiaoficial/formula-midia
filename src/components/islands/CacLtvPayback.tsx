import { useEffect, useMemo, useState } from "react";
import { waLink } from "../../data/schema";
import { trackEvent } from "../../lib/track";

// TOOL-002 (formula-foundation/CAPABILITIES/TOOL-002-cac-ltv-payback.md).
// Unit economics padrão de mercado — não é hipótese comportamental (diferente
// da TOOL-001): CAC, LTV e Payback são definição matemática. O único ponto
// externo é o benchmark LTV:CAC 3:1 (David Skok, "SaaS Metrics 2.0").

const REF = "cac-ltv-01";
const BENCHMARK_LTV_CAC = 3;

function fmtBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

type Leitura = "saudavel" | "atencao" | "critico";

function leituraDe(razao: number): { id: Leitura; label: string; cor: string } {
  if (razao >= BENCHMARK_LTV_CAC) return { id: "saudavel", label: "Saudável", cor: "text-[#1B7F4B]" };
  if (razao >= 1) return { id: "atencao", label: "Atenção", cor: "text-[#B26A00]" };
  return { id: "critico", label: "Crítico", cor: "text-red-hi" };
}

export default function CacLtvPayback() {
  const [investimento, setInvestimento] = useState<number | "">(5000);
  const [novosClientes, setNovosClientes] = useState<number | "">(10);
  const [ticketMedio, setTicketMedio] = useState<number | "">(300);
  const [margem, setMargem] = useState<number | "">(40);
  const [frequencia, setFrequencia] = useState<number | "">(1);
  const [mesesRetencao, setMesesRetencao] = useState<number | "">(12);

  useEffect(() => {
    trackEvent("tool_started", { tool: REF });
  }, []);

  const [interagiu, setInteragiu] = useState(false);
  function marcarInteracao() {
    if (interagiu) return;
    setInteragiu(true);
    trackEvent("tool_completed", { tool: REF });
  }

  const inv = typeof investimento === "number" ? investimento : 0;
  const clientes = typeof novosClientes === "number" ? novosClientes : 0;
  const ticket = typeof ticketMedio === "number" ? ticketMedio : 0;
  const margemFrac = (typeof margem === "number" ? margem : 0) / 100;
  const freq = typeof frequencia === "number" ? frequencia : 0;
  const meses = typeof mesesRetencao === "number" ? mesesRetencao : 0;

  const cac = clientes > 0 ? inv / clientes : 0;
  const lucroMensalPorCliente = ticket * margemFrac * freq;
  const ltv = lucroMensalPorCliente * meses;
  const paybackMeses = lucroMensalPorCliente > 0 ? cac / lucroMensalPorCliente : 0;
  const razao = cac > 0 ? ltv / cac : 0;
  const leitura = leituraDe(razao);

  const waHref = useMemo(() => {
    const lines = [
      "Olá! Calculei CAC, LTV e Payback da Fórmula Mídia:",
      `• CAC: ${fmtBRL(cac)}`,
      `• LTV: ${fmtBRL(ltv)}`,
      `• Payback: ${paybackMeses.toFixed(1)} meses`,
      `• Razão LTV:CAC: ${razao.toFixed(1)}:1 (${leitura.label})`,
      "",
      "Quero entender melhor a saúde do meu investimento em aquisição.",
      `— ref: ${REF}`,
    ];
    return waLink(lines.join("\n"));
  }, [cac, ltv, paybackMeses, razao, leitura]);

  return (
    <div className="mt-11 grid items-start gap-7 md:grid-cols-[1fr_1.15fr]">
      <div className="rounded-card border border-border bg-glass p-8">
        <NumField label="Investimento em aquisição no mês (R$)" value={investimento} onChange={setInvestimento} onFocus={marcarInteracao} placeholder="5000" />
        <NumField label="Novos clientes no mês" value={novosClientes} onChange={setNovosClientes} onFocus={marcarInteracao} placeholder="10" />
        <NumField label="Ticket médio (R$)" value={ticketMedio} onChange={setTicketMedio} onFocus={marcarInteracao} placeholder="300" />
        <NumField label="Margem (%)" value={margem} onChange={setMargem} onFocus={marcarInteracao} placeholder="40" hint="Margem sobre o ticket, não o faturamento bruto." />
        <NumField label="Frequência de compra por mês" value={frequencia} onChange={setFrequencia} onFocus={marcarInteracao} placeholder="1" hint="Quantas vezes o cliente compra/paga por mês, em média." />
        <NumField label="Tempo médio de retenção (meses)" value={mesesRetencao} onChange={setMesesRetencao} onFocus={marcarInteracao} placeholder="12" />
      </div>

      <div className="rounded-card border border-red/28 bg-gradient-to-b from-red/8 to-glass p-8">
        <h3 className="mb-5 font-heading text-xs font-semibold uppercase tracking-[.12em] text-red-hi">
          Saúde do investimento
        </h3>

        <div className="mb-6 grid grid-cols-3 gap-3">
          <MetricCard label="CAC" value={fmtBRL(cac)} />
          <MetricCard label="LTV" value={fmtBRL(ltv)} />
          <MetricCard label="Payback" value={`${paybackMeses.toFixed(1)}m`} />
        </div>

        <div className="mb-6 rounded-2xl border border-border-hi bg-glass-hi p-5 text-center">
          <div className="mb-1.5 text-[11px] uppercase tracking-[.08em] text-dim">Razão LTV:CAC</div>
          <div className={`font-heading text-[38px] font-bold leading-none ${leitura.cor}`}>
            {razao.toFixed(1)}:1
          </div>
          <div className={`mt-1.5 font-heading text-[13px] font-bold ${leitura.cor}`}>{leitura.label}</div>
          <div className="mt-1 text-[11px] text-dim">Benchmark de mercado: 3:1</div>
        </div>

        <a
          href={waHref}
          target="_blank"
          rel="noopener"
          onClick={() => trackEvent("cta_whatsapp", { tool: REF })}
          className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5"
        >
          Quero melhorar essa razão →
        </a>
        <p className="mt-3.5 text-center text-[11.5px] leading-relaxed text-dim">
          Benchmark 3:1: David Skok, "SaaS Metrics 2.0" (forEntrepreneurs.com) — amplamente replicado
          em unit economics de recorrência.
        </p>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-glass p-4 text-center">
      <div className="mb-1 text-[10.5px] uppercase tracking-[.06em] text-dim">{label}</div>
      <div className="font-heading text-[18px] font-bold text-ink">{value}</div>
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
  onFocus,
  placeholder,
  hint,
}: {
  label: string;
  value: number | "";
  onChange: (v: number | "") => void;
  onFocus: () => void;
  placeholder: string;
  hint?: string;
}) {
  return (
    <div className="mb-6">
      <label className="mb-1.5 block font-heading text-[14px] font-semibold">{label}</label>
      {hint && <div className="mb-2 text-[12px] text-dim">{hint}</div>}
      <input
        type="number"
        inputMode="decimal"
        min={0}
        value={value}
        placeholder={placeholder}
        onFocus={onFocus}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-full rounded-2xl border border-border bg-bg px-4 py-3.5 font-body text-[15px] text-ink outline-none focus:border-red"
      />
    </div>
  );
}
