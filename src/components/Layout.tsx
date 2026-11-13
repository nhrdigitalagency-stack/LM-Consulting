import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUp, ArrowUpRight, Globe, Menu, X } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { AppLink, useRouter } from '../lib/router';
import { BrandMark } from './BrandMarks';
import { CustomerServiceFloatingWidget } from './CustomerServiceFloatingWidget';
import {
  CustomDesktopCursor,
  IntroAccentBar,
  MagneticWrap,
  ReadingProgressBar,
  SplitReveal,
  useScrollControl,
} from './MotionPrimitives';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex min-h-dvh flex-col items-start justify-center bg-midnight px-6 py-16 text-on-midnight sm:px-12"
        >
          <p className="editorial-caption text-gold">LM CONSULTING</p>
          <h1 className="mt-4 text-section-display">
            Une erreur d’affichage inattendue est survenue.
          </h1>
          <p className="mt-4 max-w-xl text-base text-on-midnight-muted">
            Vous pouvez recharger la page ou joindre directement notre équipe au{' '}
            <a href="tel:+237695491296" className="underline text-gold">
              (+237) 695 491 296
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 inline-flex min-h-11 items-center justify-center bg-gold px-6 py-3 text-sm font-semibold whitespace-nowrap text-on-midnight transition-colors hover:bg-amber"
          >
            Recharger la page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, ui } = useI18n();

  return (
    <div
      role="group"
      aria-label={ui.nav.langSwitchLabel}
      className="inline-flex items-center border border-on-midnight/25 bg-midnight-surface/80 p-0.5 text-xs"
    >
      <Globe
        className={`ml-2 mr-1 h-3.5 w-3.5 text-gold ${compact ? 'hidden sm:inline' : ''}`}
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={() => setLocale('fr')}
        aria-pressed={locale === 'fr'}
        className={`min-h-8 px-2.5 py-1 font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold ${
          locale === 'fr'
            ? 'bg-gold text-on-midnight'
            : 'text-on-midnight-muted hover:text-on-midnight'
        }`}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
        className={`min-h-8 px-2.5 py-1 font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold ${
          locale === 'en'
            ? 'bg-gold text-on-midnight'
            : 'text-on-midnight-muted hover:text-on-midnight'
        }`}
      >
        EN
      </button>
    </div>
  );
}

