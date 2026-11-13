import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
} from 'react';
import { getSeoForPath, normalizePathname } from './seo';

interface RouterContextValue {
  pathname: string;
  search: string;
  navigate: (to: string, options?: { replace?: boolean }) => void;
}

const RouterContext = createContext<RouterContextValue>({
  pathname: '/',
  search: '',
  navigate: () => {},
});

interface ViewTransitionDocument {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
}

function syncClientDocumentHead(pathname: string) {
  if (typeof document === 'undefined') return;
  const origin = window.location.origin;
  const meta = getSeoForPath(pathname, origin);
  document.title = meta.title;

  const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
    let el = document.head.querySelector<HTMLMetaElement>(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('meta[name="description"]', 'name', 'description', meta.description);
  setMeta('meta[property="og:title"]', 'property', 'og:title', meta.title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', meta.description);
  setMeta('meta[property="og:type"]', 'property', 'og:type', meta.ogType);
  setMeta('meta[property="og:url"]', 'property', 'og:url', `${origin}${meta.canonicalPath}`);
  setMeta(
    'meta[property="og:image"]',
    'property',
    'og:image',
    `${origin}/assets/photos/og-whatsapp-share.png`
  );
  setMeta(
    'meta[name="twitter:image"]',
    'name',
    'twitter:image',
    `${origin}/assets/photos/og-whatsapp-share.png`
  );
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', meta.description);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', `${origin}${meta.canonicalPath}`);

  // Met à jour les scripts JSON-LD lors de la navigation côté client
  document.head
    .querySelectorAll('script[type="application/ld+json"]')
    .forEach((node) => node.remove());
  for (const item of meta.jsonLd) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(item);
    document.head.appendChild(script);
  }
}

export function RouterProvider({
  initialUrl = '/',
  children,
}: {
  initialUrl?: string;
  children: React.ReactNode;
}) {
  const initialParsed = useMemo(() => {
    const [p, q] = initialUrl.split('?');
    return {
      pathname: normalizePathname(p || '/'),
      search: q ? `?${q}` : '',
    };
  }, [initialUrl]);

  const [locationState, setLocationState] = useState(() => {
    if (typeof window !== 'undefined') {
      return {
        pathname: normalizePathname(window.location.pathname),
        search: window.location.search,
      };
    }
    return initialParsed;
  });

  useEffect(() => {
    const handlePopState = () => {
      const nextPath = normalizePathname(window.location.pathname);
      setLocationState({
        pathname: nextPath,
        search: window.location.search,
      });
      syncClientDocumentHead(nextPath);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    if (typeof window === 'undefined') return;

    const [rawPath, rawRest = ''] = to.split('?');
    const [pathPart, hashFromPath] = rawPath.split('#');
    const [queryPart, hashFromQuery] = rawRest.split('#');
    const hash = hashFromQuery || hashFromPath || '';
    const nextPathname = normalizePathname(pathPart || window.location.pathname);
    const nextSearch = queryPart ? `?${queryPart}` : '';
    const fullUrl = `${nextPathname}${nextSearch}${hash ? `#${hash}` : ''}`;

    const commitUpdate = () => {
      if (options?.replace) {
        window.history.replaceState(null, '', fullUrl);
      } else {
        window.history.pushState(null, '', fullUrl);
      }
      setLocationState({ pathname: nextPathname, search: nextSearch });
      syncClientDocumentHead(nextPathname);

      if (hash) {
        requestAnimationFrame(() => {
          const target = document.getElementById(hash);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      }
    };

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const vtDoc = document as unknown as ViewTransitionDocument;

    if (!prefersReduced && typeof vtDoc.startViewTransition === 'function') {
      vtDoc.startViewTransition(() => {
        commitUpdate();
      });
    } else {
      commitUpdate();
    }
  }, []);

  const value = useMemo(
    () => ({
      pathname: locationState.pathname,
      search: locationState.search,
      navigate,
    }),
    [locationState.pathname, locationState.search, navigate]
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  return useContext(RouterContext);
}

export interface AppLinkProps extends Omit<ComponentProps<'a'>, 'href'> {
  href: string;
}

export function AppLink({ href, onClick, children, ...rest }: AppLinkProps) {
  const { navigate } = useRouter();

  const isExternal =
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:');

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      isExternal ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0 ||
      rest.target === '_blank'
    ) {
      return;
    }
    e.preventDefault();
    navigate(href);
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
