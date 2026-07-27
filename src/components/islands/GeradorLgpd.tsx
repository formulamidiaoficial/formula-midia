import { useId, useMemo, useRef, useState } from "react";
import { waLink } from "../../data/schema";
import { trackEvent } from "../../lib/track";

// TOOL-007 (formula-foundation/CAPABILITIES/TOOL-007-gerador-lgpd.md).
// Preenchimento de template fixo com o que o usuário informou — não é
// geração por IA de texto jurídico novo. Nenhum dado inserido é armazenado
// (nem localStorage): o documento existe só em memória, no navegador.

const REF = "lgpd-12";

interface Coleta {
  id: string;
  label: string;
  finalidade: string;
  baseLegal: string;
}

const COLETAS: Coleta[] = [
  { id: "analytics", label: "Cookies de analytics (Google Analytics etc.)", finalidade: "entender como os visitantes usam o site, de forma agregada, para melhorar a experiência e o conteúdo", baseLegal: "legítimo interesse (art. 7º, IX, LGPD)" },
  { id: "formulario", label: "Formulário de contato", finalidade: "responder à sua solicitação de contato ou orçamento", baseLegal: "execução de procedimentos preliminares (art. 7º, V, LGPD)" },
  { id: "newsletter", label: "Newsletter / cadastro de e-mail", finalidade: "enviar conteúdo, novidades e ofertas, quando você se inscreve voluntariamente", baseLegal: "consentimento (art. 7º, I, LGPD)" },
  { id: "pixel", label: "Pixel de anúncio (Meta, Google Ads etc.)", finalidade: "medir a performance de campanhas publicitárias e exibir anúncios relevantes em outras plataformas", baseLegal: "consentimento (art. 7º, I, LGPD)" },
  { id: "chat", label: "Chat / WhatsApp", finalidade: "atender e responder suas mensagens e dúvidas", baseLegal: "execução de procedimentos preliminares (art. 7º, V, LGPD)" },
];

const AVISO = "Isto não é assessoria jurídica. É um modelo orientativo com base na LGPD, gerado a " +
  "partir do que você informou. Antes de publicar, um profissional habilitado (advogado) deve " +
  "revisar — a Fórmula Mídia não se responsabiliza pela adequação legal do texto gerado sem essa revisão.";

function gerarDocumento(opts: {
  empresa: string;
  cnpj: string;
  contato: string;
  marcados: string[];
  outroDesc: string;
}): string {
  const { empresa, cnpj, contato, marcados, outroDesc } = opts;
  const nome = empresa.trim() || "[NOME DA EMPRESA]";
  const itens = [
    ...COLETAS.filter((c) => marcados.includes(c.id)),
    ...(marcados.includes("outro") && outroDesc.trim()
      ? [{ id: "outro", label: outroDesc.trim(), finalidade: "a finalidade descrita acima", baseLegal: "consentimento (art. 7º, I, LGPD)" }]
      : []),
  ];

  const secaoColeta = itens.length
    ? itens.map((c, i) => `${i + 1}. **${c.label}** — finalidade: ${c.finalidade}. Base legal: ${c.baseLegal}.`).join("\n")
    : "Nenhuma coleta selecionada ainda.";

  return `POLÍTICA DE PRIVACIDADE — ${nome.toUpperCase()}

${AVISO}

1. QUEM SOMOS
${nome}${cnpj.trim() ? `, inscrita no CNPJ ${cnpj.trim()}` : ""}, é responsável pelo tratamento dos dados pessoais coletados através deste site, em conformidade com a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados — LGPD).

2. QUAIS DADOS COLETAMOS E PARA QUÊ
${secaoColeta}

3. COMPARTILHAMENTO COM TERCEIROS
Podemos compartilhar dados com prestadores de serviço que operam em nosso nome (ex.: provedores de hospedagem, ferramentas de analytics e publicidade), sempre dentro do necessário para as finalidades acima. Não vendemos seus dados pessoais a terceiros.

4. RETENÇÃO
Mantemos os dados pelo tempo necessário para cumprir as finalidades descritas nesta política ou por obrigação legal, e os eliminamos ou anonimizamos depois disso.

5. SEUS DIREITOS (ART. 18, LGPD)
Você pode solicitar, a qualquer momento: confirmação da existência de tratamento, acesso aos dados, correção de dados incompletos ou desatualizados, anonimização, bloqueio ou eliminação de dados desnecessários, portabilidade dos dados, eliminação dos dados tratados com consentimento, informação sobre com quem compartilhamos seus dados, e a revogação do consentimento a qualquer momento.

6. CONTATO
${contato.trim() ? `Para exercer seus direitos ou tirar dúvidas, entre em contato: ${contato.trim()}.` : "[E-MAIL DO RESPONSÁVEL PELO TRATAMENTO DE DADOS]"}

7. ALTERAÇÕES DESTA POLÍTICA
Esta política pode ser atualizada periodicamente. A data da última atualização estará sempre indicada nesta página.

8. CASOS NÃO COBERTOS POR ESTE MODELO
Este modelo não cobre: dado de saúde ou outro dado sensível, transferência internacional de dados, nem a obrigatoriedade de um Encarregado de Dados (DPO) formal — que depende do porte e da atividade da empresa. Se algum desses casos se aplica ao seu negócio, procure um advogado antes de publicar.

${AVISO}
`;
}

