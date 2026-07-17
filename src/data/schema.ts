// Shared schema.org builders — single source of truth so structured data
// never drifts out of sync across pages (the old site had inconsistent /
// Manaus-localized JSON-LD scattered across routes).

export const SITE_URL = "https://formulamidia.com.br";
export const BRAND_NAME = "Fórmula Mídia";
export const WHATSAPP_NUMBER = "5548991826577";
export const WHATSAPP_E164 = "+5548991826577";

export interface FaqItem {
  question: string;
  answer: string;
}

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: BRAND_NAME,
    image: `${SITE_URL}/assets/logo.png`,
    logo: `${SITE_URL}/assets/logo.png`,
    description:
      "Agência de performance especializada em tráfego pago, SEO técnico e GEO (otimização para buscadores de IA). Google Ads, Meta Ads, sites de alta performance e automação para gerar mais clientes em todo o Brasil.",
    url: SITE_URL,
    telephone: WHATSAPP_E164,
    email: "formulamidiaoficial@gmail.com",
    taxID: "55.777.659/0001-40",
    address: { "@type": "PostalAddress", addressCountry: "BR" },
    areaServed: "BR",
    serviceType:
      "Gestão de Tráfego Pago, Google Ads, Meta Ads, SEO, GEO (Otimização para IA), Criação de Sites de Alta Performance",
    sameAs: [
      "https://www.instagram.com/formulamidia",
      "https://www.linkedin.com/company/formulamidia",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "100",
      bestRating: "5",
      worstRating: "1",
    },
    priceRange: "R$ 1.200 - R$ 3.500",
  };
}

export function faqPageSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
