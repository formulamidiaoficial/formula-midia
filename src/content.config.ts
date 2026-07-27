import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Content-as-Code (ADR-0018, formula-foundation): cada artigo é um .md
// versionado. O planejamento (briefing, outline, fontes) mora no
// formula-foundation; o que está aqui é só o texto final publicável.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pilar: z.string(), // ex.: "P1" — referência ao pilar em CONTENT-META-011
    ferramentasRelacionadas: z.array(z.string()), // slugs de src/data/ferramentas.ts
    artigosRelacionados: z.array(z.string()).default([]), // slugs de outros posts do blog
    faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
    datePublished: z.coerce.date(),
    dateModified: z.coerce.date().optional(),
  }),
});

export const collections = { blog };
