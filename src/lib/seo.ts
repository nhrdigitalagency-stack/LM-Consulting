import type {
  Article,
  BreadcrumbList,
  FAQPage,
  Organization,
  Person,
  ProfessionalService,
  Service,
  Thing,
  WebSite,
  WithContext,
} from 'schema-dts';
import {
  cabinet,
  faqData,
  getActiveServices,
  getOfficeBySlug,
  getResourceBySlug,
  getServiceBySlug,
  legalData,
} from './content';

export interface RouteSeoMetadata {
  title: string;
  description: string;
  canonicalPath: string;
  ogType: 'website' | 'article';
  ogImageSlug: string;
  robots?: string;
  statusCode: 200 | 404;
  jsonLd: Array<WithContext<Thing>>;
}

export function normalizeBaseUrl(rawBaseUrl?: string): string {
  const fallback = 'https://www.lmconsulting-cm.com';
  if (!rawBaseUrl || rawBaseUrl === 'MY_APP_URL') return fallback;
  return rawBaseUrl.replace(/\/+$/, '');
}

export function normalizePathname(rawPath: string): string {
  const withoutQuery = rawPath.split('?')[0].split('#')[0] || '/';
  if (withoutQuery === '/') return '/';
  return withoutQuery.replace(/\/+$/, '') || '/';
}

function buildBreadcrumbs(
  baseUrl: string,
  crumbs: Array<{ name: string; path: string }>
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: `${baseUrl}${crumb.path}`,
    })),
  };
}

function buildOrganizationJsonLd(baseUrl: string): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: cabinet.brand.name,
    description: cabinet.brand.shortPositioning,
    url: `${baseUrl}/`,
    logo: `${baseUrl}${cabinet.brand.logoFallbackPath}`,
    email: cabinet.contact.email,
    telephone: cabinet.contact.phones[0].tel,
    sameAs: [cabinet.contact.facebookUrl],
    founder: {
      '@type': 'Person',
      name: cabinet.founder.name,
      jobTitle: cabinet.founder.role,
    },
    areaServed: [
      { '@type': 'Country', name: 'Cameroun' },
      { '@type': 'City', name: 'Yaoundé' },
      { '@type': 'City', name: 'Douala' },
    ],
    department: [
      {
        '@type': 'ProfessionalService',
        name: `${cabinet.brand.name} — Yaoundé (Siège)`,
        telephone: cabinet.contact.phones[0].tel,
        email: cabinet.contact.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Immeuble ADJAL Warda',
          addressLocality: 'Yaoundé',
          addressRegion: 'Centre',
          addressCountry: 'CM',
        },
      },
      {
        '@type': 'ProfessionalService',
        name: `${cabinet.brand.name} — Douala (Bonanjo)`,
        telephone: cabinet.contact.phones[0].tel,
        email: cabinet.contact.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Immeuble ONCPB, Bonanjo',
          addressLocality: 'Douala',
          addressRegion: 'Littoral',
          addressCountry: 'CM',
        },
      },
    ],
  };
}

function buildFounderPersonJsonLd(baseUrl: string): WithContext<Person> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${baseUrl}/a-propos#laurentine-mvondo`,
    name: cabinet.founder.name,
    jobTitle: cabinet.founder.role,
    description: cabinet.founder.shortBio,
    image: `${baseUrl}${cabinet.founder.photo.jpg}`,
    worksFor: {
      '@id': `${baseUrl}/#organization`,
    },
  };
}

function buildLocalOfficeJsonLd(
  baseUrl: string,
  citySlug: 'yaounde' | 'douala'
): WithContext<ProfessionalService> {
  const office = getOfficeBySlug(citySlug);
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${baseUrl}/${office.slug}#localbusiness`,
    name: `${cabinet.brand.name} — ${office.city}`,
    description: office.seo.description,
    url: `${baseUrl}/${office.slug}`,
    telephone: office.phones[0].tel,
    email: office.email,
    image: `${baseUrl}${cabinet.brand.logoFallbackPath}`,
    parentOrganization: {
      '@id': `${baseUrl}/#organization`,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress:
        office.slug === 'yaounde'
          ? 'Immeuble ADJAL Warda'
          : 'Immeuble ONCPB, Bonanjo',
      addressLocality: office.city,
      addressRegion: office.slug === 'yaounde' ? 'Centre' : 'Littoral',
      addressCountry: 'CM',
    },
    areaServed: [
      { '@type': 'City', name: office.city },
      { '@type': 'Country', name: 'Cameroun' },
    ],
    sameAs: [cabinet.contact.facebookUrl],
  };
}

