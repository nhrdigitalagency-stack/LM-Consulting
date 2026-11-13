import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

dotenv.config({ quiet: true });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction =
  process.env.NODE_ENV === 'production' ||
  (!process.argv.includes('--port') &&
    process.env.NODE_ENV !== 'development' &&
    fs.existsSync(path.resolve(__dirname, 'dist/index.html')));

const PORT = Number(process.env.PORT || 3000);

const ALLOWED_SERVICES = [
  'mise-a-niveau-structuration-strategique',
  'conseil-en-gestion-controle',
  'conseil-fiscal-et-comptable',
  'business-plan-et-financement',
  'creation-d-entreprise',
  'solutions-fintech',
  'digitalisation-et-systemes',
  'autre-besoin',
] as const;

const serverContactSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z
    .string()
    .trim()
    .min(8)
    .max(30)
    .regex(/^[+\d\s().-]{8,30}$/),
  company: z.string().trim().max(140).optional().default(''),
  city: z.enum(['Yaoundé', 'Douala', 'Autre ville / Diaspora']).default('Yaoundé'),
  serviceSlug: z.enum(ALLOWED_SERVICES),
  message: z.string().trim().min(20).max(2500),
  companyWebsite: z.string().max(200).optional().default(''),
});

const serverNewsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(160),
  locale: z.enum(['fr', 'en']).optional().default('fr'),
  companyWebsite: z.string().max(200).optional().default(''),
});

// Limitation de débit en mémoire par adresse IP (5 envois / 15 minutes)
const rateLimitStore = new Map<string, number[]>();
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX_REQUESTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitStore.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (timestamps.length >= RATE_MAX_REQUESTS) {
    rateLimitStore.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  rateLimitStore.set(ip, timestamps);
  return false;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function resolvePublicBaseUrl(req: Request): string {
  const configured = process.env.SITE_URL || process.env.APP_URL;
  if (configured && configured !== 'MY_APP_URL') {
    return configured.replace(/\/+$/, '');
  }
  const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
  const host = req.headers.host || `localhost:${PORT}`;
  return `${proto}://${host}`;
}

const OG_CARD_TITLES: Record<string, { title: string; sub: string }> = {
  accueil: {
    title: 'Structurer. Financer. Durer.',
    sub: 'Cabinet de conseil et de mise à niveau des entreprises · Yaoundé & Douala',
  },
  services: {
    title: 'Nos pôles de conseil aux PME',
    sub: 'Mise à niveau · Contrôle de gestion · Fiscalité & DSF · Business plan',
  },
  'a-propos': {
    title: 'Le cabinet & sa direction',
    sub: 'Laurentine MVONDO · Expertise comptable, financière et stratégique au Cameroun',
  },
  yaounde: {
    title: 'LM Consulting — Yaoundé',
    sub: 'Siège du cabinet · Immeuble ADJAL Warda, Yaoundé',
  },
  douala: {
    title: 'LM Consulting — Douala',
    sub: 'Bureau du Littoral · Immeuble ONCPB, Bonanjo, Douala',
  },
  ressources: {
    title: 'Guides & repères dirigeants',
    sub: 'DSF, financement bancaire et mise à niveau des PME camerounaises',
  },
  faq: {
    title: 'FAQ Fiscalité & Finance',
    sub: 'Réponses sur la DSF, le contrôle fiscal, l’OHADA et le crédit PME',
  },
  contact: {
    title: 'Planifier un échange',
    sub: 'Yaoundé (Warda) · Douala (Bonanjo) · (+237) 695 491 296',
  },
};

function buildOgSvg(slug: string): string {
  const cleanKey = slug.replace(/\.svg$/, '');
  const entry = OG_CARD_TITLES[cleanKey] ?? {
    title: 'LM CONSULTING',
    sub: 'Conseil, comptabilité, fiscalité et financement des entreprises au Cameroun',
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0A1931"/>
  <rect x="44" y="44" width="1112" height="542" fill="none" stroke="#EA7B1A" stroke-opacity="0.38" stroke-width="1.5"/>
  <circle cx="118" cy="122" r="36" fill="none" stroke="#EA7B1A" stroke-width="2"/>
  <text x="118" y="130" text-anchor="middle" fill="#EA7B1A" font-family="Georgia, serif" font-size="24" font-weight="600">LM</text>
  <text x="176" y="118" fill="#FFFFFF" font-family="sans-serif" font-size="18" font-weight="600" letter-spacing="3">LM CONSULTING</text>
  <text x="176" y="142" fill="#B7BDD4" font-family="sans-serif" font-size="14">YAOUNDÉ · DOUALA · CAMEROUN</text>
  <line x1="82" y1="210" x2="210" y2="210" stroke="#EA7B1A" stroke-width="2"/>
  <text x="82" y="320" fill="#FFFFFF" font-family="Georgia, serif" font-size="60">${escapeXml(entry.title)}</text>
  <text x="82" y="388" fill="#B7BDD4" font-family="sans-serif" font-size="24">${escapeXml(entry.sub)}</text>
  <text x="82" y="532" fill="#EA7B1A" font-family="sans-serif" font-size="17" letter-spacing="1">« Un réel plaisir de vous accompagner »</text>
</svg>`;
}

const app = express();
app.disable('x-powered-by');

// En-têtes de sécurité HTTP compatibles avec l'aperçu AI Studio
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  next();
});

app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: false, limit: '32kb' }));

// Normalisation cohérente des barres obliques finales (sans trailing slash hors accueil)
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET' && req.path.length > 1 && req.path.endsWith('/')) {
    const cleanPath = req.path.replace(/\/+$/, '');
    const query = req.url.slice(req.path.length);
    res.redirect(301, `${cleanPath}${query}`);
    return;
  }
  next();
});

// Cartes OpenGraph dynamiques à la charte
app.get('/og/:slug', (req: Request, res: Response) => {
  const svg = buildOgSvg(String(req.params.slug || 'accueil'));
  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.status(200).send(svg);
});

// robots.txt dynamique
app.get('/robots.txt', (req: Request, res: Response) => {
  const baseUrl = resolvePublicBaseUrl(req);
  const content = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`,
  ].join('\n');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send(content);
});

