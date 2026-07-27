import { useMemo, useRef, useState } from "react";
import { waLink } from "../../data/schema";
import { trackEvent } from "../../lib/track";

// TOOL-014 (formula-foundation/CAPABILITIES/TOOL-014-verificador-acesso-ia.md), ferramenta 02.
// Busca o robots.txt de um site de terceiro exige servidor (CORS impede o navegador de
// buscar direto) — por isso depende do RUN-001 (worker/, Cloudflare Worker que faz a busca
// e devolve JSON). Aqui só fazemos parsing do robots.txt já buscado.

const REF = "acesso-ia-02";

const PROXY_URL = import.meta.env.PUBLIC_ROBOTS_PROXY_URL as string | undefined;

type Categoria = "treino" | "busca";

interface Bot {
  id: string;
  nome: string;
  categoria: Categoria;
  desc: string;
}

// Lista travada no ADR-0006 / TOOL-014 — revalidar a cada trimestre (nomes e
// comportamento dos robôs de IA mudam rápido).
const BOTS: Bot[] = [
  { id: "GPTBot", nome: "GPTBot", categoria: "treino", desc: "Treina os modelos da OpenAI (ChatGPT)." },
  { id: "ClaudeBot", nome: "ClaudeBot", categoria: "treino", desc: "Treina os modelos da Anthropic (Claude)." },
  { id: "Google-Extended", nome: "Google-Extended", categoria: "treino", desc: "Treina o Gemini e alimenta o AI Overviews do Google." },
  { id: "OAI-SearchBot", nome: "OAI-SearchBot", categoria: "busca", desc: "Busca ao vivo para citar sites no ChatGPT Search." },
  { id: "Claude-SearchBot", nome: "Claude-SearchBot", categoria: "busca", desc: "Busca ao vivo para citar sites nas respostas do Claude." },
  { id: "PerplexityBot", nome: "PerplexityBot", categoria: "busca", desc: "Rastreia e cita sites nas respostas da Perplexity." },
];

interface Regra {
  tipo: "allow" | "disallow";
  caminho: string;
}

function normalizeDomain(input: string): string | null {
  let v = input.trim().toLowerCase();
  if (!v) return null;
  v = v.replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/:\d+$/, "");
  return /^[a-z0-9.-]+\.[a-z]{2,}$/.test(v) ? v : null;
}

// Agrupa o robots.txt em blocos "User-agent(s) -> regras", conforme o Robots
// Exclusion Protocol (RFC 9309): user-agents consecutivos compartilham as
// regras que vêm a seguir, até o próximo user-agent "novo" bloco.
function parseRobots(texto: string): Map<string, Regra[]> {
  const grupos = new Map<string, Regra[]>();
  let agentesAtuais: string[] = [];
  let esperandoAgente = true;

  for (const linhaBruta of texto.split(/\r?\n/)) {
    const linha = linhaBruta.split("#")[0].trim();
    if (!linha) continue;
    const idx = linha.indexOf(":");
    if (idx === -1) continue;
    const campo = linha.slice(0, idx).trim().toLowerCase();
    const valor = linha.slice(idx + 1).trim();

    if (campo === "user-agent") {
      const agente = valor.toLowerCase();
      if (!esperandoAgente) {
        agentesAtuais = [];
        esperandoAgente = true;
      }
      agentesAtuais.push(agente);
      if (!grupos.has(agente)) grupos.set(agente, []);
    } else if (campo === "allow" || campo === "disallow") {
      esperandoAgente = false;
      if (valor === "") continue; // "Disallow:" vazio = sem restrição, não é regra
      for (const agente of agentesAtuais) {
        grupos.get(agente)!.push({ tipo: campo, caminho: valor });
      }
    }
  }
  return grupos;
}

