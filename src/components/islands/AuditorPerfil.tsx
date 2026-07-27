import { useEffect, useMemo, useRef, useState } from "react";
import { WHATSAPP_NUMBER } from "../../data/schema";
import { trackEvent } from "../../lib/track";

// Régua dos 20 pontos do Auditor de Perfil da Empresa (spec: ferramenta-01-vinte-pontos).
// É autoavaliação guiada — declaração, não observação (ADR-0010). Lead magnet.
// O ponto 10 (volume de avaliações) é calculado a partir dos números dos concorrentes.

type Opcao = { t: string; p: number };
type Questao = {
  id: number;
  bloco: string;
  titulo: string;
  peso: number;
  opcoes: Opcao[];
  fix: string; // ação curta quando perde ponto
  alerta?: string;
};

const BLOCOS = [
  "A · Identidade e categoria",
  "B · Completude",
  "C · Prova social",
  "D · Conteúdo visual",
  "E · Atividade e conversão",
] as const;

const QUESTOES: Questao[] = [
  { id: 1, bloco: BLOCOS[0], titulo: "Categoria principal", peso: 10,
    opcoes: [ { t: "Igual à do concorrente mais bem posicionado", p: 10 }, { t: "Relacionada", p: 5 }, { t: "Diferente ou genérica", p: 0 } ],
    fix: "Ajuste a categoria principal para a mesma do concorrente que aparece na frente." },
  { id: 2, bloco: BLOCOS[0], titulo: "Categorias secundárias preenchidas", peso: 6,
    opcoes: [ { t: "4 ou mais", p: 6 }, { t: "1 a 3", p: 3 }, { t: "Nenhuma", p: 0 } ],
    fix: "Cada categoria secundária é uma porta de entrada. Preencha o máximo relevante." },
  { id: 3, bloco: BLOCOS[0], titulo: "Nome sem palavra-chave forçada", peso: 5,
    opcoes: [ { t: "É o nome real, como na fachada", p: 5 }, { t: "Tem palavra-chave, cidade ou serviço colado", p: 0 } ],
    fix: "Remova palavra-chave do nome — viola as diretrizes e pode suspender o perfil.",
    alerta: "Único ponto que pode DERRUBAR o perfil do mapa." },
  { id: 4, bloco: BLOCOS[0], titulo: "Endereço e área de atendimento", peso: 4,
    opcoes: [ { t: "A configuração bate com a realidade", p: 4 }, { t: "Está errada (endereço fixo x atende a domicílio)", p: 0 } ],
    fix: "Configure endereço x área de atendimento conforme como você realmente atende." },

  { id: 5, bloco: BLOCOS[1], titulo: "Horário completo e datas especiais", peso: 4,
    opcoes: [ { t: "7 dias + horário do próximo feriado", p: 4 }, { t: "Só o horário normal", p: 2 }, { t: "Falta algum dia", p: 0 } ],
    fix: "Preencha os 7 dias e cadastre o horário do próximo feriado." },
  { id: 6, bloco: BLOCOS[1], titulo: "Telefone e site", peso: 4,
    opcoes: [ { t: "Ambos, mesmo telefone do site, link marcado", p: 4 }, { t: "Ambos, sem marcação de origem", p: 2 }, { t: "Falta um deles", p: 0 } ],
    fix: "Preencha telefone e site e marque o link para medir a origem." },
  { id: 7, bloco: BLOCOS[1], titulo: "Descrição do negócio", peso: 4,
    opcoes: [ { t: "Passa de 500 caracteres (o que faz, para quem, onde)", p: 4 }, { t: "Menos de 200 caracteres", p: 2 }, { t: "Vazia", p: 0 } ],
    fix: "Escreva 500+ caracteres dizendo o que faz, para quem e onde." },
  { id: 8, bloco: BLOCOS[1], titulo: "Serviços cadastrados", peso: 5,
    opcoes: [ { t: "5 ou mais, com descrição", p: 5 }, { t: "1 a 4", p: 3 }, { t: "Nenhum", p: 0 } ],
    fix: "Cadastre 5+ serviços com descrição — é texto que o Google lê." },
  { id: 9, bloco: BLOCOS[1], titulo: "Atributos preenchidos", peso: 3,
    opcoes: [ { t: "Preenchidos (acessibilidade, pagamento, atendimento)", p: 3 }, { t: "Ignorados", p: 0 } ],
    fix: "Preencha os atributos disponíveis do seu segmento." },

  { id: 10, bloco: BLOCOS[2], titulo: "Volume de avaliações vs. concorrentes", peso: 10,
    opcoes: [], fix: "Puxe avaliações — é o número que mais move sua posição no mapa." }, // AUTO
  { id: 11, bloco: BLOCOS[2], titulo: "Nota média", peso: 5,
    opcoes: [ { t: "4,5 ou mais", p: 5 }, { t: "4,0 a 4,4", p: 3 }, { t: "Abaixo de 4,0", p: 0 } ],
    fix: "Trabalhe a experiência e o pós-venda para subir a nota média." },
  { id: 12, bloco: BLOCOS[2], titulo: "Ritmo de avaliação (últimos 90 dias)", peso: 6,
    opcoes: [ { t: "10 ou mais", p: 6 }, { t: "3 a 9", p: 3 }, { t: "Menos de 3", p: 0 } ],
    fix: "Crie uma rotina de pedir avaliação — ritmo vale mais que acervo." },
  { id: 13, bloco: BLOCOS[2], titulo: "Taxa de resposta às avaliações", peso: 6,
    opcoes: [ { t: "Mais de 90%", p: 6 }, { t: "Entre 50% e 90%", p: 3 }, { t: "Abaixo de 50%", p: 0 } ],
    fix: "Responda as avaliações — é conteúdo indexável que o próximo cliente lê." },
  { id: 14, bloco: BLOCOS[2], titulo: "Resposta às avaliações negativas", peso: 3,
    opcoes: [ { t: "Todas as negativas (6 meses) respondidas", p: 3 }, { t: "Alguma ficou sem resposta", p: 0 } ],
    fix: "Responda toda avaliação negativa — é a página que o concorrente mostra ao seu cliente." },

  { id: 15, bloco: BLOCOS[3], titulo: "Quantidade de fotos", peso: 4,
    opcoes: [ { t: "20 ou mais", p: 4 }, { t: "5 a 19", p: 2 }, { t: "Menos de 5", p: 0 } ],
    fix: "Suba 20+ fotos reais do negócio." },
  { id: 16, bloco: BLOCOS[3], titulo: "Recência das fotos", peso: 4,
    opcoes: [ { t: "Subiu foto nos últimos 30 dias", p: 4 }, { t: "Nos últimos 90 dias", p: 2 }, { t: "Passa disso", p: 0 } ],
    fix: "Suba fotos novas ao menos uma vez por mês." },
  { id: 17, bloco: BLOCOS[3], titulo: "Capa, logo e vídeo", peso: 4,
    opcoes: [ { t: "Capa e logo nítidos + pelo menos um vídeo", p: 4 }, { t: "Só capa e logo definidos", p: 2 }, { t: "Falta capa ou logo", p: 0 } ],
    fix: "Defina capa e logo nítidos e adicione um vídeo curto." },

  { id: 18, bloco: BLOCOS[4], titulo: "Publicações recentes", peso: 4,
    opcoes: [ { t: "Publicou nos últimos 7 dias", p: 4 }, { t: "Nos últimos 30 dias", p: 2 }, { t: "Passa disso", p: 0 } ],
    fix: "Publique ao menos uma vez por semana no perfil." },
  { id: 19, bloco: BLOCOS[4], titulo: "Perguntas e respostas", peso: 4,
    opcoes: [ { t: "3 ou mais perguntas respondidas", p: 4 }, { t: "1 ou 2", p: 2 }, { t: "Vazio ou pergunta sem resposta", p: 0 } ],
    fix: "Publique e responda as dúvidas que travam a venda antes do cliente ligar." },
  { id: 20, bloco: BLOCOS[4], titulo: "Caminho de contato", peso: 5,
    opcoes: [ { t: "Mensagem ativa com resposta rápida ou agendamento", p: 5 }, { t: "Só telefone", p: 2 }, { t: "Difícil achar como falar", p: 0 } ],
    fix: "Ative mensagem com resposta rápida ou botão de agendamento." },
];

