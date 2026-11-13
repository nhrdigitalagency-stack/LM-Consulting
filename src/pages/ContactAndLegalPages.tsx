import React, { useEffect, useState } from 'react';
import { ArrowUpRight, CheckCircle2, MessageCircle, Phone } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { AppLink, useRouter } from '../lib/router';
import {
  ALLOWED_SERVICE_SLUGS,
  contactFormSchema,
  type ContactFormInput,
} from '../lib/validation';
import { Breadcrumbs } from '../components/BrandMarks';
import { SplitReveal } from '../components/MotionPrimitives';

type FieldErrors = Partial<Record<keyof ContactFormInput, string>>;

export function ContactPage() {
  const { search } = useRouter();
  const { locale, ui, cabinet, services, implantationsData } = useI18n();

  const [formData, setFormData] = useState<ContactFormInput>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    city: 'Yaoundé',
    serviceSlug: 'mise-a-niveau-structuration-strategique',
    message: '',
    companyWebsite: '',
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [serverFeedback, setServerFeedback] = useState<string>('');

  useEffect(() => {
    if (!search) return;
    const params = new URLSearchParams(search);
    const requested = params.get('service');
    if (
      requested &&
      (ALLOWED_SERVICE_SLUGS as readonly string[]).includes(requested)
    ) {
      setFormData((prev) => ({
        ...prev,
        serviceSlug: requested as ContactFormInput['serviceSlug'],
      }));
    }
  }, [search]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof ContactFormInput]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'submitting') return;

    setServerFeedback('');
    const parsed = contactFormSchema.safeParse(formData);

    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactFormInput | undefined;
        if (key && !nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      setStatus('error');
      setServerFeedback(
        locale === 'en'
          ? 'Please review the highlighted fields before sending.'
          : 'Veuillez vérifier les champs signalés avant l’envoi.'
      );
      return;
    }

    setFieldErrors({});
    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        message?: string;
        fieldErrors?: FieldErrors;
      };

      if (!response.ok || !payload.ok) {
        if (payload.fieldErrors) {
          setFieldErrors(payload.fieldErrors);
        }
        setStatus('error');
        setServerFeedback(
          payload.message ??
            (locale === 'en'
              ? 'Submission failed temporarily. Your typed information has been kept.'
              : 'La transmission a échoué momentanément. Vos informations saisies ont été conservées.')
        );
        return;
      }

      setStatus('success');
      setServerFeedback(
        locale === 'en'
          ? 'Thank you. Your inquiry has been forwarded to LM CONSULTING leadership. A consultant will get back to you shortly.'
          : payload.message ??
              'Votre demande a bien été transmise à la direction de LM CONSULTING. Nous revenons vers vous rapidement.'
      );
      setFormData((prev) => ({
        ...prev,
        fullName: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        companyWebsite: '',
      }));
    } catch {
      setStatus('error');
      setServerFeedback(
        locale === 'en'
          ? `Unable to reach the server right now. Your inputs are preserved; you can also call us directly at ${cabinet.contact.phones[0].display}.`
          : `Impossible de joindre le serveur actuellement. Vos informations saisies sont conservées ; vous pouvez aussi nous appeler directement au ${cabinet.contact.phones[0].display}.`
      );
    }
  };

  return (
    <>
      <section className="bg-midnight pt-32 pb-16 text-on-midnight sm:pt-40 sm:pb-24">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <Breadcrumbs
            tone="light"
            items={[{ label: ui.nav.home, href: '/' }, { label: ui.nav.contact }]}
          />
          <p className="editorial-caption text-gold">{ui.contactPage.kicker}</p>
          <SplitReveal
            text={ui.contactPage.h1}
            as="h1"
            mode="words"
            className="mt-4 max-w-4xl text-section-display text-on-midnight"
          />
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-on-midnight-muted sm:text-lg">
            {ui.contactPage.intro}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={`tel:${cabinet.contact.phones[0].tel}`}
              className="inline-flex min-h-11 items-center gap-2 border border-gold bg-gold px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-on-midnight transition-colors hover:bg-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                {ui.contactPage.callBtnPrefix} {cabinet.contact.phones[0].display}
              </span>
            </a>
            <a
              href={cabinet.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 border border-on-midnight/30 px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-on-midnight transition-colors hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <MessageCircle className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <span>{ui.contactPage.whatsappBtn}</span>
            </a>
          </div>
        </div>
      </section>

      <section className="bg-ivory py-16 text-ink sm:py-24">
        <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14 lg:px-12">
          {/* FORMULAIRE ACCESSIBLE & VALIDÉ ZOD */}
          <div className="min-w-0 lg:col-span-7">
            <h2 className="text-subsection-display text-ink">{ui.contactPage.formHeading}</h2>
            <p className="mt-2 text-sm text-ink-muted">{ui.contactPage.requiredNote}</p>

            {status === 'success' && (
              <div
                role="status"
                aria-live="polite"
                className="mt-6 flex items-start gap-3 border border-ink/20 bg-ivory-surface p-5 text-sm text-ink"
              >
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-amber-ink"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold">{ui.contactPage.successTitle}</p>
                  <p className="mt-1 text-ink-muted">{serverFeedback}</p>
                </div>
              </div>
            )}

            {status === 'error' && serverFeedback && (
              <div
                role="alert"
                className="mt-6 border border-amber-ink bg-ivory-surface p-5 text-sm text-ink"
              >
                <p className="font-semibold text-amber-ink">{ui.contactPage.errorTitle}</p>
                <p className="mt-1 text-ink-muted">{serverFeedback}</p>
              </div>
            )}

            <form
              action="/api/contact"
              method="POST"
              noValidate
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >
              {/* Champ honeypot anti-robots invisible aux lecteurs humains */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="field-company-website">Ne pas remplir ce champ</label>
                <input
                  id="field-company-website"
                  name="companyWebsite"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="min-w-0">
                  <label
                    htmlFor="field-fullName"
                    className="block text-xs font-semibold tracking-wide text-ink"
                  >
                    {ui.contactPage.fullNameLabel}
                  </label>
                  <input
                    id="field-fullName"
                    name="fullName"
                    type="text"
                    required
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={handleChange}
                    aria-invalid={Boolean(fieldErrors.fullName)}
                    aria-describedby={fieldErrors.fullName ? 'err-fullName' : undefined}
                    placeholder={ui.contactPage.fullNamePlaceholder}
                    className="mt-2 min-h-11 w-full border border-ink/25 bg-ivory px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold"
                  />
                  {fieldErrors.fullName && (
                    <p id="err-fullName" className="mt-1.5 text-xs font-medium text-amber-ink">
                      {fieldErrors.fullName}
                    </p>
                  )}
                </div>

                <div className="min-w-0">
                  <label
                    htmlFor="field-company"
                    className="block text-xs font-semibold tracking-wide text-ink"
                  >
                    {ui.contactPage.companyLabel}
                  </label>
                  <input
                    id="field-company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder={ui.contactPage.companyPlaceholder}
                    className="mt-2 min-h-11 w-full border border-ink/25 bg-ivory px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold"
                  />
                  {fieldErrors.company && (
                    <p className="mt-1.5 text-xs font-medium text-amber-ink">
                      {fieldErrors.company}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="min-w-0">
                  <label
                    htmlFor="field-email"
                    className="block text-xs font-semibold tracking-wide text-ink"
                  >
                    {ui.contactPage.emailLabel}
                  </label>
                  <input
                    id="field-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? 'err-email' : undefined}
                    placeholder={ui.contactPage.emailPlaceholder}
                    className="mt-2 min-h-11 w-full border border-ink/25 bg-ivory px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold"
                  />
                  {fieldErrors.email && (
                    <p id="err-email" className="mt-1.5 text-xs font-medium text-amber-ink">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div className="min-w-0">
                  <label
                    htmlFor="field-phone"
                    className="block text-xs font-semibold tracking-wide text-ink"
                  >
                    {ui.contactPage.phoneLabel}
                  </label>
                  <input
                    id="field-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    aria-invalid={Boolean(fieldErrors.phone)}
                    aria-describedby={fieldErrors.phone ? 'err-phone' : undefined}
                    placeholder={ui.contactPage.phonePlaceholder}
                    className="mt-2 min-h-11 w-full border border-ink/25 bg-ivory px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold"
                  />
                  {fieldErrors.phone && (
                    <p id="err-phone" className="mt-1.5 text-xs font-medium text-amber-ink">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="min-w-0">
                  <label
                    htmlFor="field-serviceSlug"
                    className="block text-xs font-semibold tracking-wide text-ink"
                  >
                    {ui.contactPage.serviceLabel}
                  </label>
                  <select
                    id="field-serviceSlug"
                    name="serviceSlug"
                    value={formData.serviceSlug}
                    onChange={handleChange}
                    className="mt-2 min-h-11 w-full border border-ink/25 bg-ivory px-3.5 py-2.5 text-sm text-ink focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold"
                  >
                    {services.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.shortTitle}
                      </option>
                    ))}
                    <option value="autre-besoin">{ui.contactPage.otherServiceOption}</option>
                  </select>
                </div>

                <div className="min-w-0">
                  <label
                    htmlFor="field-city"
                    className="block text-xs font-semibold tracking-wide text-ink"
                  >
                    {ui.contactPage.officeLabel}
                  </label>
                  <select
                    id="field-city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-2 min-h-11 w-full border border-ink/25 bg-ivory px-3.5 py-2.5 text-sm text-ink focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold"
                  >
                    <option value="Yaoundé">{ui.contactPage.officeYaounde}</option>
                    <option value="Douala">{ui.contactPage.officeDouala}</option>
                    <option value="Autre ville / Diaspora">{ui.contactPage.officeOther}</option>
                  </select>
                </div>
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="field-message"
                  className="block text-xs font-semibold tracking-wide text-ink"
                >
                  {ui.contactPage.messageLabel}
                </label>
                <textarea
                  id="field-message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.message)}
                  aria-describedby={fieldErrors.message ? 'err-message' : undefined}
                  placeholder={ui.contactPage.messagePlaceholder}
                  className="mt-2 w-full border border-ink/25 bg-ivory p-3.5 text-sm text-ink placeholder:text-ink-muted/60 focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold"
                />
                {fieldErrors.message && (
                  <p id="err-message" className="mt-1.5 text-xs font-medium text-amber-ink">
                    {fieldErrors.message}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex min-h-12 items-center justify-center gap-2 bg-gold px-7 py-3 text-sm font-semibold whitespace-nowrap text-on-midnight transition-colors hover:bg-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-midnight disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>
                    {status === 'submitting'
                      ? ui.contactPage.submitBusy
                      : ui.contactPage.submitIdle}
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </button>

                <p className="text-xs text-ink-muted">
                  {ui.contactPage.privacyGuarantee}{' '}
                  <AppLink
                    href="/politique-de-confidentialite"
                    className="underline hover:text-ink"
                  >
                    {ui.common.privacyPolicy}
                  </AppLink>
                </p>
              </div>
            </form>
          </div>

          {/* COORDONNÉES DES DEUX ÉTABLISSEMENTS */}
          <aside className="min-w-0 space-y-6 lg:col-span-5">
            <div className="border border-ink/15 bg-midnight p-6 text-on-midnight sm:p-9">
              <p className="editorial-caption text-gold">
                {ui.contactPage.generalCoordinatesKicker}
              </p>
              <dl className="mt-5 divide-y divide-on-midnight/12 text-sm">
                <div className="py-3.5 first:pt-0">
                  <dt className="text-xs text-on-midnight-muted">
                    {ui.contactPage.phoneLinesLabel}
                  </dt>
                  <dd className="mt-1 space-y-1">
                    {cabinet.contact.phones.map((ph) => (
                      <div
                        key={ph.tel}
                        className="flex flex-wrap items-baseline justify-between gap-2"
                      >
                        <a
                          href={`tel:${ph.tel}`}
                          className="editorial-link font-semibold text-on-midnight hover:text-gold"
                        >
                          {ph.display}
                        </a>
                        <span className="text-xs text-on-midnight-muted">{ph.label}</span>
                      </div>
                    ))}
                  </dd>
                </div>

                <div className="py-3.5">
                  <dt className="text-xs text-on-midnight-muted">
                    {ui.contactPage.emailAddressLabel}
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${cabinet.contact.email}`}
                      className="editorial-link text-on-midnight hover:text-gold"
                    >
                      {cabinet.contact.email}
                    </a>
                  </dd>
                </div>

                <div className="py-3.5 last:pb-0">
                  <dt className="text-xs text-on-midnight-muted">
                    {ui.contactPage.socialNetworksLabel}
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={cabinet.contact.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-link text-on-midnight hover:text-gold"
                    >
                      {ui.contactPage.facebookPagePrefix} {cabinet.contact.facebookName}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            {implantationsData.offices.map((office) => (
              <div
                key={office.slug}
                className="border border-ink/15 bg-ivory-surface p-6 sm:p-7"
              >
                <p className="editorial-caption text-amber-ink">{office.role}</p>
                <h3 className="mt-2 font-editorial text-3xl text-ink">{office.city}</h3>
                <p className="mt-2 text-sm font-semibold text-ink">{office.building}</p>
                <p className="text-xs text-ink-muted">{office.district}</p>
                <div className="mt-5 flex flex-wrap items-center gap-5 text-xs font-semibold">
                  <AppLink
                    href={`/${office.slug}`}
                    className="editorial-link text-ink hover:text-amber-ink"
                  >
                    <span>
                      {ui.contactPage.localPagePrefix} {office.city}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-amber-ink" aria-hidden="true" />
                  </AppLink>
                  <a
                    href={office.googleMapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-muted underline hover:text-ink"
                  >
                    Google Maps
                  </a>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </>
  );
}

export function LegalDocumentPage({
  docKey,
}: {
  docKey: 'mentionsLegales' | 'politiqueConfidentialite';
}) {
  const { ui, legalData } = useI18n();
  const doc = legalData[docKey];

  return (
    <section className="bg-ivory pt-32 pb-24 text-ink sm:pt-40">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <Breadcrumbs
          tone="dark"
          items={[{ label: ui.nav.home, href: '/' }, { label: doc.title }]}
        />
        <p className="editorial-caption text-amber-ink">{doc.lastUpdated}</p>
        <h1 className="mt-3 text-section-display text-ink">{doc.title}</h1>
        <p className="mt-6 border-y border-ink/15 py-5 text-sm leading-relaxed text-ink-muted">
          {doc.notice}
        </p>

        <div className="mt-10 space-y-10">
          {doc.sections.map((section) => (
            <div key={section.heading} className="space-y-3">
              <h2 className="text-subsection-display text-ink">{section.heading}</h2>
              {section.paragraphs.map((p, idx) => (
                <p key={idx} className="text-base leading-relaxed text-ink-muted">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NotFoundPage() {
  const { ui } = useI18n();

  return (
    <section className="flex min-h-[78dvh] items-center bg-midnight pt-32 pb-20 text-on-midnight">
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <p className="editorial-caption text-gold">{ui.notFound.kicker}</p>
        <h1 className="mt-4 max-w-3xl text-hero-display text-on-midnight">
          {ui.notFound.h1}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-on-midnight-muted">
          {ui.notFound.body}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-5">
          <AppLink
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 bg-gold px-6 py-3 text-sm font-semibold whitespace-nowrap text-on-midnight transition-colors hover:bg-amber"
          >
            <span>{ui.notFound.backHome}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </AppLink>
          <AppLink
            href="/services"
            className="editorial-link text-sm font-semibold text-on-midnight hover:text-gold"
          >
            <span>{ui.notFound.browseServices}</span>
          </AppLink>
          <AppLink
            href="/contact"
            className="editorial-link text-sm font-semibold text-on-midnight hover:text-gold"
          >
            <span>{ui.notFound.contactOffices}</span>
          </AppLink>
        </div>
      </div>
    </section>
  );
}