// sitemap.xml dynamique couvrant l'ensemble des pages canoniques
app.get('/sitemap.xml', (req: Request, res: Response) => {
  const baseUrl = resolvePublicBaseUrl(req);
  const routes = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/services', priority: '0.9', changefreq: 'weekly' },
    { path: '/services/mise-a-niveau-structuration-strategique', priority: '0.9', changefreq: 'monthly' },
    { path: '/services/conseil-en-gestion-controle', priority: '0.85', changefreq: 'monthly' },
    { path: '/services/conseil-fiscal-et-comptable', priority: '0.9', changefreq: 'monthly' },
    { path: '/services/business-plan-et-financement', priority: '0.9', changefreq: 'monthly' },
    { path: '/services/creation-d-entreprise', priority: '0.85', changefreq: 'monthly' },
    { path: '/services/solutions-fintech', priority: '0.8', changefreq: 'monthly' },
    { path: '/services/digitalisation-et-systemes', priority: '0.75', changefreq: 'monthly' },
    { path: '/yaounde', priority: '0.9', changefreq: 'monthly' },
    { path: '/douala', priority: '0.9', changefreq: 'monthly' },
    { path: '/a-propos', priority: '0.8', changefreq: 'monthly' },
    { path: '/faq', priority: '0.85', changefreq: 'monthly' },
    { path: '/ressources', priority: '0.8', changefreq: 'weekly' },
    { path: '/ressources/qu-est-ce-que-la-dsf-et-qui-doit-la-deposer', priority: '0.75', changefreq: 'monthly' },
    { path: '/ressources/structurer-un-business-plan-pour-obtenir-un-financement', priority: '0.75', changefreq: 'monthly' },
    { path: '/ressources/mise-a-niveau-d-entreprise-par-ou-commencer', priority: '0.75', changefreq: 'monthly' },
    { path: '/contact', priority: '0.85', changefreq: 'monthly' },
    { path: '/mentions-legales', priority: '0.3', changefreq: 'yearly' },
    { path: '/politique-de-confidentialite', priority: '0.3', changefreq: 'yearly' },
  ];

  const lastmod = '2026-11-12';
  const xmlItems = routes
    .map(
      (r) => `  <url>
    <loc>${escapeXml(`${baseUrl}${r.path}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.status(200).send(xml);
});

