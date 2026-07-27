import { useEffect, useMemo, useRef, useState } from "react";
import { WHATSAPP_NUMBER } from "../../data/schema";
import { trackEvent } from "../../lib/track";

// O GA4 lançou o canal nativo "AI Assistant" em maio/2026, mas:
//  (1) reconhece ChatGPT, Gemini, DeepSeek, Copilot e Grok — NÃO a Perplexity, Claude, Meta AI;
//  (2) perde 35% a 70% do tráfego de IA por padrão.
// Esta ferramenta gera o grupo de canais que captura tudo + estima o tráfego invisível.

type Fonte = { id: string; nome: string; patt: string; ga4Reconhece: boolean };

const FONTES: Fonte[] = [
  { id: "chatgpt", nome: "ChatGPT", patt: "chatgpt\\.com|chat\\.openai\\.com|openai\\.com", ga4Reconhece: true },
  { id: "gemini", nome: "Gemini", patt: "gemini\\.google\\.com|bard\\.google\\.com", ga4Reconhece: true },
  { id: "copilot", nome: "Copilot", patt: "copilot\\.microsoft\\.com", ga4Reconhece: true },
  { id: "grok", nome: "Grok", patt: "grok\\.com|x\\.ai", ga4Reconhece: true },
  { id: "deepseek", nome: "DeepSeek", patt: "deepseek\\.com", ga4Reconhece: true },
  { id: "perplexity", nome: "Perplexity", patt: "perplexity\\.ai", ga4Reconhece: false },
  { id: "claude", nome: "Claude", patt: "claude\\.ai", ga4Reconhece: false },
  { id: "metaai", nome: "Meta AI", patt: "meta\\.ai", ga4Reconhece: false },
];

const MISS_MIN = 0.35; // GA4 perde ao menos 35%
const MISS_MAX = 0.7; // ...até 70%

function formatN(v: number) { return Math.round(v).toLocaleString("pt-BR"); }

