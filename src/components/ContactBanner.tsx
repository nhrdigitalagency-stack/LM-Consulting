import React from 'react';
import { ArrowUpRight, Phone } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { AppLink } from '../lib/router';
import { MagneticWrap } from './MotionPrimitives';

export function ContactBanner({
  heading,
  subtitle,
  serviceSlug,
}: {
  heading?: string;
  subtitle?: string;
  serviceSlug?: string;
}) {
  const { ui, cabinet } = useI18n();
  const contactHref = serviceSlug
    ? `/contact?service=${encodeURIComponent(serviceSlug)}`
    : '/contact';

  const resolvedHeading = heading ?? ui.banner.defaultHeading;
  const resolvedSubtitle = subtitle ?? ui.banner.defaultSubtitle;

  return (
    <section
      aria-label={ui.banner.kicker}
      className="border-t border-on-midnight/15 bg-midnight-surface py-16 text-on-midnight sm:py-24"
    >
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-8">
            <p className="editorial-caption text-gold">{ui.banner.kicker}</p>
            <h2 className="mt-4 text-section-display text-on-midnight">{resolvedHeading}</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-on-midnight-muted">
              {resolvedSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 lg:col-span-4 lg:justify-end">
            <MagneticWrap>
              <AppLink
                href={contactHref}
                className="inline-flex min-h-12 items-center justify-center gap-2.5 bg-gold px-6 py-3 text-sm font-semibold whitespace-nowrap text-on-midnight transition-colors hover:bg-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <span>{ui.banner.cta}</span>
                <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </AppLink>
            </MagneticWrap>
            <a
              href={`tel:${cabinet.contact.phones[0].tel}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-on-midnight/25 px-5 py-3 text-sm font-semibold whitespace-nowrap text-on-midnight transition-colors hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <Phone className="h-4 w-4 text-gold shrink-0" aria-hidden="true" />
              <span>{cabinet.contact.phones[0].display}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
