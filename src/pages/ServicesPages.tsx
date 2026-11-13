import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { AppLink } from '../lib/router';
import { Breadcrumbs } from '../components/BrandMarks';
import { ContactBanner } from '../components/ContactBanner';
import { FaqAccordion } from '../components/FaqAccordion';
import { SplitReveal } from '../components/MotionPrimitives';
import { ServicesInteractiveList } from '../components/ServicesInteractiveList';
import { NotFoundPage } from './ContactAndLegalPages';

export function ServicesIndexPage() {
  const { locale, ui, services, servicesSection } = useI18n();

  return (
    <>
      <section className="bg-midnight pt-32 pb-16 text-on-midnight sm:pt-40 sm:pb-24">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <Breadcrumbs
            tone="light"
            items={[{ label: ui.nav.home, href: '/' }, { label: ui.nav.services }]}
          />
          <p className="editorial-caption text-gold">{servicesSection.label}</p>
          <SplitReveal
            text={ui.servicesPage.h1}
            as="h1"
            mode="words"
            className="mt-4 max-w-4xl text-section-display text-on-midnight"
          />
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-on-midnight-muted sm:text-lg">
            {servicesSection.intro} {ui.servicesPage.introSuffix}
          </p>
        </div>
      </section>

      <section className="bg-ivory py-16 text-ink sm:py-24">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            <figure className="group border border-ink/15 bg-ivory-surface p-3">
              <div className="aspect-[16/9] w-full overflow-hidden bg-midnight">
                <img
                  src="/assets/photos/advisory-meeting.jpg"
                  alt={
                    locale === 'en'
                      ? 'LM Consulting executive consultation and tax diagnosis'
                      : 'Consultation dirigeant et diagnostic financier LM Consulting'
                  }
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
            </figure>
            <figure className="group border border-ink/15 bg-ivory-surface p-3">
              <div className="aspect-[16/9] w-full overflow-hidden bg-midnight">
                <img
                  src="/assets/photos/finance-strategy-desk.jpg"
                  alt={
                    locale === 'en'
                      ? 'Financial modeling, DSF assembly, and management dashboards'
                      : 'Modélisation financière, montage DSF et tableaux de bord de gestion'
                  }
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
            </figure>
          </div>

          <ServicesInteractiveList services={services} tone="ivory" />

          <div className="mt-16 grid grid-cols-1 gap-8 border-t border-ink/15 pt-12 md:grid-cols-2">
            <div>
              <h2 className="text-subsection-display text-ink">
                {ui.servicesPage.onSiteHeading}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {ui.servicesPage.onSiteBody}
              </p>
            </div>
            <div className="flex flex-wrap items-start gap-6 md:justify-end">
              <AppLink
                href="/yaounde"
                className="editorial-link text-sm font-semibold text-ink hover:text-amber-ink"
              >
                <span>{ui.servicesPage.yaoundeLink}</span>
                <ArrowUpRight className="h-4 w-4 text-amber-ink" aria-hidden="true" />
              </AppLink>
              <AppLink
                href="/douala"
                className="editorial-link text-sm font-semibold text-ink hover:text-amber-ink"
              >
                <span>{ui.servicesPage.doualaLink}</span>
                <ArrowUpRight className="h-4 w-4 text-amber-ink" aria-hidden="true" />
              </AppLink>
            </div>
          </div>
        </div>
      </section>

      <ContactBanner
        heading={ui.servicesPage.bannerHeading}
        subtitle={ui.servicesPage.bannerSubtitle}
      />
    </>
  );
}

