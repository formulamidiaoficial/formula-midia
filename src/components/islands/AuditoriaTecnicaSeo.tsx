import { useMemo, useRef, useState } from "react";
import { waLink } from "../../data/schema";
import { trackEvent } from "../../lib/track";

// TOOL-015 (formula-foundation/CAPABILITIES/TOOL-015-auditoria-tecnica-seo.md),
// ferramenta 05 (guarda-chuva). Consome o Worker de crawl (worker-site-audit/),
// limitado a 20 páginas / 2 níveis por decisão de negócio (27/07) — não é
// ajustável aqui no cliente.

const REF = "auditoria-seo-05";

const AUDIT_URL = import.meta.env.PUBLIC_SITE_AUDIT_URL as string | undefined;

interface Achado {
  mensagem: string;
  urls: string[];
}

interface Resultado {
  domain: string;
  paginasAuditadas: number;
  paginasNaoVerificadas: number;
  robots: { encontrado: boolean; bloqueiaTudo: boolean };
  sitemap: { encontrado: boolean; url: string | null };
  resumo: { critico: Achado[]; importante: Achado[]; secundario: Achado[] };
}

function normalizeDomain(input: string): string | null {
  let v = input.trim().toLowerCase();
  if (!v) return null;
  v = v.replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/:\d+$/, "");
  return /^[a-z0-9.-]+\.[a-z]{2,}$/.test(v) ? v : null;
}

class ErroAmigavel extends Error {}