export function getSeoForPath(rawPath: string, rawBaseUrl?: string): RouteSeoMetadata {
  const baseUrl = normalizeBaseUrl(rawBaseUrl);
  const path = normalizePathname(rawPath);

  if (path === '/') {
    const websiteSchema: WithContext<WebSite> = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: `${baseUrl}/`,
      name: cabinet.brand.name,
      inLanguage: 'fr-CM',
      publisher: { '@id': `${baseUrl}/#organization` },
    };

    const faqSchema: WithContext<FAQPage> = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqData.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };

    return {
      title: 'LM CONSULTING — « Un réel plaisir de vous accompagner »',
      description:
        'LM CONSULTING — Un réel plaisir de vous accompagner. Conseil, mise à niveau des PME, fiscalité (DSF, OHADA) et financement à Yaoundé & Douala (Cameroun).',
      canonicalPath: '/',
      ogType: 'website',
      ogImageSlug: 'accueil',
      statusCode: 200,
      jsonLd: [
        buildOrganizationJsonLd(baseUrl),
        websiteSchema,
        buildLocalOfficeJsonLd(baseUrl, 'yaounde'),
        buildLocalOfficeJsonLd(baseUrl, 'douala'),
        faqSchema,
      ],
    };
  }

  if (path === '/services') {
    return {
      title: 'Services de conseil aux PME au Cameroun | LM Consulting',
      description:
        'Découvrez nos pôles : mise à niveau, contrôle de gestion, conseil fiscal et comptable, montage DSF, business plan et création d’entreprise.',
      canonicalPath: '/services',
      ogType: 'website',
      ogImageSlug: 'services',
      statusCode: 200,
      jsonLd: [
        buildOrganizationJsonLd(baseUrl),
        buildBreadcrumbs(baseUrl, [
          { name: 'Accueil', path: '/' },
          { name: 'Services', path: '/services' },
        ]),
      ],
    };
  }

  if (path.startsWith('/services/')) {
    const slug = path.slice('/services/'.length);
    const service = getServiceBySlug(slug);
    if (service) {
      const serviceSchema: WithContext<Service> = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${baseUrl}/services/${service.slug}#service`,
        name: service.title,
        serviceType: service.shortTitle,
        description: service.seo.description,
        provider: {
          '@id': `${baseUrl}/#organization`,
        },
        areaServed: [
          { '@type': 'City', name: 'Yaoundé' },
          { '@type': 'City', name: 'Douala' },
          { '@type': 'Country', name: 'Cameroun' },
        ],
      };

      const faqSchema: WithContext<FAQPage> = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: service.faq.map((q) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.answer,
          },
        })),
      };

      return {
        title: service.seo.title,
        description: service.seo.description,
        canonicalPath: `/services/${service.slug}`,
        ogType: 'website',
        ogImageSlug: `service-${service.slug}`,
        statusCode: 200,
        jsonLd: [
          serviceSchema,
          faqSchema,
          buildBreadcrumbs(baseUrl, [
            { name: 'Accueil', path: '/' },
            { name: 'Services', path: '/services' },
            { name: service.shortTitle, path: `/services/${service.slug}` },
          ]),
        ],
      };
    }
  }

  if (path === '/a-propos') {
    return {
      title: 'À propos du cabinet & direction | LM Consulting',
      description:
        'Découvrez la vision, les engagements et le parcours de Laurentine MVONDO, Manager de LM Consulting à Yaoundé et Douala.',
      canonicalPath: '/a-propos',
      ogType: 'website',
      ogImageSlug: 'a-propos',
      statusCode: 200,
      jsonLd: [
        buildOrganizationJsonLd(baseUrl),
        buildFounderPersonJsonLd(baseUrl),
        buildBreadcrumbs(baseUrl, [
          { name: 'Accueil', path: '/' },
          { name: 'À propos', path: '/a-propos' },
        ]),
      ],
    };
  }

  if (path === '/yaounde' || path === '/douala') {
    const citySlug = path === '/yaounde' ? 'yaounde' : 'douala';
    const office = getOfficeBySlug(citySlug);
    return {
      title: office.seo.title,
      description: office.seo.description,
      canonicalPath: `/${office.slug}`,
      ogType: 'website',
      ogImageSlug: office.slug,
      statusCode: 200,
      jsonLd: [
        buildLocalOfficeJsonLd(baseUrl, citySlug),
        buildBreadcrumbs(baseUrl, [
          { name: 'Accueil', path: '/' },
          { name: office.city, path: `/${office.slug}` },
        ]),
      ],
    };
  }

  if (path === '/faq') {
    const faqSchema: WithContext<FAQPage> = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqData.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };

    return {
      title: 'FAQ Fiscalité, DSF & Financement PME au Cameroun | LM Consulting',
      description:
        'Questions fréquentes sur la DSF, la régularisation fiscale, la comptabilité OHADA, la CNPS et le montage de dossiers de financement au Cameroun.',
      canonicalPath: '/faq',
      ogType: 'website',
      ogImageSlug: 'faq',
      statusCode: 200,
      jsonLd: [
        buildOrganizationJsonLd(baseUrl),
        faqSchema,
        buildBreadcrumbs(baseUrl, [
          { name: 'Accueil', path: '/' },
          { name: 'FAQ', path: '/faq' },
        ]),
      ],
    };
  }

  if (path === '/ressources') {
    return {
      title: 'Ressources & guides de gestion PME | LM Consulting',
      description:
        'Notes pratiques sur la DSF, le montage de business plan et la mise à niveau des entreprises au Cameroun par LM Consulting.',
      canonicalPath: '/ressources',
      ogType: 'website',
      ogImageSlug: 'ressources',
      statusCode: 200,
      jsonLd: [
        buildOrganizationJsonLd(baseUrl),
        buildBreadcrumbs(baseUrl, [
          { name: 'Accueil', path: '/' },
          { name: 'Ressources', path: '/ressources' },
        ]),
      ],
    };
  }

  if (path.startsWith('/ressources/')) {
    const slug = path.slice('/ressources/'.length);
    const article = getResourceBySlug(slug);
    if (article) {
      const articleSchema: WithContext<Article> = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.frontmatter.title,
        description: article.frontmatter.seoDescription,
        datePublished: article.frontmatter.publishedAt,
        dateModified: article.frontmatter.updatedAt,
        inLanguage: 'fr-CM',
        author: {
          '@type': 'Person',
          name: article.frontmatter.author,
          url: `${baseUrl}/a-propos`,
        },
        publisher: {
          '@id': `${baseUrl}/#organization`,
        },
        mainEntityOfPage: `${baseUrl}/ressources/${article.frontmatter.slug}`,
      };

      return {
        title: article.frontmatter.seoTitle,
        description: article.frontmatter.seoDescription,
        canonicalPath: `/ressources/${article.frontmatter.slug}`,
        ogType: 'article',
        ogImageSlug: `ressource-${article.frontmatter.slug}`,
        statusCode: 200,
        jsonLd: [
          articleSchema,
          buildBreadcrumbs(baseUrl, [
            { name: 'Accueil', path: '/' },
            { name: 'Ressources', path: '/ressources' },
            {
              name: article.frontmatter.title,
              path: `/ressources/${article.frontmatter.slug}`,
            },
          ]),
        ],
      };
    }
  }

  if (path === '/contact') {
    return {
      title: 'Contacter LM Consulting à Yaoundé et Douala',
      description:
        'Planifiez un premier échange avec LM Consulting à Yaoundé (Warda) ou Douala (Bonanjo) pour vos besoins comptables, fiscaux et financiers.',
      canonicalPath: '/contact',
      ogType: 'website',
      ogImageSlug: 'contact',
      statusCode: 200,
      jsonLd: [
        buildOrganizationJsonLd(baseUrl),
        buildLocalOfficeJsonLd(baseUrl, 'yaounde'),
        buildLocalOfficeJsonLd(baseUrl, 'douala'),
        buildBreadcrumbs(baseUrl, [
          { name: 'Accueil', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]),
      ],
    };
  }

  if (path === '/mentions-legales') {
    return {
      title: legalData.mentionsLegales.seoTitle,
      description: legalData.mentionsLegales.seoDescription,
      canonicalPath: '/mentions-legales',
      ogType: 'website',
      ogImageSlug: 'mentions-legales',
      statusCode: 200,
      jsonLd: [
        buildBreadcrumbs(baseUrl, [
          { name: 'Accueil', path: '/' },
          { name: 'Mentions légales', path: '/mentions-legales' },
        ]),
      ],
    };
  }

  if (path === '/politique-de-confidentialite') {
    return {
      title: legalData.politiqueConfidentialite.seoTitle,
      description: legalData.politiqueConfidentialite.seoDescription,
      canonicalPath: '/politique-de-confidentialite',
      ogType: 'website',
      ogImageSlug: 'politique-de-confidentialite',
      statusCode: 200,
      jsonLd: [
        buildBreadcrumbs(baseUrl, [
          { name: 'Accueil', path: '/' },
          {
            name: 'Politique de confidentialité',
            path: '/politique-de-confidentialite',
          },
        ]),
      ],
    };
  }

  return {
    title: 'Page introuvable (404) | LM Consulting',
    description:
      'La page demandée est introuvable. Retrouvez les services et coordonnées du cabinet LM Consulting à Yaoundé et Douala.',
    canonicalPath: path,
    ogType: 'website',
    ogImageSlug: 'accueil',
    robots: 'noindex, follow',
    statusCode: 404,
    jsonLd: [buildOrganizationJsonLd(baseUrl)],
  };
}

