import { useMemo, useState } from "react";
import { waLink } from "../../data/schema";
import { trackEvent } from "../../lib/track";

// TOOL-012 (formula-foundation/CAPABILITIES/TOOL-012-comparador-historico.md).
// 100% client-side: CrUX History API, mesma logica de custo/quota da TOOL-011
// (PUBLIC_PAGESPEED_API_KEY reaproveitada — mesmo projeto Google Cloud).

const REF = "historico-06";
const API_KEY = import.meta.env.PUBLIC_PAGESPEED_API_KEY as string | undefined;
const ENDPOINT = "https://chromeuxreport.googleapis.com/v1/records:queryHistoryRecord";

interface LinhaResultado {
  origem: string;
  temDado: boolean;
  lcpAtual?: number; // segundos
  lcpTendencia?: "melhorou" | "piorou" | "estavel";
  clsAtual?: number;
}

function normalizeOrigin(input: string): string | null {
  let v = input.trim();
  if (!v) return null;
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  try {
    const u = new URL(v);
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}

async function consultarOrigem(origin: string): Promise<LinhaResultado> {
  try {
    const url = API_KEY ? `${ENDPOINT}?key=${API_KEY}` : ENDPOINT;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origin,
        formFactor: "PHONE",
        metrics: ["largest_contentful_paint", "cumulative_layout_shift"],
        collectionPeriodCount: 40,
      }),
    });

    if (!resp.ok) return { origem: origin, temDado: false };

    const data = await resp.json();
    const lcpSeries: number[] | undefined = data?.record?.metrics?.largest_contentful_paint?.percentilesTimeseries?.p75s;
    const clsSeries: number[] | undefined = data?.record?.metrics?.cumulative_layout_shift?.percentilesTimeseries?.p75s;

    if (!lcpSeries || lcpSeries.length === 0) return { origem: origin, temDado: false };

    const lcpAtual = lcpSeries[lcpSeries.length - 1] / 1000;
    const lcpInicial = lcpSeries[0] / 1000;
    const diff = lcpAtual - lcpInicial;
    const tendencia = Math.abs(diff) < 0.1 ? "estavel" : diff < 0 ? "melhorou" : "piorou";
    const clsAtual = clsSeries && clsSeries.length > 0 ? clsSeries[clsSeries.length - 1] / 100 : undefined;

    return { origem: origin, temDado: true, lcpAtual, lcpTendencia: tendencia, clsAtual };
  } catch {
    return { origem: origin, temDado: false };
  }
}

function iconeTendencia(t?: string) {
  if (t === "melhorou") return "↓ melhorou";
  if (t === "piorou") return "↑ piorou";
  if (t === "estavel") return "→ estável";
  return "—";
}

