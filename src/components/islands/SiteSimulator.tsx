import { useMemo, useState } from "react";
import { WHATSAPP_NUMBER } from "../../data/schema";

const TYPE_OPTIONS = [
  { val: 0, label: "Site novo" },
  { val: 8, label: "Redesign de site existente" },
] as const;

interface Tier {
  name: string;
  pct: number;
  timeline: string;
}

// Same tier thresholds as the SEO/GEO calculator, for consistency across
// every simulator on the site.
function computeTier(score: number): Tier {
  if (score < 30) return { name: "Essencial", pct: 28, timeline: "2 a 3 semanas" };
  if (score < 60) return { name: "Avançado", pct: 58, timeline: "3 a 5 semanas" };
  if (score < 90) return { name: "Estruturado", pct: 80, timeline: "5 a 8 semanas" };
  return { name: "Enterprise", pct: 100, timeline: "8+ semanas" };
}

function sliderFillStyle(value: number, min: number, max: number) {
  const pct = ((value - min) / (max - min)) * 100;
  return { "--fill": `${pct}%` } as React.CSSProperties;
}

export default function SiteSimulator() {
  const [pages, setPages] = useState(5);
  const [ecommerce, setEcommerce] = useState(false);
  const [blog, setBlog] = useState(false);
  const [members, setMembers] = useState(false);
  const [type, setType] = useState<(typeof TYPE_OPTIONS)[number]>(TYPE_OPTIONS[0]);

  const score =
    pages * 3 + (ecommerce ? 30 : 0) + (blog ? 12 : 0) + (members ? 18 : 0) + type.val;
  const tier = useMemo(() => computeTier(score), [score]);

  const waHref = useMemo(() => {
    const lines = [
      "Olá! Simulei meu site no site da Fórmula Mídia:",
      `• ${pages} páginas`,
      `• Loja virtual: ${ecommerce ? "Sim" : "Não"}`,
      `• Blog / conteúdo: ${blog ? "Sim" : "Não"}`,
      `• Área de membros: ${members ? "Sim" : "Não"}`,
      `• ${type.label}`,
      `• Porte estimado: ${tier.name}`,
      "",
      "Quero receber uma proposta.",
    ];
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [pages, ecommerce, blog, members, type, tier]);

  return (
    <div className="mt-11 grid items-start gap-7 md:grid-cols-[1.3fr_1fr]">
      <div className="rounded-card border border-border bg-glass p-8">
        <div className="mb-8.5">
          <div className="mb-1.5 flex items-baseline justify-between gap-3 font-heading text-[15px] font-semibold">
            <span>Quantas páginas você precisa?</span>
            <span className="font-heading font-bold text-red-hi">{pages}</span>
          </div>
          <div className="mb-4 text-[12.5px] text-dim">Home, sobre, serviços, contato, etc.</div>
          <input
            type="range"
            className="range-slider"
            min={1}
            max={15}
            value={pages}
            style={sliderFillStyle(pages, 1, 15)}
            onChange={(e) => setPages(Number(e.target.value))}
          />
        </div>

        <div className="mb-8">
          <div className="mb-1.5 font-heading text-[15px] font-semibold">Que tipo de projeto é esse?</div>
          <div className="mb-4 text-[12.5px] text-dim">Redesigns partem de uma base existente, o que muda o escopo técnico.</div>
          <div className="flex flex-wrap gap-2.5">
            {TYPE_OPTIONS.map((opt) => {
              const isActive = opt.val === type.val;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setType(opt)}
                  className={`min-w-[160px] flex-1 rounded-xl border px-4 py-3.5 text-center font-heading text-[13.5px] font-semibold transition-all ${
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
        </div>

        <ToggleRow
          title="Preciso de loja virtual (e-commerce)"
          subtitle="Catálogo de produtos, carrinho e pagamento online"
          checked={ecommerce}
          onToggle={() => setEcommerce((v) => !v)}
        />
        <ToggleRow
          title="Preciso de blog ou área de conteúdo"
          subtitle="Para publicar artigos e sustentar sua estratégia de SEO"
          checked={blog}
          onToggle={() => setBlog((v) => !v)}
        />
        <ToggleRow
          title="Preciso de área de membros ou login"
          subtitle="Conteúdo exclusivo por trás de autenticação"
          checked={members}
          onToggle={() => setMembers((v) => !v)}
          last
        />
      </div>

      <div className="rounded-card border border-red/28 bg-gradient-to-b from-red/8 to-glass p-8 md:sticky md:top-24">
        <h3 className="mb-5 font-heading text-xs font-semibold uppercase tracking-[.12em] text-red-hi">
          Resumo do seu site
        </h3>

        <div className="mb-6.5 flex flex-col gap-3.5">
          <SummaryRow label="Páginas" value={pages} />
          <SummaryRow label="Loja virtual" value={ecommerce ? "Sim" : "Não"} />
          <SummaryRow label="Blog / conteúdo" value={blog ? "Sim" : "Não"} />
          <SummaryRow label="Área de membros" value={members ? "Sim" : "Não"} />
          <SummaryRow label="Tipo de projeto" value={type.label} />
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
