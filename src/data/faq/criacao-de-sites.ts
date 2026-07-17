import type { FaqItem } from "../schema";

export const criacaoDeSitesFaq: FaqItem[] = [
  {
    question: "Quanto tempo leva para o site ficar pronto?",
    answer:
      "Depende do escopo, mas a maioria dos projetos fica pronta entre 2 e 6 semanas, dependendo da quantidade de páginas e da complexidade (loja virtual, área de membros, etc.).",
  },
  {
    question: "Vocês entregam o código-fonte?",
    answer:
      "Sim. Diferente da maioria das agências, entregamos o projeto num repositório Git, sob seu controle, sem dependência de nós para qualquer alteração futura.",
  },
  {
    question: "O site já nasce em qual tecnologia?",
    answer:
      "Usamos uma stack moderna (Astro, com React quando necessário) focada em performance máxima, a mesma que aplicamos no nosso próprio site.",
  },
  {
    question: "Precisa de manutenção depois de pronto?",
    answer:
      "Sites estáticos de alta performance exigem pouquíssima manutenção. Se quiser, oferecemos planos de atualização e evolução contínua.",
  },
];
