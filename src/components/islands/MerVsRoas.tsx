import { useEffect, useId, useMemo, useState } from "react";
import { waLink } from "../../data/schema";
import { trackEvent } from "../../lib/track";
import OptInPlacar from "./OptInPlacar";

// TOOL-004 (formula-foundation/CAPABILITIES/TOOL-004-mer-vs-roas.md).
// MER (Marketing Efficiency Ratio) = receita total do caixa / investimento
// total em mídia — conceito consolidado de mercado de e-commerce/DTC, não
// benchmark numérico único. Comparado ao ROAS que a plataforma reporta.

const REF = "mer-roas-03";

type Severidade = "saudavel" | "investigar" | "problema";

// RUN-006 — mesmas faixas da leitura de severidade acima, reaproveitadas pro
// opt-in do /placar (worker-placar/stat.js exige categoria fixa, não valor cru).
function faixaDoGap(gapAbsPct: number): string {
  if (gapAbsPct < 15) return "<15";
  if (gapAbsPct < 40) return "15-40";
  return "40+";
}

function leituraDe(gapAbsPct: number): { id: Severidade; label: string; cor: string; texto: string } {
  if (gapAbsPct < 15) {
    return { id: "saudavel", label: "Tracking parece saudável", cor: "text-[#1B7F4B]", texto: "A diferença entre o caixa e o painel é pequena — dentro do esperado." };
  }
  if (gapAbsPct < 40) {
    return { id: "investigar", label: "Vale investigar", cor: "text-[#B26A00]", texto: "Diferença relevante — pode ser venda offline, atribuição cruzada entre canais ou orgânico influenciado por ads." };
  }
  return { id: "problema", label: "Sinal forte de problema", cor: "text-red-hi", texto: "Diferença grande — provável problema de tracking ou de atribuição multi-canal mal contada." };
}

export default function MerVsRoas() {
  const [receita, setReceita] = useState<number | "">(100000);
  const [investimento, setInvestimento] = useState<number | "">(20000);
  const [roasReportado, setRoasReportado] = useState<number | "">(6);

  useEffect(() => {
    trackEvent("tool_started", { tool: REF });
  }, []);

  const [interagiu, setInteragiu] = useState(false);
  function marcarInteracao() {
    if (interagiu) return;
    setInteragiu(true);
    trackEvent("tool_completed", { tool: REF });
  }

  const rec = typeof receita === "number" ? receita : 0;
  const inv = typeof investimento === "number" ? investimento : 0;
  const roas = typeof roasReportado === "number" ? roasReportado : 0;

  const mer = inv > 0 ? rec / inv : 0;
  const gapPct = roas > 0 ? ((mer - roas) / roas) * 100 : 0;
  const leitura = leituraDe(Math.abs(gapPct));

  const waHref = useMemo(() => {
    const lines = [
      "Olá! Comparei MER × ROAS na Fórmula Mídia:",
      `• MER (negócio inteiro): ${mer.toFixed(1)}x`,
      `• ROAS reportado pela plataforma: ${roas.toFixed(1)}x`,
      `• Gap: ${gapPct >= 0 ? "+" : ""}${gapPct.toFixed(0)}% — ${leitura.label}`,
      "",
      "Quero uma auditoria de rastreio.",
      `— ref: ${REF}`,
    ];
    return waLink(lines.join("\n"));
  }, [mer, roas, gapPct, leitura]);

  return (
    <div className="mt-11 grid items-start gap-7 md:grid-cols-[1fr_1.15fr]">
      <div className="rounded-card border border-border bg-glass p-8">
        <NumField label="Receita total do período (R$)" value={receita} onChange={setReceita} onFocus={marcarInteracao} placeholder="100000" hint="Do caixa/CRM, somando todos os canais — não só o que a plataforma de mídia atribui a si." />
        <NumField label="Investimento total em mídia (R$)" value={investimento} onChange={setInvestimento} onFocus={marcarInteracao} placeholder="20000" hint="Todas as plataformas somadas." />
        <NumField label="ROAS reportado pelas plataformas" value={roasReportado} onChange={setRoasReportado} onFocus={marcarInteracao} placeholder="6" hint="Média ponderada, se houver mais de uma plataforma." />

        <p className="mt-2 text-[11.5px] leading-relaxed text-dim">
          Isso é o negócio inteiro, não uma campanha específica — o MER mistura todos os canais.
        </p>
      </div>

      <div className="rounded-card border border-red/28 bg-gradient-to-b from-red/8 to-glass p-8">
        <h3 className="mb-5 font-heading text-xs font-semibold uppercase tracking-[.12em] text-red-hi">
          Caixa × painel
        </h3>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <MetricCard label="MER (caixa)" value={`${mer.toFixed(1)}x`} />
          <MetricCard label="ROAS (painel)" value={`${roas.toFixed(1)}x`} />
        </div>

        <div className="mb-6 rounded-2xl border border-border-hi bg-glass-hi p-5 text-center">
          <div className="mb-1.5 text-[11px] uppercase tracking-[.08em] text-dim">Gap entre os dois</div>
          <div className={`font-heading text-[38px] font-bold leading-none ${leitura.cor}`}>
            {gapPct >= 0 ? "+" : ""}{gapPct.toFixed(0)}%
          </div>
          <div className={`mt-1.5 font-heading text-[13px] font-bold ${leitura.cor}`}>{leitura.label}</div>
        </div>

        <p className="mb-6 text-[13px] leading-relaxed text-mid">{leitura.texto}</p>

        <a
          href={waHref}
          target="_blank"
          rel="noopener"
          onClick={() => trackEvent("cta_whatsapp", { tool: REF })}
          className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5"
        >
          Quero auditar meu rastreio →
        </a>
        <p className="mt-3.5 text-center text-[11.5px] leading-relaxed text-dim">
          MER é conceito consolidado de mercado (e-commerce/DTC) — não é fórmula proprietária da
          Fórmula Mídia.
        </p>

        <OptInPlacar
          ferramentaId="mer-vs-roas"
          metrica="gap_mer_roas_pontos"
          faixaDeValor={inv > 0 && roas > 0 ? faixaDoGap(Math.abs(gapPct)) : null}
        />
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-glass p-4 text-center">
      <div className="mb-1 text-[10.5px] uppercase tracking-[.06em] text-dim">{label}</div>
      <div className="font-heading text-[20px] font-bold text-ink">{value}</div>
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
  const id = useId();
  return (
    <div className="mb-6">
      <label htmlFor={id} className="mb-1.5 block font-heading text-[14px] font-semibold">{label}</label>
      {hint && <div className="mb-2 text-[12px] text-dim">{hint}</div>}
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
