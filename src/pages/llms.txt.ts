import { getCollection } from "astro:content";
import { SITE_URL, BRAND_NAME } from "../data/schema";
import { FERRAMENTAS } from "../data/ferramentas";

// Convenção emergente llms.txt (https://llmstxt.org) — resumo do site em
// markdown puro pra agentes de IA lerem sem precisar renderizar HTML/JS.
// Gerado a partir das mesmas fontes (FERRAMENTAS, Content Collection "blog")
// usadas no site, pra nunca ficar dessincronizado.
export async function GET() {
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.datePublished.valueOf() - a.data.datePublished.valueOf()
  );

  const ferramentasPorTag = new Map<string, typeof FERRAMENTAS>();
  for (const f of FERRAMENTAS) {
    const lista = ferramentasPorTag.get(f.tag) ?? [];
    lista.push(f);
    ferramentasPorTag.set(f.tag, lista);
  }

  const linhas: string[] = [];

  linhas.push(`# ${BRAND_NAME}`);
  linhas.push("");
  linhas.push(
    "> Agência de performance brasileira especializada em tráfego pago (Google Ads, Meta Ads), SEO técnico e GEO (otimização para buscadores de IA como ChatGPT, Perplexity e Gemini). Oferece mais de 20 ferramentas gratuitas de cálculo e diagnóstico, um blog técnico e um glossário — sem necessidade de cadastro."
  );
  linhas.push("");
  linhas.push(
    "Atendimento em todo o Brasil, foco em growth mensurável: CAC, LTV, ROAS/MER, conversão e capacidade comercial."
  );
  linhas.push("");

  linhas.push("## Ferramentas gratuitas");
  linhas.push("");
  for (const [tag, lista] of ferramentasPorTag) {
    linhas.push(`### ${tag}`);
    for (const f of lista) {
      linhas.push(`- [${f.nome}](${SITE_URL}/ferramentas/${f.slug}): ${f.desc}`);
    }
    linhas.push("");
  }

  linhas.push("## Blog");
  linhas.push("");
  for (const post of posts) {
    linhas.push(`- [${post.data.title}](${SITE_URL}/blog/${post.id}/): ${post.data.description}`);
  }
  linhas.push("");

  linhas.push("## Páginas principais");
  linhas.push("");
  linhas.push(`- [Glossário](${SITE_URL}/glossario): termos de growth, tráfego pago, SEO e GEO explicados em português claro.`);
  linhas.push(`- [Nossa Metodologia](${SITE_URL}/metodologia): como a Fórmula Mídia estrutura diagnóstico, execução e otimização.`);
  linhas.push(`- [Soluções](${SITE_URL}/solucoes): visão geral dos serviços de tráfego pago, SEO/GEO e sites de alta performance.`);
  linhas.push(`- [Serviços](${SITE_URL}/servicos): Google Ads, Meta Ads, consultoria de tráfego e gestão de anúncios.`);

  linhas.push("");
  linhas.push("## Feeds");
  linhas.push("");
  linhas.push(`- [RSS do blog](${SITE_URL}/blog/rss.xml)`);
  linhas.push(`- [Sitemap](${SITE_URL}/sitemap-index.xml)`);

  return new Response(linhas.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