// Regra mais específica (caminho mais longo) vence; empate favorece "allow"
// (mesmo critério que o Google documenta para o próprio robots.txt).
function bloqueadoNaRaiz(regras: Regra[]): boolean {
  let melhor: Regra | null = null;
  for (const r of regras) {
    if (!"/".startsWith(r.caminho)) continue;
    if (!melhor || r.caminho.length > melhor.caminho.length) {
      melhor = r;
    } else if (r.caminho.length === melhor.caminho.length && r.tipo === "allow") {
      melhor = r;
    }
  }
  return melhor?.tipo === "disallow";
}

function statusDoBot(grupos: Map<string, Regra[]>, botId: string): boolean {
  const especifico = grupos.get(botId.toLowerCase());
  const regras = especifico ?? grupos.get("*") ?? [];
  return !bloqueadoNaRaiz(regras);
}

interface Resultado {
  domain: string;
  encontrado: boolean;
  permitidos: Bot[];
  bloqueados: Bot[];
}

// Mensagem já pensada pro usuário final — diferente de um erro cru de rede
// (ex.: "Failed to fetch" do fetch()), que nunca deve chegar na tela.
class ErroAmigavel extends Error {}

export default function VerificadorAcessoIa() {
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
    const domain = normalizeDomain(url);
    if (!domain) {
      setErro("Domínio inválido — confira e tente de novo (ex.: seusite.com.br).");
      return;
    }
    if (!PROXY_URL) {
      setErro("A verificação ao vivo está temporariamente indisponível. Fale com a gente no WhatsApp abaixo.");
      return;
    }

    setLoading(true);
    setErro(null);
    setResultado(null);

    try {
      const endpoint = new URL(PROXY_URL);
      endpoint.searchParams.set("domain", domain);
      const resp = await fetch(endpoint.toString());
      const data = await resp.json();

      if (!data.ok) {
        throw new ErroAmigavel("Não conseguimos ler o robots.txt desse domínio. Confirme se o site está no ar.");
      }

      const grupos = parseRobots(data.found ? data.robotsTxt : "");
      const permitidos = BOTS.filter((b) => statusDoBot(grupos, b.id));
      const bloqueados = BOTS.filter((b) => !statusDoBot(grupos, b.id));

      setResultado({ domain, encontrado: data.found, permitidos, bloqueados });

      if (!completou.current) {
        completou.current = true;
        trackEvent("tool_completed", { tool: REF });
      }
    } catch (err) {
      setErro(
        err instanceof ErroAmigavel
          ? err.message
          : "Não conseguimos falar com o verificador agora. Tente de novo em instantes."
      );
    } finally {
      setLoading(false);
    }
  }

  const buscaBloqueada = useMemo(
    () => resultado?.bloqueados.filter((b) => b.categoria === "busca") ?? [],
    [resultado]
  );

  const waHref = useMemo(() => {
    if (!resultado) return waLink(`Quero saber se o meu site bloqueia algum robô de IA sem querer.\n— ref: ${REF}`);
    const lines = [
      "Olá! Rodei o Verificador de Acesso de IA da Fórmula Mídia:",
      `• Site: ${resultado.domain}`,
      resultado.bloqueados.length === 0
        ? "• Nenhum robô de IA bloqueado"
        : `• Bloqueados: ${resultado.bloqueados.map((b) => b.nome).join(", ")}`,
      buscaBloqueada.length > 0
        ? "• Isso inclui robô de BUSCA — posso estar perdendo visibilidade nas respostas de IA."
        : "",
      "",
      "Quero entender o que isso significa pra minha visibilidade.",
      `— ref: ${REF}`,
    ].filter(Boolean);
    return waLink(lines.join("\n"));
  }, [resultado, buscaBloqueada]);

  return (
    <div className="mt-11 grid items-start gap-7 md:grid-cols-[1fr_1.2fr]">
      <div className="rounded-card border border-border bg-glass p-8">
        <form onSubmit={consultar}>
          <label className="mb-2 block font-heading text-[15px] font-semibold" htmlFor="domain-input">
            Domínio do seu site
          </label>
          <input
            id="domain-input"
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
            {loading ? "Lendo o robots.txt…" : "Verificar acesso →"}
          </button>
          {erro && (
            <div className="mt-3">
              <p className="text-[13px] text-red-hi">{erro}</p>
              <a
                href={waLink(`Olá! Quero saber se o meu site${url ? ` (${url})` : ""} bloqueia algum robô de IA — a verificação ao vivo não completou.\n— ref: ${REF}`)}
                target="_blank"
                rel="noopener"
                onClick={() => trackEvent("cta_whatsapp", { tool: REF })}
                className="mt-2 inline-block font-heading text-[13px] font-semibold text-red-hi underline underline-offset-2"
              >
                Prefere que a gente confira pra você? Fale no WhatsApp →
              </a>
            </div>
          )}
          <p className="mt-4 text-[11.5px] leading-relaxed text-dim">
            Leitura direta do <span className="text-ink">robots.txt</span> público do domínio, sem
            heurística. Nada é armazenado pela Fórmula.
          </p>
        </form>
      </div>

      <div className="rounded-card border border-red/28 bg-gradient-to-b from-red/8 to-glass p-8">
        <h3 className="mb-5 font-heading text-xs font-semibold uppercase tracking-[.12em] text-red-hi">
          Resultado
        </h3>

        {!resultado && !loading && (
          <p className="text-[13.5px] leading-relaxed text-dim">
            Informe o domínio ao lado pra ver quais robôs de IA seu site deixa entrar — separado
            entre treino e busca.
          </p>
        )}

        {resultado && (
          <>
            {!resultado.encontrado && (
              <p className="mb-5 rounded-2xl border border-border bg-glass p-4 text-[12.5px] leading-relaxed text-dim">
                Esse domínio não tem <span className="text-ink">robots.txt</span> — por padrão,
                isso significa que todos os robôs podem acessar livremente.
              </p>
            )}

            {buscaBloqueada.length > 0 && (
              <p className="mb-5 rounded-2xl border border-red/40 bg-red/10 p-4 text-[12.5px] leading-relaxed text-ink">
                <strong>Atenção:</strong> você bloqueia um robô de <strong>busca/citação</strong> —
                isso corta sua visibilidade nas respostas de IA sem afetar treino nenhum.
              </p>
            )}

            <div className="mb-2.5 text-[11px] uppercase tracking-[.08em] text-dim">Robôs de treino</div>
            <div className="mb-5 flex flex-col gap-2">
              {BOTS.filter((b) => b.categoria === "treino").map((b) => (
                <LinhaBot key={b.id} bot={b} bloqueado={resultado.bloqueados.some((x) => x.id === b.id)} />
              ))}
            </div>

            <div className="mb-2.5 text-[11px] uppercase tracking-[.08em] text-dim">Robôs de busca/citação</div>
            <div className="mb-6 flex flex-col gap-2">
              {BOTS.filter((b) => b.categoria === "busca").map((b) => (
                <LinhaBot key={b.id} bot={b} bloqueado={resultado.bloqueados.some((x) => x.id === b.id)} />
              ))}
            </div>

            <a
              href={waHref}
              target="_blank"
              rel="noopener"
              onClick={() => trackEvent("cta_whatsapp", { tool: REF })}
              className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5"
            >
              Quero entender o que isso significa →
            </a>
          </>
        )}
      </div>
    </div>
  );
}

function LinhaBot({ bot, bloqueado }: { bot: Bot; bloqueado: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-glass px-4 py-3">
      <div>
        <div className="font-heading text-[13.5px] font-semibold text-ink">{bot.nome}</div>
        <div className="text-[11.5px] text-dim">{bot.desc}</div>
      </div>
      <span className={"shrink-0 font-heading text-[12px] font-bold " + (bloqueado ? "text-red-hi" : "text-[#1B7F4B]")}>
        {bloqueado ? "Bloqueado" : "Permitido"}
      </span>
    </div>
  );
}
