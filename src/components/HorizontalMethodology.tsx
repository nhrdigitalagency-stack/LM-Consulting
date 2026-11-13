import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useI18n } from '../lib/i18n';

/**
 * Version ordinateur (≥ 1024px) avec défilement horizontal piloté par le scroll.
 * Isolée dans un sous-composant dédié afin que `useScroll({ target: sectionRef })`
 * ne s'exécute que lorsque la section cible est effectivement montée dans le DOM.
 */
function HorizontalMethodologyDesktop() {
  const { cabinet, ui } = useI18n();
  const { methodology } = cabinet;
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-46%']);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="heading-demarche-desktop"
      className="relative h-[230vh] border-t border-on-midnight/14 bg-midnight text-on-midnight"
    >
      <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden py-16">
        <div className="mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <div className="flex items-end justify-between gap-12 border-b border-on-midnight/14 pb-8">
            <div className="max-w-2xl">
              <p className="editorial-caption text-gold">
                {methodology.sectionNumber} · {methodology.label}
              </p>
              <h2 id="heading-demarche-desktop" className="mt-3 text-section-display">
                {methodology.heading}
              </h2>
            </div>
            <p className="max-w-sm text-sm text-on-midnight-muted">{methodology.intro}</p>
          </div>

          <div className="mt-10">
            <motion.ol
              style={{ x }}
              className="flex w-[178%] gap-7 will-change-transform"
            >
              {methodology.steps.map((step) => (
                <li
                  key={step.step}
                  className="flex w-1/4 shrink-0 flex-col justify-between border border-on-midnight/16 bg-midnight-surface p-8"
                >
                  <div>
                    <div className="flex items-baseline justify-between border-b border-on-midnight/12 pb-4">
                      <span className="font-display text-5xl font-bold text-gold tabular-nums">
                        {step.step}
                      </span>
                      <span className="text-xs text-on-midnight-muted">
                        {ui.common.sequenceLabel} {step.step} / 04
                      </span>
                    </div>
                    <p className="mt-5 text-xs font-semibold text-gold">{step.subtitle}</p>
                    <h3 className="mt-2 text-subsection-display text-on-midnight">
                      {step.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-on-midnight-muted">
                      {step.description}
                    </p>
                  </div>
                  <div className="mt-10 border-t border-on-midnight/12 pt-4 text-xs text-on-midnight">
                    <span className="text-on-midnight-muted">
                      {ui.common.deliverableLabel} :{' '}
                    </span>
                    <span>{step.deliverable}</span>
                  </div>
                </li>
              ))}
            </motion.ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Section « Notre démarche » (4 étapes) :
 * - Sur ordinateur (≥ 1024px, sans reduced-motion) : défilement horizontal fluide piloté par le scroll vertical.
 * - Sur mobile/tablette et en mode reduced-motion / sans JS : empilement éditorial vertical lisible.
 */
export function HorizontalMethodologySection() {
  const { cabinet, ui } = useI18n();
  const { methodology } = cabinet;
  const prefersReduced = useReducedMotion();
  const [desktopPinEnabled, setDesktopPinEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || prefersReduced) {
      setDesktopPinEnabled(false);
      return;
    }
    const mq = window.matchMedia('(min-width: 1024px)');
    setDesktopPinEnabled(mq.matches);
    const handler = (e: MediaQueryListEvent) => setDesktopPinEnabled(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [prefersReduced]);

  if (desktopPinEnabled) {
    return <HorizontalMethodologyDesktop />;
  }

  return (
    <section
      aria-labelledby="heading-demarche"
      className="border-t border-on-midnight/14 bg-midnight py-20 text-on-midnight sm:py-28"
    >
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <p className="editorial-caption text-gold">
            {methodology.sectionNumber} · {methodology.label}
          </p>
          <h2 id="heading-demarche" className="mt-4 text-section-display">
            {methodology.heading}
          </h2>
          <p className="mt-4 text-base text-on-midnight-muted">{methodology.intro}</p>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {methodology.steps.map((step) => (
            <li
              key={step.step}
              className="flex min-w-0 flex-col justify-between border border-on-midnight/16 bg-midnight-surface p-6 sm:p-8"
            >
              <div>
                <div className="flex items-baseline justify-between border-b border-on-midnight/12 pb-4">
                  <span className="font-display text-4xl font-bold text-gold tabular-nums">
                    {step.step}
                  </span>
                  <span className="text-xs text-on-midnight-muted">{step.subtitle}</span>
                </div>
                <h3 className="mt-6 text-subsection-display text-on-midnight">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-on-midnight-muted">
                  {step.description}
                </p>
              </div>
              <div className="mt-8 border-t border-on-midnight/12 pt-4 text-xs text-gold">
                {ui.common.deliverableLabel} : {step.deliverable}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