export default function ComparadorHistorico() {
  const [meuSite, setMeuSite] = useState("");
  const [concorrente1, setConcorrente1] = useState("");
  const [concorrente2, setConcorrente2] = useState("");
  const [concorrente3, setConcorrente3] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultados, setResultados] = useState<LinhaResultado[] | null>(null);

  async function comparar(e: React.FormEvent) {
    e.preventDefault();
    trackEvent("tool_started", { tool: REF });
    setErro(null);
    setResultados(null);

    const origens = [meuSite, concorrente1, concorrente2, concorrente3]
      .map(normalizeOrigin)
      .filter((o): o is string => !!o);

    if (origens.length === 0) {
      setErro("Informe pelo menos o seu site.");
      return;
    }

    setLoading(true);
    try {
      const resp = await Promise.all(origens.map(consultarOrigem));
      setResultados(resp);
      trackEvent("tool_completed", { tool: REF });
    } finally {
      setLoading(false);
    }
  }

  const waHref = useMemo(() => {
    if (!resultados) return waLink(`Quero comparar a velocidade do meu site com concorrentes.\n— ref: ${REF}`);
    const linhas = resultados.map((r) =>
      r.temDado ? `• ${r.origem}: LCP ${r.lcpAtual?.toFixed(1)}s (${iconeTendencia(r.lcpTendencia)})` : `• ${r.origem}: sem dado suficiente`
    );
    return waLink(["Olá! Usei o Comparador Histórico da Fórmula Mídia:", ...linhas, "", "Quero um diagnóstico competitivo completo.", `— ref: ${REF}`].join("\n"));
  }, [resultados]);

  return (
    <div className="mt-11 grid items-start gap-7 md:grid-cols-[1fr_1.3fr]">
      <div className="rounded-card border border-border bg-glass p-8">
        <form onSubmit={comparar}>
          <label className="mb-1.5 block font-heading text-[14px] font-semibold" htmlFor="meu-site">Seu site</label>
          <input id="meu-site" type="text" placeholder="seusite.com.br" value={meuSite}
            onChange={(e) => setMeuSite(e.target.value)}
            className="mb-5 w-full rounded-2xl border border-border bg-bg px-4 py-3 font-body text-[14px] text-ink outline-none focus:border-red" />

          <label className="mb-1.5 block font-heading text-[13px] font-semibold text-mid">Concorrente 1 (opcional)</label>
          <input type="text" placeholder="concorrente1.com" value={concorrente1}
            onChange={(e) => setConcorrente1(e.target.value)}
            className="mb-3 w-full rounded-2xl border border-border bg-bg px-4 py-3 font-body text-[14px] text-ink outline-none focus:border-red" />
          <label className="mb-1.5 block font-heading text-[13px] font-semibold text-mid">Concorrente 2 (opcional)</label>
          <input type="text" placeholder="concorrente2.com" value={concorrente2}
            onChange={(e) => setConcorrente2(e.target.value)}
            className="mb-3 w-full rounded-2xl border border-border bg-bg px-4 py-3 font-body text-[14px] text-ink outline-none focus:border-red" />
          <label className="mb-1.5 block font-heading text-[13px] font-semibold text-mid">Concorrente 3 (opcional)</label>
          <input type="text" placeholder="concorrente3.com" value={concorrente3}
            onChange={(e) => setConcorrente3(e.target.value)}
            className="mb-5 w-full rounded-2xl border border-border bg-bg px-4 py-3 font-body text-[14px] text-ink outline-none focus:border-red" />

          <button type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5 disabled:opacity-60">
            {loading ? "Comparando…" : "Comparar histórico →"}
          </button>
          {erro && <p className="mt-3 text-[13px] text-red-hi">{erro}</p>}
          <p className="mt-4 text-[11.5px] leading-relaxed text-dim">
            Dado direto do CrUX History API (Google) — até 40 semanas de usuário real. Nada armazenado pela Fórmula.
          </p>
        </form>
      </div>

      <div className="rounded-card border border-red/28 bg-gradient-to-b from-red/8 to-glass p-8">
        <h3 className="mb-5 font-heading text-xs font-semibold uppercase tracking-[.12em] text-red-hi">Comparativo (40 semanas)</h3>

        {!resultados && !loading && (
          <p className="text-[13.5px] leading-relaxed text-dim">
            Informe seu site e até 3 concorrentes pra ver quem está melhorando ou piorando em velocidade real.
          </p>
        )}

        {resultados && (
          <>
            <div className="flex flex-col gap-3">
              {resultados.map((r, i) => (
                <div key={i} className="rounded-2xl border border-border bg-glass p-4">
                  <div className="mb-1 truncate font-heading text-[13.5px] font-bold text-ink">{r.origem}</div>
                  {r.temDado ? (
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-mid">LCP: <strong className="text-ink">{r.lcpAtual?.toFixed(1)}s</strong></span>
                      <span className="font-heading font-semibold text-ink">{iconeTendencia(r.lcpTendencia)}</span>
                    </div>
                  ) : (
                    <p className="text-[12px] text-dim">Sem dado suficiente de usuário real (tráfego baixo no Chrome).</p>
                  )}
                </div>
              ))}
            </div>
            <a href={waHref} target="_blank" rel="noopener" onClick={() => trackEvent("cta_whatsapp", { tool: REF })}
              className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5">
              Quero um diagnóstico competitivo →
            </a>
          </>
        )}
      </div>
    </div>
  );
}
