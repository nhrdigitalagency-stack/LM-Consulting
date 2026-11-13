import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { AppLink } from '../lib/router';
import { Breadcrumbs } from '../components/BrandMarks';
import { ContactBanner } from '../components/ContactBanner';
import { FaqInteractiveExplorer } from '../components/FaqAccordion';
import { EditorialReveal, SplitReveal } from '../components/MotionPrimitives';

export function FaqPage() {
  const { ui, faqData, resources, cabinet } = useI18n();

  return (
    <>
      <section className="bg-midnight pt-32 pb-16 text-on-midnight sm:pt-40 sm:pb-24">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <Breadcrumbs
            tone="light"
            items={[{ label: ui.nav.home, href: '/' }, { label: ui.nav.faq }]}
          />
          <p className="editorial-caption text-gold">{ui.faqPage.kicker}</p>
          <SplitReveal
            text={ui.faqPage.h1}
            as="h1"
            mode="words"
            className="mt-4 max-w-4xl text-section-display text-on-midnight"
          />
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-on-midnight-muted sm:text-lg">
            {ui.faqPage.intro}
          </p>
        </div>
      </section>

      <section className="bg-ivory py-16 text-ink sm:py-24">
        <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12">
          {/* Colonne latérale d'orientation & guides associés */}
          <aside className="min-w-0 space-y-6 lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
            <EditorialReveal>
              <div className="border border-ink/15 bg-midnight p-6 text-on-midnight sm:p-8">
                <p className="editorial-caption text-gold">LM CONSULTING</p>
                <h2 className="mt-3 font-display text-2xl font-semibold leading-snug text-on-midnight">
                  {ui.faqPage.quickAssistanceTitle}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-on-midnight-muted">
                  {ui.faqPage.quickAssistanceBody}
                </p>
                <div className="mt-6 space-y-3 border-t border-on-midnight/14 pt-5 text-xs">
                  <p className="font-semibold text-on-midnight">
                    {cabinet.contact.phones[0].display}
                  </p>
                  <p className="text-on-midnight-muted">{cabinet.contact.email}</p>
                </div>
                <div className="mt-6">
                  <AppLink
                    href="/contact"
                    className="cta-primary inline-flex min-h-11 w-full items-center justify-center gap-2 bg-gold px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-on-midnight hover:bg-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    <span>{ui.faqPage.quickAssistanceCta}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </AppLink>
                </div>
              </div>
            </EditorialReveal>

            <EditorialReveal delay={0.08}>
              <div className="border border-ink/15 bg-ivory-surface p-6">
                <p className="editorial-caption text-amber-ink">
                  {ui.nav.resources}
                </p>
                <ul className="mt-4 divide-y divide-ink/12">
                  {resources.map((article) => (
                    <li key={article.frontmatter.slug} className="py-3.5 first:pt-0 last:pb-0">
                      <AppLink
                        href={`/ressources/${article.frontmatter.slug}`}
                        className="group flex items-start justify-between gap-3 text-sm font-medium text-ink transition-colors hover:text-amber-ink"
                      >
                        <span className="min-w-0 leading-snug">
                          {article.frontmatter.title}
                        </span>
                        <ArrowUpRight
                          className="mt-0.5 h-4 w-4 shrink-0 text-amber-ink transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </AppLink>
                    </li>
                  ))}
                </ul>
              </div>
            </EditorialReveal>
          </aside>

          {/* Explorateur FAQ interactif */}
          <div className="min-w-0 lg:col-span-8">
            <FaqInteractiveExplorer items={faqData.items} />
          </div>
        </div>
      </section>

      <ContactBanner />
    </>
  );
}
