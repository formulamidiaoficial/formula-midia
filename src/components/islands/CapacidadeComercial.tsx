import { useEffect, useMemo, useState } from "react";
import { waLink } from "../../data/schema";
import { trackEvent } from "../../lib/track";

// TOOL-005 (formula-foundation/CAPABILITIES/TOOL-005-capacidade-comercial.md).
// Throughput linear simples (não é fila M/M/1) — adequado pro nível de
// precisão de um diagnóstico rápido, não de dimensionamento de call center.

const REF = "capacidade-09";

type Severidade = "escala" | "limite" | "perdendo";

function leituraDe(utilizacao: number): { id: Severidade; label: string; cor: string } {
  if (utilizacao < 0.8) return { id: "escala", label: "Dá pra escalar tráfego", cor: "text-[#1B7F4B]" };
  if (utilizacao <= 1) return { id: "limite", label: "Atenção — já está no limite", cor: "text-[#B26A00]" };
  return { id: "perdendo", label: "Está perdendo lead por falta de gente", cor: "text-red-hi" };
}

export default function CapacidadeComercial() {
  const [pessoas, setPessoas] = useState<number | "">(2);
  const [tempoPorLead, setTempoPorLead] = useState<number | "">(15);
  const [horasDia, setHorasDia] = useState<number | "">(6);
  const [diasUteis, setDiasUteis] = useState<number | "">(22);
  const [leadsRecebidos, setLeadsRecebidos] = useState<number | "">(300);

  useEffect(() => {
    trackEvent("tool_started", { tool: REF });
  }, []);

  const [interagiu, setInteragiu] = useState(false);
  function marcarInteracao() {
    if (interagiu) return;
    setInteragiu(true);
    trackEvent("tool_completed", { tool: REF });
  }

  const p = typeof pessoas === "number" ? pessoas : 0;
  const tempo = typeof tempoPorLead === "number" ? tempoPorLead : 0;
  const horas = typeof horasDia === "number" ? horasDia : 0;
  const dias = typeof diasUteis === "number" ? diasUteis : 0;
  const leads = typeof leadsRecebidos === "number" ? leadsRecebidos : 0;

  const capacidadeMensal = tempo > 0 ? ((p * horas * 60) / tempo) * dias : 0;
  const excesso = Math.max(0, leads - capacidadeMensal);
  const utilizacao = capacidadeMensal > 0 ? leads / capacidadeMensal : 0;
  const leitura = leituraDe(utilizacao);

  const waHref = useMemo(() => {
    const lines = [
      "Olá! Calculei a capacidade comercial da Fórmula Mídia:",
      `• Capacidade: ${Math.floor(capacidadeMensal)} leads/mês`,
      `• Leads recebidos hoje: ${leads}/mês`,
      excesso > 0 ? `• Excesso não atendido a tempo: ${Math.ceil(excesso)} leads/mês` : "• Dentro da capacidade",
      `• Leitura: ${leitura.label}`,
      "",
      "Quero ajuda para decidir se escalo tráfego ou reforço o atendimento.",
      `— ref: ${REF}`,
    ].filter(Boolean);
    return waLink(lines.join("\n"));
  }, [capacidadeMensal, leads, excesso, leitura]);

  return (
    <div className="mt-11 grid items-start gap-7 md:grid-cols-[1fr_1.15fr]">
      <div className="rounded-card border border-border bg-glass p-8">
        <NumField label="Pessoas que atendem lead" value={pessoas} onChange={setPessoas} onFocus={marcarInteracao} placeholder="2" />
        <NumField label="Tempo médio de atendimento por lead (minutos)" value={tempoPorLead} onChange={setTempoPorLead} onFocus={marcarInteracao} placeholder="15" />
        <NumField label="Horas por dia dedicadas a isso" value={horasDia} onChange={setHorasDia} onFocus={marcarInteracao} placeholder="6" />
        <NumField label="Dias úteis no mês" value={diasUteis} onChange={setDiasUteis} onFocus={marcarInteracao} placeholder="22" />
        <NumField label="Leads recebidos por mês hoje" value={leadsRecebidos} onChange={setLeadsRecebidos} onFocus={marcarInteracao} placeholder="300" />

        <p className="mt-2 text-[11.5px] leading-relaxed text-dim">
          Estimativa simplificada — não considera picos de dia da semana, qualidade variável do
          atendimento nem follow-up múltiplo por lead.
        </p>
      </div>

      <div className="rounded-card border border-red/28 bg-gradient-to-b from-red/8 to-glass p-8">
        <h3 className="mb-5 font-heading text-xs font-semibold uppercase tracking-[.12em] text-red-hi">
          Sua capacidade real
        </h3>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <MetricCard label="Capacidade" value={`${Math.floor(capacidadeMensal)}`} sub="leads/mês" />
          <MetricCard label="Recebidos" value={`${leads}`} sub="leads/mês" />
        </div>

        <div className="mb-6 rounded-2xl border border-border-hi bg-glass-hi p-5 text-center">
          <div className="mb-1.5 text-[11px] uppercase tracking-[.08em] text-dim">Utilização da capacidade</div>
          <div className={`font-heading text-[38px] font-bold leading-none ${leitura.cor}`}>
            {Math.round(utilizacao * 100)}%
          </div>
          <div className={`mt-1.5 font-heading text-[13px] font-bold ${leitura.cor}`}>{leitura.label}</div>
          {excesso > 0 && (
            <div className="mt-1 text-[11px] text-dim">{Math.ceil(excesso)} leads/mês além da capacidade</div>
          )}
        </div>

        <a
          href={waHref}
          target="_blank"
          rel="noopener"
          onClick={() => trackEvent("cta_whatsapp", { tool: REF })}
          className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5"
        >
          Quero decidir com ajuda →
        </a>
        <p className="mt-3.5 text-center text-[11.5px] leading-relaxed text-dim">
          Estimativa simplificada de capacidade operacional, não dimensionamento formal de equipe.
        </p>
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
