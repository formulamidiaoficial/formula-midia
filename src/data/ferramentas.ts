// Fonte única das ferramentas gratuitas — importada por Nav.astro, Footer.astro
// e src/pages/ferramentas/index.astro. Antes cada um mantinha a própria lista
// e elas ficavam dessincronizadas (aconteceu duas vezes em 26/07: a mudança de
// pra /ferramentas/ e depois a adição de 3 ferramentas novas ficaram de fora
// do Nav/Footer porque ninguém lembrou de atualizar os três lugares). Editar
// SÓ aqui ao adicionar/remover ferramenta.

export interface Ferramenta {
  slug: string;
  nome: string;
  nomeCurto: string; // usado no menu/rodapé, onde o espaço é menor
  desc: string;
  tag: string;
}

export const FERRAMENTAS: Ferramenta[] = [
  {
    slug: "gerador-politica-privacidade-lgpd",
    nome: "Gerador de Política de Privacidade (LGPD)",
    nomeCurto: "Gerador de Política de Privacidade",
    desc: "Gere um modelo de política de privacidade alinhado à LGPD com o que o seu site realmente coleta — pronto pra revisar e publicar.",
    tag: "Jurídico",
  },
  {
    slug: "valor-do-ganho-de-conversao",
    nome: "Valor do Ganho de Conversão",
    nomeCurto: "Valor do Ganho de Conversão",
    desc: "Melhorar a conversão do site vira um número abstrato — até você ver quanto meio ponto percentual vale em reais.",
    tag: "Financeiro",
  },
  {
    slug: "capacidade-comercial",
    nome: "Capacidade Comercial",
    nomeCurto: "Capacidade Comercial",
    desc: "Seu time consegue atender os leads que já chegam? Calcule a capacidade real antes de escalar verba de tráfego.",
    tag: "Financeiro",
  },
  {
    slug: "mer-vs-roas",
    nome: "MER × ROAS de plataforma",
    nomeCurto: "MER × ROAS",
    desc: "O Gerenciador mostra um ROAS bonito, mas o caixa mostra outra coisa? Compare com o MER e veja o gap de atribuição.",
    tag: "Financeiro",
  },
  {
    slug: "meta-reversa",
    nome: "Meta Reversa",
    nomeCurto: "Meta Reversa",
    desc: "Diga quanto quer faturar e descubra quantos leads e quanta verba de mídia isso exige.",
    tag: "Financeiro",
  },
  {
    slug: "cac-ltv-payback",
    nome: "CAC · LTV · Payback",
    nomeCurto: "CAC · LTV · Payback",
    desc: "O cliente que você conquista se paga? Calcule CAC, LTV e Payback e compare com o benchmark de mercado 3:1.",
    tag: "Financeiro",
  },
  {
    slug: "custo-do-lead-perdido",
    nome: "Custo do Lead Perdido",
    nomeCurto: "Custo do Lead Perdido",
    desc: "Quanto você perde por mês demorando pra responder um lead, com base em estudo real de tempo de resposta.",
    tag: "Financeiro",
  },
  {
    slug: "custo-real-da-midia",
    nome: "Custo Real da Mídia",
    nomeCurto: "Custo real da mídia",
    desc: "Quanto o seu anúncio realmente custa em 2026, com tributos, IOF e spread. O Gerenciador mostra a verba; a conta mostra outra coisa.",
    tag: "Tráfego pago",
  },
  {
    slug: "auditor-de-perfil",
    nome: "Auditor de Perfil",
    nomeCurto: "Auditor de perfil",
    desc: "20 pontos do seu Perfil da Empresa no Google, comparados com 3 concorrentes. Descubra o que falta para passar o vizinho no mapa.",
    tag: "Presença local",
  },
  {
    slug: "verificador-acesso-ia",
    nome: "Verificador de Acesso de IA",
    nomeCurto: "Acesso de IA",
    desc: "Confira se o seu site bloqueia sem querer os robôs de IA que poderiam citá-lo — separa treino de busca.",
    tag: "SEO / IA",
  },
  {
    slug: "medir-trafego-de-ia",
    nome: "Medir Tráfego de IA no GA4",
    nomeCurto: "Medir tráfego de IA",
    desc: "O GA4 ignora a Perplexity e perde até 70% do tráfego de IA. Gere o grupo de canais que captura tudo e veja quanto você está perdendo.",
    tag: "Medição · IA",
  },
  {
    slug: "diagnostico",
    nome: "Diagnóstico de Crescimento",
    nomeCurto: "Diagnóstico de crescimento",
    desc: "Responda 6 perguntas rápidas e descubra a maturidade de crescimento do seu negócio e o próximo passo mais importante.",
    tag: "Growth",
  },
  {
    slug: "calculadora",
    nome: "Calculadora de SEO & GEO",
    nomeCurto: "Calculadora de escopo",
    desc: "Monte o escopo do seu projeto de SEO e GEO: landing pages, cidades e objetivo de ranking.",
    tag: "SEO & GEO",
  },
  {
    slug: "simulador-de-funil",
    nome: "Simulador de Funil",
    nomeCurto: "Simulador de funil",
    desc: "Informe tráfego, conversão e ticket médio e descubra em 1 minuto onde está o maior vazamento do seu funil.",
    tag: "Growth",
  },
  {
    slug: "simulador-de-site",
    nome: "Simulador de Site",
    nomeCurto: "Simulador de site",
    desc: "Escolha quantas páginas, se precisa de loja virtual e de blog. Em 1 minuto você tem o escopo do seu site.",
    tag: "Criação de sites",
  },
  {
    slug: "velocidade-usuario-real",
    nome: "Velocidade + Usuário Real",
    nomeCurto: "Velocidade + Usuário Real",
    desc: "Nota de performance e experiência real dos seus usuários, lado a lado — direto da API oficial do Google.",
    tag: "Site / técnico",
  },
  {
    slug: "analise-de-log",
    nome: "Análise de Log de Servidor",
    nomeCurto: "Análise de Log",
    desc: "O que o Google e os bots de IA realmente rastrearam no seu site — direto do log, processado só no seu navegador.",
    tag: "SEO / avançado",
  },
  {
    slug: "comparador-historico",
    nome: "Comparador Histórico",
    nomeCurto: "Comparador Histórico",
    desc: "Sua velocidade contra até 3 concorrentes, ao longo de 40 semanas — dado real do Google.",
    tag: "Site / técnico",
  },
  {
    slug: "friccao-do-formulario",
    nome: "Fricção do Formulário",
    nomeCurto: "Fricção do Formulário",
    desc: "Descubra se o formulário do seu site afasta lead por ter campo demais ou errado — com benchmark real.",
    tag: "Conversão",
  },
  {
    slug: "sinais-de-confianca",
    nome: "Checador de Sinais de Confiança",
    nomeCurto: "Sinais de Confiança",
    desc: "Os 7 sinais (E-E-A-T) que o Google e as IAs generativas usam para decidir se citam sua marca.",
    tag: "SEO / GEO",
  },
];
