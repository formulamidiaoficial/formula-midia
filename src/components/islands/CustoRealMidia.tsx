import { useEffect, useMemo, useRef, useState } from "react";
import { WHATSAPP_NUMBER } from "../../data/schema";
import { REPASSE_META, IOF_INTERNACIONAL, SPREAD_CARTAO_PADRAO, VIGENCIA_LABEL } from "../../data/aliquotas";
import { trackEvent } from "../../lib/track";

// Ajuste A1: os dois regimes NÃO se somam — o toggle troca o modelo de cobrança:
//   • Fatura em real (Meta Brasil): custo = verba + tributos repassados (PIS/Cofins + ISS).
//   • Cartão internacional (dólar): custo = verba × (1 + IOF) × (1 + spread).
//     O repasse de tributo no caso internacional é "conforme o caso" e precisa de contador.
// Ajuste A5: alíquotas vêm de src/data/aliquotas.ts, não hardcoded aqui.

const REF = "cr-03";

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}
function sliderFill(value: number, min: number, max: number) {
  return { "--fill": `${((value - min) / (max - min)) * 100}%` } as React.CSSProperties;
}

type Pagamento = "real" | "dolar";

export default function CustoRealMidia() {
  const [verba, setVerba] = useState(10000);
  const [pagamento, setPagamento] = useState<Pagamento>("real");
  const [iof, setIof] = useState(IOF_INTERNACIONAL.valor);
  const [spread, setSpread] = useState(SPREAD_CARTAO_PADRAO);

  const ehDolar = pagamento === "dolar";

  // --- Cálculo por regime (não soma os dois) ---
  const tributoMeta = ehDolar ? 0 : verba * (REPASSE_META / 100);
  const iofValor = ehDolar ? verba * (iof / 100) : 0;
  const spreadValor = ehDolar ? (verba + iofValor) * (spread / 100) : 0; // A2: spread sobre verba + IOF
  const custoReal = verba + tributoMeta + iofValor + spreadValor;

  const diferenca = custoReal - verba;
  const diferencaPct = (diferenca / verba) * 100;
  const diferencaAno = diferenca * 12;

  // --- Medição (D2) ---
  useEffect(() => { trackEvent("tool_started", { tool: REF }); }, []);
  const completou = useRef(false);
  function marcarInteracao() {
    if (completou.current) return;
    completou.current = true;
    trackEvent("tool_completed", { tool: REF });
  }

  const waHref = useMemo(() => {
    const lines = [
      "Olá! Usei a calculadora de custo real da mídia da Fórmula Mídia:",
      `• Verba no Gerenciador: ${formatBRL(verba)}/mês`,
      `• Pagamento: ${ehDolar ? "cartão internacional (dólar)" : "fatura em real"}`,
      `• Custo real que sai da conta: ${formatBRL(custoReal)}/mês`,
      `• Diferença: ${formatBRL(diferenca)}/mês (${diferencaPct.toFixed(1)}%) — ${formatBRL(diferencaAno)}/ano`,
      "",
      "Quero reestruturar minha conta e parar de pagar cego.",
      `— ref: ${REF}`,
    ];
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verba, ehDolar, custoReal, diferenca, diferencaPct, diferencaAno]);

  return (
    <div className="mt-11 grid items-start gap-7 md:grid-cols-[1.3fr_1fr]">
      {/* ENTRADAS */}
      <div className="rounded-card border border-border bg-glass p-8">
        <Field label="Verba mensal no Gerenciador" value={formatBRL(verba)}>
          <input type="range" className="range-slider" min={1000} max={100000} step={1000} value={verba}
            style={sliderFill(verba, 1000, 100000)}
            onChange={(e) => { setVerba(Number(e.target.value)); marcarInteracao(); }} />
        </Field>

        <div className="mb-8.5">
          <div className="mb-3 font-heading text-[15px] font-semibold">Como a Meta te cobra?</div>
          <div className="grid grid-cols-2 gap-2.5">
            <Toggle active={pagamento === "real"} onClick={() => { setPagamento("real"); marcarInteracao(); }}>
              Fatura em real<span className="mt-0.5 block text-[11.5px] font-normal text-dim">Meta Brasil / boleto</span>
            </Toggle>
            <Toggle active={pagamento === "dolar"} onClick={() => { setPagamento("dolar"); marcarInteracao(); }}>
              Cartão internacional<span className="mt-0.5 block text-[11.5px] font-normal text-dim">cobrança em dólar</span>
            </Toggle>
          </div>
        </div>

        {ehDolar ? (
          <>
            <Field label="IOF sobre a compra internacional" value={`${iof}%`} hint={`Padrão ${VIGENCIA_LABEL}: ${IOF_INTERNACIONAL.valor}% — confirme na sua fatura`}>
              <input type="range" className="range-slider" min={0} max={6} step={0.1} value={iof}
                style={sliderFill(iof, 0, 6)} onChange={(e) => { setIof(Number(e.target.value)); marcarInteracao(); }} />
            </Field>
            <Field label="Spread do cartão na conversão" value={`${spread}%`} hint="Varia por banco/cartão — geralmente 2% a 6%" last>
              <input type="range" className="range-slider" min={0} max={8} step={0.5} value={spread}
                style={sliderFill(spread, 0, 8)} onChange={(e) => { setSpread(Number(e.target.value)); marcarInteracao(); }} />
            </Field>
          </>
        ) : (
          <p className="mt-1 text-[12.5px] leading-relaxed text-dim">
            Na fatura em real, a Meta repassa <strong className="text-ink">PIS/Cofins + ISS ({REPASSE_META}%)</strong>.
            Não há IOF nem spread de câmbio nesse caso.
          </p>
        )}
      </div>

      {/* RESULTADO */}
      <div className="rounded-card border border-red/28 bg-gradient-to-b from-red/8 to-glass p-8 md:sticky md:top-24">
        <h3 className="mb-5 font-heading text-xs font-semibold uppercase tracking-[.12em] text-red-hi">O que sai da sua conta</h3>

        <div className="mb-6 flex flex-col gap-3.5">
          <SummaryRow label="Verba (o que o painel mostra)" value={formatBRL(verba)} />
          {!ehDolar && <SummaryRow label={`+ Tributos Meta (${REPASSE_META}%)`} value={`+ ${formatBRL(tributoMeta)}`} />}
          {ehDolar && <SummaryRow label={`+ IOF (${iof}% sobre a verba)`} value={`+ ${formatBRL(iofValor)}`} />}
          {ehDolar && <SummaryRow label={`+ Spread (${spread}% sobre verba + IOF)`} value={`+ ${formatBRL(spreadValor)}`} />}
        </div>

        <div className="mb-6 rounded-2xl border border-border-hi bg-glass-hi p-5 text-center">
          <div className="mb-1.5 text-[11px] uppercase tracking-[.08em] text-dim">Custo real por mês</div>
          <div className="font-heading text-[30px] font-bold leading-none text-red-hi">{formatBRL(custoReal)}</div>
          <div className="mt-3 text-xs leading-relaxed text-dim">
            São <strong className="text-ink">{formatBRL(diferenca)}</strong> a mais por mês (
            <strong className="text-ink">{diferencaPct.toFixed(1)}%</strong>) que o Gerenciador não mostra —{" "}
            <strong className="text-ink">{formatBRL(diferencaAno)}</strong> por ano.
          </div>
        </div>

        {ehDolar && (
          <p className="mb-5 text-[11.5px] leading-relaxed text-warn">
            No caso internacional, confirme com seu contador se ainda há repasse de tributo a somar —
            pode ou não incidir conforme a cobrança.
          </p>
        )}

        <a href={waHref} target="_blank" rel="noopener" onClick={() => trackEvent("cta_whatsapp", { tool: REF })}
          className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-red to-red-lo px-4 py-4 font-heading text-[14.5px] font-semibold text-white no-underline shadow-[0_10px_30px_rgba(228,41,41,0.30)] transition-transform hover:-translate-y-0.5">
          Reestruturar minha conta →
        </a>
        <p className="mt-3.5 text-center text-[11.5px] leading-relaxed text-dim">
          Alíquotas vigentes em {VIGENCIA_LABEL}. Estimativa para orientação — confirme com seu contador.
          O ISS varia de 2% a 5% por município.
        </p>
      </div>
    </div>
  );
}

function Toggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={"rounded-2xl border px-4 py-3.5 text-center font-heading text-[14px] font-semibold transition-colors " +
        (active ? "border-red bg-red/12 text-ink" : "border-border bg-glass text-mid hover:border-border-hi")}>
      {children}
    </button>
  );
}

function Field({ label, value, hint, last = false, children }: { label: string; value: string; hint?: string; last?: boolean; children: React.ReactNode }) {
  return (
    <div className={last ? "" : "mb-8.5"}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 font-heading text-[15px] font-semibold">
        <span>{label}</span><span className="font-heading font-bold text-red-hi">{value}</span>
      </div>
      {hint ? <div className="mb-4 text-[12.5px] text-dim">{hint}</div> : <div className="mb-4" />}
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2.5 text-[13.5px]">
      <span className="text-mid">{label}</span><span className="font-heading font-bold">{value}</span>
    </div>
  );
}
