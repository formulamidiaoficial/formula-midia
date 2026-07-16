import { useMemo, useState } from "react";
import { WHATSAPP_NUMBER } from "../../data/schema";

const RANK_OPTIONS = [
  { val: 10, label: "Top 10 (1ª página)" },
  { val: 20, label: "Top 3" },
  { val: 32, label: "Posição #1" },
] as const;

const COMP_OPTIONS = [
  { val: 0, label: "Baixa" },
  { val: 10, label: "Média" },
  { val: 20, label: "Alta" },
] as const;

interface Tier {
  name: string;
  pct: number;
  timeline: string;
}

// Exact same weighted-score formula as the original vanilla-JS calculator
// (calculadora/index.html) — keep in sync if the scoring ever changes.
function computeTier(score: number): Tier {
  if (score < 30) return { name: "Essencial", pct: 28, timeline: "3 a 4 meses" };
  if (score < 60) return { name: "Avançado", pct: 58, timeline: "4 a 6 meses" };
  if (score < 90) return { name: "Estruturado", pct: 80, timeline: "6 a 8 meses" };
  return { name: "Enterprise", pct: 100, timeline: "8+ meses" };
}

function sliderFillStyle(value: number, min: number, max: number) {
  const pct = ((value - min) / (max - min)) * 100;
  return { "--fill": `${pct}%` } as React.CSSProperties;
}

