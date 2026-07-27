import { useMemo, useRef, useState } from "react";
import { waLink } from "../../data/schema";
import { trackEvent } from "../../lib/track";

// TOOL-011 (formula-foundation/CAPABILITIES/TOOL-011-velocidade-usuario-real.md).
// 100% client-side: a PageSpeed Insights API do Google já roda o Lighthouse do
// lado deles e devolve laboratório + campo (CrUX) numa chamada só — sem
// precisar de backend nosso (RUN-001 continua não existindo, e essa ferramenta
// não depende dele). Funciona sem chave (quota baixa, compartilhada); se
// PUBLIC_PAGESPEED_API_KEY existir no .env, usa quota própria da Fórmula.

const REF = "velocidade-04";

const API_KEY = import.meta.env.PUBLIC_PAGESPEED_API_KEY as string | undefined;

type Categoria = "FAST" | "AVERAGE" | "SLOW";

interface Resultado {
  score: number; // 0-100
  lcpLab: number; // segundos
  clsLab: number;
  temCampo: boolean;
  lcpCampo?: number; // segundos
  clsCampo?: number;
  categoriaCampo?: Categoria;
}

function normalizeUrl(input: string): string | null {
  let v = input.trim();
  if (!v) return null;
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  try {
    return new URL(v).toString();
  } catch {
    return null;
  }
}

function labelCategoria(c?: Categoria) {
  if (c === "FAST") return "Rápido";
  if (c === "AVERAGE") return "Médio";
  if (c === "SLOW") return "Lento";
  return "—";
}

function corScore(score: number) {
  if (score >= 90) return "text-[#1B7F4B]";
  if (score >= 50) return "text-[#B26A00]";
  return "text-red-hi";
}

