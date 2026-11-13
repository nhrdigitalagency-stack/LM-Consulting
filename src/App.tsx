import React, { useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { I18nProvider } from './lib/i18n';
import { RouterProvider, useRouter } from './lib/router';
import { AppErrorBoundary, PageShell } from './components/Layout';
import { SmoothScrollProvider } from './components/MotionPrimitives';
import { HomePage } from './pages/HomePage';
import { ServiceDetailPage, ServicesIndexPage } from './pages/ServicesPages';
import { AboutPage, LocalOfficePage } from './pages/AboutAndLocalPages';
import { FaqPage } from './pages/FaqPage';
import { ResourceDetailPage, ResourcesIndexPage } from './pages/ResourcesPages';
import {
  ContactPage,
  LegalDocumentPage,
  NotFoundPage,
} from './pages/ContactAndLegalPages';

function RouteSwitch() {
  const { pathname } = useRouter();

  if (pathname === '/') return <HomePage />;
  if (pathname === '/services') return <ServicesIndexPage />;
  if (pathname.startsWith('/services/')) {
    return <ServiceDetailPage slug={pathname.slice('/services/'.length)} />;
  }
  if (pathname === '/a-propos') return <AboutPage />;
  if (pathname === '/yaounde') return <LocalOfficePage citySlug="yaounde" />;
  if (pathname === '/douala') return <LocalOfficePage citySlug="douala" />;
  if (pathname === '/faq') return <FaqPage />;
  if (pathname === '/ressources') return <ResourcesIndexPage />;
  if (pathname.startsWith('/ressources/')) {
    return <ResourceDetailPage slug={pathname.slice('/ressources/'.length)} />;
  }
  if (pathname === '/contact') return <ContactPage />;
  if (pathname === '/mentions-legales') {
    return <LegalDocumentPage docKey="mentionsLegales" />;
  }
  if (pathname === '/politique-de-confidentialite') {
    return <LegalDocumentPage docKey="politiqueConfidentialite" />;
  }

  return <NotFoundPage />;
}

function DeferredPrivacyAnalytics() {
  useEffect(() => {
    const src = import.meta.env.VITE_ANALYTICS_SRC as string | undefined;
    const domain = import.meta.env.VITE_ANALYTICS_DOMAIN as string | undefined;
    if (!src || !domain) return;

    const timer = window.setTimeout(() => {
      if (document.querySelector(`script[src="${src}"]`)) return;
      const script = document.createElement('script');
      script.defer = true;
      script.src = src;
      script.setAttribute('data-domain', domain);
      document.head.appendChild(script);
    }, 2200);

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}

export function App({ initialUrl = '/' }: { initialUrl?: string }) {
  const initialLocale = initialUrl.includes('lang=en') ? 'en' : 'fr';

  return (
    <AppErrorBoundary>
      <MotionConfig reducedMotion="user">
        <I18nProvider initialLocale={initialLocale}>
          <RouterProvider initialUrl={initialUrl}>
            <SmoothScrollProvider>
              <DeferredPrivacyAnalytics />
              <PageShell>
                <RouteSwitch />
              </PageShell>
            </SmoothScrollProvider>
          </RouterProvider>
        </I18nProvider>
      </MotionConfig>
    </AppErrorBoundary>
  );
}

export default App;
