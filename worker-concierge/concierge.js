// RUN-CONCIERGE — concierge de IA embutido no site (Cloudflare Worker).
// Por que existe: CONTENT-META-012 (formula-foundation) — em vez de RAG ou modelo
// self-hospedado (pesquisa 27/07: Ollama seria a opção MAIS cara nessa escala), o
// contexto do site vem do /llms.txt que o próprio site já publica. O Worker só
// monta o prompt de sistema com esse conteúdo e repassa pra API da Anthropic.
//
// Guardrails (mesmo espírito do RUN-001/RUN-002):
//  1. Só responde a chamadas do site da Fórmula (Origin allowlist).
//  2. Mensagem e histórico com limite de tamanho (custo de token sob controle).
//  3. max_tokens baixo na resposta — isto é um concierge, não um chat aberto.
//  4. Rate limit por IP (binding opcional).
//  5. /llms.txt cacheado (Cache API, 1h) — não busca a cada mensagem.

const ALLOWED_ORIGINS = [
  "https://formulamidia.com.br",
  "https://www.formulamidia.com.br",
];
const SITE_ORIGIN = "https://formulamidia.com.br";
const LLMS_TXT_URL = `${SITE_ORIGIN}/llms.txt`;
const LLMS_TXT_CACHE_TTL = 3600; // 1h — o /llms.txt muda só quando o site é buildado de novo.
const MAX_MESSAGE_CHARS = 600;
const MAX_HISTORY_TURNS = 6; // últimas 6 trocas (12 mensagens) — o resto é esquecido, de propósito.
const MAX_TOKENS_RESPOSTA = 400;
const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";
const FETCH_TIMEOUT_MS = 15000;

const SYSTEM_PROMPT_BASE = `Você é o concierge do site da Fórmula Mídia (formulamidia.com.br), uma agência
brasileira de tráfego pago, SEO e GEO. Sua função é ajudar quem está navegando o site a entender
os serviços, achar a ferramenta gratuita certa, ou entender um conceito do glossário/blog —
usando SÓ o conteúdo do site abaixo.

Regras rígidas:
- Responda sempre em português do Brasil, direto, sem enrolação, no máximo 4-5 frases.
- Use SÓ os fatos do resumo do site abaixo. Nunca invente número, preço, prazo ou resultado que
  não esteja lá — se não souber, diga que não tem essa informação e sugira falar com a equipe.
- Se a pergunta pedir um cálculo, aponte pra ferramenta gratuita certa (com o link /ferramentas/...).
- Se a pergunta pedir orçamento, prazo, ou qualquer coisa que exija atendimento humano, direcione
  pro WhatsApp (não tente fechar negócio nem prometer prazo/preço você mesmo).
- Nunca se passe por humano, nunca invente nome de atendente.

Resumo do site (fonte única de fatos):
---
`;

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

async function getLlmsTxt() {
  const cache = caches.default;
  const cacheKey = new Request(LLMS_TXT_URL);
  const cached = await cache.match(cacheKey);
  if (cached) return cached.text();

  const resp = await fetch(LLMS_TXT_URL, {
    headers: { "User-Agent": "FormulaMidia-Concierge/1.0 (+https://formulamidia.com.br)" },
  });
  const text = await resp.text();
  const toCache = new Response(text, {
    headers: { "Cache-Control": `public, max-age=${LLMS_TXT_CACHE_TTL}` },
  });
  await cache.put(cacheKey, toCache);
  return text;
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_HISTORY_TURNS * 2)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));
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
    if (!env.ANTHROPIC_API_KEY) {
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

    const message = typeof body.message === "string" ? body.message.trim().slice(0, MAX_MESSAGE_CHARS) : "";
    if (!message) {
      return json({ ok: false, error: "empty_message" }, 400, origin);
    }
    const history = sanitizeHistory(body.history);

    let llmsTxt;
    try {
      llmsTxt = await getLlmsTxt();
    } catch {
      return json({ ok: false, error: "context_unavailable" }, 502, origin);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: MAX_TOKENS_RESPOSTA,
          system: SYSTEM_PROMPT_BASE + llmsTxt,
          messages: [...history, { role: "user", content: message }],
        }),
      });

      if (!resp.ok) {
        return json({ ok: false, error: "upstream_error", status: resp.status }, 502, origin);
      }
      const data = await resp.json();
      const reply = data?.content?.[0]?.text?.trim();
      if (!reply) {
        return json({ ok: false, error: "empty_reply" }, 502, origin);
      }
      return json({ ok: true, reply }, 200, origin);
    } catch (err) {
      const reason = err && err.name === "AbortError" ? "timeout" : "fetch_failed";
      return json({ ok: false, error: reason }, 502, origin);
    } finally {
      clearTimeout(timer);
    }
  },
};
