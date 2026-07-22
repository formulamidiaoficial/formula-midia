import { useMemo, useState } from "react";
import { WHATSAPP_NUMBER } from "../../data/schema";

// Guided growth diagnosis — a client-side quiz (no backend, works on static
// hosting). Each question maps to one growth dimension; the answer score
// (0-3) is that dimension's maturity. The result shows an overall level,
// the weakest dimension (biggest gap) and a tailored recommendation, then
// gates a WhatsApp conversation with the result embedded.

interface Option {
  label: string;
  score: number;
}
interface Question {
  dim: string;
  q: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    dim: "Aquisição",
    q: "Como novos clientes chegam até o seu negócio hoje?",
    options: [
      { label: "Quase tudo por indicação e boca a boca", score: 0 },
      { label: "Um pouco de anúncio, mas sem constância", score: 1 },
      { label: "Anúncios rodando, mas sem previsibilidade clara", score: 2 },
      { label: "Uma máquina de aquisição previsível e constante", score: 3 },
    ],
  },
  {
    dim: "Conversão",
    q: "Quando alguém entra em contato (ex.: WhatsApp), o que costuma acontecer?",
    options: [
      { label: "Às vezes a resposta demora ou o contato se perde", score: 0 },
      { label: "Respondemos, mas sem um processo definido", score: 1 },
      { label: "Temos um processo de atendimento, porém manual", score: 2 },
      { label: "Atendimento rápido, com CRM e follow-up organizado", score: 3 },
    ],
  },
  {
    dim: "Mensuração",
    q: "Você sabe quanto custa para conquistar um novo cliente?",
    options: [
      { label: "Não faço ideia", score: 0 },
      { label: "Tenho só uma noção vaga", score: 1 },
      { label: "Sei aproximadamente", score: 2 },
      { label: "Sei com precisão e acompanho todo mês", score: 3 },
    ],
  },
  {
    dim: "Previsibilidade",
    q: "Consegue prever quantos clientes novos terá no próximo mês?",
    options: [
      { label: "Não, varia muito de um mês para o outro", score: 0 },
      { label: "Só uma estimativa grosseira", score: 1 },
      { label: "Razoavelmente, em meses normais", score: 2 },
      { label: "Sim, com boa previsibilidade", score: 3 },
    ],
  },
  {
    dim: "Presença digital",
    q: "Como está a presença online do seu negócio (site, Google)?",
    options: [
      { label: "Não tenho site, ou está desatualizado", score: 0 },
      { label: "Tenho site, mas quase não gera contato", score: 1 },
      { label: "Site ok, apareço às vezes no Google", score: 2 },
      { label: "Site forte, apareço bem e converto", score: 3 },
    ],
  },
  {
    dim: "Relacionamento",
    q: "Você aproveita a base de clientes que já conquistou?",
    options: [
      { label: "Não faço nada com ela", score: 0 },
      { label: "Contato esporádico, sem estratégia", score: 1 },
      { label: "Alguma ação de relacionamento", score: 2 },
      { label: "Estratégia ativa de recompra e indicação", score: 3 },
    ],
  },
];

const MAX = QUESTIONS.length * 3;

const RECS: Record<string, string> = {
  Aquisição:
    "Seu maior gargalo é a aquisição: o crescimento depende do acaso. O primeiro passo é construir um canal previsível de novos clientes — a base do Motor de Crescimento.",
  Conversão:
    "Seu maior gargalo é a conversão: você atrai contatos, mas perde parte deles no caminho. Um CRM e um processo de atendimento rápido recuperam vendas que já estão quase na mão.",
  Mensuração:
    "Seu maior gargalo é a mensuração: sem saber o custo por cliente, cada decisão é achismo. Medir é o que transforma esforço em estratégia.",
  Previsibilidade:
    "Seu maior gargalo é a previsibilidade: o mês bom e o mês fraco não estão sob seu controle. Uma máquina de aquisição medida traz estabilidade ao faturamento.",
  "Presença digital":
    "Seu maior gargalo é a presença digital: quem procura por você não encontra ou não confia no que vê. Um site forte e presença no Google são a fundação de tudo.",
  Relacionamento:
    "Seu maior gargalo é o relacionamento: você já tem uma base valiosa e não a aproveita. Recompra e indicação são o crescimento mais barato que existe.",
};

function levelFor(pct: number) {
  if (pct <= 40) return { name: "Crescimento na sorte", desc: "Seu negócio cresce por reputação e indicação — mas sem uma máquina previsível por trás. Há muito potencial destravado." };
  if (pct <= 70) return { name: "Máquina em construção", desc: "Você já tem peças no lugar, mas elas ainda não trabalham integradas. Faltam ajustes para o crescimento ficar previsível." };
  return { name: "Máquina de crescimento", desc: "Seu negócio já cresce com método e dados. Agora o jogo é escalar e otimizar o que já funciona." };
}