export function ServiceDetailPage({ slug }: { slug: string }) {
  const {
    locale,
    ui,
    cabinet,
    getServiceBySlug,
    getRelatedServices,
    getResourceBySlug,
  } = useI18n();
  const service = getServiceBySlug(slug);
  if (!service) {
    return <NotFoundPage />;
  }

  const relatedServices = getRelatedServices(service.relatedSlugs);
  const relatedArticle = getResourceBySlug(service.relatedResourceSlug);

  return (
    <>
      {/* EN-TÊTE DU SERVICE */}
      <section className="bg-midnight pt-32 pb-16 text-on-midnight sm:pt-40 sm:pb-24">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <Breadcrumbs
            tone="light"
            items={[
              { label: ui.nav.home, href: '/' },
              { label: ui.nav.services, href: '/services' },
              { label: service.shortTitle },
            ]}
          />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <div className="min-w-0 lg:col-span-8">
              <p className="editorial-caption text-gold">
                {service.number} · {service.category}
              </p>
              <SplitReveal
                text={service.title}
                as="h1"
                mode="words"
                className="mt-4 text-section-display text-on-midnight"
              />
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-on-midnight-muted sm:text-lg">
                {service.summary}
              </p>
            </div>

            <div className="lg:col-span-4 lg:text-right">
              <AppLink
                href={`/contact?service=${encodeURIComponent(service.slug)}`}
                className="inline-flex min-h-12 items-center justify-center gap-2.5 bg-gold px-6 py-3 text-sm font-semibold whitespace-nowrap text-on-midnight transition-colors hover:bg-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <span>{ui.servicesPage.requestServiceCta}</span>
                <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </AppLink>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION APPROFONDIE & PUBLIC CONCERNÉ */}
      <section className="bg-ivory py-16 text-ink sm:py-24">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="min-w-0 space-y-5 lg:col-span-7">
              <h2 className="text-subsection-display text-ink">
                {ui.servicesPage.operationalStakes}
              </h2>
              {service.introduction.map((para, idx) => (
                <p key={idx} className="text-base leading-relaxed text-ink-muted">
                  {para}
                </p>
              ))}

              {relatedArticle && (
                <div className="mt-8 border-t border-ink/15 pt-6">
                  <p className="editorial-caption text-amber-ink">
                    {ui.servicesPage.relatedResourceKicker}
                  </p>
                  <AppLink
                    href={`/ressources/${relatedArticle.frontmatter.slug}`}
                    className="editorial-link mt-2 font-editorial text-2xl text-ink hover:text-amber-ink"
                  >
                    <span>{relatedArticle.frontmatter.title}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-amber-ink" aria-hidden="true" />
                  </AppLink>
                </div>
              )}
            </div>

            <aside className="group min-w-0 border border-ink/15 bg-ivory-surface p-6 sm:p-9 lg:col-span-5 lg:self-start">
              <div className="mb-6 aspect-[16/9] w-full overflow-hidden border border-ink/12 bg-midnight">
                <img
                  src={
                    ['conseil-en-gestion-controle', 'business-plan-et-financement', 'solutions-fintech'].includes(
                      service.slug
                    )
                      ? '/assets/photos/finance-strategy-desk.jpg'
                      : '/assets/photos/advisory-meeting.jpg'
                  }
                  alt={service.title}
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <h2 className="editorial-caption text-amber-ink">
                {ui.servicesPage.whoIsItFor}
              </h2>
              <ul className="mt-5 divide-y divide-ink/12 text-sm leading-relaxed text-ink">
                {service.audience.map((item, idx) => (
                  <li key={idx} className="py-4 first:pt-0 last:pb-0">
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-ink/14 pt-5 text-xs text-ink-muted">
                {locale === 'en'
                  ? 'LM CONSULTING · Yaoundé (Warda) & Douala (Bonanjo)'
                  : `LM CONSULTING · ${cabinet.hero.architecturalPlateCaption}`}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* LIVRABLES CONCRETS */}
      <section className="border-t border-ink/14 bg-ivory-surface py-16 text-ink sm:py-24">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="editorial-caption text-amber-ink">
              {ui.servicesPage.deliverablesKicker}
            </p>
            <h2 className="mt-3 text-section-display text-ink">
              {ui.servicesPage.deliverablesHeading}
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {service.deliverables.map((deliv, idx) => (
              <div
                key={deliv.title}
                className="min-w-0 border border-ink/15 bg-ivory p-6 sm:p-8"
              >
                <span className="font-sans text-xs font-semibold tabular-nums text-amber-ink">
                  {ui.servicesPage.deliverableItemPrefix} 0{idx + 1}
                </span>
                <h3 className="mt-3 text-subsection-display text-ink">{deliv.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{deliv.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DÉROULÉ DE L'INTERVENTION */}
      <section className="bg-midnight py-16 text-on-midnight sm:py-24">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="editorial-caption text-gold">
              {ui.servicesPage.executionMethodKicker}
            </p>
            <h2 className="mt-3 text-section-display text-on-midnight">
              {ui.servicesPage.executionMethodHeading}
            </h2>
          </div>

          <ol className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step) => (
              <li
                key={step.step}
                className="min-w-0 border border-on-midnight/15 bg-midnight-surface p-6 sm:p-7"
              >
                <span className="font-editorial text-4xl text-gold tabular-nums">
                  {step.step}
                </span>
                <h3 className="mt-4 font-editorial text-2xl text-on-midnight">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-on-midnight-muted">
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ SPÉCIFIQUE + SERVICES LIÉS */}
      <section className="bg-ivory py-16 text-ink sm:py-24">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="min-w-0 lg:col-span-4">
              <p className="editorial-caption text-amber-ink">{ui.servicesPage.faqKicker}</p>
              <h2 className="mt-3 text-subsection-display text-ink">
                {ui.servicesPage.faqHeading}
              </h2>
            </div>
            <div className="min-w-0 lg:col-span-8">
              <FaqAccordion items={service.faq} tone="ivory" />
            </div>
          </div>

          {relatedServices.length > 0 && (
            <div className="mt-16 border-t border-ink/15 pt-14 sm:mt-20">
              <p className="editorial-caption text-amber-ink">
                {ui.servicesPage.relatedServicesKicker}
              </p>
              <h2 className="mt-3 text-subsection-display text-ink">
                {ui.servicesPage.relatedServicesHeading}
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {relatedServices.map((rel) => (
                  <AppLink
                    key={rel.slug}
                    href={`/services/${rel.slug}`}
                    className="group flex min-w-0 flex-col justify-between border border-ink/15 bg-ivory-surface p-6 transition-colors hover:border-amber-ink"
                  >
                    <div>
                      <span className="text-xs font-semibold text-amber-ink tabular-nums">
                        {rel.number} · {rel.category}
                      </span>
                      <h3 className="mt-3 font-editorial text-2xl text-ink group-hover:text-amber-ink">
                        {rel.shortTitle}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-ink-muted">{rel.summary}</p>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-ink">
                      <span>{ui.servicesPage.viewService}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-amber-ink" aria-hidden="true" />
                    </span>
                  </AppLink>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <ContactBanner
        heading={`${ui.servicesPage.detailBannerPrefix} ${service.shortTitle.toLowerCase()}`}
        serviceSlug={service.slug}
      />
    </>
  );
}
