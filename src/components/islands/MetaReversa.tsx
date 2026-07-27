import { useEffect, useMemo, useState } from "react";
import { waLink } from "../../data/schema";
import { trackEvent } from "../../lib/track";

// TOOL-003 (formula-foundation/CAPABILITIES/TOOL-003-meta-reversa.md).
// Matemática reversa de funil — mesma lógica do Simulador de Funil já
// existente, invertida: parte do faturamento desejado, não do tráfego atual.

const REF = "meta-reversa-02";
const BENCHMARK_CONVERSAO = 25; // % lead -> venda, hipótese (docs/pesquisa/2026-07-25-achados-modernos.md)

function fmtBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export default function MetaReversa() {
  const [faturamento, setFaturamento] = useState<number | "">(50000);
  const [ticketMedio, setTicketMedio] = useState<number | "">(500);
  const [taxaInformada, setTaxaInformada] = useState<number | "">("");
  const [cpl, setCpl] = useState<number | "">(30);
  const [verbaDisponivel, setVerbaDisponivel] = useState<number | "">("");

  useEffect(() => {
    trackEvent("tool_started", { tool: REF });
  }, []);

  const [interagiu, setInteragiu] = useState(false);
  function marcarInteracao() {
    if (interagiu) return;
    setInteragiu(true);
    trackEvent("tool_completed", { tool: REF });
  }

  const fat = typeof faturamento === "number" ? faturamento : 0;
  const ticket = typeof ticketMedio === "number" ? ticketMedio : 0;
  const taxa = (typeof taxaInformada === "number" ? taxaInformada : BENCHMARK_CONVERSAO) / 100;
  const custoLead = typeof cpl === "number" ? cpl : 0;
  const verba = typeof verbaDisponivel === "number" ? verbaDisponivel : null;

  const vendasNecessarias = ticket > 0 ? fat / ticket : 0;
  const leadsNecessarios = taxa > 0 ? vendasNecessarias / taxa : 0;
  const verbaNecessaria = leadsNecessarios * custoLead;
  const gap = verba != null ? verba - verbaNecessaria : null;

  const waHref = useMemo(() => {
    const lines = [
      "Olá! Rodei a Meta Reversa da Fórmula Mídia:",
      `• Meta de faturamento: ${fmtBRL(fat)}`,
      `• Leads necessários: ${Math.ceil(leadsNecessarios)}`,
      `• Verba de mídia necessária: ${fmtBRL(verbaNecessaria)}`,
      gap != null ? `• Gap vs. verba disponível: ${fmtBRL(gap)}` : "",
      "",
      "Quero ajuda para planejar essa verba.",
      `— ref: ${REF}`,
    ].filter(Boolean);
    return waLink(lines.join("\n"));
  }, [fat, leadsNecessarios, verbaNecessaria, gap]);

  return (
    <div className="mt-11 grid items-start gap-7 md:grid-cols-[1fr_1.15fr]">
      <div className="rounded-card border border-border bg-glass p-8">
        <NumField label="Faturamento desejado no mês (R$)" value={faturamento} onChange={setFaturamento} onFocus={marcarInteracao} placeholder="50000" />
        <NumField label="Ticket médio (R$)" value={ticketMedio} onChange={setTicketMedio} onFocus={marcarInteracao} placeholder="500" />
        <NumField
          label={`Taxa de conversão lead → venda (%) — opcional, padrão ${BENCHMARK_CONVERSAO}%`}
          value={taxaInformada}
          onChange={setTaxaInformada}
          onFocus={marcarInteracao}
          placeholder={String(BENCHMARK_CONVERSAO)}
        />
        <NumField label="Custo por lead estimado (CPL, R$)" value={cpl} onChange={setCpl} onFocus={marcarInteracao} placeholder="30" />
        <NumField label="Verba disponível hoje (R$) — opcional" value={verbaDisponivel} onChange={setVerbaDisponivel} onFocus={marcarInteracao} placeholder="0" />

        <p className="mt-2 text-[11.5px] leading-relaxed text-dim">
          Estimativa educativa — assume taxa de conversão e CPL constantes, sem considerar saturação
          de mercado ao escalar verba.
        </p>
      </div>

      <div className="rounded-card border border-red/28 bg-gradient-to-b from-red/8 to-glass p-8">
        <h3 className="mb-5 font-heading text-xs font-semibold uppercase tracking-[.12em] text-red-hi">
          O que precisa pra chegar lá
        </h3>

        <div className="mb-6 grid grid-cols-3 gap-3">
          <MetricCard label="Vendas" value={Math.ceil(vendasNecessarias).toString()} />
          <MetricCard label="Leads" value={Math.ceil(leadsNecessarios).toString()} />
          <MetricCard label="Verba" value={fmtBRL(verbaNecessaria)} />
        </div>

        {gap != null && (
          <div className={`mb-6 rounded-2xl border p-5 text-center ${gap >= 0 ? "border-border-hi bg-glass-hi" : "border-red/40 bg-red/10"}`}>
            <div className="mb-1.5 text-[11px] uppercase tracking-[.08em] text-dim">
              {gap >= 0 ? "Sobra em relação à verba disponível" : "Falta em relação à verba disponível"}
            </div>
            <div className={`font-heading text-[28px] font-bold leading-none ${gap >= 0 ? "text-[#1B7F4B]" : "text-red-hi"}`}>
              {fmtBRL(Math.abs(gap))}
            </div>
          </div>
        )}

        <a
          href={waHref}
          target="_blank"
          rel="noopener"
          onClick={() => trackEvent("cta_whatsapp", { tool: REF })}
          className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5"
        >
          Quero planejar essa verba →
        </a>
        <p className="mt-3.5 text-center text-[11.5px] leading-relaxed text-dim">
          Benchmark de conversão ({BENCHMARK_CONVERSAO}%) é hipótese de mercado — o ideal é usar o
          seu próprio número.
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
}: {
  label: string;
  value: number | "";
  onChange: (v: number | "") => void;
  onFocus: () => void;
  placeholder: string;
}) {
  return (
    <div className="mb-6">
      <label className="mb-2 block font-heading text-[14px] font-semibold">{label}</label>
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
