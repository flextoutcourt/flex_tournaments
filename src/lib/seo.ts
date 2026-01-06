import type { Metadata } from 'next';

const siteUrl = 'https://flex-tournaments.com';
const siteName = 'Flex Tournaments';
const siteDescription = 'Plateforme de création et gestion de tournois interactifs avec intégration Twitch. Organisez des compétitions engageantes avec votes en temps réel et suivi des participants.';

export const defaultMetadata: Metadata = {
  title: 'Flex Tournaments - Créez et gérez vos tournois interactifs',
  description: siteDescription,
  keywords: [
    'tournoi en ligne',
    'tournoi interactif',
    'tournoi Twitch',
    'compétition en ligne',
    'gestion de tournoi',
    'votes en direct',
    'streaming tournoi',
    'esport',
    'gaming tournament',
    'bracket tournament',
  ],
  authors: [{ name: 'Flex Tournaments' }],
  creator: 'Flex Tournaments',
  publisher: 'Flex Tournaments',
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: siteName,
    title: 'Flex Tournaments - Créez et gérez vos tournois interactifs',
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Flex Tournaments',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flex Tournaments',
    description: siteDescription,
    creator: '@flextournaments',
    images: [`${siteUrl}/twitter-image.jpg`],
  },
  alternates: {
    canonical: siteUrl,
  },
  category: 'entertainment',
  classification: 'Tournament Management Platform',
};

export function createMetadata(overrides: Metadata): Metadata {
  return {
    ...defaultMetadata,
    ...overrides,
    openGraph: {
      ...defaultMetadata.openGraph,
      ...overrides.openGraph,
    },
    twitter: {
      ...defaultMetadata.twitter,
      ...overrides.twitter,
    },
    alternates: {
      ...defaultMetadata.alternates,
      ...overrides.alternates,
    },
  };
}

// JSON-LD Structured Data
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Flex Tournaments',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description: siteDescription,
  sameAs: [
    'https://twitter.com/flextournaments',
    'https://discord.gg/flextournaments',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    url: `${siteUrl}/support`,
  },
};

export const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Flex Tournaments',
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/tournaments?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});
