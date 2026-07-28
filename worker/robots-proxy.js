// RUN-001 — proxy de leitura de robots.txt (Cloudflare Worker).
// Por que existe: o navegador não pode buscar o robots.txt de um site de
// terceiro (CORS bloqueia). Este Worker faz a busca do lado do servidor e
// devolve JSON. É a base da Ferramenta 02 (Verificador de Acesso de IA).
//
// Guardrails (senão vira proxy aberto e é abusado):
//  1. Só responde a chamadas do site da Fórmula (Origin allowlist).
//  2. Só busca /robots.txt — NUNCA uma URL arbitrária (não é proxy geral).
//  3. Timeout + limite de tamanho (domínio que não responde / arquivo gigante).
//  4. Rate limit por IP (binding opcional — ver wrangler.toml; funciona sem).

const ALLOWED_ORIGINS = [
  "https://formulamidia.com.br",
  "https://www.formulamidia.com.br",
];
const FETCH_TIMEOUT_MS = 8000;
const MAX_BYTES = 512 * 1024; // robots.txt é minúsculo; isto é folga de sobra.

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, max-age=3600",
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

function normalizeDomain(input) {
  if (!input) return null;
  const v = input.trim().toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "");
  return /^[a-z0-9.-]+\.[a-z]{2,}$/.test(v) ? v : null;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== "GET") {
      return json({ ok: false, error: "method_not_allowed" }, 405, origin);
    }

    // Guardrail 1 — só o site da Fórmula (o navegador envia Origin).
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return json({ ok: false, error: "origin_not_allowed" }, 403, origin);
    }

    // Guardrail 4 — rate limit por IP, se o binding estiver configurado.
    if (env.RATE_LIMITER) {
      const ip = request.headers.get("CF-Connecting-IP") || "anon";
      const { success } = await env.RATE_LIMITER.limit({ key: ip });
      if (!success) return json({ ok: false, error: "rate_limited" }, 429, origin);
    }

    const domain = normalizeDomain(new URL(request.url).searchParams.get("domain"));
    if (!domain) {
      return json({ ok: false, error: "invalid_domain" }, 400, origin);
    }

    // Guardrail 2 — caminho FIXO: só robots.txt. Nunca uma URL arbitrária.
    const target = `https://${domain}/robots.txt`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const resp = await fetch(target, {
        signal: controller.signal,
        redirect: "follow",
        headers: { "User-Agent": "FormulaMidia-RobotsCheck/1.0 (+https://formulamidia.com.br)" },
      });
      // Guardrail 3 — limite de tamanho na resposta que devolvemos.
      const robotsTxt = (await resp.text()).slice(0, MAX_BYTES);

      return json({
        ok: true,
        domain,
        url: target,
        status: resp.status,
        found: resp.status === 200,
        robotsTxt,
        fetchedAt: new Date().toISOString(),
      }, 200, origin);
    } catch (err) {
      const reason = err && err.name === "AbortError" ? "timeout" : "fetch_failed";
      // Falha de fetch volta como 200 + ok:false pra ferramenta tratar com elegância.
      return json({ ok: false, domain, error: reason }, 200, origin);
    } finally {
      clearTimeout(timer);
    }
  },
};
