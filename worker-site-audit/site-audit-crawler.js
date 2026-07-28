// TOOL-015 — crawler de auditoria técnica de SEO (Cloudflare Worker).
// Base da Ferramenta 05 (Auditoria Técnica de SEO). Diferente do RUN-001
// (que só lê 1 arquivo, robots.txt), este Worker visita várias páginas do
// site de um terceiro — por isso os limites abaixo são regra de negócio
// aprovada por Fabiano (27/07), não só guardrail técnico:
//   - Até 20 páginas por auditoria.
//   - Até 2 níveis de profundidade (a home + os links que saem dela —
//     NUNCA segue link encontrado numa página de nível 1, isso seria
//     nível 3, fora do aprovado).
// Motivo do limite: cada página visitada consome cota de subrequests do
// plano gratuito da Cloudflare, compartilhada com as outras 19 ferramentas
// que já usam a mesma conta — não é sobre custo em dinheiro (o plano
// gratuito não cobra excedente, só recusa), é sobre não travar as outras
// ferramentas no mesmo dia por causa de 1 auditoria mal-comportada.
//
// Guardrails (mesmo espírito do robots-proxy.js):
//  1. Só responde a chamadas do site da Fórmula (Origin allowlist).
//  2. NUNCA segue link externo (outro domínio) — só rastreia páginas do
//     próprio domínio auditado. Isso não é um crawler geral.
//  3. Timeout por página + limite de tamanho por resposta.
//  4. Teto rígido de 20 páginas / 2 níveis, não configurável pelo cliente
//     (qualquer parâmetro de override enviado pelo cliente é ignorado).
//  5. Orçamento de tempo total da auditoria (evita travar em site lento).
//  6. Rate limit por IP (binding opcional — ver wrangler.toml; funciona sem).

const ALLOWED_ORIGINS = [
  "https://formulamidia.com.br",
  "https://www.formulamidia.com.br",
];
const FETCH_TIMEOUT_MS = 8000;
const CRAWL_BUDGET_MS = 22000; // orçamento total da auditoria inteira
const MAX_BYTES_POR_PAGINA = 1.5 * 1024 * 1024;
const MAX_PAGINAS = 20; // regra de negócio aprovada — não é ajustável por parâmetro
const MAX_NIVEL = 1; // 0 = home, 1 = links diretos da home ("2 níveis")

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, max-age=1800",
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
  const v = input.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/:\d+$/, "");
  return /^[a-z0-9.-]+\.[a-z]{2,}$/.test(v) ? v : null;
}

async function fetchComTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "FormulaMidia-AuditoriaSEO/1.0 (+https://formulamidia.com.br)" },
    });
  } finally {
    clearTimeout(timer);
  }
}

// Lê o corpo da resposta como texto, respeitando o limite de tamanho —
// evita que uma página gigante estoure memória/tempo do Worker.
async function textComLimite(resp, maxBytes) {
  const reader = resp.body?.getReader();
  if (!reader) return await resp.text();
  const decoder = new TextDecoder();
  let total = 0;
  let out = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      out += decoder.decode(value.subarray(0, Math.max(0, maxBytes - (total - value.byteLength))));
      await reader.cancel();
      break;
    }
    out += decoder.decode(value, { stream: true });
  }
  return out;
}