function formatN(v: number) { return Math.round(v).toLocaleString("pt-BR"); }

function banda(nota: number) {
  if (nota <= 40) return { nome: "Crítico", cor: "text-red-hi" };
  if (nota <= 60) return { nome: "Atenção", cor: "text-red-hi" };
  if (nota <= 80) return { nome: "Bom", cor: "text-ink" };
  return { nome: "Referência", cor: "text-ink" };
}

export default function AuditorPerfil() {
  const [respostas, setRespostas] = useState<Record<number, number>>({}); // id -> pontos
  const [suas, setSuas] = useState(40);
  const [c1, setC1] = useState(180);
  const [c2, setC2] = useState(260);
  const [c3, setC3] = useState(320);

  // Ponto 10 — automático a partir dos concorrentes
  const media = (c1 + c2 + c3) / 3;
  const menor = Math.min(c1, c2, c3);
  const pontos10 = suas > media ? 10 : suas >= menor ? 5 : 0;
  const faltam = Math.max(0, Math.ceil(media - suas));

  const nota = useMemo(() => {
    let soma = pontos10;
    for (const q of QUESTOES) {
      if (q.id === 10) continue;
      soma += respostas[q.id] ?? 0;
    }
    return soma;
  }, [respostas, pontos10]);

  const respondidas = Object.keys(respostas).length + 1; // +1 = ponto 10 sempre calculado
  const completo = respondidas >= QUESTOES.length;

  useEffect(() => { trackEvent("tool_started", { tool: "ap-01" }); }, []);
  const jaCompletou = useRef(false);
  useEffect(() => {
    if (completo && !jaCompletou.current) { jaCompletou.current = true; trackEvent("tool_completed", { tool: "ap-01" }); }
  }, [completo]);

  // Bloco mais fraco e 3 ações prioritárias (maior perda de ponto)
  const { blocoFraco, acoes } = useMemo(() => {
    const perdas: { titulo: string; fix: string; perda: number; bloco: string }[] = [];
    const porBloco: Record<string, { ganho: number; max: number }> = {};
    for (const q of QUESTOES) {
      const ganho = q.id === 10 ? pontos10 : respostas[q.id] ?? 0;
      const perda = q.peso - ganho;
      if (perda > 0) perdas.push({ titulo: q.titulo, fix: q.fix, perda, bloco: q.bloco });
      porBloco[q.bloco] ??= { ganho: 0, max: 0 };
      porBloco[q.bloco].ganho += ganho;
      porBloco[q.bloco].max += q.peso;
    }
    perdas.sort((a, b) => b.perda - a.perda);
    let fraco = "—";
    let pior = 2;
    for (const [b, v] of Object.entries(porBloco)) {
      const ratio = v.ganho / v.max;
      if (ratio < pior) { pior = ratio; fraco = b; }
    }
    return { blocoFraco: fraco, acoes: perdas.slice(0, 3) };
  }, [respostas, pontos10]);

  const b = banda(nota);

  const waHref = useMemo(() => {
    const lines = [
      "Olá! Auditei meu Perfil da Empresa no site da Fórmula Mídia:",
      `• Nota: ${nota}/100 (${b.nome})`,
      `• Bloco mais fraco: ${blocoFraco}`,
      `• Avaliações: eu ${formatN(suas)} x média dos concorrentes ${formatN(media)}` + (faltam > 0 ? ` (faltam ${formatN(faltam)} para empatar)` : ""),
      "",
      "Quero otimizar meu perfil.",
      "— ref: ap-01",
    ];
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nota, b.nome, blocoFraco, suas, media, faltam]);

  return (
    <div className="mt-11 grid items-start gap-7 md:grid-cols-[1.35fr_1fr]">
      {/* ENTRADAS */}
      <div className="flex flex-col gap-7">
        {/* Concorrência (dirige o ponto 10 e a linha que fecha a venda) */}
        <div className="rounded-card border border-border bg-glass p-7">
          <h3 className="mb-1 font-heading text-[15px] font-semibold">Avaliações: você contra 3 concorrentes</h3>
          <p className="mb-5 text-[12.5px] text-dim">Abra o mapa na sua busca principal e conte as avaliações dos 3 que aparecem antes de você.</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <NumBox label="Você" value={suas} onChange={setSuas} destaque />
            <NumBox label="Concorrente 1" value={c1} onChange={setC1} />
            <NumBox label="Concorrente 2" value={c2} onChange={setC2} />
            <NumBox label="Concorrente 3" value={c3} onChange={setC3} />
          </div>
        </div>

        {/* 20 pontos por bloco */}
        {BLOCOS.map((bloco) => (
          <div key={bloco} className="rounded-card border border-border bg-glass p-7">
            <div className="mb-5 font-heading text-xs font-semibold uppercase tracking-[.12em] text-red-hi">{bloco}</div>
            <div className="flex flex-col gap-6">
              {QUESTOES.filter((q) => q.bloco === bloco).map((q) =>
                q.id === 10 ? (
                  <div key={q.id}>
                    <div className="mb-1 flex items-baseline justify-between gap-3 font-heading text-[14.5px] font-semibold">
                      <span>{q.id}. {q.titulo}</span>
                      <span className="font-bold text-red-hi">{pontos10}/{q.peso}</span>
                    </div>
                    <p className="text-[12.5px] text-dim">
                      Calculado automaticamente: {pontos10 === 10 ? "acima da média dos concorrentes." : pontos10 === 5 ? "entre o menor e a média." : "abaixo de todos os concorrentes."}
                    </p>
                  </div>
                ) : (
                  <Questao
                    key={q.id}
                    q={q}
                    selecionado={respostas[q.id]}
                    onSelect={(p) => setRespostas((r) => ({ ...r, [q.id]: p }))}
                  />
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* RESULTADO */}
      <div className="rounded-card border border-red/28 bg-gradient-to-b from-red/8 to-glass p-8 md:sticky md:top-24">
        <h3 className="mb-4 font-heading text-xs font-semibold uppercase tracking-[.12em] text-red-hi">Sua nota</h3>

        <div className="mb-5 rounded-2xl border border-border-hi bg-glass-hi p-5 text-center">
          <div className="font-heading text-[46px] font-bold leading-none">{nota}<span className="text-[22px] text-dim">/100</span></div>
          <div className={"mt-2 font-heading text-[15px] font-bold " + b.cor}>{b.nome}</div>
          <div className="mt-2 text-[11.5px] text-dim">{completo ? "Perfil avaliado nos 20 pontos" : `${respondidas} de ${QUESTOES.length} respondidos`}</div>
        </div>

        {/* A linha que fecha a venda */}
        {faltam > 0 && (
          <div className="mb-5 rounded-2xl border border-border-hi bg-glass-hi p-5 text-center">
            <div className="text-xs leading-relaxed text-dim">
              Você tem <strong className="text-ink">{formatN(suas)}</strong> avaliações. A média dos 3
              concorrentes é <strong className="text-ink">{formatN(media)}</strong>. Faltam{" "}
              <strong className="text-red-hi">{formatN(faltam)} avaliações</strong> para empatar — e esse é
              o número que mais move sua posição no mapa.
            </div>
          </div>
        )}

        <div className="mb-5">
          <div className="mb-2 text-[11px] uppercase tracking-[.08em] text-dim">Bloco mais fraco</div>
          <div className="font-heading text-[15px] font-bold text-red-hi">{blocoFraco}</div>
        </div>

        <div className="mb-6">
          <div className="mb-2.5 text-[11px] uppercase tracking-[.08em] text-dim">3 ações prioritárias</div>
          <div className="flex flex-col gap-2.5">
            {acoes.length === 0 ? (
              <p className="text-[13px] text-dim">Responda os pontos ao lado para ver o que corrigir primeiro.</p>
            ) : (
              acoes.map((a, i) => (
                <div key={i} className="flex gap-2.5 text-[13px] leading-snug">
                  <span className="font-heading font-bold text-red-hi">{i + 1}.</span>
                  <span className="text-mid">{a.fix}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <a
          href={waHref}
          target="_blank"
          rel="noopener"
          onClick={() => trackEvent("cta_whatsapp", { tool: "ap-01" })}
          className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5"
        >
          Otimizar meu perfil →
        </a>
        <p className="mt-3.5 text-center text-[11.5px] leading-relaxed text-dim">
          Autoavaliação guiada. As diretrizes do Google mudam — se der nota alta, ela é sua; não
          inventamos pontos faltando para criar proposta.
        </p>
      </div>
    </div>
  );
}

function Questao({ q, selecionado, onSelect }: { q: Questao; selecionado?: number; onSelect: (p: number) => void }) {
  return (
    <div>
      <div className="mb-2 font-heading text-[14.5px] font-semibold">
        {q.id}. {q.titulo} <span className="text-dim">· {q.peso} pts</span>
      </div>
      {q.alerta && <div className="mb-2 text-[12px] font-semibold text-red-hi">⚠ {q.alerta}</div>}
      <div className="flex flex-col gap-2">
        {q.opcoes.map((o, i) => {
          const ativo = selecionado === o.p;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(o.p)}
              aria-pressed={ativo}
              className={
                "flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-left text-[13.5px] transition-colors " +
                (ativo ? "border-red bg-red/12 text-ink" : "border-border bg-glass text-mid hover:border-border-hi")
              }
            >
              <span>{o.t}</span>
              <span className={"font-heading text-[12px] font-bold " + (ativo ? "text-red-hi" : "text-dim")}>{o.p}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NumBox({ label, value, onChange, destaque = false }: { label: string; value: number; onChange: (v: number) => void; destaque?: boolean }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={"text-[11.5px] font-semibold " + (destaque ? "text-red-hi" : "text-mid")}>{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        className="w-full rounded-xl border border-border bg-glass px-3 py-2.5 font-heading text-[15px] font-bold text-ink outline-none focus:border-red"
      />
    </label>
  );
}