export default function VelocidadeUsuarioReal() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const iniciou = useRef(false);
  const completou = useRef(false);

  function marcarInicio() {
    if (iniciou.current) return;
    iniciou.current = true;
    trackEvent("tool_started", { tool: REF });
  }

  async function consultar(e: React.FormEvent) {
    e.preventDefault();
    marcarInicio();
    const alvo = normalizeUrl(url);
    if (!alvo) {
      setErro("URL inválida — confira e tente de novo (ex.: seusite.com.br).");
      return;
    }

    setLoading(true);
    setErro(null);
    setResultado(null);

    try {
      const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
      endpoint.searchParams.set("url", alvo);
      endpoint.searchParams.set("strategy", "mobile");
      endpoint.searchParams.set("category", "performance");
      if (API_KEY) endpoint.searchParams.set("key", API_KEY);

      const resp = await fetch(endpoint.toString());
      if (!resp.ok) {
        if (resp.status === 429) {
          throw new Error("A medição ao vivo está no limite agora. A gente pode medir pra você — é só chamar no WhatsApp abaixo.");
        }
        throw new Error("Não conseguimos analisar essa URL. Confirme se o site está no ar.");
      }
      const data = await resp.json();

      const score = Math.round((data?.lighthouseResult?.categories?.performance?.score ?? 0) * 100);
      const lcpLab = (data?.lighthouseResult?.audits?.["largest-contentful-paint"]?.numericValue ?? 0) / 1000;
      const clsLab = data?.lighthouseResult?.audits?.["cumulative-layout-shift"]?.numericValue ?? 0;

      const campo = data?.loadingExperience?.metrics;
      const temCampo = !!campo;
      const lcpCampoMs = campo?.LARGEST_CONTENTFUL_PAINT_MS?.percentile;
      const clsCampoRaw = campo?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile;
      const categoriaCampo = campo?.LARGEST_CONTENTFUL_PAINT_MS?.category as Categoria | undefined;

      setResultado({
        score,
        lcpLab,
        clsLab,
        temCampo,
        lcpCampo: temCampo && lcpCampoMs != null ? lcpCampoMs / 1000 : undefined,
        clsCampo: temCampo && clsCampoRaw != null ? clsCampoRaw / 100 : undefined,
        categoriaCampo,
      });

      if (!completou.current) {
        completou.current = true;
        trackEvent("tool_completed", { tool: REF });
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro inesperado — tente de novo em instantes.");
    } finally {
      setLoading(false);
    }
  }

  const waHref = useMemo(() => {
    if (!resultado) return waLink(`Quero saber a velocidade real do meu site.\n— ref: ${REF}`);
    const lines = [
      "Olá! Usei a ferramenta de Velocidade + Usuário Real da Fórmula Mídia:",
      `• Site: ${url}`,
      `• Nota de performance (laboratório): ${resultado.score}/100`,
      resultado.temCampo && resultado.categoriaCampo
        ? `• Experiência real do usuário: ${labelCategoria(resultado.categoriaCampo)}`
        : "• Sem dado suficiente de usuário real (site com pouco tráfego no Chrome)",
      "",
      "Quero um diagnóstico de performance completo.",
      `— ref: ${REF}`,
    ];
    return waLink(lines.join("\n"));
  }, [resultado, url]);

  return (
    <div className="mt-11 grid items-start gap-7 md:grid-cols-[1fr_1.2fr]">
      <div className="rounded-card border border-border bg-glass p-8">
        <form onSubmit={consultar}>
          <label className="mb-2 block font-heading text-[15px] font-semibold" htmlFor="url-input">
            URL do seu site
          </label>
          <input
            id="url-input"
            type="text"
            inputMode="url"
            placeholder="seusite.com.br"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={marcarInicio}
            className="mb-5 w-full rounded-2xl border border-border bg-bg px-4 py-3.5 font-body text-[15px] text-ink outline-none focus:border-red"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {loading ? "Analisando (pode levar até 20s)…" : "Analisar velocidade →"}
          </button>
          {erro && (
            <div className="mt-3">
              <p className="text-[13px] text-red-hi">{erro}</p>
              <a
                href={waLink(`Olá! Quero saber a velocidade real do meu site${url ? ` (${url})` : ""} — a medição ao vivo não completou.\n— ref: ${REF}`)}
                target="_blank"
                rel="noopener"
                onClick={() => trackEvent("cta_whatsapp", { tool: REF })}
                className="mt-2 inline-block font-heading text-[13px] font-semibold text-red-hi underline underline-offset-2"
              >
                Prefere que a gente meça pra você? Fale no WhatsApp →
              </a>
            </div>
          )}
          <p className="mt-4 text-[11.5px] leading-relaxed text-dim">
            Dado direto da API oficial do Google (PageSpeed Insights) — a mesma que roda em{" "}
            <span className="text-ink">pagespeed.web.dev</span>. Nada é armazenado pela Fórmula.
          </p>
        </form>
      </div>

      <div className="rounded-card border border-red/28 bg-gradient-to-b from-red/8 to-glass p-8">
        <h3 className="mb-5 font-heading text-xs font-semibold uppercase tracking-[.12em] text-red-hi">
          Resultado
        </h3>

        {!resultado && !loading && (
          <p className="text-[13.5px] leading-relaxed text-dim">
            Informe a URL ao lado pra ver a nota de performance e a experiência real dos seus
            usuários, lado a lado.
          </p>
        )}

        {resultado && (
          <>
            <div className="mb-6 rounded-2xl border border-border-hi bg-glass-hi p-5 text-center">
              <div className="mb-1.5 text-[11px] uppercase tracking-[.08em] text-dim">
                Nota de performance (laboratório)
              </div>
              <div className={`font-heading text-[42px] font-bold leading-none ${corScore(resultado.score)}`}>
                {resultado.score}
              </div>
              <div className="mt-1 text-[11px] text-dim">de 100 — mobile</div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3">
              <MetricCard label="LCP (carregamento)" value={`${resultado.lcpLab.toFixed(1)}s`} sub="laboratório" />
              <MetricCard label="CLS (estabilidade)" value={resultado.clsLab.toFixed(2)} sub="laboratório" />
            </div>

            {resultado.temCampo ? (
              <div className="rounded-2xl border border-border bg-glass p-5">
                <div className="mb-2 text-[11px] uppercase tracking-[.08em] text-dim">
                  Experiência real dos seus usuários (últimos 28 dias)
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-[13.5px] text-mid">Velocidade percebida</span>
                  <span className="font-heading font-bold text-ink">{labelCategoria(resultado.categoriaCampo)}</span>
                </div>
                {resultado.lcpCampo != null && (
                  <div className="mt-1.5 flex items-baseline justify-between">
                    <span className="text-[13.5px] text-mid">LCP real</span>
                    <span className="font-heading font-bold text-ink">{resultado.lcpCampo.toFixed(1)}s</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-glass p-5 text-[12.5px] leading-relaxed text-dim">
                Sem dado suficiente de usuário real ainda — o Google só mede isso em sites com
                tráfego relevante no Chrome. O resultado de laboratório acima continua válido.
              </div>
            )}

            <a
              href={waHref}
              target="_blank"
              rel="noopener"
              onClick={() => trackEvent("cta_whatsapp", { tool: REF })}
              className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5"
            >
              Quero um diagnóstico completo →
            </a>
          </>
        )}
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