function extrairDados(html, baseUrl) {
  const dados = {
    links: [],
    h1: 0,
    h2: 0,
    canonical: null,
    jsonLdCount: 0,
    imagensTotal: 0,
    imagensSemAlt: 0,
    metaDescription: false,
  };

  for (const m of html.matchAll(/<a\s[^>]*href\s*=\s*["']([^"'#][^"']*)["']/gi)) {
    dados.links.push(m[1]);
  }
  dados.h1 = (html.match(/<h1[\s>]/gi) || []).length;
  dados.h2 = (html.match(/<h2[\s>]/gi) || []).length;
  const canonicalMatch = html.match(/<link[^>]+rel\s*=\s*["']canonical["'][^>]*>/i);
  if (canonicalMatch) {
    const hrefMatch = canonicalMatch[0].match(/href\s*=\s*["']([^"']+)["']/i);
    dados.canonical = hrefMatch ? hrefMatch[1] : null;
  }
  dados.jsonLdCount = (html.match(/<script[^>]+type\s*=\s*["']application\/ld\+json["']/gi) || []).length;
  const imgTags = html.match(/<img\s[^>]*>/gi) || [];
  dados.imagensTotal = imgTags.length;
  dados.imagensSemAlt = imgTags.filter((tag) => !/\salt\s*=\s*["'][^"']*["']/i.test(tag)).length;
  dados.metaDescription = /<meta[^>]+name\s*=\s*["']description["'][^>]*>/i.test(html);

  return dados;
}

function resolverLink(href, baseUrl) {
  try {
    return new URL(href, baseUrl).toString().split("#")[0];
  } catch {
    return null;
  }
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
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return json({ ok: false, error: "origin_not_allowed" }, 403, origin);
    }
    if (env.RATE_LIMITER) {
      const ip = request.headers.get("CF-Connecting-IP") || "anon";
      const { success } = await env.RATE_LIMITER.limit({ key: ip });
      if (!success) return json({ ok: false, error: "rate_limited" }, 429, origin);
    }

    const domain = normalizeDomain(new URL(request.url).searchParams.get("domain"));
    if (!domain) return json({ ok: false, error: "invalid_domain" }, 400, origin);

    const origemAlvo = `https://${domain}`;
    const inicio = Date.now();
    const orcamentoEsgotado = () => Date.now() - inicio > CRAWL_BUDGET_MS;

    const visitadas = new Map(); // url -> { status, dados | erro }
    const fila = [{ url: `${origemAlvo}/`, nivel: 0 }];
    const vistos = new Set([`${origemAlvo}/`]);
    let naoVerificadas = 0;

    while (fila.length > 0 && visitadas.size < MAX_PAGINAS && !orcamentoEsgotado()) {
      const { url, nivel } = fila.shift();
      try {
        const resp = await fetchComTimeout(url, FETCH_TIMEOUT_MS);
        if (!resp.ok) {
          visitadas.set(url, { status: resp.status, nivel });
          continue;
        }
        const html = await textComLimite(resp, MAX_BYTES_POR_PAGINA);
        const dados = extrairDados(html, url);
        visitadas.set(url, { status: resp.status, nivel, dados });

        if (nivel < MAX_NIVEL) {
          for (const href of dados.links) {
            const abs = resolverLink(href, url);
            if (!abs) continue;
            let alvoOrigin;
            try { alvoOrigin = new URL(abs).origin; } catch { continue; }
            if (alvoOrigin !== new URL(origemAlvo).origin) continue; // guardrail 2 — nunca externo
            if (vistos.has(abs)) continue;
            if (visitadas.size + fila.length >= MAX_PAGINAS) { naoVerificadas++; continue; }
            vistos.add(abs);
            fila.push({ url: abs, nivel: nivel + 1 });
          }
        }
      } catch (err) {
        const motivo = err && err.name === "AbortError" ? "timeout" : "fetch_failed";
        visitadas.set(url, { status: null, nivel, erro: motivo });
      }
    }
    naoVerificadas += fila.length; // o que sobrou na fila quando o teto/orçamento bateu

    // robots.txt e sitemap.xml — mesma leitura pública do RUN-001, sem custo extra de guardrail.
    let robots = { encontrado: false, bloqueiaTudo: false };
    let sitemap = { encontrado: false, url: null };
    try {
      const rResp = await fetchComTimeout(`${origemAlvo}/robots.txt`, FETCH_TIMEOUT_MS);
      if (rResp.ok) {
        const texto = await textComLimite(rResp, 256 * 1024);
        robots.encontrado = true;
        const grupoGeral = texto.match(/user-agent:\s*\*[\s\S]*?(?=user-agent:|$)/i);
        robots.bloqueiaTudo = !!grupoGeral && /disallow:\s*\/\s*$/im.test(grupoGeral[0]);
        const sitemapLinha = texto.match(/sitemap:\s*(\S+)/i);
        if (sitemapLinha) sitemap = { encontrado: true, url: sitemapLinha[1] };
      }
    } catch { /* ausência de robots.txt não é erro — só significa tudo permitido */ }

    if (!sitemap.encontrado) {
      try {
        const sResp = await fetchComTimeout(`${origemAlvo}/sitemap.xml`, FETCH_TIMEOUT_MS);
        if (sResp.ok) sitemap = { encontrado: true, url: `${origemAlvo}/sitemap.xml` };
      } catch { /* segue sem sitemap */ }
    }

    // Consolida em leitura priorizada por severidade (TOOL-015: "não sete notas soltas").
    const critico = [];
    const importante = [];
    const secundario = [];
    const paginas = [];

    if (robots.bloqueiaTudo) {
      critico.push({ mensagem: "robots.txt bloqueia o site inteiro para todos os robôs (Disallow: / em User-agent: *).", urls: [`${origemAlvo}/robots.txt`] });
    }
    if (!sitemap.encontrado) {
      importante.push({ mensagem: "Nenhum sitemap.xml encontrado (nem referenciado no robots.txt, nem em /sitemap.xml).", urls: [] });
    }

    const linksQuebrados = [];
    for (const [url, info] of visitadas) {
      paginas.push({
        url,
        status: info.status,
        erro: info.erro ?? null,
        h1: info.dados?.h1 ?? null,
        canonical: info.dados?.canonical ?? null,
        jsonLdCount: info.dados?.jsonLdCount ?? null,
        imagensSemAlt: info.dados?.imagensSemAlt ?? null,
        imagensTotal: info.dados?.imagensTotal ?? null,
        metaDescription: info.dados?.metaDescription ?? null,
      });
      if (info.erro || (info.status && info.status >= 400)) {
        linksQuebrados.push({ url, status: info.status, erro: info.erro });
      }
      if (info.dados) {
        if (info.dados.h1 === 0) importante.push({ mensagem: `Página sem H1.`, urls: [url] });
        if (info.dados.h1 > 1) secundario.push({ mensagem: `Página com múltiplos H1 (${info.dados.h1}).`, urls: [url] });
        if (!info.dados.canonical) secundario.push({ mensagem: "Página sem tag canonical.", urls: [url] });
        if (info.dados.jsonLdCount === 0) secundario.push({ mensagem: "Página sem dados estruturados (JSON-LD).", urls: [url] });
        if (!info.dados.metaDescription) secundario.push({ mensagem: "Página sem meta description.", urls: [url] });
        if (info.dados.imagensTotal > 0 && info.dados.imagensSemAlt > 0) {
          const pct = Math.round((info.dados.imagensSemAlt / info.dados.imagensTotal) * 100);
          (pct >= 50 ? importante : secundario).push({
            mensagem: `${info.dados.imagensSemAlt} de ${info.dados.imagensTotal} imagens sem atributo alt (${pct}%).`,
            urls: [url],
          });
        }
      }
    }
    if (linksQuebrados.length > 0) {
      critico.push({
        mensagem: `${linksQuebrados.length} página(s) interna(s) inacessível(is) durante a auditoria.`,
        urls: linksQuebrados.map((l) => l.url),
      });
    }

    return json({
      ok: true,
      domain,
      paginasAuditadas: visitadas.size,
      paginasNaoVerificadas: naoVerificadas,
      limite: { maxPaginas: MAX_PAGINAS, maxNivel: MAX_NIVEL },
      robots,
      sitemap,
      resumo: { critico, importante, secundario },
      paginas,
      fetchedAt: new Date().toISOString(),
    }, 200, origin);
  },
};
