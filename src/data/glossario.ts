// Glossário — rota fixada no ADR-0012 (formula-foundation/docs/decisoes/
// 0012-tudo-nasce-no-dominio-principal.md): "/glossario" é subdiretório
// aprovado do domínio principal, distinto do blog (que ainda não tem rota
// decidida — ver CONTENT-META-011 §5/§8).
//
// Cada termo é escrito pra ser citável isoladamente por uma IA generativa
// (definição curta, autocontida, sem depender de contexto anterior) —
// mesma lógica de "definição citável" descrita em CONTENT-META-011 §3.
// Fonte única: editar SÓ aqui ao adicionar/remover termo (mesmo princípio
// de src/data/ferramentas.ts).

export interface TermoGlossario {
  slug: string;
  termo: string;
  categoria: string;
  definicaoCurta: string; // 1-2 frases, autocontida, citável isoladamente
  definicaoCompleta: string;
  ferramentasRelacionadas: string[]; // slugs de src/data/ferramentas.ts
}

export const GLOSSARIO: TermoGlossario[] = [
  {
    slug: "cac",
    termo: "CAC (Custo de Aquisição de Cliente)",
    categoria: "Financeiro",
    definicaoCurta:
      "CAC é o valor investido em aquisição dividido pelo número de clientes novos conquistados no mesmo período. É o quanto, em média, custou conquistar cada cliente.",
    definicaoCompleta:
      "O CAC (Customer Acquisition Cost) mede quanto uma empresa gasta, em média, para conquistar um cliente novo. A fórmula é simples — investimento em aquisição dividido pelo número de clientes novos — mas o erro comum é calcular só com o valor gasto em anúncio, sem incluir comissão de vendedor, ferramenta de CRM ou qualquer outro custo direto do processo de conquista. Um CAC completo inclui todo esse custo, não só a mídia. O CAC sozinho não diz se o investimento vale a pena — precisa ser comparado com o LTV (quanto aquele cliente vale ao longo do tempo).",
    ferramentasRelacionadas: ["cac-ltv-payback", "custo-real-da-midia", "meta-reversa"],
  },
  {
    slug: "ltv",
    termo: "LTV (Lifetime Value / Valor do Tempo de Vida do Cliente)",
    categoria: "Financeiro",
    definicaoCurta:
      "LTV é o lucro total que um cliente gera durante todo o tempo em que continua comprando, não só na primeira venda. Calcula-se multiplicando ticket médio, margem, frequência de compra e tempo de retenção.",
    definicaoCompleta:
      "LTV mede o valor de um cliente ao longo de todo o relacionamento com a empresa, não apenas na primeira compra. A fórmula padrão é ticket médio × margem × frequência de compra por mês × meses de retenção. O erro mais comum é usar o ticket bruto em vez do lucro (ticket já descontada a margem), o que infla o LTV artificialmente. LTV só faz sentido interpretado junto do CAC — a razão entre os dois (LTV:CAC) é o indicador mais usado de saúde do investimento em aquisição, com benchmark de mercado em 3:1 (David Skok, 'SaaS Metrics 2.0').",
    ferramentasRelacionadas: ["cac-ltv-payback"],
  },
  {
    slug: "payback",
    termo: "Payback (de aquisição de cliente)",
    categoria: "Financeiro",
    definicaoCurta:
      "Payback é o número de meses necessário até o lucro mensal gerado por um cliente cobrir o custo de tê-lo conquistado (o CAC).",
    definicaoCompleta:
      "Payback, no contexto de aquisição de clientes, é quantos meses levam até o lucro que um cliente gera cobrir o CAC investido para conquistá-lo — calculado como CAC dividido pelo lucro mensal daquele cliente. É uma métrica de caixa, não só de resultado no papel: um negócio pode ter uma razão LTV:CAC saudável e, mesmo assim, sofrer problema de caixa se o payback for muito longo enquanto o investimento em aquisição continua alto mês a mês.",
    ferramentasRelacionadas: ["cac-ltv-payback"],
  },
  {
    slug: "mer",
    termo: "MER (Marketing Efficiency Ratio)",
    categoria: "Financeiro",
    definicaoCurta:
      "MER é a receita total do caixa dividida pelo investimento total em mídia, somando todos os canais — diferente do ROAS, que cada plataforma calcula isoladamente só com o que consegue atribuir a si mesma.",
    definicaoCompleta:
      "O MER (Marketing Efficiency Ratio) é uma métrica consolidada no mercado de e-commerce/DTC que olha a eficiência de marketing do negócio inteiro: receita total (do caixa ou CRM) dividida pelo investimento total em todos os canais de mídia. Diferente do ROAS reportado por cada plataforma (que só enxerga o que consegue atribuir a si mesma), o MER ignora essa disputa de atribuição entre canais. Um gap grande entre MER e o ROAS médio reportado pelas plataformas é sinal de possível problema de rastreio (tracking).",
    ferramentasRelacionadas: ["mer-vs-roas"],
  },
  {
    slug: "roas",
    termo: "ROAS (Return on Ad Spend)",
    categoria: "Financeiro",
    definicaoCurta:
      "ROAS é o retorno sobre o investimento em anúncio, calculado e reportado por cada plataforma de mídia (Google Ads, Meta Ads) com base no que ela consegue atribuir a si mesma.",
    definicaoCompleta:
      "ROAS (Return on Ad Spend) é a métrica que cada plataforma de anúncio (Google Ads, Meta Ads etc.) reporta no próprio painel, medindo quanto de receita foi gerado para cada real investido — mas só considerando as conversões que a própria plataforma consegue rastrear e atribuir a si. Por isso, o ROAS reportado tende a divergir do MER (que olha o caixa da empresa como um todo): vendas offline, atribuição cruzada entre canais e limitações de rastreio (cookies, bloqueadores) fazem o ROAS de plataforma, isoladamente, contar só parte da história.",
    ferramentasRelacionadas: ["mer-vs-roas", "custo-real-da-midia"],
  },
  {
    slug: "geo",
    termo: "GEO (Generative Engine Optimization)",
    categoria: "SEO / IA",
    definicaoCurta:
      "GEO é a prática de otimizar um site para ser encontrado, lido e citado por motores de busca de IA generativa (ChatGPT, Perplexity, Gemini, AI Overviews), de forma equivalente ao que o SEO faz para buscadores tradicionais.",
    definicaoCompleta:
      "GEO (Generative Engine Optimization, ou Otimização para Buscadores de IA) é o conjunto de práticas para que um site seja encontrado e citado por ferramentas de IA generativa que respondem perguntas com base em busca — ChatGPT Search, Perplexity, Gemini, Google AI Overviews. Parte da base é compartilhada com SEO tradicional (estrutura, autoridade, sinais de confiança), mas GEO tem elementos próprios: distinção entre robôs de treino e robôs de busca no robots.txt, formatos citáveis (definições diretas, tabelas, FAQ estruturado) e medição de tráfego vindo de assistentes de IA, que ferramentas tradicionais de analytics costumam subcontar.",
    ferramentasRelacionadas: ["verificador-acesso-ia", "medir-trafego-de-ia", "sinais-de-confianca", "calculadora"],
  },
  {
    slug: "e-e-a-t",
    termo: "E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)",
    categoria: "SEO / IA",
    definicaoCurta:
      "E-E-A-T é o framework que o Google Search Central confirma usar, tanto para busca tradicional quanto para AI Overviews, para avaliar se um site demonstra experiência, especialidade, autoridade e confiabilidade suficientes para ser recomendado.",
    definicaoCompleta:
      "E-E-A-T é a sigla para Experience (experiência prática no assunto), Expertise (conhecimento técnico), Authoritativeness (reconhecimento como referência) e Trustworthiness (confiabilidade) — framework que o próprio Google Search Central documenta usar para avaliar a qualidade de conteúdo e decidir o que recomendar, tanto em busca tradicional quanto em respostas geradas por IA (AI Overviews). Na prática, sinais de E-E-A-T incluem: página 'Sobre' clara, contato verificável (endereço, telefone), autoria identificada em textos, depoimentos reais (não fabricados), CNPJ visível, e política de privacidade transparente. Presença desses sinais não garante que o Google ou uma IA generativa vai citar o site — é aproximação de boas práticas documentadas, não medição direta.",
    ferramentasRelacionadas: ["sinais-de-confianca", "auditor-de-perfil"],
  },
  {
    slug: "robots-txt",
    termo: "robots.txt",
    categoria: "SEO / IA",
    definicaoCurta:
      "robots.txt é um arquivo público na raiz de um site que declara quais robôs automatizados (de busca ou de IA) podem ou não acessar cada parte do site, seguindo o Robots Exclusion Protocol.",
    definicaoCompleta:
      "O robots.txt é um arquivo de texto público, hospedado na raiz de um domínio (ex.: seusite.com.br/robots.txt), que declara regras de acesso para robôs automatizados — quais partes do site cada robô pode ou não visitar. Segue o Robots Exclusion Protocol (RFC 9309), respeitado pelos grandes buscadores (Google, Bing) e também pelos robôs de IA generativa, que se dividem em robôs de treino (como GPTBot e ClaudeBot, que alimentam o aprendizado dos modelos) e robôs de busca (como OAI-SearchBot e PerplexityBot, que buscam em tempo real para citar sites em respostas). Bloquear um tipo de robô não afeta o outro — um erro comum é bloquear o robô errado sem perceber, perdendo visibilidade em respostas de IA sem nenhum aviso.",
    ferramentasRelacionadas: ["verificador-acesso-ia"],
  },
  {
    slug: "core-web-vitals",
    termo: "Core Web Vitals",
    categoria: "Site / Técnico",
    definicaoCurta:
      "Core Web Vitals são as três métricas de experiência de carregamento que o Google usa como sinal de ranqueamento: LCP (velocidade de carregamento), CLS (estabilidade visual) e INP (responsividade a interação).",
    definicaoCompleta:
      "Core Web Vitals é o conjunto de métricas que o Google definiu para medir a experiência real de carregamento de uma página, usadas como sinal de ranqueamento em busca: LCP (Largest Contentful Paint, tempo até o maior elemento visível carregar), CLS (Cumulative Layout Shift, o quanto os elementos da página 'pulam' durante o carregamento) e INP (Interaction to Next Paint, a responsividade da página a cliques/toques). Podem ser medidas em laboratório (teste controlado, ex.: Lighthouse) ou em campo (dado agregado de usuários reais, via Chrome User Experience Report — CrUX) — os dois números costumam divergir, e o dado de campo é o que o Google efetivamente usa como sinal de ranking.",
    ferramentasRelacionadas: ["velocidade-usuario-real", "comparador-historico"],
  },
  {
    slug: "lcp",
    termo: "LCP (Largest Contentful Paint)",
    categoria: "Site / Técnico",
    definicaoCurta:
      "LCP mede o tempo até o maior elemento visível da tela (geralmente uma imagem ou bloco de texto) terminar de carregar — quanto menor, mais rápida a página parece para quem visita.",
    definicaoCompleta:
      "LCP (Largest Contentful Paint) é uma das três métricas do Core Web Vitals: mede quanto tempo leva até o maior elemento visível na área inicial da tela (viewport) terminar de renderizar — geralmente uma imagem de destaque, um vídeo ou um bloco grande de texto. É a métrica que mais se aproxima da percepção humana de 'a página carregou'. O Google considera bom um LCP até 2,5 segundos; entre 2,5 e 4 segundos é 'precisa melhorar'; acima de 4 segundos é considerado lento.",
    ferramentasRelacionadas: ["velocidade-usuario-real", "comparador-historico"],
  },
  {
    slug: "cls",
    termo: "CLS (Cumulative Layout Shift)",
    categoria: "Site / Técnico",
    definicaoCurta:
      "CLS mede o quanto os elementos de uma página se movem inesperadamente durante o carregamento — quanto menor, mais estável a experiência (menos cliques errados por elemento que 'pulou').",
    definicaoCompleta:
      "CLS (Cumulative Layout Shift) é uma das três métricas do Core Web Vitals: mede a soma de todos os deslocamentos inesperados de elementos visuais durante o carregamento de uma página — o clássico caso de tentar clicar num botão e, no último instante, um elemento carregar acima dele e empurrar o botão pra outro lugar, causando um clique errado. O Google considera bom um CLS abaixo de 0,1; entre 0,1 e 0,25 é 'precisa melhorar'; acima de 0,25 é considerado ruim.",
    ferramentasRelacionadas: ["velocidade-usuario-real", "comparador-historico"],
  },
  {
    slug: "lgpd",
    termo: "LGPD (Lei Geral de Proteção de Dados)",
    categoria: "Jurídico",
    definicaoCurta:
      "LGPD (Lei nº 13.709/2018) é a legislação brasileira que regula a coleta, o uso e o armazenamento de dados pessoais, exigindo transparência sobre o que é coletado, para quê, e garantindo direitos ao titular dos dados.",
    definicaoCompleta:
      "A LGPD (Lei Geral de Proteção de Dados, Lei nº 13.709/2018) regula como empresas e sites brasileiros podem coletar, tratar e armazenar dados pessoais. Exige, entre outros pontos: transparência sobre o que é coletado e com qual finalidade, base legal para cada tipo de coleta, direito do titular de acessar, corrigir ou excluir seus dados, e cuidados adicionais para dados sensíveis (saúde, biometria). Todo site que usa cookies de analytics, formulário de contato, pixel de anúncio ou chat já está sujeito à lei — e precisa de uma política de privacidade que reflita exatamente o que coleta, não um texto genérico copiado de outro site.",
    ferramentasRelacionadas: ["gerador-politica-privacidade-lgpd"],
  },
  {
    slug: "cro",
    termo: "CRO (Conversion Rate Optimization / Otimização da Taxa de Conversão)",
    categoria: "Conversão",
    definicaoCurta:
      "CRO é o conjunto de práticas para aumentar a proporção de visitantes de um site que completam uma ação desejada (comprar, preencher formulário, agendar) — sem depender de trazer mais tráfego.",
    definicaoCompleta:
      "CRO (Conversion Rate Optimization) é a disciplina de melhorar a taxa de conversão de um site — a proporção de visitantes que completam uma ação desejada, como comprar, preencher um formulário ou agendar uma conversa — sem necessariamente aumentar o volume de tráfego. Táticas comuns incluem reduzir fricção em formulários (menos campos, campos mais claros), melhorar a velocidade de carregamento, reforçar sinais de confiança e testar variações de página. O valor de um ganho de conversão costuma ser subestimado por parecer um ajuste técnico abstrato — mesmo uma melhoria pequena (meio ponto percentual) pode representar um ganho relevante em receita, sem gastar mais em mídia.",
    ferramentasRelacionadas: ["friccao-do-formulario", "valor-do-ganho-de-conversao", "simulador-de-funil"],
  },
  {
    slug: "canonical",
    termo: "Tag Canonical",
    categoria: "Site / Técnico",
    definicaoCurta:
      "A tag canonical é uma marcação HTML que declara qual URL é a versão \"oficial\" de uma página, evitando que o Google trate conteúdo duplicado ou variações da mesma URL como páginas concorrentes.",
    definicaoCompleta:
      "A tag `<link rel=\"canonical\">` é colocada no `<head>` de uma página HTML para declarar explicitamente qual URL deve ser considerada a versão principal daquele conteúdo — importante quando a mesma página é acessível por mais de um endereço (com ou sem parâmetros de rastreamento, com ou sem barra final, versão mobile separada). Sem essa marcação, buscadores podem interpretar as variações como páginas duplicadas, diluindo a autoridade de SEO entre elas em vez de concentrar tudo numa única URL. Toda página deveria ter uma tag canonical, mesmo que aponte para si mesma.",
    ferramentasRelacionadas: ["auditoria-tecnica-seo"],
  },
  {
    slug: "dados-estruturados",
    termo: "Dados Estruturados (JSON-LD / Schema.org)",
    categoria: "SEO / IA",
    definicaoCurta:
      "Dados estruturados são um código adicional no HTML de uma página, seguindo o vocabulário do Schema.org, que descreve explicitamente do que se trata o conteúdo — permitindo que buscadores e IAs generativas entendam e citem a página com mais precisão.",
    definicaoCompleta:
      "Dados estruturados (mais comumente no formato JSON-LD) são blocos de código, geralmente invisíveis ao visitante, que descrevem explicitamente o conteúdo de uma página usando o vocabulário padronizado do Schema.org — por exemplo, marcando que um bloco de texto é uma `FAQPage`, que um conjunto de textos é um `Article` com autor e data, ou que um termo é uma `DefinedTerm`. Isso remove a ambiguidade que um buscador ou uma IA generativa teria ao tentar interpretar HTML puro, e é um dos fatores que favorece a citação de uma página em respostas de IA (GEO). A ausência de dados estruturados não impede a página de ser encontrada, mas reduz a precisão com que ela pode ser entendida e citada.",
    ferramentasRelacionadas: ["auditoria-tecnica-seo", "verificador-acesso-ia"],
  },
  {
    slug: "crawl",
    termo: "Crawl (Rastreamento)",
    categoria: "SEO / Técnico",
    definicaoCurta:
      "Crawl (rastreamento) é o processo pelo qual um robô automatizado (de busca ou de IA) visita as páginas de um site, seguindo links, para descobrir e ler o conteúdo.",
    definicaoCompleta:
      "Crawl, ou rastreamento, é como buscadores (Googlebot) e robôs de IA (GPTBot, PerplexityBot etc.) descobrem o conteúdo de um site: um robô visita uma página, lê o HTML, extrai os links encontrados nela e visita essas novas páginas também, repetindo o processo. O robots.txt controla quais partes do site cada robô pode rastrear; o sitemap.xml ajuda o robô a encontrar páginas que talvez não estejam bem linkadas internamente. Uma auditoria técnica de SEO que 'crawleia' um site está fazendo exatamente isso em escala pequena e controlada — visitando várias páginas automaticamente para checar problemas estruturais.",
    ferramentasRelacionadas: ["auditoria-tecnica-seo", "verificador-acesso-ia", "analise-de-log"],
  },
  {
    slug: "sla-de-resposta",
    termo: "SLA de Resposta",
    categoria: "Conversão",
    definicaoCurta:
      "SLA de Resposta é o compromisso de tempo máximo que uma empresa define internamente para responder um lead depois que ele chega — por exemplo, \"todo lead recebe a primeira resposta em até 5 minutos\".",
    definicaoCompleta:
      "SLA (Service Level Agreement, ou Acordo de Nível de Serviço) de Resposta é o tempo máximo que uma empresa se compromete a levar para dar a primeira resposta a um lead que acabou de chegar — seja por WhatsApp, formulário ou telefone. Diferente de uma meta vaga (\"responder rápido\"), um SLA é um número específico e mensurável (ex.: 5 minutos, 1 hora), que pode ser medido e cobrado do time. Definir um SLA de resposta é geralmente o primeiro passo prático depois de descobrir, via uma ferramenta como o Custo do Lead Perdido, que a velocidade de resposta está custando vendas.",
    ferramentasRelacionadas: ["custo-do-lead-perdido", "capacidade-comercial"],
  },
  {
    slug: "cpl",
    termo: "CPL (Custo Por Lead)",
    categoria: "Financeiro",
    definicaoCurta:
      "CPL é o valor investido em mídia dividido pelo número de leads gerados — quanto, em média, custa cada contato captado, antes de saber se ele vira cliente.",
    definicaoCompleta:
      "CPL (Custo Por Lead) é o investimento em mídia dividido pelo número de leads (contatos captados via formulário, WhatsApp etc.) gerados naquele período. É uma métrica intermediária: não diz se o lead vira cliente (isso depende da taxa de conversão lead→venda) nem quanto custou o cliente final (isso é o CAC). Usado principalmente em planejamento — para estimar quanta verba de mídia é necessária para atingir um número desejado de leads ou de vendas, partindo de trás para frente a partir de uma meta de faturamento.",
    ferramentasRelacionadas: ["meta-reversa", "custo-do-lead-perdido"],
  },
  {
    slug: "aeo",
    termo: "AEO (Answer Engine Optimization)",
    categoria: "SEO / IA",
    definicaoCurta:
      "AEO é a prática de estruturar conteúdo para ser citado diretamente dentro da resposta gerada por buscadores de IA e assistentes — a resposta em si, não só o link tradicional para a página.",
    definicaoCompleta:
      "AEO (Answer Engine Optimization, ou Otimização para Motores de Resposta) é o conjunto de práticas para que um conteúdo seja citado literalmente dentro de respostas geradas por sistemas de IA — AI Overviews, ChatGPT, assistentes de voz, caixas de resposta direta — em vez de aparecer só como um link na lista tradicional de resultados. É próximo de GEO (Generative Engine Optimization) e, no uso comum do mercado, os dois termos costumam se sobrepor; a distinção mais citada é que GEO foca especificamente em como IAs generativas como ChatGPT e Perplexity sintetizam e citam fontes, enquanto AEO é o guarda-chuva mais amplo, que também cobre trechos em destaque (featured snippets) e respostas de busca por voz. Na prática, boa parte das táticas é a mesma: definição direta e citável logo no início do conteúdo, estrutura clara em pergunta e resposta, e dados estruturados que reduzem a ambiguidade sobre do que trata a página.",
    ferramentasRelacionadas: ["sinais-de-confianca", "calculadora", "medir-trafego-de-ia"],
  },
  {
    slug: "ai-overviews-e-ai-mode",
    termo: "AI Overviews e AI Mode",
    categoria: "SEO / IA",
    definicaoCurta:
      "AI Overviews é o resumo gerado por IA que aparece embutido no topo dos resultados de busca do Google para certas pesquisas; AI Mode é uma aba separada, em formato de chat, para pesquisas mais longas e exploratórias com perguntas de acompanhamento.",
    definicaoCompleta:
      "AI Overviews e AI Mode são dois recursos distintos de busca com IA generativa do Google, frequentemente confundidos entre si. O AI Overviews aparece embutido na página de resultados tradicional, resumindo uma resposta a partir de várias fontes antes da lista de links — pensado pra não tirar quem pesquisa do fluxo normal de busca. O AI Mode é uma aba separada, num formato mais parecido com um chat, voltada a pesquisas mais complexas: permite perguntas de acompanhamento na mesma conversa e usa mais buscas internas pra montar uma resposta mais aprofundada (ver query fan-out). Para quem tem site, o efeito prático é parecido nos dois casos: se o conteúdo não é citado na resposta gerada, o clique pro site pode nem acontecer, mesmo que a página estivesse bem posicionada na busca tradicional.",
    ferramentasRelacionadas: ["medir-trafego-de-ia", "verificador-acesso-ia", "calculadora"],
  },
  {
    slug: "query-fan-out",
    termo: "Query Fan-Out",
    categoria: "SEO / IA",
    definicaoCurta:
      "Query fan-out é a técnica pela qual buscadores de IA (como o AI Mode do Google) quebram uma única pergunta em várias sub-perguntas relacionadas, buscam a resposta de cada uma separadamente e juntam tudo numa resposta só.",
    definicaoCompleta:
      "Query fan-out (também chamado de decomposição de consulta) é o processo pelo qual sistemas de busca com IA generativa — o AI Mode do Google, e de forma parecida ChatGPT e Perplexity — respondem perguntas complexas: em vez de rodar só a pesquisa original, o sistema gera várias sub-perguntas relacionadas (sinônimos, aspectos complementares, comparações implícitas na pergunta), busca resultado para cada uma e sintetiza tudo numa resposta única. Na prática, isso significa que uma página pode ser citada numa resposta de IA mesmo sem rankear bem pro termo de busca original, desde que responda bem a uma das sub-perguntas geradas no processo — o que muda a lógica de otimizar só pra uma palavra-chave isolada e reforça a importância de cobrir um tema com profundidade.",
    ferramentasRelacionadas: ["calculadora", "medir-trafego-de-ia"],
  },
  {
    slug: "dados-anonimizados",
    termo: "Dados Anonimizados / Anonimização (LGPD)",
    categoria: "Jurídico",
    definicaoCurta:
      "Dado anonimizado, pela LGPD, é aquele que não pode mais ser associado a uma pessoa identificável nem revertido a dado pessoal usando meios técnicos razoavelmente disponíveis — por isso a lei não se aplica a ele, diferente do dado pessoal.",
    definicaoCompleta:
      "O artigo 12 da LGPD (Lei nº 13.709/2018) estabelece que dados anonimizados não são considerados dados pessoais e, portanto, ficam fora do escopo da lei — desde que a anonimização seja irreversível com os meios técnicos razoavelmente disponíveis no momento do tratamento. É diferente de um dado apenas 'agregado' ou 'sem nome': se ainda for razoavelmente possível reverter o processo e reidentificar a pessoa (cruzando com outra base, por exemplo), a lei trata o dado como pessoal, mesmo que pareça anônimo à primeira vista. A distinção importa na prática para qualquer empresa que publique estatísticas ou benchmarks agregados a partir de dados de clientes: só é seguro tratar como anonimizado — e fora da LGPD — o que realmente não permite voltar a identificar ninguém.",
    ferramentasRelacionadas: ["gerador-politica-privacidade-lgpd"],
  },
  {
    slug: "rich-results",
    termo: "Rich Results (Resultados Ricos)",
    categoria: "SEO / IA",
    definicaoCurta:
      "Rich results (resultados ricos) são resultados de busca do Google com elementos visuais extras além do título e da descrição — como estrelas de avaliação, perguntas expansíveis ou preço — habilitados por dados estruturados (schema.org) no HTML da página.",
    definicaoCompleta:
      "Rich results, ou resultados ricos, são a forma como o Google exibe certos resultados de busca com elementos visuais adicionais ao título e à URL — estrelas de avaliação (Review), preço e disponibilidade (Product) ou perguntas expansíveis (FAQPage), por exemplo — quando a página tem dados estruturados (JSON-LD/schema.org) reconhecidos pelo Google para aquele tipo de conteúdo. Nem todo tipo de dado estruturado gera um resultado rico continuamente, e o Google pode descontinuar o suporte a um tipo específico mesmo que a marcação em si continue válida no schema.org: o rich result de FAQPage parou de aparecer na busca em 7 de maio de 2026, e o de HowTo teve a descontinuação registrada pela documentação do Google Search Central em 31 de julho de 2025. Nos dois casos, a marcação não ficou 'errada' — só deixou de gerar o elemento visual extra no resultado de busca. Por isso, dados estruturados continuam valendo pelo que ajudam buscadores e IAs a entender a página (ver GEO), mesmo quando não resultam mais num rich result visível.",
    ferramentasRelacionadas: ["auditoria-tecnica-seo", "verificador-acesso-ia"],
  },
];
