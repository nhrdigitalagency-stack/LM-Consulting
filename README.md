# LM CONSULTING — Site vitrine institutionnel (Yaoundé & Douala, Cameroun)

Site web éditorial et institutionnel du cabinet **LM CONSULTING**, cabinet de conseil, de mise à niveau des entreprises, d'expertise comptable, fiscale et d'accompagnement au financement basé à **Yaoundé** (Immeuble ADJAL Warda) et **Douala** (Immeuble ONCPB, Bonanjo).

## Architecture technique

- **Rendu serveur & génération statique (SSR / SSG)** : toutes les routes sont pré-rendues au build dans `dist/static/` et servies avec leur HTML sémantique complet, leurs balises OpenGraph (`fr_CM`), leur fil d'Ariane et leurs données structurées JSON-LD (`schema-dts`).
- **Source unique de données (`/content/`)** : aucun texte métier ni coordonnée n'est figé dans les composants.
  - `content/cabinet.json` : identité, coordonnées NAP, chiffres clés, démarche, valeurs, biographie de Laurentine MVONDO et drapeaux d'activation (`flags`).
  - `content/services.json` : les 7 fiches détaillées des pôles de conseil.
  - `content/implantations.json` : pages locales de Yaoundé et Douala et tracés des plans de repérage SVG.
  - `content/faq.json` : foire aux questions générale.
  - `content/legal.json` : modèles de mentions légales et politique de confidentialité.
  - `content/ressources/*.mdx` : articles et guides pratiques au format MDX.
- **Sécurité & formulaire (`/api/contact`)** : validation partagée **Zod** côté client et côté serveur, champ anti-robots (honeypot), limitation de débit par IP, désactivation de `X-Powered-By`, en-têtes HTTP sécurisés et expédition d'e-mails via l'API **Resend** lorsque `RESEND_API_KEY` est renseignée.

## Commandes principales

```bash
# Développement local (port 3000)
npm run dev

# Vérification stricte TypeScript
npm run lint

# Build de production (client + bundle SSR + pré-rendu statique de toutes les pages)
npm run build

# Démarrage du serveur de production (port 3000)
npm start
```

## Variables d'environnement

Copiez `.env.example` vers `.env` et renseignez :

- `SITE_URL` : URL publique canonique sans barre oblique finale (ex. `https://www.lmconsulting-cm.com`)
- `RESEND_API_KEY` : clé d'envoi transactionnel Resend
- `CONTACT_FROM_EMAIL` : adresse d'expédition vérifiée sur votre domaine
- `CONTACT_RECEIVER_EMAIL` : adresse de réception du cabinet (`lmconsulting685@gmail.com`)
- `GOOGLE_SITE_VERIFICATION` / `BING_VERIFICATION` : jetons Search Console et Bing Webmaster Tools (optionnels)

## Comment modifier un contenu

1. **Coordonnées, téléphones, chiffres ou textes d'accueil** : éditez `content/cabinet.json`.
2. **Ajouter ou modifier un service** : éditez `content/services.json` (le routage `/services/[slug]`, le maillage et le `sitemap.xml` se mettent à jour).
3. **Publier ou réviser un article de blog** : modifiez ou ajoutez un fichier `.mdx` dans `content/ressources/` et référencez-le dans `src/lib/content.ts`.
4. **Points à confirmer avant mise en ligne définitive** : consultez la clé `_validations_a_confirmer` en tête de `content/cabinet.json`, la note de `content/services.json` (pôle digitalisation) et l'en-tête `editorialValidation` des fichiers MDX.
