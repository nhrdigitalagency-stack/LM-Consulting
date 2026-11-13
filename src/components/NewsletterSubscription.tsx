import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, Mail } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { AppLink } from '../lib/router';
import { EditorialReveal } from './MotionPrimitives';

/**
 * Formulaire d'inscription à la veille finance d'entreprise & fiscalité (connecté à POST /api/newsletter).
 */
export function NewsletterSubscription() {
  const { ui, locale } = useI18n();
  const prefersReduced = useReducedMotion();
  const [email, setEmail] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'submitting') return;

    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error');
      setFeedback(ui.newsletterSection.invalidEmail);
      return;
    }

    setStatus('submitting');
    setFeedback('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          locale,
          companyWebsite,
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        alreadySubscribed?: boolean;
        message?: string;
      };

      if (!response.ok || !payload.ok) {
        setStatus('error');
        setFeedback(payload.message ?? ui.newsletterSection.errorFallback);
        return;
      }

      setStatus('success');
      setFeedback(
        payload.alreadySubscribed
          ? ui.newsletterSection.alreadySubscribed
          : ui.newsletterSection.successMessage
      );
      setEmail('');
    } catch {
      setStatus('error');
      setFeedback(ui.newsletterSection.errorFallback);
    }
  };

  return (
    <section
      aria-labelledby="heading-newsletter"
      className="border-t border-on-midnight/14 bg-midnight-surface py-14 text-on-midnight sm:py-18"
    >
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <EditorialReveal className="grid grid-cols-1 gap-8 border border-on-midnight/16 bg-midnight p-6 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="min-w-0 lg:col-span-6">
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-gold" aria-hidden="true" />
              <p className="editorial-caption text-gold">{ui.newsletterSection.kicker}</p>
            </div>
            <h2
              id="heading-newsletter"
              className="mt-3 font-display text-2xl font-semibold leading-tight text-on-midnight sm:text-3xl"
            >
              {ui.newsletterSection.heading}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-on-midnight-muted">
              {ui.newsletterSection.subtitle}
            </p>
          </div>

          <div className="min-w-0 lg:col-span-6">
            {status === 'success' ? (
              <motion.div
                role="status"
                aria-live="polite"
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start justify-between gap-4 border border-gold/45 bg-midnight-elevated p-5 text-sm text-on-midnight"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-gold"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-on-midnight">
                      {ui.newsletterSection.successTitle}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-on-midnight-muted">
                      {feedback}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStatus('idle');
                    setFeedback('');
                  }}
                  className="shrink-0 text-xs font-semibold text-gold underline hover:text-amber"
                >
                  OK
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-3">
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="nl-company-website">Site web</label>
                  <input
                    id="nl-company-website"
                    name="companyWebsite"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <label htmlFor="newsletter-email" className="sr-only">
                    {ui.newsletterSection.emailLabel}
                  </label>
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') {
                        setStatus('idle');
                        setFeedback('');
                      }
                    }}
                    aria-invalid={status === 'error'}
                    aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
                    placeholder={ui.newsletterSection.emailPlaceholder}
                    className="min-h-12 flex-1 border border-on-midnight/25 bg-midnight-surface px-4 py-3 text-sm text-on-midnight placeholder:text-on-midnight-muted/70 focus:border-gold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold"
                  />
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    aria-busy={status === 'submitting'}
                    className="cta-primary inline-flex min-h-12 shrink-0 items-center justify-center gap-2 bg-gold px-6 py-3 text-sm font-semibold whitespace-nowrap text-on-midnight hover:bg-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-65"
                  >
                    <span>
                      {status === 'submitting'
                        ? ui.newsletterSection.submittingLabel
                        : ui.newsletterSection.subscribeLabel}
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </button>
                </div>

                {status === 'error' && feedback && (
                  <p id="newsletter-error" role="alert" className="text-xs font-medium text-gold">
                    {feedback}
                  </p>
                )}

                <p className="text-[11px] text-on-midnight-muted">
                  {ui.newsletterSection.privacyNote}{' '}
                  <AppLink
                    href="/politique-de-confidentialite"
                    className="underline hover:text-on-midnight"
                  >
                    {ui.common.privacyPolicy}
                  </AppLink>
                </p>
              </form>
            )}
          </div>
        </EditorialReveal>
      </div>
    </section>
  );
}
