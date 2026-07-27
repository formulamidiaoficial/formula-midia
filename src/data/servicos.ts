// Fonte única dos serviços produtizados (escopo fixo, preço fixo, prazo prometido).
// A regra: diagnóstico grátis (as ferramentas revelam o problema) → execução paga (estes consertam).
// Preços travados no formula-foundation (B1 / registry servicos_produtizados). Editar SÓ aqui.
// Cada serviço amarra na ferramenta de diagnóstico que revela o problema que ele resolve.

export interface Servico {
  slug: string;
  nome: string;
  tag: string;
  conserta: string; // o problema que o serviço resolve (o que a ferramenta diagnostica)
  incluso: string[]; // escopo fechado — o que está incluído
  prazo: string;
  preco: string;
  ferramentaSlug?: string; // ferramenta de diagnóstico relacionada (se no ar)
  ferramentaNome?: string;
  waMsg: string; // mensagem pré-preenchida do WhatsApp
}

export const SERVICOS: Servico[] = [
  {
    slug: "reestruturacao-de-conta",
    nome: "Reestruturação de Conta",
    tag: "Tráfego pago",
    conserta:
      "Você paga mais do que o Gerenciador mostra e não sabe o custo real por venda. A conta cresceu sem estrutura e o dinheiro vaza sem aparecer.",
    incluso: [
      "Recálculo do custo real (tributos, IOF e spread)",
      "Reestruturação de campanhas, públicos e nomenclatura",
      "Rastreamento do lead até o WhatsApp/CRM",
      "Relatório com o antes e o depois",
    ],
    prazo: "1 a 2 semanas",
    preco: "R$ 4.990",
    ferramentaSlug: "custo-real-da-midia",
    ferramentaNome: "Custo Real da Mídia",
    waMsg: "Olá! Quero a Reestruturação de Conta (R$ 4.990). Rodei o diagnóstico de custo real.",
  },
  {
    slug: "sprint-de-performance",
    nome: "Sprint de Performance",
    tag: "Site / técnico",
    conserta:
      "O site é lento, o usuário real sofre e você perde venda antes da primeira dobra carregar. Cada segundo a mais é lead que desiste.",
    incluso: [
      "15 dias corrigindo velocidade por ordem de impacto",
      "Otimização de imagens, scripts e carregamento",
      "Correção de Core Web Vitals (laboratório e campo)",
      "Reteste com dado real do Google (CrUX)",
    ],
    prazo: "15 dias",
    preco: "R$ 6.990",
    ferramentaSlug: "velocidade-usuario-real",
    ferramentaNome: "Velocidade + Usuário Real",
    waMsg: "Olá! Quero a Sprint de Performance (R$ 6.990). Rodei o diagnóstico de velocidade.",
  },
  {
    slug: "correcao-tecnica-de-seo",
    nome: "Correção Técnica de SEO",
    tag: "SEO / técnico",
    conserta:
      "O Google não rastreia ou não entende o seu site direito, e você fica invisível na busca sem saber por quê. Erro técnico é ranking que nunca vem.",
    incluso: [
      "Correção dos erros por severidade",
      "Sitemap, canônicas, redirecionamentos e dados estruturados",
      "Ajuste do que o robô encontra e do que ignora",
      "Plano de rastreio (crawl budget)",
    ],
    prazo: "2 a 3 semanas",
    preco: "R$ 3.990",
    ferramentaSlug: "analise-de-log",
    ferramentaNome: "Análise de Log",
    waMsg: "Olá! Quero a Correção Técnica de SEO (R$ 3.990).",
  },
  {
    slug: "diagnostico-de-rastreio",
    nome: "Diagnóstico Avançado de Rastreio",
    tag: "SEO / avançado",
    conserta:
      "Você não sabe o que o Google e os bots de IA realmente rastrearam — onde gastam orçamento de rastreio, o que nunca visitaram, quais erros encontraram.",
    incluso: [
      "Análise profunda do log do servidor",
      "Mapa do que o robô rastreou de verdade (não o que deveria)",
      "Páginas órfãs, desperdício e erros de rastreio",
      "Plano de correção priorizado",
    ],
    prazo: "1 a 2 semanas",
    preco: "R$ 3.990",
    ferramentaSlug: "analise-de-log",
    ferramentaNome: "Análise de Log",
    waMsg: "Olá! Quero o Diagnóstico Avançado de Rastreio (R$ 3.990).",
  },
  {
    slug: "presenca-em-ia",
    nome: "Configuração de Presença em IA",
    tag: "IA · GEO",
    conserta:
      "As IAs (ChatGPT, Perplexity, Gemini) não citam sua marca — ou porque bloqueiam o robô errado, ou porque o seu site não fala a língua delas.",
    incluso: [
      "Configuração do robots.txt (robô de treino × robô de busca)",
      "Ajuste de dados estruturados e legibilidade por IA",
      "Grupo de canais no GA4 para medir o tráfego de IA",
      "Checklist de sinais de confiança (E-E-A-T)",
    ],
    prazo: "5 a 7 dias úteis",
    preco: "R$ 2.490",
    ferramentaSlug: "medir-trafego-de-ia",
    ferramentaNome: "Medir Tráfego de IA",
    waMsg: "Olá! Quero a Configuração de Presença em IA (R$ 2.490).",
  },
  {
    slug: "otimizacao-de-perfil",
    nome: "Otimização de Perfil no Google",
    tag: "Presença local",
    conserta:
      "Seu Perfil da Empresa no Google perde cliente para o concorrente do lado — categoria errada, poucas avaliações, informação incompleta.",
    incluso: [
      "Aplicação dos 20 pontos do auditor no seu perfil",
      "Categoria, serviços, descrição e atributos",
      "Estratégia de avaliações e resposta",
      "Comparação e plano contra 3 concorrentes",
    ],
    prazo: "5 dias úteis",
    preco: "R$ 1.490",
    ferramentaSlug: "auditor-de-perfil",
    ferramentaNome: "Auditor de Perfil",
    waMsg: "Olá! Quero a Otimização de Perfil no Google (R$ 1.490). Rodei o auditor.",
  },
];
