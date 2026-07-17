export interface ServiceDiff {
  icon: string;
  title: string;
  desc: string;
}

export interface ServiceStep {
  n: string;
  t: string;
  d: string;
}

export interface ServiceDefinition {
  slug: string;
  navTitle: string;
  heroTitle: string;
  heroHighlight: string;
  heroSub: string;
  diffs: ServiceDiff[];
  steps: ServiceStep[];
  faq: { question: string; answer: string }[];
  finalCtaTitle: string;
  finalCtaDesc: string;
}

export const services: ServiceDefinition[] = [
  {
    slug: "google-ads",
    navTitle: "Google Ads",
    heroTitle: "Google Ads:",
    heroHighlight: "Capture a Demanda Ativa",
    heroSub: "Apareça exatamente no momento em que seu cliente já está procurando por você, com estratégia, não só lance.",
    diffs: [
      { icon: "🔍", title: "Pesquisa de Palavras-Chave Estratégica", desc: "Mapeamos exatamente o que seu cliente ideal busca no Google, sem desperdiçar orçamento com termos genéricos." },
      { icon: "💰", title: "Otimização de Lances", desc: "Ajuste contínuo de lances para maximizar conversões dentro do seu orçamento, sem cliques desperdiçados." },
      { icon: "📊", title: "Rastreamento de Conversões", desc: "Cada clique rastreado até a venda, para saber exatamente o que está funcionando." },
    ],
    steps: [
      { n: "1", t: "Auditoria de Palavras-Chave", d: "Levantamento completo dos termos de busca mais relevantes para o seu negócio." },
      { n: "2", t: "Estruturação de Campanhas", d: "Organização de grupos de anúncios e campanhas para máxima relevância e Quality Score." },
      { n: "3", t: "Criação de Anúncios Persuasivos", d: "Copy focada em conversão, não só em cliques." },
      { n: "4", t: "Otimização Contínua", d: "Ajustes semanais baseados em dados reais de performance." },
    ],
    faq: [
      { question: "Preciso de um site pronto para rodar Google Ads?", answer: "Recomendamos uma landing page otimizada para conversão. Se você não tem uma, também construímos isso pra você." },
      { question: "Quanto tempo leva para ver resultado?", answer: "Campanhas de busca geram tráfego imediatamente após a publicação; a maturidade de otimização (CPA ideal) costuma vir entre o 1º e o 3º mês." },
    ],
    finalCtaTitle: "Pronto para capturar quem já está procurando por você?",
    finalCtaDesc: "Fale com a gente e vamos estruturar sua campanha de Google Ads.",
  },
  {
    slug: "meta-ads",
    navTitle: "Meta Ads",
    heroTitle: "Meta Ads:",
    heroHighlight: "Gere Desejo Antes da Concorrência",
    heroSub: "Alcance o público certo no Instagram e Facebook, antes que ele saiba que precisa de você.",
    diffs: [
      { icon: "🎯", title: "Segmentação por Público", desc: "Públicos customizados e semelhantes construídos com dados reais do seu negócio, não achismo de nicho." },
      { icon: "🔁", title: "Retargeting Dinâmico", desc: "Reimpactamos quem já demonstrou interesse, no momento certo da jornada." },
      { icon: "📈", title: "Otimização de ROAS", desc: "Cada real investido é acompanhado até a venda, ajustando criativos e públicos para maximizar retorno." },
    ],
    steps: [
      { n: "1", t: "Mapeamento de Públicos", d: "Definição de públicos ideais com base em dados de comportamento e interesse." },
      { n: "2", t: "Criação de Criativos", d: "Anúncios (imagem, vídeo, carrossel) pensados para parar o scroll e gerar ação." },
      { n: "3", t: "Configuração de Retargeting", d: "Estrutura de funil para reimpactar quem visitou, mas não converteu." },
      { n: "4", t: "Otimização de Performance", d: "Testes contínuos de criativos e públicos, guiados por ROAS." },
    ],
    faq: [
      { question: "Preciso ter uma página no Instagram ativa?", answer: "Não é obrigatório, mas ajuda na credibilidade do anúncio, e podemos orientar sobre isso também." },
      { question: "Meta Ads funciona para qualquer nicho?", answer: "Funciona melhor para negócios com ciclo de decisão mais curto ou produtos/serviços visuais; avaliamos isso no diagnóstico inicial." },
    ],
    finalCtaTitle: "Pronto para gerar desejo antes da concorrência?",
    finalCtaDesc: "Fale com a gente e vamos estruturar sua campanha de Meta Ads.",
  },
  {
    slug: "consultoria-trafego",
    navTitle: "Consultoria de Tráfego",
    heroTitle: "Consultoria de Tráfego:",
    heroHighlight: "Diagnóstico e Plano de Ação",
    heroSub: "Análise completa da sua operação atual de tráfego pago, com plano estratégico personalizado.",
    diffs: [
      { icon: "🔬", title: "Auditoria de Campanhas", desc: "Revisão profunda de tudo que já está rodando: estrutura, públicos, criativos e rastreamento." },
      { icon: "🗺️", title: "Plano Estratégico", desc: "Recomendações claras e priorizadas, com estimativa de impacto em cada uma." },
      { icon: "🛠️", title: "Implementação e Monitoramento", desc: "Se quiser, ajudamos a implementar e acompanhamos os resultados das mudanças recomendadas." },
    ],
    steps: [
      { n: "1", t: "Levantamento de Dados", d: "Acesso às contas de anúncio e análise histórica de performance." },
      { n: "2", t: "Diagnóstico Técnico", d: "Identificação de gargalos em estrutura, rastreamento e criativos." },
      { n: "3", t: "Plano de Ação Priorizado", d: "Recomendações organizadas por impacto e facilidade de implementação." },
      { n: "4", t: "Apresentação e Próximos Passos", d: "Reunião de entrega com plano claro do que fazer, e como podemos ajudar a executar." },
    ],
    faq: [
      { question: "A consultoria já inclui a execução das mudanças?", answer: "Não necessariamente: a consultoria entrega o diagnóstico e o plano; a execução pode ser feita por você ou contratada à parte." },
      { question: "Quanto tempo leva a consultoria?", answer: "O diagnóstico completo costuma ser entregue em 1 a 2 semanas, dependendo do volume de dados disponível." },
    ],
    finalCtaTitle: "Pronto para saber exatamente onde otimizar?",
    finalCtaDesc: "Fale com a gente e vamos analisar sua operação de tráfego pago.",
  },
];

export function getServiceBySlug(slug: string): ServiceDefinition | undefined {
  return services.find((s) => s.slug === slug);
}
