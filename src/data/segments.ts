// Páginas por segmento — o "ímã de nicho" do site.
// Cada segmento captura a intenção de busca do seu público e fala a dor
// específica dele. IMPORTANTE: saúde entra SEMPRE de forma genérica
// ("clínicas de alto padrão") — oftalmo nunca é citado (vantagem interna
// confidencial que protege o cliente atual). Ver PROGRESS.md.

export interface SegmentDiff {
  icon: string;
  title: string;
  desc: string;
}

export interface SegmentDefinition {
  slug: string;
  navTitle: string;
  badge: string;
  heroTitle: string;
  heroHighlight: string;
  heroSub: string;
  painTitle: string;
  painLead: string;
  pains: string[];
  helpTitle: string;
  diffs: SegmentDiff[];
  signalsTitle: string;
  signals: string[];
  ctaTitle: string;
  ctaDesc: string;
  metaTitle: string;
  metaDesc: string;
}

export const segments: SegmentDefinition[] = [
  {
    slug: "clinicas",
    navTitle: "Clínicas de Alto Padrão",
    badge: "Crescimento para Clínicas",
    heroTitle: "Sua clínica tem reputação.",
    heroHighlight: "Falta uma agenda sempre cheia.",
    heroSub:
      "Transformamos a autoridade que a sua clínica já construiu em fluxo constante de novos pacientes — com aquisição previsível, atendimento que não perde ninguém e total respeito às regras dos conselhos.",
    painTitle: "Por que a agenda oscila mesmo com boa reputação",
    painLead:
      "Clínicas de alto padrão vivem de agenda cheia — mas raramente têm uma máquina de aquisição de pacientes. O resultado é um crescimento que depende do acaso.",
    pains: [
      "A captação depende de indicação e convênio — quando esfria, a agenda tem buracos.",
      "Já tentou \"impulsionar\" post e anúncio solto, sem previsibilidade nem retorno claro.",
      "As plataformas restringem anúncios de saúde, e um criativo errado vira risco de processo no conselho.",
      "Paciente entra em contato no WhatsApp e se perde entre a mensagem e o agendamento.",
    ],
    helpTitle: "Como enchemos a sua agenda, com segurança",
    diffs: [
      {
        icon: "🎯",
        title: "Aquisição de pacientes previsível",
        desc: "Google e Meta Ads estruturados para atrair o paciente certo, no momento da decisão — não impulsionamento aleatório.",
      },
      {
        icon: "🛡️",
        title: "Conformidade com os conselhos",
        desc: "Cada anúncio respeita as regras de publicidade da área (CFM, CRO e afins). Crescimento sem risco de sanção ética.",
      },
      {
        icon: "🔄",
        title: "Nenhum paciente perdido",
        desc: "CRM e atendimento integrados ao WhatsApp: cada contato é respondido rápido e acompanhado até o agendamento.",
      },
    ],
    signalsTitle: "Faz sentido pra você se...",
    signals: [
      "Sua clínica já é referência, mas a agenda tem meses fortes e meses fracos.",
      "Você depende demais de indicação e quer previsibilidade.",
      "Já investiu em marketing sem clareza do que voltou.",
    ],
    ctaTitle: "Quer a agenda da sua clínica sempre cheia?",
    ctaDesc: "Comece com um diagnóstico de crescimento — vamos mapear como transformar sua reputação em pacientes.",
    metaTitle: "Crescimento para Clínicas de Alto Padrão | Fórmula Mídia",
    metaDesc:
      "Aquisição de pacientes previsível para clínicas de alto padrão, com respeito às regras dos conselhos. Transforme reputação em agenda cheia.",
  },
  {
    slug: "imobiliarias",
    navTitle: "Imobiliárias & Incorporação",
    badge: "Crescimento para Imobiliário",
    heroTitle: "Imóvel de alto padrão vende pela confiança.",
    heroHighlight: "Nós trazemos o comprador certo.",
    heroSub:
      "Geramos um fluxo constante de compradores qualificados para imobiliárias e incorporadoras — e cuidamos da nutrição no ciclo longo, para que nenhum lead de alto valor esfrie pelo caminho.",
    painTitle: "Por que lead de imóvel caro escapa",
    painLead:
      "O comprador de alto padrão é raro, disputado e decide devagar. Sem um processo certo, o lead certo chega e se perde.",
    pains: [
      "Lead de imóvel de alto valor é caro e disputado — desperdiçar um dói.",
      "O ciclo de decisão é longo: sem nutrição, o comprador esfria antes de fechar.",
      "O corretor recebe o contato e ele se perde no meio de mil conversas de WhatsApp.",
      "Portais entregam volume, mas pouca qualidade e nenhuma exclusividade.",
    ],
    helpTitle: "Como levamos o comprador certo até você",
    diffs: [
      {
        icon: "🏙️",
        title: "Captação de comprador qualificado",
        desc: "Campanhas segmentadas para atrair quem tem perfil e intenção real de compra do seu tipo de imóvel.",
      },
      {
        icon: "🌱",
        title: "Nutrição no ciclo longo",
        desc: "O lead que ainda não está pronto é acompanhado e aquecido até o momento certo — não é descartado.",
      },
      {
        icon: "📇",
        title: "Distribuição e follow-up para o time",
        desc: "Cada lead chega organizado ao corretor certo, com acompanhamento até a visita e a proposta.",
      },
    ],
    signalsTitle: "Faz sentido pra você se...",
    signals: [
      "Você vende imóveis de alto padrão e cada lead qualificado importa.",
      "Sente que perde bons compradores por falta de follow-up.",
      "Depende dos portais e quer um canal próprio de captação.",
    ],
    ctaTitle: "Quer um fluxo constante de compradores qualificados?",
    ctaDesc: "Comece com um diagnóstico — vamos desenhar sua máquina de captação de compradores de alto padrão.",
    metaTitle: "Crescimento para Imobiliárias e Incorporadoras | Fórmula Mídia",
    metaDesc:
      "Captação de compradores qualificados para imóveis de alto padrão, com nutrição no ciclo longo e follow-up para o time. Fluxo constante de compradores.",
  },
  {
    slug: "hotelaria",
    navTitle: "Hotelaria Premium",
    badge: "Crescimento para Hotelaria",
    heroTitle: "Seu hotel se vende pela experiência.",
    heroHighlight: "Nós garantimos a ocupação.",
    heroSub:
      "Aumentamos a reserva direta e a ocupação do seu hotel premium — inclusive na baixa temporada — reduzindo a dependência das OTAs e a comissão que elas comem da sua margem.",
    painTitle: "Por que a ocupação depende das OTAs",
    painLead:
      "Hotéis premium têm um produto excelente, mas terceirizam a demanda para plataformas que cobram caro e ficam com o cliente.",
    pains: [
      "A dependência de Booking e afins come a margem em comissão a cada reserva.",
      "A reserva direta (a mais lucrativa) é baixa — o hóspede sempre passa pela OTA.",
      "A ocupação despenca na baixa temporada, sem uma estratégia para preencher.",
      "O hóspede que já se hospedou não volta pelo canal direto — não há relacionamento.",
    ],
    helpTitle: "Como enchemos o seu hotel, com mais margem",
    diffs: [
      {
        icon: "🔑",
        title: "Mais reserva direta",
        desc: "Campanhas e páginas que levam o hóspede a reservar direto com você — não pela OTA que fica com a comissão.",
      },
      {
        icon: "📅",
        title: "Ocupação na baixa temporada",
        desc: "Estratégias sazonais para preencher os períodos vazios com o público certo e o preço certo.",
      },
      {
        icon: "✨",
        title: "O público que valoriza a experiência",
        desc: "Atraímos o hóspede de alto padrão que escolhe pela experiência, não só pelo menor preço.",
      },
    ],
    signalsTitle: "Faz sentido pra você se...",
    signals: [
      "Boa parte das suas reservas vem de OTAs com alta comissão.",
      "A baixa temporada derruba demais a sua ocupação.",
      "Você quer construir um canal direto e uma base de hóspedes própria.",
    ],
    ctaTitle: "Quer mais ocupação e mais reserva direta?",
    ctaDesc: "Comece com um diagnóstico — vamos mapear como encher seu hotel reduzindo a dependência das OTAs.",
    metaTitle: "Crescimento para Hotelaria Premium | Fórmula Mídia",
    metaDesc:
      "Mais reserva direta e ocupação para hotéis premium, inclusive na baixa temporada, reduzindo a dependência e a comissão das OTAs.",
  },
  {
    slug: "servicos-de-urgencia",
    navTitle: "Serviços de Urgência",
    badge: "Crescimento para Serviços de Urgência",
    heroTitle: "Quando o cliente precisa, ele busca agora.",
    heroHighlight: "Você tem que ser a primeira resposta.",
    heroSub:
      "Para serviços de urgência e alto valor, quem aparece primeiro e responde na hora ganha o cliente. Colocamos o seu negócio no topo no momento exato da busca — e garantimos a resposta imediata.",
    painTitle: "Por que urgência é vencida por segundos",
    painLead:
      "No serviço de urgência, a decisão acontece em minutos. Quem não está lá na hora da busca simplesmente não existe para aquele cliente.",
    pains: [
      "O cliente decide em minutos — quem aparece primeiro leva.",
      "Você depende de indicação boca a boca, sem controle sobre a demanda.",
      "Uma resposta lenta no WhatsApp perde o cliente para o concorrente que respondeu antes.",
      "A demanda é imprevisível e você não sabe de onde virá o próximo chamado.",
    ],
    helpTitle: "Como fazemos você ser a primeira resposta",
    diffs: [
      {
        icon: "⚡",
        title: "Topo na hora da busca",
        desc: "Campanhas de alta intenção que colocam o seu serviço no topo exatamente quando o cliente procura, com urgência.",
      },
      {
        icon: "💬",
        title: "Resposta imediata",
        desc: "Integração com WhatsApp para que nenhum chamado urgente fique sem resposta rápida — a velocidade que fecha.",
      },
      {
        icon: "📍",
        title: "Cobertura por região",
        desc: "Segmentação geográfica precisa para capturar a demanda exatamente na sua área de atendimento.",
      },
    ],
    signalsTitle: "Faz sentido pra você se...",
    signals: [
      "Seu serviço é procurado na urgência e a decisão é rápida.",
      "Você perde clientes por não aparecer ou não responder a tempo.",
      "Quer uma demanda previsível, não só o boca a boca.",
    ],
    ctaTitle: "Quer ser a primeira resposta na hora da urgência?",
    ctaDesc: "Comece com um diagnóstico — vamos colocar o seu serviço no topo no momento exato da busca.",
    metaTitle: "Crescimento para Serviços de Urgência e Alto Valor | Fórmula Mídia",
    metaDesc:
      "Apareça no topo no momento exato da busca e responda na hora. Captação de alta intenção para serviços de urgência e alto valor local.",
  },
  {
    slug: "controle-de-pragas",
    navTitle: "Controle de Pragas",
    badge: "Crescimento para Controle de Pragas",
    heroTitle: "A dedetização se decide na urgência.",
    heroHighlight: "O contrato se mantém na recorrência.",
    heroSub:
      "Capturamos a busca urgente por controle de pragas e transformamos o chamado pontual em contrato recorrente — o modelo que dá previsibilidade e faturamento estável ao seu negócio.",
    painTitle: "Por que o cliente aparece e some",
    painLead:
      "Controle de pragas tem demanda urgente e intenção altíssima — mas sem estratégia, o cliente resolve o problema pontual e nunca mais volta.",
    pains: [
      "A busca é urgente (\"dedetização perto de mim\"), mas quem aparece primeiro leva.",
      "O cliente contrata uma vez, resolve o problema e some — sem recorrência.",
      "Falta um canal previsível de novos chamados além da indicação.",
      "Contratos recorrentes (manutenção, PMOC) são a maior oportunidade e ficam na mesa.",
    ],
    helpTitle: "Como trazemos chamados e criamos recorrência",
    diffs: [
      {
        icon: "🔍",
        title: "Captura da busca urgente",
        desc: "Campanhas de alta intenção para aparecer no topo quando alguém precisa de controle de pragas, agora.",
      },
      {
        icon: "💬",
        title: "Conversão no WhatsApp",
        desc: "Atendimento rápido e organizado para transformar o chamado urgente em serviço fechado.",
      },
      {
        icon: "🔁",
        title: "Do pontual ao recorrente",
        desc: "Estratégia para converter o serviço avulso em contrato de manutenção — faturamento previsível todo mês.",
      },
    ],
    signalsTitle: "Faz sentido pra você se...",
    signals: [
      "Você atende chamados urgentes, mas o cliente não vira recorrente.",
      "Depende de indicação e quer um canal previsível de novos serviços.",
      "Quer crescer os contratos de manutenção, não só os serviços avulsos.",
    ],
    ctaTitle: "Quer mais chamados e mais contratos recorrentes?",
    ctaDesc: "Comece com um diagnóstico — vamos capturar a urgência e transformar em recorrência.",
    metaTitle: "Crescimento para Controle de Pragas | Fórmula Mídia",
    metaDesc:
      "Capture a busca urgente por controle de pragas e transforme o chamado pontual em contrato recorrente. Mais chamados, mais recorrência.",
  },
];

export function getSegmentBySlug(slug: string): SegmentDefinition | undefined {
  return segments.find((s) => s.slug === slug);
}
