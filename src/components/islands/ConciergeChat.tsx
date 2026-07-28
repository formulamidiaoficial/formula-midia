import { useEffect, useId, useRef, useState } from "react";
import { trackEvent } from "../../lib/track";

// CONTENT-META-012 (formula-foundation) — concierge de IA no cabeçalho, aprovado
// 27/07. Chama o Worker em worker-concierge/ (RUN-CONCIERGE), que usa o /llms.txt
// do próprio site como contexto — sem RAG, sem modelo self-hospedado (pesquisa
// mostrou que Ollama seria mais caro que API paga nesse volume).

const CONCIERGE_URL = import.meta.env.PUBLIC_CONCIERGE_URL as string | undefined;
const MAX_CHARS = 500;

class ErroAmigavel extends Error {}

interface Mensagem {
  role: "user" | "assistant";
  content: string;
}

export default function ConciergeChat() {
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [entrada, setEntrada] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const iniciou = useRef(false);
  const fimRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, carregando]);

  if (!CONCIERGE_URL) return null;

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const texto = entrada.trim().slice(0, MAX_CHARS);
    if (!texto || carregando) return;

    if (!iniciou.current) {
      iniciou.current = true;
      trackEvent("tool_started", { tool: "concierge" });
    }

    const novaHistoria: Mensagem[] = [...mensagens, { role: "user", content: texto }];
    setMensagens(novaHistoria);
    setEntrada("");
    setErro(null);
    setCarregando(true);

    try {
      const resp = await fetch(CONCIERGE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: texto, history: novaHistoria.slice(0, -1) }),
      });
      if (resp.status === 503) {
        throw new ErroAmigavel("O concierge ainda está sendo configurado. Fale direto com a gente pelo WhatsApp.");
      }
      if (resp.status === 429) {
        throw new ErroAmigavel("Muitas perguntas em pouco tempo — espera um instante e tenta de novo.");
      }
      if (!resp.ok) {
        throw new ErroAmigavel("Não consegui responder agora. Tenta de novo em instantes.");
      }
      const data = (await resp.json()) as { ok: boolean; reply?: string };
      if (!data.ok || !data.reply) {
        throw new ErroAmigavel("Não consegui responder agora. Tenta de novo em instantes.");
      }
      setMensagens((atual) => [...atual, { role: "assistant", content: data.reply as string }]);
      trackEvent("tool_completed", { tool: "concierge" });
    } catch (err) {
      setErro(err instanceof ErroAmigavel ? err.message : "Não consegui me conectar. Verifique sua internet e tente de novo.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-label={aberto ? "Fechar chat" : "Abrir chat com a Fórmula"}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-glass text-ink transition-colors hover:border-border-hi"
      >
        {aberto ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
            <path
              d="M17.5 9.5c0 3.59-3.36 6.5-7.5 6.5-.86 0-1.68-.12-2.45-.35L3.5 17l1.06-3.16A6.3 6.3 0 012.5 9.5C2.5 5.91 5.86 3 10 3s7.5 2.91 7.5 6.5z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {aberto && (
        <div className="absolute right-0 top-full z-[60] mt-3 flex h-[70vh] max-h-[520px] w-[92vw] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-border bg-bg shadow-xl">
          <div className="border-b border-border px-5 py-4">
            <div className="font-heading text-[14px] font-semibold text-ink">Fale com a Fórmula</div>
            <div className="text-[12px] text-dim">Respostas geradas por IA a partir do nosso site.</div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {mensagens.length === 0 && (
              <p className="text-[13px] leading-relaxed text-mid">
                Pergunte sobre nossas ferramentas gratuitas, serviços ou algum conceito do glossário.
              </p>
            )}
            <div className="flex flex-col gap-3">
              {mensagens.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-red px-4 py-2.5 text-[13.5px] text-white"
                      : "mr-auto max-w-[85%] rounded-2xl rounded-bl-sm bg-glass px-4 py-2.5 text-[13.5px] text-ink"
                  }
                >
                  {m.content}
                </div>
              ))}
              {carregando && (
                <div className="mr-auto max-w-[85%] rounded-2xl rounded-bl-sm bg-glass px-4 py-2.5 text-[13.5px] text-dim">
                  Digitando…
                </div>
              )}
              {erro && <p className="text-[12.5px] text-red-hi">{erro}</p>}
            </div>
            <div ref={fimRef} />
          </div>

          <form onSubmit={enviar} className="flex gap-2 border-t border-border p-3">
            <label htmlFor={inputId} className="sr-only">
              Sua pergunta
            </label>
            <input
              id={inputId}
              type="text"
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              placeholder="Digite sua pergunta…"
              maxLength={MAX_CHARS}
              disabled={carregando}
              className="w-full rounded-full border border-border bg-glass px-4 py-2.5 text-[13.5px] text-ink outline-none focus:border-red focus:ring-2 focus:ring-red/35 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={carregando || !entrada.trim()}
              aria-label="Enviar pergunta"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red text-white transition-transform hover:-translate-y-px disabled:opacity-40"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M2 8h11M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
