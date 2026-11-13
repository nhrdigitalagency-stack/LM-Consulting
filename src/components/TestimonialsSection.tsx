import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Quote } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { AppLink } from '../lib/router';
import { EditorialReveal } from './MotionPrimitives';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * Section Témoignages & Retours d'expérience clients :
 * combine un carrousel vedette animé et une grille de sélection directe 100 % responsive.
 */
export function TestimonialsSection() {
  const { ui, testimonials } = useI18n();
  const prefersReduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  if (!testimonials || testimonials.length === 0) return null;

  const total = testimonials.length;
  const activeItem = testimonials[activeIndex] ?? testimonials[0];

  const handleSelect = (nextIdx: number) => {
    if (nextIdx === activeIndex) return;
    setDirection(nextIdx > activeIndex ? 1 : -1);
    setActiveIndex(nextIdx);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % total);
  };

  return (
    <section
      aria-labelledby="heading-testimonials"
      className="border-t border-on-midnight/14 bg-midnight py-16 text-on-midnight sm:py-24"
    >
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        {/* En-tête + contrôles carrousel */}
        <EditorialReveal>
          <div className="flex flex-col gap-6 border-b border-on-midnight/15 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="editorial-caption text-gold">
                {ui.testimonialsSection.sectionNumber} · {ui.testimonialsSection.label}
              </p>
              <h2
                id="heading-testimonials"
                className="mt-4 text-section-display text-on-midnight"
              >
                {ui.testimonialsSection.heading}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-on-midnight-muted sm:text-base">
                {ui.testimonialsSection.intro}
              </p>
            </div>

            <div className="flex items-center gap-3 self-start lg:self-end">
              <span className="mr-2 text-xs font-semibold tabular-nums text-on-midnight-muted">
                0{activeIndex + 1} / 0{total}
              </span>
              <button
                type="button"
                onClick={handlePrev}
                aria-label={ui.testimonialsSection.prevAria}
                className="inline-flex h-11 w-11 items-center justify-center border border-on-midnight/25 text-on-midnight transition-colors duration-150 hover:border-gold hover:bg-gold hover:text-on-midnight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label={ui.testimonialsSection.nextAria}
                className="inline-flex h-11 w-11 items-center justify-center border border-gold bg-gold text-on-midnight transition-colors duration-150 hover:bg-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </EditorialReveal>

        {/* Scène principale du carrousel */}
        <div className="mt-10 overflow-hidden border border-on-midnight/16 bg-midnight-surface">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={activeItem.id}
              initial={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction * 28 }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction * -28 }
              }
              transition={{ duration: 0.34, ease: EASE_OUT }}
              className="grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Colonne résultat chiffré & contexte entreprise */}
              <div className="flex flex-col justify-between border-b border-on-midnight/14 p-6 sm:p-8 lg:col-span-4 lg:border-r lg:border-b-0 lg:p-10">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-on-midnight-muted">
                    <span>{activeItem.sector}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeItem.city}</span>
                  </div>

                  <p className="mt-6 text-metric-figure text-gold">
                    {activeItem.metricValue}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-on-midnight">
                    {activeItem.metricContext}
                  </p>
                </div>

                <div className="mt-8 border-t border-on-midnight/14 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.06em] text-gold">
                    {ui.testimonialsSection.beforeLabel}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-on-midnight-muted">
                    {activeItem.beforeState}
                  </p>
                </div>
              </div>

              {/* Colonne citation & attribution dirigeant */}
              <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-8 lg:p-10">
                <div>
                  <Quote
                    className="h-7 w-7 text-gold/80"
                    aria-hidden="true"
                  />
                  <blockquote className="mt-5 font-display text-lg font-medium leading-relaxed text-on-midnight sm:text-2xl">
                    «{'\u00A0'}
                    {activeItem.quote}
                    {'\u00A0'}»
                  </blockquote>
                </div>

                <div className="mt-8 flex flex-col gap-5 border-t border-on-midnight/14 pt-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-base font-semibold text-on-midnight">
                      {activeItem.authorName}
                    </p>
                    <p className="mt-0.5 text-xs text-on-midnight-muted">
                      {activeItem.authorRole} · {activeItem.company}
                    </p>
                  </div>

                  <AppLink
                    href={`/contact?service=${encodeURIComponent(activeItem.serviceSlug)}`}
                    className="editorial-link text-xs font-semibold whitespace-nowrap text-gold hover:text-on-midnight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:text-sm"
                  >
                    <span>{ui.testimonialsSection.serviceLinkLabel}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </AppLink>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        {/* Grille de sélection rapide des 4 retours clients */}
        <div
          role="tablist"
          aria-label={ui.testimonialsSection.label}
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {testimonials.map((item, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelect(idx)}
                className={`interactive-card relative flex min-w-0 flex-col justify-between border p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                  isSelected
                    ? 'border-gold bg-midnight-elevated text-on-midnight'
                    : 'border-on-midnight/14 bg-midnight-surface/65 text-on-midnight-muted hover:border-on-midnight/35 hover:text-on-midnight'
                }`}
              >
                {isSelected && !prefersReduced && (
                  <motion.span
                    layoutId="testimonial-active-rule"
                    aria-hidden="true"
                    className="absolute top-0 right-0 left-0 h-[2px] bg-gold"
                  />
                )}
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-semibold tabular-nums text-gold">
                      0{idx + 1}
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-on-midnight">
                      {item.metricValue}
                    </span>
                  </div>
                  <p className="mt-2.5 text-sm font-semibold text-on-midnight">
                    {item.company}
                  </p>
                  <p className="mt-1 text-xs text-on-midnight-muted">
                    {item.serviceLabel}
                  </p>
                </div>
                <p className="mt-4 text-[11px] text-on-midnight-muted">
                  {item.city}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
