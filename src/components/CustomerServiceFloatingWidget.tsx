import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowUpRight,
  CheckCircle2,
  Headset,
  Mail,
  MessageCircle,
  Phone,
  X,
} from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { AppLink } from '../lib/router';

export function CustomerServiceFloatingWidget() {
  const { ui, cabinet, locale } = useI18n();
  const prefersReduced = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'channels' | 'callback'>('channels');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const whatsappHref = `${cabinet.contact.whatsappUrl}?text=${encodeURIComponent(
    ui.customerService.whatsappPrefill
  )}`;

  const handleQuickSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitState === 'sending') return;

    setErrorMsg('');
    const trimmedMsg =
      message.trim().length >= 20
        ? message.trim()
        : `${message.trim()} — [Demande Service Client / Rappel souhaité]`;

    if (fullName.trim().length < 2 || phone.trim().length < 8 || !email.includes('@')) {
      setSubmitState('error');
      setErrorMsg(
        locale === 'en'
          ? 'Please enter a valid name, phone number, and email address.'
          : 'Veuillez renseigner votre nom, un numéro valide et votre adresse e-mail.'
      );
      return;
    }

    setSubmitState('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          company: 'Service Client Rapide',
          city: 'Yaoundé',
          serviceSlug: 'autre-besoin',
          message: trimmedMsg,
          companyWebsite: '',
        }),
      });

      const payload = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !payload.ok) {
        setSubmitState('error');
        setErrorMsg(
          payload.message ??
            (locale === 'en'
              ? 'Unable to send right now. Please call us directly.'
              : 'Envoi impossible pour le moment. Vous pouvez nous appeler directement.')
        );
        return;
      }

      setSubmitState('success');
      setFullName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch {
      setSubmitState('error');
      setErrorMsg(
        locale === 'en'
          ? 'Connection error. Please reach us via WhatsApp or phone.'
          : 'Erreur de connexion. Merci de nous joindre sur WhatsApp ou par téléphone.'
      );
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            id="fenetre-service-client"
            role="dialog"
            aria-modal="false"
            aria-label={ui.customerService.badge}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mb-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden border-2 border-midnight bg-ivory text-ink shadow-2xl sm:w-96"
          >
            {/* En-tête Bleu Marine & Orange */}
            <div className="border-b border-on-midnight/15 bg-midnight p-4 text-on-midnight sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/80 bg-[#000000]">
                    <img
                      src="/assets/photos/logo-lm-consulting.png"
                      alt="LM Consulting"
                      width={44}
                      height={44}
                      className="h-full w-full scale-110 object-cover"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-gold">
                      {ui.customerService.badge}
                    </p>
                    <h2 className="mt-0.5 font-editorial text-xl leading-tight text-on-midnight">
                      {ui.customerService.heading}
                    </h2>
                  </div>
                </div>

                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }}
                  aria-label={ui.customerService.closeAria}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-on-midnight/20 text-on-midnight transition-colors hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <p className="mt-2.5 text-xs leading-relaxed text-on-midnight-muted">
                {ui.customerService.subtitle}
              </p>

              {/* Onglets de mode : Canaux directs / Demande rapide */}
              <div className="mt-4 grid grid-cols-2 gap-1 border border-on-midnight/20 bg-midnight-surface p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('channels')}
                  className={`min-h-9 px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeTab === 'channels'
                      ? 'bg-gold text-on-midnight'
                      : 'text-on-midnight-muted hover:text-on-midnight'
                  }`}
                >
                  {ui.customerService.tabChannels}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('callback');
                    setSubmitState('idle');
                  }}
                  className={`min-h-9 px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeTab === 'callback'
                      ? 'bg-gold text-on-midnight'
                      : 'text-on-midnight-muted hover:text-on-midnight'
                  }`}
                >
                  {ui.customerService.tabCallback}
                </button>
              </div>
            </div>

            {/* Contenu de l'onglet actif */}
            <div className="p-4 sm:p-5">
              {activeTab === 'channels' ? (
                <div className="space-y-3">
                  {/* Action principale WhatsApp */}
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 border border-gold bg-gold px-4 py-3 text-on-midnight transition-colors hover:bg-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-midnight"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold">
                          {ui.customerService.whatsappTitle}
                        </p>
                        <p className="text-[11px] text-on-midnight/90">
                          {cabinet.contact.phones[0].display}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </a>

                  {/* Lignes téléphoniques */}
                  <div className="divide-y divide-ink/12 border border-ink/15 bg-ivory-surface">
                    <a
                      href={`tel:${cabinet.contact.phones[0].tel}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 text-xs transition-colors hover:bg-ivory"
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <Phone className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                        <span className="min-w-0">
                          <span className="block font-semibold text-ink">
                            {ui.customerService.callYaoundeTitle}
                          </span>
                          <span className="text-ink-muted">
                            {cabinet.contact.phones[0].display}
                          </span>
                        </span>
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-gold" aria-hidden="true" />
                    </a>

                    <a
                      href={`tel:${cabinet.contact.phones[1].tel}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 text-xs transition-colors hover:bg-ivory"
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <Phone className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                        <span className="min-w-0">
                          <span className="block font-semibold text-ink">
                            {ui.customerService.callSecondaryTitle}
                          </span>
                          <span className="text-ink-muted">
                            {cabinet.contact.phones[1].display}
                          </span>
                        </span>
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-gold" aria-hidden="true" />
                    </a>

                    <a
                      href={`mailto:${cabinet.contact.email}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 text-xs transition-colors hover:bg-ivory"
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                        <span className="min-w-0">
                          <span className="block font-semibold text-ink">
                            {ui.customerService.emailDirectTitle}
                          </span>
                          <span className="block truncate text-ink-muted">
                            {cabinet.contact.email}
                          </span>
                        </span>
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-gold" aria-hidden="true" />
                    </a>
                  </div>

                  <p className="pt-1 text-center text-[11px] text-ink-muted">
                    {ui.customerService.officesHoursNote}
                  </p>
                </div>
              ) : (
                <div>
                  {submitState === 'success' ? (
                    <div
                      role="status"
                      className="space-y-3 border border-ink/15 bg-ivory-surface p-4 text-xs text-ink"
                    >
                      <div className="flex items-center gap-2 font-semibold text-amber-ink">
                        <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{ui.customerService.quickSuccess}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSubmitState('idle')}
                        className="inline-flex min-h-9 items-center justify-center bg-midnight px-4 py-2 text-xs font-semibold text-on-midnight hover:bg-midnight-elevated"
                      >
                        OK
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleQuickSubmit} className="space-y-3" noValidate>
                      <p className="text-xs leading-relaxed text-ink-muted">
                        {ui.customerService.quickFormIntro}
                      </p>

                      {submitState === 'error' && errorMsg && (
                        <p role="alert" className="text-xs font-medium text-amber-ink">
                          {errorMsg}
                        </p>
                      )}

                      <div>
                        <label htmlFor="cs-name" className="sr-only">
                          {ui.customerService.namePlaceholder}
                        </label>
                        <input
                          id="cs-name"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={ui.customerService.namePlaceholder}
                          className="min-h-10 w-full border border-ink/25 bg-ivory px-3 py-2 text-xs text-ink placeholder:text-ink-muted/70 focus:border-midnight focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        <div>
                          <label htmlFor="cs-phone" className="sr-only">
                            {ui.customerService.phonePlaceholder}
                          </label>
                          <input
                            id="cs-phone"
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={ui.customerService.phonePlaceholder}
                            className="min-h-10 w-full border border-ink/25 bg-ivory px-3 py-2 text-xs text-ink placeholder:text-ink-muted/70 focus:border-midnight focus:outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor="cs-email" className="sr-only">
                            {ui.customerService.emailPlaceholder}
                          </label>
                          <input
                            id="cs-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={ui.customerService.emailPlaceholder}
                            className="min-h-10 w-full border border-ink/25 bg-ivory px-3 py-2 text-xs text-ink placeholder:text-ink-muted/70 focus:border-midnight focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="cs-msg" className="sr-only">
                          {ui.customerService.messagePlaceholder}
                        </label>
                        <textarea
                          id="cs-msg"
                          rows={2}
                          required
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={ui.customerService.messagePlaceholder}
                          className="w-full border border-ink/25 bg-ivory p-3 text-xs text-ink placeholder:text-ink-muted/70 focus:border-midnight focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitState === 'sending'}
                        className="inline-flex min-h-10 w-full items-center justify-center gap-2 bg-gold px-4 py-2.5 text-xs font-semibold whitespace-nowrap text-on-midnight transition-colors hover:bg-amber disabled:opacity-60"
                      >
                        <span>
                          {submitState === 'sending'
                            ? ui.customerService.sendingQuickBtn
                            : ui.customerService.sendQuickBtn}
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      </button>
                    </form>
                  )}
                </div>
              )}

              <div className="mt-3 border-t border-ink/12 pt-3 text-center">
                <AppLink
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="editorial-link text-[11px] font-semibold text-ink hover:text-amber-ink"
                >
                  <span>{ui.customerService.fullContactLink}</span>
                  <ArrowUpRight className="h-3 w-3 text-gold" aria-hidden="true" />
                </AppLink>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Bouton flottant Service Client permanent en bas à droite */}
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="fenetre-service-client"
        aria-label={ui.customerService.triggerAria}
        onClick={() => setIsOpen((prev) => !prev)}
        className="group inline-flex min-h-12 items-center gap-3 border-2 border-gold bg-midnight px-4 py-2.5 text-xs font-semibold whitespace-nowrap text-on-midnight shadow-xl transition-colors hover:bg-midnight-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:px-5 sm:py-3 sm:text-sm"
      >
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center bg-gold text-on-midnight transition-transform group-hover:scale-105">
          {isOpen ? (
            <X className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Headset className="h-4 w-4" aria-hidden="true" />
          )}
        </span>
        <span>{ui.customerService.triggerLabel}</span>
      </button>
    </div>
  );
}
