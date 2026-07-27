// RUN-006 — agregação anônima do /placar (Cloudflare Worker + Workers Analytics Engine).
// Por que existe: RUN-006-placar-agregacao.md (formula-foundation) — o site não tem
// nenhum backend com estado. Analytics Engine resolve "contar agregado sem banco de
// dado e sem corrida de contagem" (cada chamada é um append via writeDataPoint(),
// nunca um leitura-modificação-escrita).
//
// Guardrails (mesmo espírito do RUN-001/RUN-002/RUN-CONCIERGE):
//  1. Só aceita chamada do site da Fórmula (Origin allowlist).
//  2. Payload rígido — só {ferramenta_id, metrica, faixa_de_valor}. Nunca domínio,
//     nome, e-mail, IP guardado, texto livre. Isso é o que torna o dado anônimo de
//     verdade (não é "anonimizado" por promessa, é anonimizado por não ter campo
//     pra guardar identificador nenhum).
//  3. Whitelist fixa de ferramenta_id/metrica — não aceita string arbitrária (evita
//     virar analytics genérico disfarçado de /placar).
//  4. Rate limit por IP (binding opcional).

const ALLOWED_ORIGINS = [
  "https://formulamidia.com.br",
  "https://www.formulamidia.com.br",
];

// Só estas combinações são aceitas — trava o que pode ser gravado, na prática
// (não é o cliente que decide o que é uma "métrica válida").
const METRICAS_VALIDAS = {
  "cac-ltv-payback": ["razao_ltv_cac"],
  "mer-vs-roas": ["gap_mer_roas_pontos"],
  "custo-do-lead-perdido": ["faixa_tempo_resposta_minutos"],
  "verificador-acesso-ia": ["bloqueia_bot_ia"],
};

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== "POST") {
      return json({ ok: false, error: "method_not_allowed" }, 405, origin);
    }
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return json({ ok: false, error: "origin_not_allowed" }, 403, origin);
    }
    if (!env.PLACAR_STATS) {
      return json({ ok: false, error: "not_configured" }, 503, origin);
    }
    if (env.RATE_LIMITER) {
      const ip = request.headers.get("CF-Connecting-IP") || "anon";
      const { success } = await env.RATE_LIMITER.limit({ key: ip });
      if (!success) return json({ ok: false, error: "rate_limited" }, 429, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: "invalid_json" }, 400, origin);
    }

    const { ferramenta_id, metrica, faixa_de_valor } = body || {};

    // Guardrail 3 — whitelist fixa, nunca string arbitrária do cliente.
    const metricasDaFerramenta = METRICAS_VALIDAS[ferramenta_id];
    if (!metricasDaFerramenta || !metricasDaFerramenta.includes(metrica)) {
      return json({ ok: false, error: "metrica_invalida" }, 400, origin);
    }
    if (typeof faixa_de_valor !== "string" || faixa_de_valor.length === 0 || faixa_de_valor.length > 40) {
      return json({ ok: false, error: "faixa_invalida" }, 400, origin);
    }

    // Guardrail 2 — o dado point NUNCA carrega nada que identifique quem enviou:
    // sem IP, sem domínio, sem cookie, sem sessão. blobs = dimensões categóricas
    // (o que estamos contando), indexes = chave de agrupamento pra consulta rápida.
    try {
      env.PLACAR_STATS.writeDataPoint({
        blobs: [ferramenta_id, metrica, faixa_de_valor],
        indexes: [ferramenta_id],
      });
    } catch {
      return json({ ok: false, error: "write_failed" }, 502, origin);
    }

    return json({ ok: true }, 200, origin);
  },
};
