import { useState } from "react";

// RUN-006 (formula-foundation) — checkbox de opt-in desligado por padrão, usado
// nas ferramentas que já têm métrica e whitelist correspondente no Worker
// (worker-placar/stat.js). Nunca envia nada sozinho — só quando marcado.

const PLACAR_URL = import.meta.env.PUBLIC_PLACAR_STATS_URL as string | undefined;

interface Props {
  ferramentaId: string;
  metrica: string;
  /** null = ainda não há resultado válido pra contribuir (ex.: campo vazio). */
  faixaDeValor: string | null;
}

export default function OptInPlacar({ ferramentaId, metrica, faixaDeValor }: Props) {
  const [contribuido, setContribuido] = useState(false);
  const [enviando, setEnviando] = useState(false);

  if (!PLACAR_URL || !faixaDeValor) return null;

  async function alternar(marcado: boolean) {
    if (!marcado || contribuido || enviando || !faixaDeValor) return;
    setEnviando(true);
    try {
      await fetch(PLACAR_URL as string, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ferramenta_id: ferramentaId, metrica, faixa_de_valor: faixaDeValor }),
      });
      setContribuido(true);
    } catch {
      // Contribuir é opcional — uma falha aqui nunca deve incomodar quem só quer o resultado.
    } finally {
      setEnviando(false);
    }
  }

  return (
    <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-xl border border-border bg-glass px-4 py-3 text-[12.5px] leading-relaxed text-mid">
      <input
        type="checkbox"
        checked={contribuido}
        disabled={enviando || contribuido}
        onChange={(e) => alternar(e.target.checked)}
        className="mt-0.5"
      />
      <span>
        {contribuido ? (
          <>Obrigado! Seu número entrou anonimamente na estatística pública do <a href="/placar" className="text-ink underline underline-offset-2">Placar</a>.</>
        ) : (
          <>Contribuir anonimamente para o <a href="/placar" className="text-ink underline underline-offset-2" onClick={(e) => e.stopPropagation()}>Placar</a> público (sem nome, sem domínio, sem e-mail).</>
        )}
      </span>
    </label>
  );
}