export default function AuditoriaTecnicaSeo() {
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

  async function auditar(e: React.FormEvent) {
    e.preventDefault();
    marcarInicio();
    const domain = normalizeDomain(url);
    if (!domain) {
      setErro("Domínio inválido — confira e tente de novo (ex.: seusite.com.br).");
      return;
    }
    if (!AUDIT_URL) {
      setErro("A auditoria ao vivo está temporariamente indisponível. Fale com a gente no WhatsApp abaixo.");
      return;
    }

    setLoading(true);
    setErro(null);
    setResultado(null);

    try {
      const endpoint = new URL(AUDIT_URL);
      endpoint.searchParams.set("domain", domain);
      const resp = await fetch(endpoint.toString());
      const data = await resp.json();

      if (!data.ok) {
        throw new ErroAmigavel("Não conseguimos auditar esse domínio. Confirme se o site está no ar.");
      }

      setResultado(data);

      if (!completou.current) {
        completou.current = true;
        trackEvent("tool_completed", { tool: REF });
      }
    } catch (err) {
      setErro(
        err instanceof ErroAmigavel
          ? err.message
          : "Não conseguimos falar com o auditor agora. Sites grandes podem levar até 20s — tente de novo."
      );
    } finally {
      setLoading(false);
    }
  }

  const totalAchados = resultado
    ? resultado.resumo.critico.length + resultado.resumo.importante.length + resultado.resumo.secundario.length
    : 0;

  const waHref = useMemo(() => {
    if (!resultado) return waLink(`Quero uma auditoria técnica de SEO do meu site.\n— ref: ${REF}`);
    const lines = [
      "Olá! Rodei a Auditoria Técnica de SEO da Fórmula Mídia:",
      `• Site: ${resultado.domain}`,
      `• Páginas auditadas: ${resultado.paginasAuditadas}`,
      `• Críticos: ${resultado.resumo.critico.length} · Importantes: ${resultado.resumo.importante.length} · Secundários: ${resultado.resumo.secundario.length}`,
      "",
      "Quero ajuda para corrigir o que foi encontrado.",
      `— ref: ${REF}`,
    ];
    return waLink(lines.join("\n"));
  }, [resultado]);

  return (
    <div className="mt-11 grid items-start gap-7 md:grid-cols-[1fr_1.3fr]">
      <div className="rounded-card border border-border bg-glass p-8">
        <form onSubmit={auditar}>
          <label className="mb-2 block font-heading text-[15px] font-semibold" htmlFor="audit-domain">
            Domínio do seu site
          </label>
          <input
            id="audit-domain"
            type="text"
            inputMode="url"
            placeholder="seusite.com.br"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={marcarInicio}
            className="mb-5 w-full rounded-2xl border border-border bg-bg px-4 py-3.5 font-body text-[15px] text-ink outline-none focus:border-red focus:ring-2 focus:ring-red/35"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {loading ? "Auditando (pode levar até 20s)…" : "Auditar site →"}
          </button>
          {erro && (
            <div className="mt-3">
              <p className="text-[13px] text-red-hi">{erro}</p>
              <a
                href={waLink(`Olá! Quero uma auditoria técnica de SEO${url ? ` (${url})` : ""} — a auditoria ao vivo não completou.\n— ref: ${REF}`)}
                target="_blank"
                rel="noopener"
                onClick={() => trackEvent("cta_whatsapp", { tool: REF })}
                className="mt-2 inline-block font-heading text-[13px] font-semibold text-red-hi underline underline-offset-2"
              >
                Prefere que a gente audite pra você? Fale no WhatsApp →
              </a>
            </div>
          )}
          <p className="mt-4 text-[11.5px] leading-relaxed text-dim">
            Audita até 20 páginas do seu site (a home + os links diretos dela), rastreando só o seu
            próprio domínio. Verificações técnicas padrão — sitemap, links quebrados, hierarquia de
            heading, canonical, dados estruturados. Nada é armazenado pela Fórmula.
          </p>
        </form>
      </div>

      <div className="rounded-card border border-red/28 bg-gradient-to-b from-red/8 to-glass p-8">
        <h3 className="mb-5 font-heading text-xs font-semibold uppercase tracking-[.12em] text-red-hi">
          Resultado
        </h3>

        {!resultado && !loading && (
          <p className="text-[13.5px] leading-relaxed text-dim">
            Informe o domínio ao lado pra ver um relatório priorizado por severidade — crítico,
            importante e secundário — em vez de sete notas soltas.
          </p>
        )}

        {resultado && (
          <>
            <div className="mb-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-glass p-4 text-center">
                <div className="mb-1 text-[10.5px] uppercase tracking-[.06em] text-dim">Páginas auditadas</div>
                <div className="font-heading text-[20px] font-bold text-ink">{resultado.paginasAuditadas}</div>
              </div>
              <div className="rounded-2xl border border-border bg-glass p-4 text-center">
                <div className="mb-1 text-[10.5px] uppercase tracking-[.06em] text-dim">Achados no total</div>
                <div className="font-heading text-[20px] font-bold text-ink">{totalAchados}</div>
              </div>
            </div>

            {resultado.paginasNaoVerificadas > 0 && (
              <p className="mb-5 text-[12px] leading-relaxed text-dim">
                {resultado.paginasNaoVerificadas} página(s) adicional(is) do site não entraram nessa
                auditoria — limite de 20 páginas / 2 níveis por auditoria.
              </p>
            )}

            <SeveridadeBloco titulo="Crítico" cor="text-red-hi" corBorda="border-red/40" itens={resultado.resumo.critico} />
            <SeveridadeBloco titulo="Importante" cor="text-[#B26A00]" corBorda="border-border-hi" itens={resultado.resumo.importante} />
            <SeveridadeBloco titulo="Secundário" cor="text-dim" corBorda="border-border" itens={resultado.resumo.secundario} />

            {totalAchados === 0 && (
              <p className="mb-6 rounded-2xl border border-border bg-glass p-5 text-[13px] leading-relaxed text-dim">
                Nenhum problema técnico encontrado nas páginas auditadas — bom sinal, mas isso não
                cobre design, conteúdo nem concorrência.
              </p>
            )}

            <a
              href={waHref}
              target="_blank"
              rel="noopener"
              onClick={() => trackEvent("cta_whatsapp", { tool: REF })}
              className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5"
            >
              Quero corrigir o que foi encontrado →
            </a>
          </>
        )}
      </div>
    </div>
  );
}

function SeveridadeBloco({
  titulo,
  cor,
  corBorda,
  itens,
}: {
  titulo: string;
  cor: string;
  corBorda: string;
  itens: Achado[];
}) {
  if (itens.length === 0) return null;
  return (
    <div className="mb-5">
      <div className={`mb-2 font-heading text-[11px] font-bold uppercase tracking-[.08em] ${cor}`}>
        {titulo} ({itens.length})
      </div>
      <div className="flex flex-col gap-2">
        {itens.map((item, i) => (
          <div key={i} className={`rounded-xl border ${corBorda} bg-glass px-4 py-3`}>
            <div className="text-[13px] leading-snug text-ink">{item.mensagem}</div>
            {item.urls.length > 0 && (
              <div className="mt-1 text-[11px] leading-relaxed text-dim">
                {item.urls.slice(0, 3).join(", ")}
                {item.urls.length > 3 ? ` +${item.urls.length - 3}` : ""}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