export default function GrowthDiagnosis() {
  const [step, setStep] = useState(0); // 0..N-1 questions, N = result
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));

  const isResult = step >= QUESTIONS.length;
  const answered = answers.filter((a) => a !== null).length;

  function choose(score: number) {
    const next = [...answers];
    next[step] = score;
    setAnswers(next);
    // small delay feels responsive; advance immediately for reliability
    setStep(step + 1);
  }

  const total = answers.reduce<number>((sum, a) => sum + (a ?? 0), 0);
  const pct = Math.round((total / MAX) * 100);
  const level = levelFor(pct);

  // weakest dimension = lowest answered score (first one on tie)
  const weakest = useMemo(() => {
    let idx = 0;
    let min = 4;
    QUESTIONS.forEach((q, i) => {
      const s = answers[i] ?? 0;
      if (s < min) {
        min = s;
        idx = i;
      }
    });
    return QUESTIONS[idx].dim;
  }, [answers]);

  const waHref = useMemo(() => {
    const lines = [
      "Olá! Fiz o Diagnóstico de Crescimento no site da Fórmula Mídia:",
      `• Nível: ${level.name} (${pct}/100)`,
      `• Maior gargalo: ${weakest}`,
      "",
      "Quero um diagnóstico completo do meu negócio.",
    ];
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [level.name, pct, weakest]);

  function restart() {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setStep(0);
  }

  if (!isResult) {
    const question = QUESTIONS[step];
    const progress = Math.round((step / QUESTIONS.length) * 100);
    return (
      <div className="mx-auto mt-11 max-w-[680px]">
        {/* progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-[12px] font-semibold text-dim">
            <span>Pergunta {step + 1} de {QUESTIONS.length}</span>
            <span>{question.dim}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-glass-hi">
            <div className="h-full rounded-full bg-gradient-to-r from-red to-red-hi transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <h3 className="mb-7 font-heading text-[clamp(20px,2.6vw,26px)] font-bold leading-tight tracking-tight">{question.q}</h3>

        <div className="flex flex-col gap-3">
          {question.options.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => choose(opt.score)}
              className="group flex items-center gap-3.5 rounded-2xl border border-border bg-glass px-5 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-red/40 hover:bg-glass-hi"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-hi text-[12px] font-bold text-dim transition-colors group-hover:border-red-hi group-hover:text-red-hi">
                {String.fromCharCode(65 + question.options.indexOf(opt))}
              </span>
              <span className="text-[15px] font-medium leading-snug">{opt.label}</span>
            </button>
          ))}
        </div>

        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="mt-6 text-[13px] font-semibold text-dim transition-colors hover:text-ink"
          >
            ← Voltar
          </button>
        )}
      </div>
    );
  }

  // RESULT
  return (
    <div className="mx-auto mt-11 max-w-[680px]">
      <div className="rounded-card border border-red/28 bg-gradient-to-b from-red/8 to-glass p-8 text-center">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[.12em] text-red-hi">Seu diagnóstico de crescimento</div>
        <div className="font-heading text-[52px] font-bold leading-none tracking-tight text-ink">
          {pct}<span className="text-[24px] text-dim">/100</span>
        </div>
        <div className="mt-3 font-heading text-[22px] font-bold text-red-hi">{level.name}</div>
        <p className="mx-auto mt-3 max-w-[460px] text-sm leading-relaxed text-mid">{level.desc}</p>
      </div>

      {/* dimension breakdown */}
      <div className="mt-6 rounded-card border border-border bg-glass p-7">
        <h4 className="mb-5 font-heading text-xs font-semibold uppercase tracking-[.1em] text-dim">Onde você está em cada frente</h4>
        <div className="flex flex-col gap-3.5">
          {QUESTIONS.map((qq, i) => {
            const s = answers[i] ?? 0;
            const w = (s / 3) * 100;
            const isWeak = qq.dim === weakest;
            return (
              <div key={qq.dim}>
                <div className="mb-1 flex items-center justify-between text-[12.5px]">
                  <span className={isWeak ? "font-semibold text-red-hi" : "text-mid"}>{qq.dim}{isWeak && " — maior gargalo"}</span>
                  <span className="font-heading font-bold text-dim">{s}/3</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-bg-2">
                  <div className={`h-full rounded-full ${isWeak ? "bg-red-hi" : "bg-gradient-to-r from-red to-red-lo"}`} style={{ width: `${w}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* recommendation */}
      <div className="mt-6 rounded-card border border-border bg-bg-2 p-7">
        <h4 className="mb-2.5 font-heading text-xs font-semibold uppercase tracking-[.1em] text-red-hi">O próximo passo mais importante</h4>
        <p className="text-[15px] leading-relaxed text-ink">{RECS[weakest]}</p>
      </div>

      <a
        href={waHref}
        target="_blank"
        rel="noopener"
        className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5"
      >
        Quero um diagnóstico completo com um especialista →
      </a>
      <button
        type="button"
        onClick={restart}
        className="mt-4 w-full text-center text-[13px] font-semibold text-dim transition-colors hover:text-ink"
      >
        Refazer o diagnóstico
      </button>
      <p className="mt-4 text-center text-[11.5px] leading-relaxed text-dim">
        Diagnóstico educativo e indicativo, baseado nas suas respostas — não substitui uma análise completa do seu negócio.
      </p>
    </div>
  );
}