export default function GeradorLgpd() {
  const [empresa, setEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [contato, setContato] = useState("");
  const [marcados, setMarcados] = useState<string[]>([]);
  const [outroDesc, setOutroDesc] = useState("");
  const [copiado, setCopiado] = useState(false);

  const iniciou = useRef(false);
  const completou = useRef(false);
  function marcarInicio() {
    if (iniciou.current) return;
    iniciou.current = true;
    trackEvent("tool_started", { tool: REF });
  }

  function toggle(id: string) {
    marcarInicio();
    setMarcados((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));
  }

  const documento = useMemo(
    () => gerarDocumento({ empresa, cnpj, contato, marcados, outroDesc }),
    [empresa, cnpj, contato, marcados, outroDesc]
  );

  const pronto = empresa.trim().length > 0 && marcados.length > 0;

  function copiar() {
    if (!completou.current) {
      completou.current = true;
      trackEvent("tool_completed", { tool: REF });
    }
    navigator.clipboard?.writeText(documento).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }

  const waHref = waLink(
    `Olá! Gerei uma política de privacidade na Fórmula Mídia para "${empresa || "minha empresa"}" e quero uma revisão profissional antes de publicar.\n— ref: ${REF}`
  );

  return (
    <div className="mt-11 flex flex-col gap-7">
      <div className="rounded-card border border-red/40 bg-red/10 p-5 text-[13.5px] leading-relaxed text-ink">
        <strong>Antes de preencher:</strong> {AVISO}
      </div>

      <div className="grid items-start gap-7 md:grid-cols-[1fr_1.2fr]">
        <div className="rounded-card border border-border bg-glass p-8">
          <TextField label="Nome da empresa" value={empresa} onChange={setEmpresa} onFocus={marcarInicio} placeholder="Sua Empresa Ltda." />
          <TextField label="CNPJ (opcional)" value={cnpj} onChange={setCnpj} onFocus={marcarInicio} placeholder="00.000.000/0000-00" />
          <TextField label="E-mail do responsável (opcional)" value={contato} onChange={setContato} onFocus={marcarInicio} placeholder="contato@suaempresa.com.br" />

          <div className="mb-2 mt-2">
            <div className="mb-1.5 font-heading text-[15px] font-semibold">O que o seu site coleta?</div>
            <div className="mb-4 text-[12.5px] text-dim">Marque tudo que se aplica.</div>
            <div className="flex flex-col gap-2">
              {COLETAS.map((c) => (
                <label key={c.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-glass px-4 py-3 text-[13.5px] hover:border-border-hi">
                  <input
                    type="checkbox"
                    checked={marcados.includes(c.id)}
                    onChange={() => toggle(c.id)}
                    className="mt-0.5"
                  />
                  <span>{c.label}</span>
                </label>
              ))}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-glass px-4 py-3 text-[13.5px] hover:border-border-hi">
                <input type="checkbox" checked={marcados.includes("outro")} onChange={() => toggle("outro")} className="mt-0.5" />
                <span>Outro</span>
              </label>
              {marcados.includes("outro") && (
                <input
                  type="text"
                  aria-label="Descreva o que mais é coletado"
                  value={outroDesc}
                  onChange={(e) => setOutroDesc(e.target.value)}
                  placeholder="Descreva o que mais é coletado"
                  className="w-full rounded-2xl border border-border bg-bg px-4 py-3 font-body text-[14px] text-ink outline-none focus:border-red focus:ring-2 focus:ring-red/35"
                />
              )}
            </div>
          </div>
        </div>

        <div className="rounded-card border border-red/28 bg-gradient-to-b from-red/8 to-glass p-6">
          <h3 className="mb-4 font-heading text-xs font-semibold uppercase tracking-[.12em] text-red-hi">
            Documento gerado
          </h3>
          <pre className="mb-5 max-h-[480px] overflow-y-auto whitespace-pre-wrap rounded-2xl border border-border bg-bg p-5 font-body text-[12.5px] leading-relaxed text-mid">
            {documento}
          </pre>

          <button
            type="button"
            onClick={copiar}
            disabled={!pronto}
            className="mb-3 flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {copiado ? "Copiado!" : "Copiar documento →"}
          </button>
          {!pronto && (
            <p className="mb-3 text-center text-[11.5px] text-dim">
              Preencha o nome da empresa e marque ao menos uma coleta pra liberar a cópia.
            </p>
          )}

          <a
            href={waHref}
            target="_blank"
            rel="noopener"
            onClick={() => trackEvent("cta_whatsapp", { tool: REF })}
            className="block text-center font-heading text-[13px] font-semibold text-red-hi underline underline-offset-2"
          >
            Quero uma revisão profissional antes de publicar →
          </a>
        </div>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  onFocus,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onFocus: () => void;
  placeholder: string;
}) {
  const id = useId();
  return (
    <div className="mb-6">
      <label htmlFor={id} className="mb-2 block font-heading text-[14px] font-semibold">{label}</label>
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onFocus={onFocus}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-border bg-bg px-4 py-3.5 font-body text-[15px] text-ink outline-none focus:border-red focus:ring-2 focus:ring-red/35"
      />
    </div>
  );
}
