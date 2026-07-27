import { useMemo, useRef, useState } from "react";
import { waLink } from "../../data/schema";
import { trackEvent } from "../../lib/track";

// TOOL-013 (formula-foundation/CAPABILITIES/TOOL-013-analise-de-log.md).
// 100% client-side: o arquivo é lido com FileReader/file.text() e nunca sai
// do navegador do usuário — sem upload, sem backend, sem RUN-001.

const REF = "log-07";
const LIMITE_MB = 40;

// Combined Log Format (Apache/Nginx padrão):
// IP - - [timestamp] "METHOD path proto" status size "referer" "user-agent"
const LOG_REGEX =
  /^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+)\s+(\S+)\s+[^"]*" (\d{3}) (\S+) "([^"]*)" "([^"]*)"/;

const BOTS: { nome: string; padrao: RegExp; tipo: "treino" | "busca" }[] = [
  { nome: "Googlebot", padrao: /Googlebot(?!-)/i, tipo: "busca" },
  { nome: "Google-Extended (treino IA)", padrao: /Google-Extended/i, tipo: "treino" },
  { nome: "Bingbot", padrao: /bingbot/i, tipo: "busca" },
  { nome: "GPTBot (treino OpenAI)", padrao: /GPTBot/i, tipo: "treino" },
  { nome: "OAI-SearchBot (busca OpenAI)", padrao: /OAI-SearchBot/i, tipo: "busca" },
  { nome: "ClaudeBot (treino Anthropic)", padrao: /ClaudeBot|anthropic-ai/i, tipo: "treino" },
  { nome: "Claude-SearchBot (busca Anthropic)", padrao: /Claude-SearchBot/i, tipo: "busca" },
  { nome: "PerplexityBot (busca IA)", padrao: /PerplexityBot/i, tipo: "busca" },
  { nome: "CCBot (Common Crawl)", padrao: /CCBot/i, tipo: "treino" },
];

interface Resultado {
  totalLinhas: number;
  linhasReconhecidas: number;
  porBot: { nome: string; tipo: string; contagem: number }[];
  status4xx: { path: string; status: string; bot: string }[];
  topPaths: { path: string; contagem: number }[];
}

function classificarUserAgent(ua: string): string | null {
  for (const bot of BOTS) if (bot.padrao.test(ua)) return bot.nome;
  return null;
}

function parseLog(texto: string): Resultado {
  const linhas = texto.split("\n").filter((l) => l.trim().length > 0);
  const porBotMap = new Map<string, number>();
  const pathMap = new Map<string, number>();
  const status4xx: Resultado["status4xx"] = [];
  let reconhecidas = 0;

  for (const linha of linhas) {
    const m = linha.match(LOG_REGEX);
    if (!m) continue;
    const [, , , , path, status, , , userAgent] = m;
    const botNome = classificarUserAgent(userAgent);
    if (!botNome) continue;
    reconhecidas++;
    porBotMap.set(botNome, (porBotMap.get(botNome) ?? 0) + 1);
    pathMap.set(path, (pathMap.get(path) ?? 0) + 1);
    if (status.startsWith("4") && status4xx.length < 20) {
      status4xx.push({ path, status, bot: botNome });
    }
  }

  const porBot = [...porBotMap.entries()]
    .map(([nome, contagem]) => ({
      nome,
      tipo: BOTS.find((b) => b.nome === nome)?.tipo ?? "busca",
      contagem,
    }))
    .sort((a, b) => b.contagem - a.contagem);

  const topPaths = [...pathMap.entries()]
    .map(([path, contagem]) => ({ path, contagem }))
    .sort((a, b) => b.contagem - a.contagem)
    .slice(0, 10);

  return { totalLinhas: linhas.length, linhasReconhecidas: reconhecidas, porBot, status4xx, topPaths };
}

export default function AnaliseDeLog() {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [nomeArquivo, setNomeArquivo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iniciou = useRef(false);

  function marcarInicio() {
    if (iniciou.current) return;
    iniciou.current = true;
    trackEvent("tool_started", { tool: REF });
  }

  async function processarArquivo(file: File) {
    marcarInicio();
    setErro(null);
    setResultado(null);
    setNomeArquivo(file.name);

    if (file.size > LIMITE_MB * 1024 * 1024) {
      setErro(
        `Arquivo maior que ${LIMITE_MB}MB — pra rodar bem no navegador, envie uma amostra (ex.: 1 semana de log) em vez do arquivo inteiro.`
      );
      return;
    }

    setLoading(true);
    try {
      const texto = await file.text();
      const parsed = parseLog(texto);
      if (parsed.linhasReconhecidas === 0) {
        setErro(
          "Não reconhecemos nenhuma linha de bot conhecido nesse arquivo. Confirme que é um log no formato Apache/Nginx combinado (com user-agent entre aspas)."
        );
      } else {
        setResultado(parsed);
        trackEvent("tool_completed", { tool: REF });
      }
    } catch {
      setErro("Não conseguimos ler esse arquivo — confirme que é um arquivo de texto (.log ou .txt).");
    } finally {
      setLoading(false);
    }
  }

  const waHref = useMemo(() => {
    if (!resultado) return waLink(`Quero analisar o log de rastreio do meu site.\n— ref: ${REF}`);
    const linhas = [
      "Olá! Usei a Análise de Log de Servidor da Fórmula Mídia:",
      `• Linhas analisadas: ${resultado.totalLinhas}`,
      `• Bots reconhecidos: ${resultado.porBot.map((b) => `${b.nome} (${b.contagem})`).join(", ")}`,
      resultado.status4xx.length > 0 ? `• Erros 4xx encontrados: ${resultado.status4xx.length}` : "",
      "",
      "Quero um diagnóstico avançado de rastreio.",
      `— ref: ${REF}`,
    ].filter(Boolean);
    return waLink(linhas.join("\n"));
  }, [resultado]);

  return (
    <div className="mt-11 grid items-start gap-7 md:grid-cols-[1fr_1.3fr]">
      <div className="rounded-card border border-border bg-glass p-8">
        <div className="mb-2 font-heading text-[15px] font-semibold">Arquivo de log</div>
        <p className="mb-5 text-[12.5px] leading-relaxed text-dim">
          Formato Apache/Nginx combinado. Até {LIMITE_MB}MB. O arquivo é processado só no seu
          navegador — nunca sai do seu computador.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".log,.txt,text/plain"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processarArquivo(file);
          }}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => { marcarInicio(); fileInputRef.current?.click(); }}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {loading ? "Processando…" : nomeArquivo ? "Trocar arquivo" : "Enviar arquivo de log →"}
        </button>
        {nomeArquivo && <p className="mt-3 text-[12px] text-dim">Arquivo: {nomeArquivo}</p>}
        {erro && <p className="mt-3 text-[13px] text-red-hi">{erro}</p>}
      </div>

      <div className="rounded-card border border-red/28 bg-gradient-to-b from-red/8 to-glass p-8">
        <h3 className="mb-5 font-heading text-xs font-semibold uppercase tracking-[.12em] text-red-hi">
          O que os robôs realmente rastrearam
        </h3>

        {!resultado && (
          <p className="text-[13.5px] leading-relaxed text-dim">
            Envie o arquivo de log ao lado pra ver quais bots visitaram seu site, com que
            frequência, e quais erros eles encontraram.
          </p>
        )}

        {resultado && (
          <>
            <div className="mb-5 grid grid-cols-2 gap-3">
              <MetricCard label="Linhas analisadas" value={resultado.totalLinhas.toLocaleString("pt-BR")} />
              <MetricCard label="Erros 4xx encontrados" value={String(resultado.status4xx.length)} />
            </div>

            <div className="mb-5 rounded-2xl border border-border bg-glass p-5">
              <div className="mb-3 text-[11px] uppercase tracking-[.08em] text-dim">Bots por frequência</div>
              <div className="flex flex-col gap-2.5">
                {resultado.porBot.map((b) => (
                  <div key={b.nome} className="flex items-center justify-between text-[13.5px]">
                    <span className="text-mid">
                      {b.nome}{" "}
                      <span className="text-[10.5px] uppercase text-dim">({b.tipo})</span>
                    </span>
                    <span className="font-heading font-bold text-ink">{b.contagem}</span>
                  </div>
                ))}
              </div>
            </div>

            {resultado.status4xx.length > 0 && (
              <div className="mb-5 rounded-2xl border border-border bg-glass p-5">
                <div className="mb-3 text-[11px] uppercase tracking-[.08em] text-dim">
                  Páginas com erro que os bots encontraram
                </div>
                <div className="flex flex-col gap-2 text-[12.5px]">
                  {resultado.status4xx.slice(0, 8).map((e, i) => (
                    <div key={i} className="flex items-center justify-between gap-3">
                      <span className="truncate text-mid">{e.path}</span>
                      <span className="shrink-0 font-heading font-bold text-red-hi">{e.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <a
              href={waHref}
              target="_blank"
              rel="noopener"
              onClick={() => trackEvent("cta_whatsapp", { tool: REF })}
              className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5"
            >
              Quero um diagnóstico avançado →
            </a>
          </>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border-hi bg-glass-hi p-4 text-center">
      <div className="mb-1 text-[10.5px] uppercase tracking-[.06em] text-dim">{label}</div>
      <div className="font-heading text-[22px] font-bold text-ink">{value}</div>
    </div>
  );
}