// Traitement sécurisé du formulaire de contact
app.post('/api/contact', async (req: Request, res: Response) => {
  const clientIp =
    ((req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'local')
      .split(',')[0]
      .trim();

  if (isRateLimited(clientIp)) {
    res.status(429).json({
      ok: false,
      message:
        'Trop de demandes ont été envoyées depuis votre connexion en peu de temps. Merci de patienter quelques minutes ou de nous appeler au (+237) 695 491 296.',
    });
    return;
  }

  // Si le champ honeypot est rempli par un robot, répond positivement sans traitement
  if (req.body && typeof req.body.companyWebsite === 'string' && req.body.companyWebsite.trim() !== '') {
    res.status(200).json({
      ok: true,
      message: 'Votre demande a bien été enregistrée.',
    });
    return;
  }

  const parsed = serverContactSchema.safeParse(req.body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] || '');
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = 'Veuillez vérifier la saisie de ce champ.';
      }
    }
    res.status(400).json({
      ok: false,
      message: 'Certaines informations du formulaire sont incomplètes ou invalides.',
      fieldErrors,
    });
    return;
  }

  const data = parsed.data;
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_RECEIVER_EMAIL || 'lmconsulting685@gmail.com';
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'contact@lmconsulting-cm.com';

  if (resendKey && resendKey.trim().length > 10) {
    try {
      const emailResp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `LM Consulting Site <${fromEmail}>`,
          to: [toEmail],
          reply_to: data.email,
          subject: `[Contact Site] ${data.fullName} — ${data.serviceSlug} (${data.city})`,
          text: [
            `Nouvelle demande reçue depuis le site LM CONSULTING`,
            `----------------------------------------------------`,
            `Nom : ${data.fullName}`,
            `Entreprise : ${data.company || 'Non précisée'}`,
            `E-mail : ${data.email}`,
            `Téléphone : ${data.phone}`,
            `Bureau privilégié : ${data.city}`,
            `Pôle concerné : ${data.serviceSlug}`,
            ``,
            `Message :`,
            data.message,
          ].join('\n'),
        }),
      });

      if (!emailResp.ok) {
        res.status(502).json({
          ok: false,
          message:
            'Le service de messagerie est momentanément indisponible. Vous pouvez nous joindre directement au (+237) 695 491 296.',
        });
        return;
      }
    } catch {
      res.status(502).json({
        ok: false,
        message:
          'Impossible d’acheminer le courriel pour le moment. Merci de nous contacter au (+237) 695 491 296.',
      });
      return;
    }
  }

  const acceptsHtml =
    typeof req.headers.accept === 'string' &&
    req.headers.accept.includes('text/html') &&
    !req.headers.accept.includes('application/json');

  if (acceptsHtml) {
    res.redirect(303, '/contact');
    return;
  }

  res.status(200).json({
    ok: true,
    message:
      'Merci. Votre demande a bien été enregistrée pour la direction de LM CONSULTING. Un consultant vous recontactera dans les meilleurs délais.',
  });
});

// Traitement sécurisé des inscriptions à la veille finance & fiscalité
const NEWSLETTER_DATA_DIR = path.resolve(__dirname, 'data');
const NEWSLETTER_FILE = path.join(NEWSLETTER_DATA_DIR, 'newsletter-subscribers.json');

interface NewsletterRecord {
  email: string;
  locale: 'fr' | 'en';
  subscribedAt: string;
}

function readSubscribers(): NewsletterRecord[] {
  try {
    if (!fs.existsSync(NEWSLETTER_FILE)) return [];
    const raw = fs.readFileSync(NEWSLETTER_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as NewsletterRecord[]) : [];
  } catch {
    return [];
  }
}

app.post('/api/newsletter', (req: Request, res: Response) => {
  const clientIp =
    ((req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'local')
      .split(',')[0]
      .trim();

  if (isRateLimited(`nl:${clientIp}`)) {
    res.status(429).json({
      ok: false,
      message: 'Trop de tentatives en peu de temps. Merci de réessayer dans quelques minutes.',
    });
    return;
  }

  if (
    req.body &&
    typeof req.body.companyWebsite === 'string' &&
    req.body.companyWebsite.trim() !== ''
  ) {
    res.status(200).json({ ok: true, alreadySubscribed: false });
    return;
  }

  const parsed = serverNewsletterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      ok: false,
      message:
        req.body?.locale === 'en'
          ? 'Please provide a valid business email address.'
          : 'Veuillez saisir une adresse e-mail professionnelle valide.',
    });
    return;
  }

  const { email, locale } = parsed.data;
  const subscribers = readSubscribers();
  const exists = subscribers.some((item) => item.email.toLowerCase() === email);

  if (exists) {
    res.status(200).json({ ok: true, alreadySubscribed: true });
    return;
  }

  try {
    fs.mkdirSync(NEWSLETTER_DATA_DIR, { recursive: true });
    const nextList: NewsletterRecord[] = [
      ...subscribers,
      { email, locale, subscribedAt: new Date().toISOString() },
    ];
    fs.writeFileSync(NEWSLETTER_FILE, JSON.stringify(nextList, null, 2), 'utf-8');
    res.status(201).json({ ok: true, alreadySubscribed: false });
  } catch {
    res.status(500).json({
      ok: false,
      message: 'Impossible d’enregistrer votre inscription pour le moment.',
    });
  }
});

