import { useEffect, useMemo, useRef, useState } from "react";
import { WHATSAPP_NUMBER } from "../../data/schema";
import { trackEvent } from "../../lib/track";

// Spec: TOOL-009 (fórmula-foundation). Declarativo — o usuário descreve o próprio formulário,
// não fazemos crawl. Fonte do benchmark: HubSpot, "Form Conversion Rate Statistics" (2024).
// Conversão por nº de campos (dado real, não fabricado): 1 campo ~18,2% · 2 campos ~13,0% ·
// 3 campos ~11,5% · 4 campos ~9,9% · 7+ campos chegam a 67,8% de abandono. A faixa 3-6 campos
// costuma ter a melhor relação completude/dado coletado — por isso a nota não pune poucos campos
// como "fricção alta", só avisa que capta menos dado de qualificação.

const CONVERSAO_POR_CAMPO: Record<number, number> = { 1: 18.2, 2: 13.0, 3: 11.5, 4: 9.9 };

function friccaoDeCampos(campos: number): number {
  if (campos <= 0) return 0;
  if (campos >= 3 && campos <= 6) return 0; // faixa ideal
  if (campos <= 2) return 12; // converte bem, mas capta pouco dado — aviso, não punição forte
  if (campos === 7) return 40;
  return Math.min(100, 55 + (campos - 8) * 6);
}

function banda(nota: number): { nome: string; cor: string } {
  if (nota <= 25) return { nome: "Baixa", cor: "text-ink" };
  if (nota <= 55) return { nome: "Média", cor: "text-red-hi" };
  return { nome: "Alta", cor: "text-red-hi" };
}

