import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import {
  getAllStaticRoutes,
  getSeoForPath,
  normalizeBaseUrl,
  renderSeoHeadTags,
  type RouteSeoMetadata,
} from './lib/seo';

export interface ServerRenderResult {
  appHtml: string;
  headHtml: string;
  statusCode: 200 | 404;
  seoMeta: RouteSeoMetadata;
}

export function renderPage(
  url: string,
  baseUrl?: string,
  verification?: { google?: string; bing?: string }
): ServerRenderResult {
  const resolvedBase = normalizeBaseUrl(baseUrl);
  const seoMeta = getSeoForPath(url, resolvedBase);
  const headHtml = renderSeoHeadTags(seoMeta, resolvedBase, verification);

  const appHtml = renderToString(
    <StrictMode>
      <App initialUrl={url} />
    </StrictMode>
  );

  return {
    appHtml,
    headHtml,
    statusCode: seoMeta.statusCode,
    seoMeta,
  };
}

export { getAllStaticRoutes, getSeoForPath, normalizeBaseUrl };
