import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { AppLink } from '../lib/router';
import { Breadcrumbs, CityLocatorMap } from '../components/BrandMarks';
import { ContactBanner } from '../components/ContactBanner';
import { SplitReveal } from '../components/MotionPrimitives';

export function AboutPage() {
  const { locale, ui, cabinet, implantationsData } = useI18n();
  const prefersReduced = useReducedMotion();

  return (
    <>
      <section className="bg-midnight pt-32 pb-16 text-on-midnight sm:pt-40 sm:pb-24">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <Breadcrumbs
            tone="light"
            items={[{ label: ui.nav.home, href: '/' }, { label: ui.nav.about }]}
          />
          <p className="editorial-caption text-gold">{ui.aboutPage.kicker}</p>
          <SplitReveal
            text={ui.aboutPage.h1}
            as="h1"
            mode="words"
            className="mt-4 max-w-4xl text-section-display text-on-midnight"
          />
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-on-midnight-muted sm:text-lg">
            {ui.aboutPage.intro}
          </p>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="bg-ivory py-16 text-ink sm:py-24">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-5">
              <p className="editorial-caption text-amber-ink">{ui.aboutPage.visionKicker}</p>
              <h2 className="mt-3 text-section-display text-ink">
                {ui.aboutPage.visionHeading}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ink-muted">
                {cabinet.values.vision}
              </p>
              <blockquote className="mt-8 border-l-2 border-amber-ink pl-5 font-editorial text-2xl text-ink italic">
                «{'\u00A0'}
                {cabinet.brand.engagement}
                {'\u00A0'}»
              </blockquote>

              <motion.figure
                initial={
                  prefersReduced
                    ? { opacity: 1 }
                    : { clipPath: 'inset(10% 0% 10% 0%)', opacity: 0.86 }
                }
                whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
                viewport={{ once: true, margin: '-8% 0px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="group mt-8 border border-ink/15 bg-ivory-surface p-3"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-midnight">
                  <img
                    src="/assets/photos/advisory-meeting.jpg"
                    alt={
                      locale === 'en'
                        ? 'LM Consulting executive consultation session'
                        : 'Séance de travail entre la direction LM Consulting et un dirigeant de PME'
                    }
                    width={1200}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              </motion.figure>
            </div>

            <div className="min-w-0 lg:col-span-7">
              <p className="editorial-caption text-amber-ink">{ui.aboutPage.missionKicker}</p>
              <ol className="mt-6 divide-y divide-ink/14 border-y border-ink/14">
                {cabinet.methodology.steps.map((step) => (
                  <li key={step.step} className="py-6 sm:grid sm:grid-cols-12 sm:gap-6">
                    <span className="font-editorial text-3xl text-amber-ink tabular-nums sm:col-span-2">
                      {step.step}
                    </span>
                    <div className="mt-2 min-w-0 sm:col-span-10 sm:mt-0">
                      <h3 className="font-editorial text-2xl text-ink">{step.title}</h3>
                      <p className="mt-1 text-xs font-semibold text-amber-ink">{step.subtitle}</p>
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* PARCOURS DE LA DIRIGEANTE */}
      <section
        id="laurentine-mvondo"
        aria-labelledby="heading-parcours-dirigeante"
        className="bg-midnight py-16 text-on-midnight sm:py-24"
      >
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
            <div className="mx-auto w-full max-w-xs lg:col-span-4 lg:mx-0">
              <figure className="border border-on-midnight/16 bg-midnight-surface p-4">
                <div className="editorial-photo-frame aspect-[188/290] w-full">
                  <picture>
                    <source srcSet={cabinet.founder.photo.webp} type="image/webp" />
                    <img
                      src={cabinet.founder.photo.jpg}
                      alt={cabinet.founder.photo.alt}
                      width={cabinet.founder.photo.width}
                      height={cabinet.founder.photo.height}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </picture>
                </div>
                <figcaption className="mt-4 border-t border-on-midnight/12 pt-3 text-xs text-on-midnight-muted">
                  <span className="block font-semibold text-on-midnight">
                    {cabinet.founder.name}
                  </span>
                  <span>{cabinet.founder.role}</span>
                  <span className="mt-1 block text-gold">{cabinet.founder.degree}</span>
                </figcaption>
              </figure>
            </div>

            <div className="min-w-0 lg:col-span-8">
              <p className="editorial-caption text-gold">{ui.aboutPage.founderKicker}</p>
              <h2
                id="heading-parcours-dirigeante"
                className="mt-4 text-section-display text-on-midnight"
              >
                {ui.aboutPage.founderHeading}
              </h2>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-on-midnight-muted">
                {cabinet.founder.extendedBio.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              <div className="mt-10 border-t border-on-midnight/14 pt-8">
                <h3 className="font-editorial text-2xl text-gold">
                  {cabinet.values.programs.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-on-midnight-muted">
                  {cabinet.values.programs.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALEURS & IMPLANTATIONS */}
      <section className="bg-ivory py-16 text-ink sm:py-24">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <p className="editorial-caption text-amber-ink">{ui.aboutPage.valuesKicker}</p>
          <h2 className="mt-3 text-section-display text-ink">
            {ui.aboutPage.valuesHeading}
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {cabinet.values.items.map((item) => (
              <div key={item.code} className="min-w-0 border-t border-ink/20 pt-6">
                <span className="text-xs font-semibold tabular-nums text-amber-ink">
                  {item.code}
                </span>
                <h3 className="mt-2 font-editorial text-2xl text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 border-t border-ink/15 pt-14 sm:mt-20 md:grid-cols-2">
            {implantationsData.offices.map((office) => (
              <div
                key={office.slug}
                className="group flex flex-col justify-between border border-ink/15 bg-ivory-surface p-6 sm:p-7"
              >
                <div>
                  <div className="mb-5 aspect-video w-full overflow-hidden border border-ink/12 bg-midnight">
                    <img
                      src={
                        office.slug === 'yaounde'
                          ? '/assets/photos/office-yaounde-warda.jpg'
                          : '/assets/photos/office-douala-bonanjo.jpg'
                      }
                      alt={`${cabinet.brand.name} — ${office.city} (${office.building})`}
                      width={1600}
                      height={900}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <p className="editorial-caption text-amber-ink">{office.role}</p>
                  <h3 className="mt-2 font-editorial text-3xl text-ink">{office.city}</h3>
                  <p className="mt-2 text-sm font-semibold text-ink">{office.building}</p>
                  <p className="text-xs text-ink-muted">{office.district}</p>
                </div>
                <div className="mt-6">
                  <AppLink
                    href={`/${office.slug}`}
                    className="editorial-link text-xs font-semibold text-ink hover:text-amber-ink"
                  >
                    <span>
                      {ui.aboutPage.accessInfoPrefix} {office.city}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-amber-ink" aria-hidden="true" />
                  </AppLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactBanner />
    </>
  );
}

export function LocalOfficePage({ citySlug }: { citySlug: 'yaounde' | 'douala' }) {
  const { ui, cabinet, services, getOfficeBySlug } = useI18n();
  const office = getOfficeBySlug(citySlug);
  const otherOffice = getOfficeBySlug(citySlug === 'yaounde' ? 'douala' : 'yaounde');

  return (
    <>
      <section className="bg-midnight pt-32 pb-16 text-on-midnight sm:pt-40 sm:pb-24">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <Breadcrumbs
            tone="light"
            items={[{ label: ui.nav.home, href: '/' }, { label: office.city }]}
          />
          <p className="editorial-caption text-gold">
            {office.role} · {office.region}
          </p>
          <SplitReveal
            text={office.seo.h1}
            as="h1"
            mode="words"
            className="mt-4 max-w-4xl text-section-display text-on-midnight"
          />
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-on-midnight-muted sm:text-lg">
            {office.building} — {office.district}. {ui.localPage.introPrefix}
          </p>
        </div>
      </section>

      {/* COORDONNÉES NAP, PHOTO PLACEHOLDER ÉDITORIAL & CARTE VECTORIELLE */}
      <section className="bg-ivory py-16 text-ink sm:py-24">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="min-w-0 space-y-6 lg:col-span-6">
              <h2 className="text-subsection-display text-ink">
                {ui.localPage.proximityHeadingPrefix} {office.city}
              </h2>
              {office.presentation.map((p, idx) => (
                <p key={idx} className="text-base leading-relaxed text-ink-muted">
                  {p}
                </p>
              ))}

              <div className="border-t border-ink/15 pt-6">
                <h3 className="editorial-caption text-amber-ink">
                  {ui.localPage.frequentMissionsPrefix} {office.city}
                </h3>
                <ul className="mt-4 space-y-2.5 text-sm text-ink">
                  {office.keyFocusAreas.map((item, idx) => (
                    <li key={idx} className="flex items-baseline gap-3">
                      <span className="text-amber-ink tabular-nums">0{idx + 1}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <figure className="group border border-ink/15 bg-ivory-surface p-3">
                <div className="relative aspect-video w-full overflow-hidden bg-midnight">
                  <img
                    src={
                      office.slug === 'yaounde'
                        ? '/assets/photos/office-yaounde-warda.jpg'
                        : '/assets/photos/office-douala-bonanjo.jpg'
                    }
                    alt={`${cabinet.brand.name} — ${office.city} (${office.building})`}
                    width={1600}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <figcaption className="mt-3 flex items-center justify-between text-xs text-ink-muted">
                  <span>{office.missingPhotoCaption}</span>
                  <span className="font-semibold text-amber-ink">{office.city}</span>
                </figcaption>
              </figure>
            </div>

            <div className="min-w-0 space-y-8 lg:col-span-6">
              <div className="border border-ink/15 bg-ivory-surface p-6 sm:p-9">
                <h2 className="editorial-caption text-amber-ink">
                  {ui.localPage.coordinatesHeadingPrefix} {office.city}
                </h2>
                <dl className="mt-6 divide-y divide-ink/12 text-sm">
                  <div className="py-3.5 first:pt-0">
                    <dt className="flex items-center gap-2 font-semibold text-ink">
                      <MapPin className="h-4 w-4 text-amber-ink" aria-hidden="true" />
                      <span>{ui.localPage.addressLabel}</span>
                    </dt>
                    <dd className="mt-1 pl-6 text-ink-muted">
                      {cabinet.brand.name} — {office.building}, {office.district}, {office.city},
                      Cameroun
                    </dd>
                  </div>

                  <div className="py-3.5">
                    <dt className="flex items-center gap-2 font-semibold text-ink">
                      <Phone className="h-4 w-4 text-amber-ink" aria-hidden="true" />
                      <span>{ui.localPage.phonesLabel}</span>
                    </dt>
                    <dd className="mt-1 flex flex-wrap gap-4 pl-6">
                      {office.phones.map((ph) => (
                        <a
                          key={ph.tel}
                          href={`tel:${ph.tel}`}
                          className="editorial-link font-semibold text-ink hover:text-amber-ink"
                        >
                          {ph.display}
                        </a>
                      ))}
                    </dd>
                  </div>

                  <div className="py-3.5">
                    <dt className="flex items-center gap-2 font-semibold text-ink">
                      <Mail className="h-4 w-4 text-amber-ink" aria-hidden="true" />
                      <span>{ui.localPage.emailLabel}</span>
                    </dt>
                    <dd className="mt-1 pl-6">
                      <a
                        href={`mailto:${office.email}`}
                        className="editorial-link text-ink hover:text-amber-ink"
                      >
                        {office.email}
                      </a>
                    </dd>
                  </div>

                  <div className="py-3.5 last:pb-0">
                    <dt className="font-semibold text-ink">{ui.localPage.receptionLabel}</dt>
                    <dd className="mt-1 text-ink-muted">{office.schedule}</dd>
                  </div>
                </dl>

                <p className="mt-5 border-t border-ink/12 pt-4 text-xs leading-relaxed text-ink-muted">
                  {office.accessNote}
                </p>
              </div>

              <CityLocatorMap office={office} />
            </div>
          </div>
        </div>
      </section>

      {/* RAPPEL DES SERVICES DISPONIBLES DANS CETTE VILLE */}
      <section className="border-t border-ink/14 bg-ivory-surface py-16 text-ink sm:py-24">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="editorial-caption text-amber-ink">
                {ui.localPage.availableServicesKicker}
              </p>
              <h2 className="mt-3 text-section-display text-ink">
                {ui.localPage.availableServicesHeadingPrefix} {office.city}
              </h2>
            </div>
            <AppLink
              href={`/${otherOffice.slug}`}
              className="editorial-link text-sm font-semibold text-ink hover:text-amber-ink"
            >
              <span>
                {ui.localPage.seeOtherOfficePrefix} {otherOffice.city}
              </span>
              <ArrowUpRight className="h-4 w-4 text-amber-ink" aria-hidden="true" />
            </AppLink>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <AppLink
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group flex min-w-0 flex-col justify-between border border-ink/15 bg-ivory p-6 transition-colors hover:border-amber-ink"
              >
                <div>
                  <span className="text-xs font-semibold text-amber-ink tabular-nums">
                    {s.number}
                  </span>
                  <h3 className="mt-2 font-editorial text-2xl text-ink group-hover:text-amber-ink">
                    {s.shortTitle}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted">{s.summary}</p>
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-ink">
                  <span>{ui.localPage.serviceDetailLink}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-amber-ink" aria-hidden="true" />
                </span>
              </AppLink>
            ))}
          </div>
        </div>
      </section>

      <ContactBanner
        heading={`${ui.localPage.bannerHeadingPrefix} ${office.city}`}
      />
    </>
  );
}