export function getAllStaticRoutes(): string[] {
  const staticCore = [
    '/',
    '/services',
    '/a-propos',
    '/yaounde',
    '/douala',
    '/faq',
    '/ressources',
    '/contact',
    '/mentions-legales',
    '/politique-de-confidentialite',
  ];
  const serviceRoutes = getActiveServices().map((s) => `/services/${s.slug}`);
  const resourceRoutes = [
    '/ressources/qu-est-ce-que-la-dsf-et-qui-doit-la-deposer',
    '/ressources/structurer-un-business-plan-pour-obtenir-un-financement',
    '/ressources/mise-a-niveau-d-entreprise-par-ou-commencer',
  ];
  return [...staticCore, ...serviceRoutes, ...resourceRoutes];
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderSeoHeadTags(
  meta: RouteSeoMetadata,
  rawBaseUrl?: string,
  verification?: { google?: string; bing?: string }
): string {
  const baseUrl = normalizeBaseUrl(rawBaseUrl);
  const canonicalUrl = `${baseUrl}${meta.canonicalPath}`;
  const ogImageUrl = `${baseUrl}/assets/photos/og-whatsapp-share.png`;

  const lines: string[] = [
    `<title>${escapeHtmlAttr(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtmlAttr(meta.description)}" />`,
    `<link rel="canonical" href="${escapeHtmlAttr(canonicalUrl)}" />`,
    `<link rel="alternate" hreflang="fr" href="${escapeHtmlAttr(canonicalUrl)}" />`,
    `<link rel="alternate" hreflang="en" href="${escapeHtmlAttr(canonicalUrl)}?lang=en" />`,
    `<meta property="og:locale" content="fr_CM" />`,
    `<meta property="og:locale:alternate" content="en_CM" />`,
    `<meta property="og:type" content="${meta.ogType}" />`,
    `<meta property="og:site_name" content="${escapeHtmlAttr(cabinet.brand.name)}" />`,
    `<meta property="og:title" content="${escapeHtmlAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtmlAttr(meta.description)}" />`,
    `<meta property="og:url" content="${escapeHtmlAttr(canonicalUrl)}" />`,
    `<meta property="og:image" content="${escapeHtmlAttr(ogImageUrl)}" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="LM CONSULTING — « Un réel plaisir de vous accompagner »" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtmlAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtmlAttr(meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtmlAttr(ogImageUrl)}" />`,
  ];

  if (meta.robots) {
    lines.push(`<meta name="robots" content="${escapeHtmlAttr(meta.robots)}" />`);
  }

  if (verification?.google) {
    lines.push(
      `<meta name="google-site-verification" content="${escapeHtmlAttr(verification.google)}" />`
    );
  }

  if (verification?.bing) {
    lines.push(`<meta name="msvalidate.01" content="${escapeHtmlAttr(verification.bing)}" />`);
  }

  for (const block of meta.jsonLd) {
    const serialized = JSON.stringify(block).replace(/</g, '\\u003c');
    lines.push(`<script type="application/ld+json">${serialized}</script>`);
  }

  return lines.join('\n    ');
}