export default function FriccaoFormulario() {
  const [campos, setCampos] = useState(6);
  const [obrigatorios, setObrigatorios] = useState(4);
  const [temCaptcha, setTemCaptcha] = useState(false);
  const [pedeDadoSensivelAntes, setPedeDadoSensivelAntes] = useState(false);
  const [temWhatsapp, setTemWhatsapp] = useState(true);
  const [multiEtapa, setMultiEtapa] = useState(false);

  const interagiu = useRef(false);
  function marcarInteracao() {
    if (!interagiu.current) {
      interagiu.current = true;
      trackEvent("tool_completed", { tool: "friccao-09" });
    }
  }

  useEffect(() => { trackEvent("tool_started", { tool: "friccao-09" }); }, []);

  const { nota, acoes, conversaoEstimada } = useMemo(() => {
    let n = friccaoDeCampos(campos);
    const acoesLista: { texto: string; peso: number }[] = [];

    if (campos > 6) {
      acoesLista.push({ texto: `Reduza de ${campos} para a faixa de 3 a 6 campos — corte primeiro o que não é essencial para o primeiro contato.`, peso: campos > 7 ? 40 : 25 });
    }
    if (temCaptcha) {
      n += 15;
      acoesLista.push({ texto: "Remova o captcha do primeiro contato. Deixe para uma etapa posterior, se for realmente necessário.", peso: 15 });
    }
    if (pedeDadoSensivelAntes) {
      n += 20;
      acoesLista.push({ texto: "Não peça CPF ou endereço completo antes do primeiro contato — peça só depois que o lead já demonstrou interesse.", peso: 20 });
    }
    if (!temWhatsapp) {
      n += 10;
      acoesLista.push({ texto: "Adicione um campo de telefone/WhatsApp — é o canal mais rápido para qualificar e responder.", peso: 10 });
    }
    if (campos <= 2) {
      acoesLista.push({ texto: "Poucos campos convertem mais, mas você vai captar menos dado — combine com uma etapa de qualificação depois, por WhatsApp.", peso: 8 });
    }

    n = Math.max(0, Math.min(100, n));
    acoesLista.sort((a, b) => b.peso - a.peso);

    const conv = CONVERSAO_POR_CAMPO[campos] ?? (campos <= 6 ? 9.9 : undefined);

    return { nota: n, acoes: acoesLista.slice(0, 3), conversaoEstimada: conv };
  }, [campos, temCaptcha, pedeDadoSensivelAntes, temWhatsapp]);

  const b = banda(nota);

  const waHref = useMemo(() => {
    const lines = [
      "Olá! Avaliei a fricção do formulário do meu site na Fórmula Mídia:",
      `• Fricção: ${nota}/100 (${b.nome})`,
      `• Campos: ${campos} (${obrigatorios} obrigatórios)`,
      acoes[0] ? `• Prioridade: ${acoes[0].texto}` : "",
      "",
      "Quero ajuda para simplificar o formulário.",
      "— ref: friccao-09",
    ].filter(Boolean);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nota, b.nome, campos, obrigatorios, acoes]);

  return (
    <div className="mt-11 grid items-start gap-7 md:grid-cols-[1.35fr_1fr]">
      {/* ENTRADAS */}
      <div className="flex flex-col gap-7">
        <div className="rounded-card border border-border bg-glass p-7">
          <h3 className="mb-5 font-heading text-[15px] font-semibold">Sobre o formulário do seu site</h3>

          <div className="grid grid-cols-2 gap-4">
            <NumBox label="Quantos campos, no total" value={campos} onChange={(v) => { setCampos(v); marcarInteracao(); }} />
            <NumBox label="Quantos são obrigatórios" value={obrigatorios} onChange={(v) => { setObrigatorios(v); marcarInteracao(); }} />
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Toggle label="Tem telefone/WhatsApp como campo" checked={temWhatsapp} onChange={(v) => { setTemWhatsapp(v); marcarInteracao(); }} />
            <Toggle label="Tem captcha" checked={temCaptcha} onChange={(v) => { setTemCaptcha(v); marcarInteracao(); }} />
            <Toggle label="Pede CPF ou endereço completo antes do primeiro contato" checked={pedeDadoSensivelAntes} onChange={(v) => { setPedeDadoSensivelAntes(v); marcarInteracao(); }} />
            <Toggle label="É multi-etapa (várias telas)" checked={multiEtapa} onChange={(v) => { setMultiEtapa(v); marcarInteracao(); }} />
          </div>

          {multiEtapa && (
            <p className="mt-5 rounded-xl border border-border bg-glass-hi p-4 text-[12.5px] leading-relaxed text-dim">
              Formulário multi-etapa costuma reduzir a fricção <em>percebida</em>, mesmo com o mesmo
              total de campos — mas isso não muda a nota abaixo, que é sobre o total de dado pedido.
            </p>
          )}
        </div>

        <div className="rounded-card border border-border bg-glass p-6 text-[13px] leading-relaxed text-dim">
          <strong className="text-ink">Fonte do benchmark.</strong> HubSpot, "Form Conversion Rate
          Statistics" (2024): conversão cai em média 4,1% por campo adicional. Formulários de 1 campo
          convertem ~18,2%; de 4 campos, ~9,9%; de 7 ou mais, o abandono chega a 67,8%. Estudos mais
          recentes (pós-2012) mostram ganho menor que os primeiros — não é garantia de resultado
          individual, é média de mercado.
        </div>
      </div>

      {/* RESULTADO */}
      <div className="rounded-card border border-red/28 bg-gradient-to-b from-red/8 to-glass p-8 md:sticky md:top-24">
        <h3 className="mb-4 font-heading text-xs font-semibold uppercase tracking-[.12em] text-red-hi">Fricção do formulário</h3>

        <div className="mb-5 rounded-2xl border border-border-hi bg-glass-hi p-5 text-center">
          <div className="font-heading text-[46px] font-bold leading-none">{nota}<span className="text-[22px] text-dim">/100</span></div>
          <div className={"mt-2 font-heading text-[15px] font-bold " + b.cor}>{b.nome}</div>
          {conversaoEstimada !== undefined && campos <= 6 && (
            <div className="mt-2 text-[11.5px] text-dim">Conversão média de mercado nessa faixa: ~{conversaoEstimada.toString().replace(".", ",")}%</div>
          )}
        </div>

        <div className="mb-5 rounded-2xl border border-border-hi bg-glass-hi p-5 text-center">
          <div className="text-xs leading-relaxed text-dim">
            Faixa ideal: <strong className="text-ink">3 a 6 campos</strong>. Você tem{" "}
            <strong className={campos >= 3 && campos <= 6 ? "text-ink" : "text-red-hi"}>{campos}</strong>.
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-2.5 text-[11px] uppercase tracking-[.08em] text-dim">O que cortar primeiro</div>
          <div className="flex flex-col gap-2.5">
            {acoes.length === 0 ? (
              <p className="text-[13px] text-dim">Seu formulário está na faixa recomendada, sem agravantes.</p>
            ) : (
              acoes.map((a, i) => (
                <div key={i} className="flex gap-2.5 text-[13px] leading-snug">
                  <span className="font-heading font-bold text-red-hi">{i + 1}.</span>
                  <span className="text-mid">{a.texto}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <a
          href={waHref}
          target="_blank"
          rel="noopener"
          onClick={() => trackEvent("cta_whatsapp", { tool: "friccao-09" })}
          className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5"
        >
          Simplificar meu formulário →
        </a>
        <p className="mt-3.5 text-center text-[11.5px] leading-relaxed text-dim">
          Cortar campo nem sempre é bom: menos dado no formulário pode significar mais trabalho de
          qualificação depois.
        </p>
      </div>
    </div>
  );
}

function NumBox({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11.5px] font-semibold text-mid">{label}</span>
      <input
        type="number"
        min={0}
        max={20}
        value={value}
        onChange={(e) => onChange(Math.max(0, Math.min(20, Number(e.target.value))))}
        className="w-full rounded-xl border border-border bg-glass px-3 py-2.5 font-heading text-[15px] font-bold text-ink outline-none focus:border-red focus:ring-2 focus:ring-red/35"
      />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={
        "flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-left text-[13.5px] transition-colors " +
        (checked ? "border-red bg-red/12 text-ink" : "border-border bg-glass text-mid hover:border-border-hi")
      }
    >
      <span>{label}</span>
      <span className={"font-heading text-[12px] font-bold " + (checked ? "text-red-hi" : "text-dim")}>{checked ? "Sim" : "Não"}</span>
    </button>
  );
}
