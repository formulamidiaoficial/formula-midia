// Alíquotas e parâmetros tributários usados nas ferramentas (ajuste A5).
// ⚠️ NÃO é orientação fiscal. As alíquotas e, principalmente, as regras de crédito precisam de
// validação com contador antes de a ferramenta ir ao ar (ajustes A1–A4). Ao mudar a legislação,
// atualize o `valor` e o `revisadoEm` — é uma linha, e o histórico fica versionado no repositório.

export interface Aliquota {
  valor: number; // em %
  vigenciaInicio: string; // ISO
  fonte: string;
  revisadoEm: string; // ISO
}

export const PIS_COFINS: Aliquota = {
  valor: 9.25,
  vigenciaInicio: "2026-01-01",
  fonte: "Repasse da Meta ao anunciante brasileiro",
  revisadoEm: "2026-07-26",
};

export const ISS_MEDIO: Aliquota = {
  valor: 2.9,
  vigenciaInicio: "2026-01-01",
  fonte: "Média usada pela Meta; o ISS varia de 2% a 5% por município",
  revisadoEm: "2026-07-26",
};

export const IOF_INTERNACIONAL: Aliquota = {
  valor: 3.5,
  vigenciaInicio: "2026-01-01",
  fonte: "IOF sobre compra internacional no cartão",
  revisadoEm: "2026-07-26",
};

// Estimativa; varia por banco/cartão (2% a 6%). Editável pelo usuário na ferramenta.
export const SPREAD_CARTAO_PADRAO = 4;

// Repasse total da Meta na fatura EM REAL (PIS/Cofins + ISS). ~12,15%.
export const REPASSE_META = Number((PIS_COFINS.valor + ISS_MEDIO.valor).toFixed(2));

// Rótulo de vigência exibido na ferramenta (ajuste A4).
export const VIGENCIA_LABEL = "julho de 2026";
