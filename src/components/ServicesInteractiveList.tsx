import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import type { ServiceItem } from '../lib/content';
import { useI18n } from '../lib/i18n';
import { AppLink } from '../lib/router';

/**
 * Liste éditoriale numérotée des services avec aperçu architectural au survol (desktop)
 * et flèche directionnelle animée.
 */
export function ServicesInteractiveList({
  services,
  tone = 'ivory',
}: {
  services: ServiceItem[];
  tone?: 'ivory' | 'midnight';
}) {
  const { ui } = useI18n();
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const prefersReduced = useReducedMotion();
  const isLight = tone === 'ivory';

  const activeService = services.find((s) => s.slug === hoveredSlug) ?? services[0];

  return (
    <div className="relative">
      <ul
        className={`divide-y border-y ${
          isLight
            ? 'divide-ink/14 border-ink/14'
            : 'divide-on-midnight/14 border-on-midnight/14'
        }`}
      >
        {services.map((service) => {
          const isHovered = hoveredSlug === service.slug;
          return (
            <li key={service.slug} className="min-w-0">
              <AppLink
                href={`/services/${service.slug}`}
                onMouseEnter={() => setHoveredSlug(service.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                onFocus={() => setHoveredSlug(service.slug)}
                onBlur={() => setHoveredSlug(null)}
                className={`group grid grid-cols-1 gap-3 py-6 transition-colors duration-200 sm:grid-cols-12 sm:items-baseline sm:gap-6 sm:py-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${
                  isLight
                    ? 'hover:bg-ivory-surface/90'
                    : 'hover:bg-midnight-surface/80'
                }`}
              >
                <div className="flex items-baseline gap-3 sm:col-span-3 lg:col-span-2">
                  <span className="font-sans text-xs font-semibold tabular-nums text-amber-ink">
                    {service.number}
                  </span>
                  <span
                    className={`text-xs ${
                      isLight ? 'text-ink-muted' : 'text-on-midnight-muted'
                    }`}
                  >
                    {service.category}
                  </span>
                </div>

                <div className="min-w-0 sm:col-span-6">
                  <h3
                    className={`text-subsection-display transition-transform duration-200 ${
                      !prefersReduced ? 'group-hover:translate-x-1.5' : ''
                    } ${isLight ? 'text-ink' : 'text-on-midnight'}`}
                  >
                    {service.shortTitle}
                  </h3>
                  <p
                    className={`mt-2 max-w-xl text-sm leading-relaxed ${
                      isLight ? 'text-ink-muted' : 'text-on-midnight-muted'
                    }`}
                  >
                    {service.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:col-span-3 lg:col-span-4 sm:justify-end">
                  <span
                    className={`hidden text-xs xl:inline ${
                      isLight ? 'text-ink-muted' : 'text-on-midnight-muted'
                    }`}
                  >
                    {service.deliverables.length} {ui.common.structuredDeliverables}
                  </span>
                  <span
                    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center border transition-colors duration-200 ${
                      isHovered
                        ? 'border-gold bg-gold text-on-midnight'
                        : isLight
                        ? 'border-ink/20 text-ink'
                        : 'border-on-midnight/20 text-on-midnight'
                    }`}
                  >
                    <ArrowUpRight
                      className={`h-4 w-4 transition-transform duration-200 ${
                        !prefersReduced
                          ? 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                          : ''
                      }`}
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </AppLink>
            </li>
          );
        })}
      </ul>

      {/* Aperçu architectural contextuel sur grand écran lors du survol */}
      <motion.aside
        aria-hidden="true"
        initial={false}
        animate={{
          opacity: hoveredSlug ? 1 : 0,
          y: hoveredSlug && !prefersReduced ? 0 : 8,
        }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none mt-6 hidden border border-ink/15 bg-midnight p-5 text-on-midnight lg:block"
      >
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={
                ['conseil-en-gestion-controle', 'business-plan-et-financement', 'solutions-fintech'].includes(
                  activeService.slug
                )
                  ? '/assets/photos/finance-strategy-desk.jpg'
                  : '/assets/photos/advisory-meeting.jpg'
              }
              alt=""
              width={160}
              height={96}
              className="h-16 w-28 shrink-0 border border-gold/30 object-cover"
            />
            <div>
              <p className="editorial-caption text-gold">
                {ui.common.previewPrefix} {activeService.number} · {activeService.category}
              </p>
              <p className="mt-1.5 font-editorial text-2xl text-on-midnight">
                {activeService.previewPalette.caption}
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-on-midnight-muted">
            <span>LM CONSULTING · Yaoundé · Douala</span>
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
