import type { Locale } from './i18n';

/**
 * Applique les règles de micro-typographie française (espaces insécables avant
 * les ponctuations doubles et à l'intérieur des guillemets français).
 */
export function formatFrenchTypography(input: string, locale: Locale = 'fr'): string {
  if (!input || locale === 'en') return input;
  return input
    .replace(/\s+([:;!?»])/g, '\u00A0$1')
    .replace(/(«)\s+/g, '$1\u00A0');
}

export function formatFrenchDate(isoDate: string, locale: Locale = 'fr'): string {
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return isoDate;
  }
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'fr-CM', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