export default function MedicaoIaGa4() {
  const [sel, setSel] = useState<Record<string, boolean>>(
    Object.fromEntries(FONTES.map((f) => [f.id, true]))
  );
  const [sessoesGa4, setSessoesGa4] = useState(150);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => { trackEvent("tool_started", { tool: "ia-08" }); }, []);
  const completou = useRef(false);
  function marcarInteracao() {
    if (completou.current) return;
    completou.current = true;
    trackEvent("tool_completed", { tool: "ia-08" });
  }

  const selecionadas = FONTES.filter((f) => sel[f.id]);

  const regex = useMemo(() => {
    if (selecionadas.length === 0) return "";
    return selecionadas.map((f) => f.patt).join("|");
  }, [selecionadas]);

  // Fontes selecionadas que o GA4 não reconhece sozinho
  const cegas = selecionadas.filter((f) => !f.ga4Reconhece);

  // Estimativa de tráfego invisível
  const realMin = sessoesGa4 / (1 - MISS_MIN); // menos perda -> menor multiplicador
  const realMax = sessoesGa4 / (1 - MISS_MAX);
  const escondidoMin = realMin - sessoesGa4;
  const escondidoMax = realMax - sessoesGa4;

  function copiar() {
    if (!regex) return;
    marcarInteracao();
    navigator.clipboard?.writeText(regex).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    });
  }

  const waHref = useMemo(() => {
    const lines = [
      "Olá! Usei o auditor de medição de tráfego de IA no GA4 da Fórmula Mídia:",
      `• Motores que quero medir: ${selecionadas.map((f) => f.nome).join(", ") || "—"}`,
      `• O GA4 não reconhece sozinho: ${cegas.map((f) => f.nome).join(", ") || "nenhum"}`,
      `• Sessões de IA que o GA4 mostra hoje: ${formatN(sessoesGa4)}`,
      "",
      "Quero configurar a medição de IA direito.",
      "— ref: ia-08",
    ];
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selecionadas, cegas, sessoesGa4]);

  return (
    <div className="mt-11 grid items-start gap-7 md:grid-cols-[1.25fr_1fr]">
      {/* ENTRADAS */}
      <div className="flex flex-col gap-7">
        <div className="rounded-card border border-border bg-glass p-7">
          <h3 className="mb-1 font-heading text-[15px] font-semibold">Quais motores de IA você quer medir?</h3>
          <p className="mb-5 text-[12.5px] text-dim">
            O selo <span className="font-semibold text-red-hi">GA4 não pega</span> marca os que o canal
            nativo do GA4 ignora — é aí que a maioria perde tráfego sem saber.
          </p>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {FONTES.map((f) => {
              const ativo = sel[f.id];
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => { setSel((s) => ({ ...s, [f.id]: !s[f.id] })); marcarInteracao(); }}
                  aria-pressed={ativo}
                  className={
                    "flex flex-col items-start gap-1 rounded-xl border px-3.5 py-2.5 text-left transition-colors " +
                    (ativo ? "border-red bg-red/12 text-ink" : "border-border bg-glass text-mid hover:border-border-hi")
                  }
                >
                  <span className="font-heading text-[13.5px] font-semibold">{f.nome}</span>
                  {!f.ga4Reconhece && <span className="text-[10px] font-semibold uppercase tracking-[.05em] text-red-hi">GA4 não pega</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-card border border-border bg-glass p-7">
          <div className="mb-1.5 flex items-baseline justify-between gap-3 font-heading text-[15px] font-semibold">
            <span>Sessões de IA que o GA4 mostra hoje</span>
            <span className="font-bold text-red-hi">{formatN(sessoesGa4)}/mês</span>
          </div>
          <p className="mb-4 text-[12.5px] text-dim">
            Não sabe? Em Relatórios → Aquisição, procure o canal "AI Assistant". Se não existe, é 0 —
            e todo o seu tráfego de IA está caindo em "Referral" ou "Direct".
          </p>
          <input
            type="range"
            aria-label="Sessões de IA que o GA4 mostra hoje, por mês"
            className="range-slider"
            min={0}
            max={5000}
            step={50}
            value={sessoesGa4}
            style={{ "--fill": `${(sessoesGa4 / 5000) * 100}%` } as React.CSSProperties}
            onChange={(e) => { setSessoesGa4(Number(e.target.value)); marcarInteracao(); }}
          />
        </div>
      </div>

      {/* RESULTADO */}
      <div className="rounded-card border border-red/28 bg-gradient-to-b from-red/8 to-glass p-8 md:sticky md:top-24">
        <h3 className="mb-4 font-heading text-xs font-semibold uppercase tracking-[.12em] text-red-hi">
          Seu grupo de canais de IA
        </h3>

        <div className="mb-2 text-[11px] uppercase tracking-[.08em] text-dim">Regex (condição: Origem corresponde à regex)</div>
        <div className="mb-3 overflow-x-auto rounded-xl border border-border-hi bg-glass-hi p-3.5">
          <code className="whitespace-pre text-[12px] leading-relaxed text-ink">{regex || "selecione ao menos um motor"}</code>
        </div>
        <button
          type="button"
          onClick={copiar}
          disabled={!regex}
          className="mb-6 w-full rounded-full border border-border bg-glass px-4 py-2.5 font-heading text-[13.5px] font-semibold text-ink transition-colors hover:border-red disabled:opacity-40"
        >
          {copiado ? "Copiado ✓" : "Copiar regex"}
        </button>

        {sessoesGa4 > 0 && (
          <div className="mb-6 rounded-2xl border border-border-hi bg-glass-hi p-5 text-center">
            <div className="mb-1.5 text-[11px] uppercase tracking-[.08em] text-dim">Tráfego de IA invisível (estimativa)</div>
            <div className="font-heading text-[22px] font-bold leading-tight text-red-hi">
              {formatN(escondidoMin)} a {formatN(escondidoMax)}
            </div>
            <div className="mt-2 text-[11.5px] leading-relaxed text-dim">
              sessões de IA por mês que o GA4 provavelmente <strong className="text-ink">não está te mostrando</strong>
              {" "}(ele perde de 35% a 70% por padrão). É visita que converte ~16% mais e você trata como "direto".
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="mb-2 text-[11px] uppercase tracking-[.08em] text-dim">Como aplicar (2 min)</div>
          <ol className="flex flex-col gap-1.5 text-[12.5px] leading-snug text-mid">
            <li><strong className="text-ink">1.</strong> GA4 → Admin → Grupos de canais → Criar novo.</li>
            <li><strong className="text-ink">2.</strong> Novo canal "IA / Assistentes" → condição: <em>Origem da sessão</em> corresponde à regex → cole a regex acima.</li>
            <li><strong className="text-ink">3.</strong> Suba esse canal acima de "Referral" e "Direct" na ordem.</li>
          </ol>
        </div>

        <a
          href={waHref}
          target="_blank"
          rel="noopener"
          onClick={() => trackEvent("cta_whatsapp", { tool: "ia-08" })}
          className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5"
        >
          Configurar minha medição de IA →
        </a>
        <p className="mt-3.5 text-center text-[11.5px] leading-relaxed text-dim">
          O comportamento do GA4 e os domínios das IAs mudam — revalide o grupo de canais a cada trimestre.
        </p>
      </div>
    </div>
  );
}
