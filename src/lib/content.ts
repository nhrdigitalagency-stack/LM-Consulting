import cabinetRaw from '../../content/cabinet.json';
import faqRaw from '../../content/faq.json';
import implantationsRaw from '../../content/implantations.json';
import legalRaw from '../../content/legal.json';
import servicesRaw from '../../content/services.json';
import dsfMdx from '../../content/ressources/qu-est-ce-que-la-dsf-et-qui-doit-la-deposer.mdx?raw';
import bpMdx from '../../content/ressources/structurer-un-business-plan-pour-obtenir-un-financement.mdx?raw';
import manMdx from '../../content/ressources/mise-a-niveau-d-entreprise-par-ou-commencer.mdx?raw';
import { parseMdxDocument, type ParsedMdxArticle } from './mdx';

export const cabinet = cabinetRaw;
export const faqData = faqRaw;
export const implantationsData = implantationsRaw;
export const legalData = legalRaw;

export type ServiceItem = (typeof servicesRaw.services)[number];
export type OfficeItem = (typeof implantationsRaw.offices)[number];

export const servicesSection = {
  sectionNumber: servicesRaw.sectionNumber,
  label: servicesRaw.label,
  heading: servicesRaw.heading,
  intro: servicesRaw.intro,
};

export function getActiveServices(): ServiceItem[] {
  return servicesRaw.services.filter(
    (s) => !s.requiresConfirmation || cabinet.flags.enableDigitalisationService
  );
}

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return getActiveServices().find((s) => s.slug === slug);
}

export function getRelatedServices(slugs: string[]): ServiceItem[] {
  const active = getActiveServices();
  return slugs
    .map((slug) => active.find((item) => item.slug === slug))
    .filter((item): item is ServiceItem => Boolean(item));
}

export function getOfficeBySlug(slug: 'yaounde' | 'douala'): OfficeItem {
  const found = implantationsData.offices.find((o) => o.slug === slug);
  return found ?? implantationsData.offices[0];
}

const parsedArticles: ParsedMdxArticle[] = [
  parseMdxDocument(dsfMdx),
  parseMdxDocument(bpMdx),
  parseMdxDocument(manMdx),
].sort((a, b) => (a.frontmatter.publishedAt < b.frontmatter.publishedAt ? 1 : -1));

export function getAllResources(): ParsedMdxArticle[] {
  return parsedArticles;
}

export function getResourceBySlug(slug: string): ParsedMdxArticle | undefined {
  return parsedArticles.find((article) => article.frontmatter.slug === slug);
}
