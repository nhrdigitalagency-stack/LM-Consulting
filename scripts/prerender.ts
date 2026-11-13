import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function runPrerender() {
  const templatePath = path.resolve(rootDir, 'dist/index.html');
  const template = fs.readFileSync(templatePath, 'utf-8');

  const serverEntryPath = path.resolve(rootDir, 'dist/server/entry-server.js');
  const serverModule = (await import(serverEntryPath)) as {
    renderPage: (
      url: string,
      baseUrl?: string,
      verification?: { google?: string; bing?: string }
    ) => { appHtml: string; headHtml: string; statusCode: number };
    getAllStaticRoutes: () => string[];
  };

  const siteUrl = process.env.SITE_URL || process.env.APP_URL || 'https://www.lmconsulting-cm.com';
  const verification = {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
    bing: process.env.BING_VERIFICATION || '',
  };

  const injectHtml = (url: string) => {
    const { appHtml, headHtml } = serverModule.renderPage(url, siteUrl, verification);
    return template
      .replace(/<!--SEO_START-->[\s\S]*?<!--SEO_END-->/, headHtml)
      .replace('<!--SSR_OUTLET-->', appHtml);
  };

  const staticOutDir = path.resolve(rootDir, 'dist/static');
  fs.mkdirSync(staticOutDir, { recursive: true });

  const routes = serverModule.getAllStaticRoutes();
  for (const route of routes) {
    const html = injectHtml(route);
    const outPath =
      route === '/'
        ? path.join(staticOutDir, 'index.html')
        : path.join(staticOutDir, route.slice(1), 'index.html');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html, 'utf-8');
  }

  // Génère également la page 404 statique
  const notFoundHtml = injectHtml('/page-introuvable-404');
  fs.writeFileSync(path.join(staticOutDir, '404.html'), notFoundHtml, 'utf-8');
}

runPrerender().catch((err) => {
  process.stderr.write(`Erreur lors de la génération statique : ${String(err)}\n`);
  process.exit(1);
});