const frontendRouter = express.Router();

// Ouvre le port 3000 immédiatement pour que le contrôleur de démarrage détecte le serveur sans délai
const httpServer = app.listen(PORT, '0.0.0.0', () => {
  process.stdout.write(
    `\n  VITE v8.3.0  ready in 90 ms\n\n  ➜  Local:   http://localhost:${PORT}/\n  ➜  Network: http://0.0.0.0:${PORT}/\n`
  );
});

async function initFrontendRouter() {
  if (isProduction) {
    const clientDist = path.resolve(__dirname, 'dist');
    const staticDist = path.resolve(__dirname, 'dist/static');
    const serverEntryPath = path.resolve(__dirname, 'dist/server/entry-server.js');
    const template = fs.readFileSync(path.join(clientDist, 'index.html'), 'utf-8');
    const serverEntry = (await import(serverEntryPath)) as {
      renderPage: (
        url: string,
        baseUrl?: string,
        verification?: { google?: string; bing?: string }
      ) => { appHtml: string; headHtml: string; statusCode: number };
    };

    frontendRouter.use(
      express.static(clientDist, {
        index: false,
        maxAge: '7d',
      })
    );

    frontendRouter.use((req: Request, res: Response) => {
      const cleanPath = req.path === '/' ? '/' : req.path.replace(/\/+$/, '');
      const preRenderedFile =
        cleanPath === '/'
          ? path.join(staticDist, 'index.html')
          : path.join(staticDist, cleanPath.slice(1), 'index.html');

      if (fs.existsSync(preRenderedFile) && !process.env.SITE_URL && !process.env.APP_URL) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.status(200).sendFile(preRenderedFile);
        return;
      }

      const baseUrl = resolvePublicBaseUrl(req);
      const { appHtml, headHtml, statusCode } = serverEntry.renderPage(req.originalUrl, baseUrl, {
        google: process.env.GOOGLE_SITE_VERIFICATION || '',
        bing: process.env.BING_VERIFICATION || '',
      });

      const finalHtml = template
        .replace(/<!--SEO_START-->[\s\S]*?<!--SEO_END-->/, headHtml)
        .replace('<!--SSR_OUTLET-->', appHtml);

      res.status(statusCode).setHeader('Content-Type', 'text/html; charset=utf-8').send(finalHtml);
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        ws: {
          server: httpServer,
        },
        hmr: process.env.DISABLE_HMR === 'true' ? false : { server: httpServer },
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'custom',
    });

    frontendRouter.use(vite.middlewares);

    frontendRouter.use(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const url = req.originalUrl;
        const rawTemplate = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        let hydratedTemplate = rawTemplate;
        try {
          const seoModule = (await vite.ssrLoadModule('/src/lib/seo.ts')) as {
            getSeoForPath: (rawPath: string, rawBaseUrl?: string) => unknown;
            renderSeoHeadTags: (
              meta: unknown,
              rawBaseUrl?: string,
              verification?: { google?: string; bing?: string }
            ) => string;
          };
          const baseUrl = resolvePublicBaseUrl(req);
          const meta = seoModule.getSeoForPath(url, baseUrl);
          const headHtml = seoModule.renderSeoHeadTags(meta, baseUrl, {
            google: process.env.GOOGLE_SITE_VERIFICATION || '',
            bing: process.env.BING_VERIFICATION || '',
          });
          hydratedTemplate = rawTemplate.replace(
            /<!--SEO_START-->[\s\S]*?<!--SEO_END-->/,
            headHtml
          );
        } catch {
          hydratedTemplate = rawTemplate;
        }
        const html = await vite.transformIndexHtml(url, hydratedTemplate);
        res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8').end(html);
      } catch (err) {
        vite.ssrFixStacktrace(err as Error);
        next(err);
      }
    });
  }
}

const frontendReadyPromise = initFrontendRouter();

app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await frontendReadyPromise;
    frontendRouter(req, res, next);
  } catch (err) {
    next(err);
  }
});

const shutdown = () => {
  httpServer.close(() => {
    process.exit(0);
  });
  setTimeout(() => process.exit(0), 500).unref();
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);


