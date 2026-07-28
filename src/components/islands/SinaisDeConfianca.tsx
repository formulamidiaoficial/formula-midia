import { useEffect, useMemo, useRef, useState } from "react";
import { WHATSAPP_NUMBER } from "../../data/schema";
import { trackEvent } from "../../lib/track";

// Spec: TOOL-010 (formula-foundation). Declarativo — checklist respondido pelo usuário, sem crawl.
// Os 7 sinais mapeiam para E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) —
// framework que o Google Search Central confirma usar para Search e AI Overviews. Presença do sinal
// não garante que o Google/IA de fato usa aquele sinal para aquele site — é aproximação de boas
// práticas documentadas, não medição direta.

type Sinal = { id: string; label: string; pergunta: string };

const SINAIS: Sinal[] = [
  { id: "sobre", label: "Página \"Sobre\"", pergunta: "Tem uma página \"Sobre\" contando quem é a empresa?" },
  { id: "nap", label: "Contato com endereço/telefone (NAP)", pergunta: "Tem página de contato com endereço físico e telefone?" },
  { id: "privacidade", label: "Política de privacidade visível", pergunta: "Tem política de privacidade visível e acessível?" },
  { id: "depoimentos", label: "Depoimentos/avaliações de cliente", pergunta: "Tem depoimentos ou avaliações de cliente no site?" },
  { id: "autor", label: "Autor identificado nos textos", pergunta: "Os artigos/textos têm autor identificado (não anônimo)?" },
  { id: "cnpj", label: "CNPJ/registro visível", pergunta: "O CNPJ ou registro da empresa está visível no site?" },
  { id: "certificacoes", label: "Certificações ou selos do setor", pergunta: "Tem certificações, selos ou registros do setor exibidos?" },
];

export default function SinaisDeConfianca() {
  const [marcados, setMarcados] = useState<Record<string, boolean>>({});

  const interagiu = useRef(false);
  function toggle(id: string) {
    setMarcados((m) => ({ ...m, [id]: !m[id] }));
    if (!interagiu.current) {
      interagiu.current = true;
      trackEvent("tool_completed", { tool: "confianca-11" });
    }
  }

  useEffect(() => { trackEvent("tool_started", { tool: "confianca-11" }); }, []);

  const nota = SINAIS.reduce((soma, s) => soma + (marcados[s.id] ? 1 : 0), 0);
  const faltando = SINAIS.filter((s) => !marcados[s.id]);

  const waHref = useMemo(() => {
    const lines = [
      "Olá! Chequei os sinais de confiança do meu site na Fórmula Mídia:",
      `• Nota: ${nota}/7`,
      faltando.length > 0 ? `• Faltando: ${faltando.map((s) => s.label).join(", ")}` : "• Todos os sinais presentes",
      "",
      "Quero ajuda para fechar os sinais que faltam.",
      "— ref: confianca-11",
    ];
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nota, faltando]);

  return (
    <div className="mt-11 grid items-start gap-7 md:grid-cols-[1.35fr_1fr]">
      {/* ENTRADAS */}
      <div className="flex flex-col gap-7">
        <div className="rounded-card border border-border bg-glass p-7">
          <h3 className="mb-1 font-heading text-[15px] font-semibold">Seu site institucional</h3>
          <p className="mb-5 text-[12.5px] text-dim">Marque o que o seu site já tem hoje.</p>
          <div className="flex flex-col gap-2.5">
            {SINAIS.map((s) => {
              const ativo = !!marcados[s.id];
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggle(s.id)}
                  aria-pressed={ativo}
                  className={
                    "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-[13.5px] transition-colors " +
                    (ativo ? "border-red bg-red/12 text-ink" : "border-border bg-glass text-mid hover:border-border-hi")
                  }
                >
                  <span>{s.pergunta}</span>
                  <span className={"shrink-0 font-heading text-[12px] font-bold " + (ativo ? "text-red-hi" : "text-dim")}>{ativo ? "Sim" : "Não"}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-card border border-border bg-glass p-6 text-[13px] leading-relaxed text-dim">
          <strong className="text-ink">Metodologia.</strong> Os 7 sinais mapeiam para E-E-A-T
          (Experience, Expertise, Authoritativeness, Trustworthiness) — o framework que o Google
          Search Central confirma usar tanto para Search quanto para AI Overviews. Ter o sinal não
          garante que o Google ou uma IA generativa de fato usa ele para o seu site especificamente —
          é aproximação de boas práticas documentadas, não medição direta.
        </div>
      </div>

      {/* RESULTADO */}
      <div className="rounded-card border border-red/28 bg-gradient-to-b from-red/8 to-glass p-8 md:sticky md:top-24">
        <h3 className="mb-4 font-heading text-xs font-semibold uppercase tracking-[.12em] text-red-hi">Sinais de confiança</h3>

        <div className="mb-5 rounded-2xl border border-border-hi bg-glass-hi p-5 text-center">
          <div className="font-heading text-[46px] font-bold leading-none">{nota}<span className="text-[22px] text-dim">/7</span></div>
          <div className="mt-2 text-[11.5px] text-dim">{nota === 7 ? "Todos os sinais presentes" : `${SINAIS.length - nota} sinal(is) faltando`}</div>
        </div>

        <div className="mb-6">
          <div className="mb-2.5 text-[11px] uppercase tracking-[.08em] text-dim">O que falta</div>
          <div className="flex flex-col gap-2.5">
            {faltando.length === 0 ? (
              <p className="text-[13px] text-dim">Nenhum sinal faltando — seu site cobre os 7 pontos.</p>
            ) : (
              faltando.map((s) => (
                <div key={s.id} className="flex gap-2.5 text-[13px] leading-snug">
                  <span className="font-heading font-bold text-red-hi">·</span>
                  <span className="text-mid">{s.label}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <a
          href={waHref}
          target="_blank"
          rel="noopener"
          onClick={() => trackEvent("cta_whatsapp", { tool: "confianca-11" })}
          className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5"
        >
          Fechar os sinais que faltam →
        </a>
        <p className="mt-3.5 text-center text-[11.5px] leading-relaxed text-dim">
          Não há truque técnico especial para IA — os fundamentos são os de sempre.
        </p>
      </div>
    </div>
  );
}
