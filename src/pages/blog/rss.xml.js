import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_URL, BRAND_NAME } from "../../data/schema";

export async function GET(context) {
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.datePublished.valueOf() - a.data.datePublished.valueOf()
  );

  return rss({
    title: `${BRAND_NAME} — Blog`,
    description: "Guias completos sobre CAC, LTV, conversão, GEO e performance técnica — conectados às ferramentas gratuitas da Fórmula Mídia.",
    site: context.site ?? SITE_URL,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.datePublished,
      link: `/blog/${post.id}/`,
    })),
    customData: `<language>pt-BR</language>`,
  });
}