export default function Calculator() {
  const [lp, setLp] = useState(3);
  const [city, setCity] = useState(1);
  const [rank, setRank] = useState<(typeof RANK_OPTIONS)[number]>(RANK_OPTIONS[1]);
  const [comp, setComp] = useState<(typeof COMP_OPTIONS)[number]>(COMP_OPTIONS[0]);
  const [geo, setGeo] = useState(true);
  const [newSite, setNewSite] = useState(false);

  const score =
    lp * 1.6 + city * 0.9 + rank.val + comp.val + (geo ? 8 : 0) + (newSite ? 10 : 0);
  const tier = useMemo(() => computeTier(score), [score]);

  const waHref = useMemo(() => {
    const lines = [
      "Olá! Simulei meu projeto de SEO & GEO no site:",
      `• ${lp} landing pages`,
      `• ${city} páginas de cidade`,
      `• Objetivo: ${rank.label}`,
      `• Concorrência: ${comp.label}`,
      `• GEO (busca por IA): ${geo ? "Sim" : "Não"}`,
      `• Preciso de site novo: ${newSite ? "Sim" : "Não"}`,
      `• Porte estimado: ${tier.name}`,
      "",
      "Quero receber uma proposta.",
    ];
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [lp, city, rank, comp, geo, newSite, tier]);

  return (
    <div className="mt-11 grid items-start gap-7 md:grid-cols-[1.3fr_1fr]">
      {/* INPUTS PANEL */}
      <div className="rounded-card border border-border bg-glass p-8">
        <Field
          label="Quantas landing pages ou páginas você precisa?"
          value={lp}
          hint="Páginas de conversão, uma para cada serviço ou produto principal."
        >
          <input
            type="range"
            className="range-slider"
            min={1}
            max={20}
            value={lp}
            style={sliderFillStyle(lp, 1, 20)}
            onChange={(e) => setLp(Number(e.target.value))}
          />
        </Field>

        <Field
          label="Quantas cidades ou regiões você quer alcançar?"
          value={city}
          hint="Páginas de SEO local — uma para cada cidade/região que você atende."
        >
          <input
            type="range"
            className="range-slider"
            min={0}
            max={30}
            value={city}
            style={sliderFillStyle(city, 0, 30)}
            onChange={(e) => setCity(Number(e.target.value))}
          />
        </Field>

        <div className="mb-8">
          <div className="mb-1.5 font-heading text-[15px] font-semibold">
            Qual seu objetivo de ranking no Google?
          </div>
          <div className="mb-4 text-[12.5px] text-dim">
            Isso define o nível de esforço técnico e de conteúdo necessário.
          </div>
          <Pills options={RANK_OPTIONS} active={rank} onSelect={setRank} />
        </div>

        <div className="mb-8">
          <div className="mb-1.5 font-heading text-[15px] font-semibold">
            Nível de concorrência do seu mercado
          </div>
          <div className="mb-4 text-[12.5px] text-dim">
            Mercados mais disputados exigem mais volume de conteúdo e autoridade.
          </div>
          <Pills options={COMP_OPTIONS} active={comp} onSelect={setComp} />
        </div>

        <ToggleRow
          title="Quero também aparecer nas respostas de IA (GEO)"
          subtitle="ChatGPT, Perplexity, Gemini e outros buscadores generativos"
          checked={geo}
          onToggle={() => setGeo((v) => !v)}
        />
        <ToggleRow
          title="Preciso construir o site do zero"
          subtitle="Se desligado, vamos otimizar o site que você já tem"
          checked={newSite}
          onToggle={() => setNewSite((v) => !v)}
          last
        />
      </div>

      {/* SUMMARY PANEL */}
      <div className="rounded-card border border-red/28 bg-gradient-to-b from-red/8 to-glass p-8 md:sticky md:top-24">
        <h3 className="mb-5 font-heading text-xs font-semibold uppercase tracking-[.12em] text-red-hi">
          Resumo do seu projeto
        </h3>

        <div className="mb-6.5 flex flex-col gap-3.5">
          <SummaryRow label="Landing pages" value={lp} />
          <SummaryRow label="Páginas de cidade" value={city} />
          <SummaryRow label="Objetivo de ranking" value={rank.label} />
          <SummaryRow label="Concorrência" value={comp.label} />
          <SummaryRow label="GEO (busca por IA)" value={geo ? "Sim" : "Não"} />
          <SummaryRow label="Site novo" value={newSite ? "Sim" : "Não"} />
        </div>

        <div className="mb-6 rounded-2xl border border-border-hi bg-glass-hi p-5 text-center">
          <div className="mb-2 text-[11px] uppercase tracking-[.08em] text-dim">Porte estimado do projeto</div>
          <div className="mb-2.5 font-heading text-[22px] font-bold text-red-hi">{tier.name}</div>
          <div className="mb-2.5 h-1.5 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-lo to-red-hi transition-[width] duration-400"
              style={{ width: `${tier.pct}%` }}
            />
          </div>
          <div className="text-xs text-dim">Prazo estimado: {tier.timeline}</div>
        </div>

        <a
          href={waHref}
          target="_blank"
          rel="noopener"
          className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5"
        >
          Falar com especialista sobre este projeto →
        </a>
        <p className="mt-3.5 text-center text-[11.5px] leading-relaxed text-dim">
          Sem compromisso. Você recebe uma proposta personalizada com base no que simulou aqui.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  hint,
  children,
}: {
  label: string;
  value: number;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8.5">
      <div className="mb-1.5 flex items-baseline justify-between gap-3 font-heading text-[15px] font-semibold">
        <span>{label}</span>
        <span className="font-heading font-bold text-red-hi">{value}</span>
      </div>
      <div className="mb-4 text-[12.5px] text-dim">{hint}</div>
      {children}
    </div>
  );
}

function Pills<T extends { val: number; label: string }>({
  options,
  active,
  onSelect,
}: {
  options: readonly T[];
  active: T;
  onSelect: (opt: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((opt) => {
        const isActive = opt.val === active.val;
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => onSelect(opt)}
            className={`min-w-[120px] flex-1 rounded-xl border px-4 py-3.5 text-center font-heading text-[13.5px] font-semibold transition-all ${
              isActive
                ? "border-red bg-gradient-to-br from-red to-red-lo text-white shadow-[0_6px_20px_rgba(228,41,41,0.25)]"
                : "border-border bg-glass text-mid hover:border-border-hi hover:text-ink"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function ToggleRow({
  title,
  subtitle,
  checked,
  onToggle,
  last = false,
}: {
  title: string;
  subtitle: string;
  checked: boolean;
  onToggle: () => void;
  last?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 rounded-xl border border-border bg-glass px-4.5 py-4 ${last ? "" : "mb-8"}`}>
      <div>
        <strong className="mb-0.5 block font-heading text-[14.5px]">{title}</strong>
        <span className="text-[12.5px] text-dim">{subtitle}</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className={`toggle-switch ${checked ? "on" : ""}`}
      />
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
