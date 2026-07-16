import { useMemo, useState } from "react";
import { WHATSAPP_NUMBER } from "../../data/schema";

// Reasonable industry benchmarks used only to point at where the biggest
// relative gap is — not a claim of precise diagnostics.
const BENCHMARK_LEAD_CONV = 3; // % visitantes -> leads
const BENCHMARK_SALE_CONV = 25; // % leads -> vendas

function sliderFillStyle(value: number, min: number, max: number) {
  const pct = ((value - min) / (max - min)) * 100;
  return { "--fill": `${pct}%` } as React.CSSProperties;
}

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export default function FunnelSimulator() {
  const [traffic, setTraffic] = useState(3000);
  const [leadConv, setLeadConv] = useState(2);
  const [saleConv, setSaleConv] = useState(15);
  const [ticket, setTicket] = useState(1200);

  const leads = traffic * (leadConv / 100);
  const sales = leads * (saleConv / 100);
  const revenue = sales * ticket;

  const potentialSales = traffic * (BENCHMARK_LEAD_CONV / 100) * (BENCHMARK_SALE_CONV / 100);
  const potentialRevenue = potentialSales * ticket;

  const leadRatio = Math.min(leadConv / BENCHMARK_LEAD_CONV, 1);
  const saleRatio = Math.min(saleConv / BENCHMARK_SALE_CONV, 1);
  const bottleneck = leadRatio <= saleRatio ? "topo" : "fundo";

  const bottleneckLabel =
    bottleneck === "topo"
      ? "Topo de funil (visitante → lead)"
      : "Fundo de funil (lead → venda)";

  const waHref = useMemo(() => {
    const lines = [
      "Olá! Simulei meu funil no site da Fórmula Mídia:",
      `• Tráfego mensal: ${Math.round(traffic).toLocaleString("pt-BR")} visitantes`,
      `• Conversão visitante → lead: ${leadConv}%`,
      `• Conversão lead → venda: ${saleConv}%`,
      `• Ticket médio: ${formatBRL(ticket)}`,
      `• Faturamento estimado atual: ${formatBRL(revenue)}`,
      `• Maior vazamento identificado: ${bottleneckLabel}`,
      "",
      "Quero uma proposta de Growth.",
    ];
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traffic, leadConv, saleConv, ticket, revenue, bottleneckLabel]);

  return (
    <div className="mt-11 grid items-start gap-7 md:grid-cols-[1.3fr_1fr]">
      <div className="rounded-card border border-border bg-glass p-8">
        <Field label="Tráfego mensal (visitantes)" value={traffic.toLocaleString("pt-BR")}>
          <input
            type="range"
            className="range-slider"
            min={300}
            max={30000}
            step={100}
            value={traffic}
            style={sliderFillStyle(traffic, 300, 30000)}
            onChange={(e) => setTraffic(Number(e.target.value))}
          />
        </Field>

        <Field label="Conversão de visitante para lead" value={`${leadConv}%`} hint={`Referência de mercado: ~${BENCHMARK_LEAD_CONV}%`}>
          <input
            type="range"
            className="range-slider"
            min={0.5}
            max={10}
            step={0.5}
            value={leadConv}
            style={sliderFillStyle(leadConv, 0.5, 10)}
            onChange={(e) => setLeadConv(Number(e.target.value))}
          />
        </Field>

        <Field label="Conversão de lead para venda" value={`${saleConv}%`} hint={`Referência de mercado: ~${BENCHMARK_SALE_CONV}%`}>
          <input
            type="range"
            className="range-slider"
            min={2}
            max={60}
            step={1}
            value={saleConv}
            style={sliderFillStyle(saleConv, 2, 60)}
            onChange={(e) => setSaleConv(Number(e.target.value))}
          />
        </Field>

        <Field label="Ticket médio" value={formatBRL(ticket)} last>
          <input
            type="range"
            className="range-slider"
            min={100}
            max={15000}
            step={100}
            value={ticket}
            style={sliderFillStyle(ticket, 100, 15000)}
            onChange={(e) => setTicket(Number(e.target.value))}
          />
        </Field>
      </div>

      <div className="rounded-card border border-red/28 bg-gradient-to-b from-red/8 to-glass p-8 md:sticky md:top-24">
        <h3 className="mb-5 font-heading text-xs font-semibold uppercase tracking-[.12em] text-red-hi">
          Resumo do seu funil
        </h3>

        <div className="mb-6.5 flex flex-col gap-3.5">
          <SummaryRow label="Leads / mês" value={Math.round(leads).toLocaleString("pt-BR")} />
          <SummaryRow label="Vendas / mês" value={Math.round(sales).toLocaleString("pt-BR")} />
          <SummaryRow label="Faturamento estimado" value={formatBRL(revenue)} />
        </div>

        <div className="mb-6 rounded-2xl border border-border-hi bg-glass-hi p-5 text-center">
          <div className="mb-2 text-[11px] uppercase tracking-[.08em] text-dim">Maior vazamento identificado</div>
          <div className="mb-2.5 font-heading text-[19px] font-bold text-red-hi">{bottleneckLabel}</div>
          <div className="text-xs leading-relaxed text-dim">
            Se essa etapa chegasse à referência de mercado, o faturamento estimado subiria para{" "}
            <strong className="text-ink">{formatBRL(potentialRevenue)}</strong>/mês.
          </div>
        </div>

        <a
          href={waHref}
          target="_blank"
          rel="noopener"
          className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5"
        >
          Falar com especialista sobre este funil →
        </a>
        <p className="mt-3.5 text-center text-[11.5px] leading-relaxed text-dim">
          Estimativa educativa baseada em benchmarks de mercado — não substitui um diagnóstico real do seu funil.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  hint,
  last = false,
  children,
}: {
  label: string;
  value: string;
  hint?: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={last ? "" : "mb-8.5"}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 font-heading text-[15px] font-semibold">
        <span>{label}</span>
        <span className="font-heading font-bold text-red-hi">{value}</span>
      </div>
      {hint && <div className="mb-4 text-[12.5px] text-dim">{hint}</div>}
      {!hint && <div className="mb-4" />}
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-baseline justify-between gap-2.5 text-[13.5px]">
      <span className="text-mid">{label}</span>
      <span className="font-heading font-bold">{value}</span>
    </div>
  );
}
