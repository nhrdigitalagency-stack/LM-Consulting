import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useI18n, type Locale } from '../lib/i18n';
import { AppLink } from '../lib/router';
import { formatFrenchDate, formatFrenchTypography } from '../lib/typography';
import { Breadcrumbs } from '../components/BrandMarks';
import { ContactBanner } from '../components/ContactBanner';
import { SplitReveal } from '../components/MotionPrimitives';
import { NotFoundPage } from './ContactAndLegalPages';

/**
 * Interprète en toute sécurité le balisage en ligne (**gras** et [ancre](/lien))
 * sans recourir à dangerouslySetInnerHTML.
 */
function renderInlineMdx(rawText: string, locale: Locale): React.ReactNode[] {
  const formatted = formatFrenchTypography(rawText, locale);
  const tokenRegex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = formatted.split(tokenRegex);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <AppLink
          key={idx}
          href={linkMatch[2]}
          className="font-semibold text-amber-ink underline underline-offset-4 hover:text-ink"
        >
          {linkMatch[1]}
        </AppLink>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export function ResourcesIndexPage() {
  const { locale, ui, resources } = useI18n();

  return (
    <>
      <section className="bg-midnight pt-32 pb-16 text-on-midnight sm:pt-40 sm:pb-24">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <Breadcrumbs
            tone="light"
            items={[{ label: ui.nav.home, href: '/' }, { label: ui.nav.resources }]}
          />
          <p className="editorial-caption text-gold">{ui.resourcesPage.kicker}</p>
          <SplitReveal
            text={ui.resourcesPage.h1}
            as="h1"
            mode="words"
            className="mt-4 max-w-4xl text-section-display text-on-midnight"
          />
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-on-midnight-muted sm:text-lg">
            {ui.resourcesPage.intro}
          </p>
        </div>
      </section>

      <section className="bg-ivory py-16 text-ink sm:py-24">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <div className="divide-y divide-ink/15 border-y border-ink/15">
            {resources.map((article, idx) => (
              <article
                key={article.frontmatter.slug}
                className="py-10 sm:py-12 lg:grid lg:grid-cols-12 lg:gap-10"
              >
                <div className="text-xs text-ink-muted lg:col-span-3">
                  <span className="font-semibold text-amber-ink tabular-nums">0{idx + 1}</span>
                  <span className="mx-2">·</span>
                  <span>{article.frontmatter.category}</span>
                  <p className="mt-2">
                    {formatFrenchDate(article.frontmatter.publishedAt, locale)} ·{' '}
                    {ui.resourcesPage.readingLabel} {article.frontmatter.readingTime}
                  </p>
                </div>

                <div className="mt-4 min-w-0 lg:col-span-7 lg:mt-0">
                  <h2 className="text-subsection-display text-ink">
                    <AppLink
                      href={`/ressources/${article.frontmatter.slug}`}
                      className="transition-colors hover:text-amber-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                    >
                      {formatFrenchTypography(article.frontmatter.title, locale)}
                    </AppLink>
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
                    {formatFrenchTypography(article.excerpt, locale)}
                  </p>
                </div>

                <div className="mt-6 flex items-start lg:col-span-2 lg:mt-0 lg:justify-end">
                  <AppLink
                    href={`/ressources/${article.frontmatter.slug}`}
                    className="editorial-link text-sm font-semibold text-ink hover:text-amber-ink"
                  >
                    <span>{ui.resourcesPage.readArticle}</span>
                    <ArrowUpRight className="h-4 w-4 text-amber-ink" aria-hidden="true" />
                  </AppLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContactBanner />
    </>
  );
}

export function ResourceDetailPage({ slug }: { slug: string }) {
  const { locale, ui, resources, getResourceBySlug, getServiceBySlug } = useI18n();
  const article = getResourceBySlug(slug);
  if (!article) {
    return <NotFoundPage />;
  }

  const relatedService = getServiceBySlug(article.frontmatter.relatedServiceSlug);
  const otherArticles = resources.filter(
    (item) => item.frontmatter.slug !== article.frontmatter.slug
  );

  return (
    <>
      <article>
        <header className="bg-midnight pt-32 pb-16 text-on-midnight sm:pt-40 sm:pb-24">
          <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
            <Breadcrumbs
              tone="light"
              items={[
                { label: ui.nav.home, href: '/' },
                { label: ui.nav.resources, href: '/ressources' },
                { label: formatFrenchTypography(article.frontmatter.title, locale) },
              ]}
            />

            <p className="text-xs font-semibold text-gold">
              {article.frontmatter.category} · {ui.resourcesPage.readingTimePrefix}{' '}
              {article.frontmatter.readingTime}
            </p>

            <SplitReveal
              text={formatFrenchTypography(article.frontmatter.title, locale)}
              as="h1"
              mode="words"
              className="mt-4 max-w-4xl text-section-display text-on-midnight"
            />

            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-on-midnight/14 pt-6 text-xs text-on-midnight-muted">
              <span>
                {ui.resourcesPage.byAuthorPrefix} {article.frontmatter.author}
              </span>
              <span aria-hidden="true">·</span>
              <time dateTime={article.frontmatter.publishedAt}>
                {ui.resourcesPage.publishedOn}{' '}
                {formatFrenchDate(article.frontmatter.publishedAt, locale)}
              </time>
              <span aria-hidden="true">·</span>
              <span>
                {ui.resourcesPage.updatedOn}{' '}
                {formatFrenchDate(article.frontmatter.updatedAt, locale)}
              </span>
            </div>
          </div>
        </header>

        <div className="bg-ivory py-16 text-ink sm:py-24">
          <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
            <div className="min-w-0 space-y-6 lg:col-span-8">
              {article.blocks.map((block, idx) => {
                if (block.type === 'h2') {
                  return (
                    <h2
                      key={idx}
                      id={block.id}
                      className="pt-6 text-subsection-display text-ink"
                    >
                      {formatFrenchTypography(block.text, locale)}
                    </h2>
                  );
                }
                if (block.type === 'h3') {
                  return (
                    <h3 key={idx} id={block.id} className="pt-4 font-editorial text-2xl text-ink">
                      {formatFrenchTypography(block.text, locale)}
                    </h3>
                  );
                }
                if (block.type === 'ul') {
                  return (
                    <ul
                      key={idx}
                      className="space-y-3 border-l-2 border-gold pl-5 text-base text-ink-muted"
                    >
                      {block.items.map((item, i) => (
                        <li key={i} className="leading-relaxed">
                          {renderInlineMdx(item, locale)}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (block.type === 'ol') {
                  return (
                    <ol key={idx} className="space-y-3 pl-1 text-base text-ink-muted">
                      {block.items.map((item, i) => (
                        <li key={i} className="flex items-baseline gap-3 leading-relaxed">
                          <span className="font-sans text-xs font-semibold tabular-nums text-amber-ink shrink-0">
                            0{i + 1}
                          </span>
                          <span>{renderInlineMdx(item, locale)}</span>
                        </li>
                      ))}
                    </ol>
                  );
                }
                if (block.type === 'callout') {
                  return (
                    <div
                      key={idx}
                      className="my-8 border border-ink/18 bg-ivory-surface p-6 sm:p-8"
                    >
                      <p className="editorial-caption text-amber-ink">
                        {formatFrenchTypography(block.title, locale)}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-ink sm:text-base">
                        {renderInlineMdx(block.text, locale)}
                      </p>
                    </div>
                  );
                }
                return (
                  <p key={idx} className="max-w-[68ch] text-base leading-relaxed text-ink-muted">
                    {renderInlineMdx(block.text, locale)}
                  </p>
                );
              })}

              <div className="mt-12 border-t border-ink/15 pt-6 text-xs leading-relaxed text-ink-muted">
                <strong className="font-semibold text-ink">
                  {ui.resourcesPage.regulatoryNoticeTitle}
                </strong>{' '}
                {ui.resourcesPage.regulatoryNoticeBody}
              </div>
            </div>

            <aside className="min-w-0 space-y-8 lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
              {relatedService && (
                <div className="border border-ink/15 bg-midnight p-7 text-on-midnight">
                  <p className="editorial-caption text-gold">
                    {ui.resourcesPage.relatedPracticeKicker}
                  </p>
                  <h2 className="mt-3 font-editorial text-2xl text-on-midnight">
                    {relatedService.shortTitle}
                  </h2>
                  <p className="mt-3 text-xs leading-relaxed text-on-midnight-muted">
                    {relatedService.summary}
                  </p>
                  <div className="mt-6">
                    <AppLink
                      href={`/services/${relatedService.slug}`}
                      className="editorial-link text-xs font-semibold text-gold hover:text-on-midnight"
                    >
                      <span>{article.frontmatter.relatedServiceAnchor}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    </AppLink>
                  </div>
                </div>
              )}

              <div className="border border-ink/15 bg-ivory-surface p-7">
                <p className="editorial-caption text-amber-ink">
                  {ui.resourcesPage.otherPublicationsKicker}
                </p>
                <ul className="mt-4 divide-y divide-ink/12">
                  {otherArticles.map((other) => (
                    <li key={other.frontmatter.slug} className="py-3.5 first:pt-0 last:pb-0">
                      <AppLink
                        href={`/ressources/${other.frontmatter.slug}`}
                        className="font-editorial text-xl text-ink transition-colors hover:text-amber-ink"
                      >
                        {formatFrenchTypography(other.frontmatter.title, locale)}
                      </AppLink>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </article>

      <ContactBanner serviceSlug={article.frontmatter.relatedServiceSlug} />
    </>
  );
}
