import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight, Quote } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { AppLink } from '../lib/router';
import { ContactBanner } from '../components/ContactBanner';
import { FaqAccordion } from '../components/FaqAccordion';
import { HorizontalMethodologySection } from '../components/HorizontalMethodology';
import {
  AnimatedCounter,
  AnimatedRule,
  EditorialReveal,
  MagneticWrap,
  ScrollScrubText,
  SplitReveal,
  StaggerRevealGroup,
  StaggerRevealItem,
} from '../components/MotionPrimitives';
import { ServicesInteractiveList } from '../components/ServicesInteractiveList';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { NewsletterSubscription } from '../components/NewsletterSubscription';

export function HomePage() {
  const {
    locale,
    ui,
    cabinet,
    services,
    servicesSection,
    faqData,
    implantationsData,
  } = useI18n();
  const prefersReduced = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const plateParallaxY = useTransform(
    heroProgress,
    [0, 1],
    prefersReduced ? ['0px', '0px'] : ['0px', '42px']
  );

  const heroHookLines =
    locale === 'en' ? 'Structure.\nFinance.\nEndure.' : 'Structurer.\nFinancer.\nDurer.';

  const homeFaqItems = faqData.items.slice(0, 6);

  return (
    <>
      {/* HERO ÉDITORIAL ASYMÉTRIQUE AVEC FOND 16:9 ANIMÉ (BLEU MARINE, ORANGE, BLANC) */}
      <section
        ref={heroRef}
        className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-midnight pt-28 pb-10 text-on-midnight sm:pt-36 sm:pb-12 lg:pt-40"
      >
        {/* Fond 16:9 avec animation zoom fluide + voile bleu marine haute lisibilité */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <motion.div
            initial={prefersReduced ? { scale: 1 } : { scale: 1 }}
            animate={prefersReduced ? { scale: 1 } : { scale: [1, 1.075, 1] }}
            transition={
              prefersReduced
                ? undefined
                : { duration: 22, repeat: Infinity, ease: 'easeInOut' }
            }
            className="h-full w-full will-change-transform"
          >
            <img
              src="/assets/photos/hero-lm-consulting.jpg"
              alt=""
              width={1600}
              height={900}
              fetchPriority="high"
              className="h-full w-full object-cover object-center opacity-55"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1931]/95 via-[#0A1931]/82 to-[#0A1931]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1931] via-transparent to-[#0A1931]/55" />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-[90rem] grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:items-end lg:gap-10 lg:px-12">
          <div className="min-w-0 lg:col-span-8">
            <motion.h1
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs font-semibold tracking-[0.06em] text-gold sm:text-sm"
            >
              {cabinet.hero.h1}
            </motion.h1>

            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <SplitReveal
                text={heroHookLines}
                as="div"
                mode="lines"
                className="mt-5 text-hero-display text-on-midnight"
              />
            </motion.div>

            <motion.p
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.68, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 max-w-2xl text-base leading-relaxed text-on-midnight-muted sm:mt-8 sm:text-lg"
            >
              {cabinet.hero.subtitle}
            </motion.p>

            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10 sm:gap-5"
            >
              <MagneticWrap>
                <AppLink
                  href={cabinet.hero.primaryCta.href}
                  className="cta-primary inline-flex min-h-12 items-center justify-center gap-2.5 bg-gold px-6 py-3.5 text-sm font-semibold whitespace-nowrap text-on-midnight hover:bg-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:px-7"
                >
                  <span>{cabinet.hero.primaryCta.label}</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </AppLink>
              </MagneticWrap>

              <AppLink
                href={cabinet.hero.secondaryCta.href}
                className="editorial-link py-2 text-sm font-semibold whitespace-nowrap text-on-midnight hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              >
                <span>{cabinet.hero.secondaryCta.label}</span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              </AppLink>
            </motion.div>
          </div>

          {/* Monolithe architectural latéral dévoilé par clip-path + léger parallax */}
          <motion.div
            style={{ y: plateParallaxY }}
            initial={
              prefersReduced
                ? { opacity: 1 }
                : { clipPath: 'inset(12% 0% 0% 0%)', opacity: 0.88 }
            }
            animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="min-w-0 border border-on-midnight/16 bg-midnight-surface/95 p-6 backdrop-blur-xs sm:p-8 lg:col-span-4"
          >
            <div className="flex items-center justify-between border-b border-on-midnight/14 pb-5">
              <img
                src={cabinet.brand.logoFallbackPath}
                alt="Logo officiel du cabinet LM Consulting"
                width={64}
                height={53}
                fetchPriority="high"
                className="h-14 w-14 rounded-full object-cover"
              />
              <span className="editorial-caption text-gold">LM CONSULTING</span>
            </div>

            <p className="mt-6 font-display text-lg font-medium leading-snug text-on-midnight sm:text-xl">
              «{'\u00A0'}
              {cabinet.brand.engagement}
              {'\u00A0'}»
            </p>

            <dl className="mt-7 divide-y divide-on-midnight/14 border-t border-on-midnight/14 text-xs">
              <div className="flex items-baseline justify-between gap-4 py-3.5">
                <dt className="text-on-midnight-muted">{ui.common.headquartersYaounde}</dt>
                <dd className="text-right font-medium text-on-midnight">
                  Immeuble ADJAL Warda
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3.5">
                <dt className="text-on-midnight-muted">{ui.common.officeDouala}</dt>
                <dd className="text-right font-medium text-on-midnight">
                  Immeuble ONCPB, Bonanjo
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3.5">
                <dt className="text-on-midnight-muted">{ui.common.accountingStandard}</dt>
                <dd className="text-right font-semibold text-gold">
                  SYSCOHADA · DSF · CNPS
                </dd>
              </div>
            </dl>
          </motion.div>
        </div>

        {/* Indicateur de défilement sobre */}
        <div className="relative z-10 mx-auto mt-12 flex w-full max-w-[90rem] flex-wrap items-center justify-between gap-4 border-t border-on-midnight/14 px-5 pt-6 text-xs text-on-midnight-muted sm:mt-14 sm:px-8 lg:px-12">
          <span>{cabinet.hero.architecturalPlateCaption}</span>
          <a
            href="#positionnement"
            className="inline-flex items-center gap-2 text-on-midnight transition-colors hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            <span>{ui.common.scrollDown}</span>
            <ArrowDown className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* 01 · POSITIONNEMENT (GRAND TEXTE SCRUB + 3 REPÈRES SUR FOND BLANC) */}
      <section
        id="positionnement"
        aria-labelledby="heading-positionnement"
        className="bg-ivory py-16 text-ink sm:py-24 lg:py-32"
      >
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <EditorialReveal className="lg:col-span-3">
              <h2 id="heading-positionnement" className="editorial-caption text-amber-ink">
                {cabinet.positioning.sectionNumber} · {cabinet.positioning.label}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                {cabinet.positioning.supportingNote}
              </p>
            </EditorialReveal>

            <div className="min-w-0 lg:col-span-9">
              <ScrollScrubText
                text={cabinet.positioning.scrubStatement}
                className="text-editorial-scrub text-ink"
              />

              <AnimatedRule tone="ink" className="mt-14 sm:mt-16" />

              <StaggerRevealGroup className="grid grid-cols-1 gap-8 pt-10 sm:grid-cols-3">
                {cabinet.metrics.map((metric) => (
                  <StaggerRevealItem key={metric.id} className="min-w-0">
                    <p className="text-metric-figure text-ink">
                      {metric.prefix}
                      {metric.value}
                      {metric.suffix}
                    </p>
                    <p className="mt-3 text-sm font-semibold text-ink">{metric.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                      {metric.detail}
                    </p>
                  </StaggerRevealItem>
                ))}
              </StaggerRevealGroup>
            </div>
          </div>
        </div>
      </section>

      {/* 02 · SERVICES (TITRE STICKY À GAUCHE + LIGNES INTERACTIVES À DROITE) */}
      <section
        aria-labelledby="heading-services"
        className="border-t border-ink/14 bg-ivory py-16 text-ink sm:py-24"
      >
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
            <EditorialReveal className="min-w-0 lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
              <p className="editorial-caption text-amber-ink">
                {servicesSection.sectionNumber} · {servicesSection.label}
              </p>
              <h2 id="heading-services" className="mt-4 text-section-display text-ink">
                {servicesSection.heading}
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-ink-muted sm:text-base">
                {servicesSection.intro}
              </p>
              <div className="mt-8">
                <AppLink
                  href="/services"
                  className="editorial-link text-sm font-semibold text-ink hover:text-amber-ink"
                >
                  <span>{ui.common.allServicesLink}</span>
                  <ArrowUpRight className="h-4 w-4 text-amber-ink" aria-hidden="true" />
                </AppLink>
              </div>

              <motion.figure
                initial={
                  prefersReduced
                    ? { opacity: 1 }
                    : { clipPath: 'inset(10% 0% 10% 0%)', opacity: 0.85 }
                }
                whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
                viewport={{ once: true, margin: '-8% 0px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="group mt-10 border border-ink/15 bg-ivory-surface p-3"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-midnight">
                  <img
                    src="/assets/photos/advisory-meeting.jpg"
                    alt={
                      locale === 'en'
                        ? 'LM Consulting executive advisory and financial review session'
                        : 'Séance de conseil dirigeant et analyse financière chez LM Consulting'
                    }
                    width={1200}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-midnight/70 to-transparent"
                  />
                </div>
                <figcaption className="mt-2.5 flex items-center justify-between text-[11px] font-medium text-ink-muted">
                  <span>
                    {locale === 'en'
                      ? 'Executive briefings · Audit & Tax'
                      : 'Entretiens dirigeants · Audit & Fiscalité'}
                  </span>
                  <span className="font-semibold text-amber-ink">01 — 07</span>
                </figcaption>
              </motion.figure>
            </EditorialReveal>

            <div className="min-w-0 lg:col-span-8">
              <ServicesInteractiveList services={services} tone="ivory" />
            </div>
          </div>
        </div>
      </section>

      {/* 03 · POUR QUI ? (DIRIGEANTS DE PME, ENTREPRENEURS, PORTEURS DE PROJETS) */}
      <section
        aria-labelledby="heading-audiences"
        className="border-t border-ink/14 bg-ivory-surface py-16 text-ink sm:py-24"
      >
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <EditorialReveal className="max-w-3xl">
            <p className="editorial-caption text-amber-ink">
              {cabinet.audiences.sectionNumber} · {cabinet.audiences.label}
            </p>
            <h2 id="heading-audiences" className="mt-4 text-section-display text-ink">
              {cabinet.audiences.heading}
            </h2>
            <p className="mt-4 text-base text-ink-muted">{cabinet.audiences.intro}</p>
          </EditorialReveal>

          <StaggerRevealGroup className="mt-12 divide-y divide-ink/14 border-y border-ink/14 sm:mt-14 lg:grid lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {cabinet.audiences.profiles.map((profile) => (
              <StaggerRevealItem
                key={profile.number}
                className="flex min-w-0 flex-col justify-between py-8 lg:px-8 lg:py-10 first:lg:pl-0 last:lg:pr-0"
              >
                <div>
                  <span className="font-display text-2xl font-semibold text-amber-ink">
                    {profile.number}.
                  </span>
                  <h3 className="mt-3 text-subsection-display text-ink">{profile.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                    {profile.situation}
                  </p>
                  <p className="mt-4 border-t border-ink/12 pt-4 text-sm leading-relaxed text-ink">
                    {profile.intervention}
                  </p>
                </div>

                <div className="mt-8">
                  <AppLink
                    href={`/services/${profile.recommendedServiceSlug}`}
                    className="editorial-link text-xs font-semibold text-amber-ink hover:text-ink"
                  >
                    <span>{profile.recommendedServiceLabel}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  </AppLink>
                </div>
              </StaggerRevealItem>
            ))}
          </StaggerRevealGroup>
        </div>
      </section>

      {/* 04 · NOTRE DÉMARCHE (4 ÉTAPES HORIZONTALES AU SCROLL SUR DESKTOP, EMPILÉES SUR MOBILE) */}
      <HorizontalMethodologySection />

      {/* 05 · IMPACT & PROGRAMME DE FORMATION DES DIRIGEANTS (FOND BLEU MARINE) */}
      <section
        aria-labelledby="heading-impact"
        className="border-t border-on-midnight/14 bg-midnight-surface py-16 text-on-midnight sm:py-24"
      >
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <EditorialReveal className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div className="min-w-0 lg:col-span-5">
              <p className="editorial-caption text-gold">{ui.common.measuredImpactLabel}</p>
              <h2 id="heading-impact" className="mt-4 text-section-display text-on-midnight">
                {ui.common.measuredImpactHeading}
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-on-midnight-muted lg:col-span-7">
              {cabinet.values.programs.description}
            </p>
          </EditorialReveal>

          <StaggerRevealGroup className="mt-12 grid grid-cols-1 gap-10 border-y border-on-midnight/14 py-12 sm:mt-14 sm:grid-cols-3">
            {cabinet.metrics.map((metric) => (
              <StaggerRevealItem key={`impact-${metric.id}`} className="min-w-0">
                <AnimatedCounter
                  value={metric.value}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  className="text-metric-figure text-gold"
                />
                <p className="mt-3 text-base font-semibold text-on-midnight">
                  {metric.label}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-on-midnight-muted">
                  {metric.detail}
                </p>
              </StaggerRevealItem>
            ))}
          </StaggerRevealGroup>
        </div>
      </section>

      {/* 06 · VALEURS & VISION (FOND BLANC) */}
      <section
        aria-labelledby="heading-valeurs"
        className="bg-ivory py-16 text-ink sm:py-24"
      >
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <EditorialReveal className="min-w-0 lg:col-span-5">
              <p className="editorial-caption text-amber-ink">
                {cabinet.values.sectionNumber} · {cabinet.values.label}
              </p>
              <h2 id="heading-valeurs" className="mt-4 text-section-display text-ink">
                {cabinet.values.heading}
              </h2>
              <p className="mt-6 border-t border-ink/14 pt-6 text-sm leading-relaxed text-ink-muted">
                {cabinet.values.vision}
              </p>

              <motion.figure
                initial={
                  prefersReduced
                    ? { opacity: 1 }
                    : { clipPath: 'inset(8% 0% 8% 0%)', opacity: 0.88 }
                }
                whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
                viewport={{ once: true, margin: '-8% 0px' }}
                transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
                className="group mt-8 border border-ink/15 bg-ivory-surface p-3"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-midnight">
                  <img
                    src="/assets/photos/finance-strategy-desk.jpg"
                    alt={
                      locale === 'en'
                        ? 'Financial modeling dashboards and SME structuring reports at LM Consulting'
                        : 'Modélisation financière, tableaux de bord et dossiers de structuration PME chez LM Consulting'
                    }
                    width={1200}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <figcaption className="mt-2.5 flex items-center justify-between text-[11px] text-ink-muted">
                  <span>
                    {locale === 'en'
                      ? 'Financial modeling · DSF · Management control'
                      : 'Modélisation financière · DSF · Contrôle de gestion'}
                  </span>
                  <span className="font-semibold text-amber-ink">SYSCOHADA</span>
                </figcaption>
              </motion.figure>
            </EditorialReveal>

            <StaggerRevealGroup className="grid min-w-0 grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-7">
              {cabinet.values.items.map((val) => (
                <StaggerRevealItem
                  key={val.code}
                  className="interactive-card min-w-0 border-t border-ink/18 pt-6"
                >
                  <span className="font-sans text-xs font-semibold tabular-nums text-amber-ink">
                    {val.code}
                  </span>
                  <h3 className="mt-2 text-subsection-display text-ink">{val.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {val.description}
                  </p>
                </StaggerRevealItem>
              ))}
            </StaggerRevealGroup>
          </div>
        </div>
      </section>

      {/* 07 · IMPLANTATIONS YAOUNDÉ & DOUALA (FOND BLANC SURFACE) */}
      <section
        aria-labelledby="heading-implantations"
        className="border-t border-ink/14 bg-ivory-surface py-16 text-ink sm:py-24"
      >
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <EditorialReveal className="max-w-3xl">
            <p className="editorial-caption text-amber-ink">
              {implantationsData.sectionNumber} · {implantationsData.label}
            </p>
            <h2 id="heading-implantations" className="mt-4 text-section-display text-ink">
              {implantationsData.heading}
            </h2>
            <p className="mt-4 text-base text-ink-muted">{implantationsData.intro}</p>
          </EditorialReveal>

          <StaggerRevealGroup className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            {implantationsData.offices.map((office) => {
              const officeImg =
                office.slug === 'yaounde'
                  ? '/assets/photos/office-yaounde-warda.jpg'
                  : '/assets/photos/office-douala-bonanjo.jpg';
              const officeAlt =
                office.slug === 'yaounde'
                  ? locale === 'en'
                    ? 'LM Consulting Yaoundé Headquarters at ADJAL Building, Warda'
                    : 'Siège LM Consulting à Yaoundé, Immeuble ADJAL Warda'
                  : locale === 'en'
                  ? 'LM Consulting Douala office at ONCPB Building, Bonanjo'
                  : 'Bureau LM Consulting à Douala, Immeuble ONCPB Bonanjo';

              return (
                <StaggerRevealItem
                  key={office.slug}
                  className="interactive-card group flex min-w-0 flex-col justify-between border border-ink/15 bg-ivory p-6 sm:p-8"
                >
                  <div>
                    <div className="relative mb-6 aspect-video w-full overflow-hidden border border-ink/12 bg-midnight">
                      <img
                        src={officeImg}
                        alt={officeAlt}
                        width={1600}
                        height={900}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 bg-midnight/90 px-3 py-1 text-[10px] font-semibold tracking-wider text-gold uppercase">
                        {office.region}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink/12 pb-4">
                      <span className="editorial-caption text-amber-ink">{office.role}</span>
                      <span className="text-xs text-ink-muted">{office.city}</span>
                    </div>
                    <h3 className="mt-5 font-display text-3xl font-semibold text-ink sm:text-4xl">
                      {office.city}
                    </h3>
                    <p className="mt-3 text-base font-semibold text-ink">{office.building}</p>
                    <p className="mt-1 text-sm text-ink-muted">{office.district}</p>
                    <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                      {office.presentation[0]}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-ink/12 pt-5">
                    <AppLink
                      href={`/${office.slug}`}
                      className="editorial-link text-sm font-semibold text-ink hover:text-amber-ink"
                    >
                      <span>
                        {ui.common.viewOfficeIn} {office.city}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-amber-ink" aria-hidden="true" />
                    </AppLink>
                    <a
                      href={office.googleMapsSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-ink-muted underline hover:text-ink"
                    >
                      {ui.common.googleMapsDirections}
                    </a>
                  </div>
                </StaggerRevealItem>
              );
            })}
          </StaggerRevealGroup>
        </div>
      </section>

      {/* 08 · TÉMOIGNAGES CLIENTS & CAS CONCRETS (CARROUSEL + GRILLE SUR FOND BLEU MARINE) */}
      <TestimonialsSection />

      {/* 09 · LA DIRIGEANTE (PORTRAIT RÉEL + EXTRAIT DE PARCOURS SUR FOND BLANC) */}
      <section
        aria-labelledby="heading-dirigeante"
        className="bg-ivory py-16 text-ink sm:py-24"
      >
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <motion.div
              initial={
                prefersReduced
                  ? { opacity: 1 }
                  : { clipPath: 'inset(10% 0% 10% 0%)', opacity: 0.88 }
              }
              whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto w-full max-w-xs lg:col-span-4 lg:mx-0"
            >
              <figure className="border border-ink/16 bg-ivory-surface p-4">
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
                <figcaption className="mt-4 border-t border-ink/12 pt-3 text-xs text-ink-muted">
                  <span className="block font-semibold text-ink">
                    {cabinet.founder.name}
                  </span>
                  <span>{cabinet.founder.role}</span>
                </figcaption>
              </figure>
            </motion.div>

            <EditorialReveal className="min-w-0 lg:col-span-8">
              <p className="editorial-caption text-amber-ink">
                09 · {cabinet.founder.label}
              </p>
              <h2 id="heading-dirigeante" className="mt-4 text-section-display text-ink">
                {ui.common.founderHeading}
              </h2>
              <div className="mt-6 border-y border-ink/14 py-6">
                <Quote className="h-6 w-6 text-gold" aria-hidden="true" />
                <blockquote className="mt-3 font-display text-xl font-medium leading-snug text-ink sm:text-2xl">
                  «{'\u00A0'}
                  {cabinet.founder.quote}
                  {'\u00A0'}»
                </blockquote>
              </div>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted">
                {cabinet.founder.shortBio}
              </p>
              <p className="mt-3 text-xs font-medium text-ink-muted">
                {cabinet.founder.degree}
              </p>

              <div className="mt-8">
                <AppLink
                  href="/a-propos"
                  className="editorial-link text-sm font-semibold text-ink hover:text-amber-ink"
                >
                  <span>{ui.common.discoverFirmAndFounder}</span>
                  <ArrowUpRight className="h-4 w-4 text-amber-ink" aria-hidden="true" />
                </AppLink>
              </div>
            </EditorialReveal>
          </div>
        </div>
      </section>

      {/* 10 · QUESTIONS FRÉQUENTES (FOND BLANC SURFACE + LIEN VERS PAGE FAQ COMPLÈTE) */}
      <section
        aria-labelledby="heading-faq"
        className="border-t border-ink/14 bg-ivory-surface py-16 text-ink sm:py-24"
      >
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <EditorialReveal className="min-w-0 lg:col-span-4">
              <p className="editorial-caption text-amber-ink">
                10 · {faqData.label}
              </p>
              <h2 id="heading-faq" className="mt-4 text-section-display text-ink">
                {faqData.heading}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                {ui.common.faqSideNote}
              </p>
              <div className="mt-8">
                <AppLink
                  href="/faq"
                  className="cta-primary inline-flex min-h-11 items-center gap-2 border border-ink bg-midnight px-5 py-2.5 text-xs font-semibold whitespace-nowrap text-on-midnight hover:bg-midnight-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:text-sm"
                >
                  <span>{ui.common.viewAllFaq}</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                </AppLink>
              </div>
            </EditorialReveal>

            <div className="min-w-0 lg:col-span-8">
              <FaqAccordion items={homeFaqItems} tone="ivory" />
            </div>
          </div>
        </div>
      </section>

      {/* 11 · VEILLE FINANCE D'ENTREPRISE & FISCALITÉ */}
      <NewsletterSubscription />

      {/* BANDEAU DE CONTACT */}
      <ContactBanner />
    </>
  );
}