export function SiteHeader() {
  const { pathname } = useRouter();
  const { ui, cabinet } = useI18n();
  const prefersReduced = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const primaryNav = [
    { label: ui.nav.services, href: '/services' },
    { label: ui.nav.about, href: '/a-propos' },
    { label: ui.nav.yaounde, href: '/yaounde' },
    { label: ui.nav.douala, href: '/douala' },
    { label: ui.nav.faq, href: '/faq' },
  ] as const;

  const drawerNav = [
    { label: ui.nav.home, href: '/' },
    ...primaryNav,
    { label: ui.nav.resources, href: '/ressources' },
  ] as const;

  const startsOnLightGround =
    pathname === '/mentions-legales' || pathname === '/politique-de-confidentialite';

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 36);

      if (currentY > 180 && currentY > lastScrollY.current + 8) {
        setIsHidden(true);
      } else if (currentY < lastScrollY.current - 6 || currentY <= 80) {
        setIsHidden(false);
      }
      lastScrollY.current = currentY;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        menuTriggerRef.current?.focus();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileOpen]);

  const solidBar = isScrolled || startsOnLightGround || mobileOpen;

  return (
    <>
      <a
        href="#contenu-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-gold focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-on-midnight"
      >
        {ui.nav.skipToContent}
      </a>

      <ReadingProgressBar />
      <IntroAccentBar />

      <header
        className={`fixed top-0 right-0 left-0 z-40 transition-[background-color,border-color,transform] duration-300 ease-out ${
          isHidden && !mobileOpen ? '-translate-y-full' : 'translate-y-0'
        } ${
          solidBar
            ? 'border-b border-on-midnight/15 bg-midnight text-on-midnight shadow-md'
            : 'border-b border-transparent bg-midnight/85 backdrop-blur-none text-on-midnight'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[90rem] items-center justify-between gap-3 px-4 sm:gap-6 sm:px-8 lg:px-12">
          <AppLink
            href="/"
            aria-label="LM Consulting — Accueil"
            className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            <BrandMark tone="light" />
          </AppLink>

          <nav
            aria-label="Navigation principale"
            className="hidden items-center gap-6 lg:flex xl:gap-8"
          >
            {primaryNav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <AppLink
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`editorial-link text-sm whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${
                    active ? 'font-semibold text-gold' : 'text-on-midnight/90 hover:text-on-midnight'
                  }`}
                >
                  {item.label}
                </AppLink>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <LanguageSwitcher />
            <MagneticWrap>
              <AppLink
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-gold bg-gold px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-on-midnight transition-colors hover:bg-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <span>{ui.nav.cta}</span>
                <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </AppLink>
            </MagneticWrap>
          </div>

          <div className="flex items-center gap-2.5 lg:hidden">
            <LanguageSwitcher compact />
            <button
              ref={menuTriggerRef}
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="menu-mobile-plein-ecran"
              aria-label={ui.nav.openMenu}
              onClick={() => setMobileOpen(true)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center border border-on-midnight/25 text-on-midnight transition-colors hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="menu-mobile-plein-ecran"
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto bg-midnight px-5 py-6 text-on-midnight sm:px-8 lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-on-midnight/15 pb-5">
              <AppLink href="/" onClick={() => setMobileOpen(false)}>
                <BrandMark tone="light" />
              </AppLink>
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <button
                  ref={closeBtnRef}
                  type="button"
                  aria-label={ui.nav.closeMenu}
                  onClick={() => {
                    setMobileOpen(false);
                    menuTriggerRef.current?.focus();
                  }}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center border border-on-midnight/25 text-on-midnight hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <nav aria-label="Menu mobile" className="my-auto py-8">
              <ul className="divide-y divide-on-midnight/14 border-y border-on-midnight/14">
                {drawerNav.map((item, idx) => {
                  const active = pathname === item.href;
                  return (
                    <motion.li
                      key={item.href}
                      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 * idx, duration: 0.28 }}
                    >
                      <AppLink
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-baseline justify-between py-4 font-editorial text-3xl transition-colors ${
                          active ? 'text-gold' : 'text-on-midnight hover:text-gold'
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className="font-sans text-xs text-on-midnight-muted">
                          0{idx + 1}
                        </span>
                      </AppLink>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-8">
                <AppLink
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-gold px-6 py-3 text-sm font-semibold whitespace-nowrap text-on-midnight transition-colors hover:bg-amber"
                >
                  <span>{ui.nav.cta}</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </AppLink>
              </div>
            </nav>

            <div className="border-t border-on-midnight/15 pt-5 text-xs text-on-midnight-muted">
              <p>Yaoundé · Immeuble ADJAL Warda</p>
              <p className="mt-1">Douala · Immeuble ONCPB, Bonanjo</p>
              <p className="mt-2 font-semibold text-gold">
                {cabinet.contact.phones[0].display}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function SiteFooter() {
  const { scrollToTop } = useScrollControl();
  const { ui, cabinet, services, implantationsData } = useI18n();
  const currentYear = 2026;

  return (
    <footer className="border-t border-on-midnight/15 bg-midnight text-on-midnight">
      <div className="mx-auto max-w-[90rem] px-5 pt-16 pb-20 sm:px-8 lg:px-12 lg:pt-24">
        <div className="grid grid-cols-1 gap-12 border-b border-on-midnight/15 pb-14 md:grid-cols-2 lg:grid-cols-12">
          {/* Identité & baseline */}
          <div className="min-w-0 lg:col-span-4">
            <BrandMark tone="light" />
            <p className="mt-5 font-editorial text-2xl text-gold italic">
              «{'\u00A0'}
              {cabinet.brand.baseline}
              {'\u00A0'}»
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-on-midnight-muted">
              {cabinet.brand.shortPositioning}
            </p>
          </div>

          {/* Domaines d'intervention */}
          <div className="min-w-0 lg:col-span-3">
            <p className="editorial-caption text-gold">{ui.common.practiceAreas}</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {services.map((service) => (
                <li key={service.slug} className="min-w-0">
                  <AppLink
                    href={`/services/${service.slug}`}
                    className="editorial-link text-on-midnight-muted transition-colors hover:text-on-midnight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    {service.shortTitle}
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Implantations NAP cohérentes */}
          <div className="min-w-0 lg:col-span-3">
            <p className="editorial-caption text-gold">{ui.common.locations}</p>
            <div className="mt-5 space-y-5 text-sm">
              {implantationsData.offices.map((office) => (
                <div key={office.slug} className="min-w-0">
                  <AppLink
                    href={`/${office.slug}`}
                    className="editorial-link font-medium text-on-midnight hover:text-gold"
                  >
                    {office.city} — {office.role}
                  </AppLink>
                  <p className="mt-1 text-on-midnight-muted">{office.building}</p>
                  <p className="text-xs text-on-midnight-muted">{office.district}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Coordonnées directes */}
          <div className="min-w-0 lg:col-span-2">
            <p className="editorial-caption text-gold">{ui.common.directContact}</p>
            <ul className="mt-5 space-y-2.5 text-sm text-on-midnight-muted">
              {cabinet.contact.phones.map((phone) => (
                <li key={phone.tel}>
                  <a
                    href={`tel:${phone.tel}`}
                    className="editorial-link text-on-midnight hover:text-gold"
                  >
                    {phone.display}
                  </a>
                </li>
              ))}
              <li className="pt-1 break-all">
                <a
                  href={`mailto:${cabinet.contact.email}`}
                  className="editorial-link hover:text-on-midnight"
                >
                  {cabinet.contact.email}
                </a>
              </li>
              <li className="pt-1">
                <a
                  href={cabinet.contact.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-link hover:text-on-midnight"
                >
                  Facebook · {cabinet.contact.facebookName}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Grand nom de marque révélé */}
        <div className="border-b border-on-midnight/15 py-10 sm:py-14">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SplitReveal
              text="LM CONSULTING"
              as="div"
              mode="words"
              className="font-editorial text-[clamp(2.5rem,9vw,8rem)] leading-[0.9] tracking-[-0.02em] text-on-midnight select-none"
            />
            <button
              type="button"
              onClick={scrollToTop}
              aria-label={ui.common.backToTop}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 border border-on-midnight/25 px-4 py-2.5 text-xs font-semibold whitespace-nowrap text-on-midnight transition-colors hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <span>{ui.common.backToTop}</span>
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mentions de bas de page */}
        <div className="mt-8 flex flex-col justify-between gap-4 text-xs text-on-midnight-muted sm:flex-row sm:items-center">
          <p>
            © {currentYear} {cabinet.brand.name}. {ui.common.allRightsReserved}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <AppLink href="/faq" className="editorial-link hover:text-on-midnight">
              {ui.nav.faq}
            </AppLink>
            <AppLink href="/ressources" className="editorial-link hover:text-on-midnight">
              {ui.nav.resources}
            </AppLink>
            <AppLink href="/mentions-legales" className="editorial-link hover:text-on-midnight">
              {ui.common.legalNotice}
            </AppLink>
            <AppLink
              href="/politique-de-confidentialite"
              className="editorial-link hover:text-on-midnight"
            >
              {ui.common.privacyPolicy}
            </AppLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useRouter();
  const prefersReduced = useReducedMotion();

  return (
    <div className="flex min-h-dvh flex-col">
      <CustomDesktopCursor />
      <SiteHeader />
      <motion.main
        id="contenu-principal"
        key={pathname}
        initial={prefersReduced ? { opacity: 1 } : { opacity: 0.92, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1"
      >
        {children}
      </motion.main>
      <SiteFooter />
      <CustomerServiceFloatingWidget />
    </div>
  );
}
