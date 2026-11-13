import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { AppLink } from '../lib/router';
import { useI18n } from '../lib/i18n';
import type { OfficeItem } from '../lib/content';

export function BrandMark({
  tone = 'light',
  compact = false,
}: {
  tone?: 'light' | 'dark';
  compact?: boolean;
}) {
  const textColor = tone === 'light' ? 'text-on-midnight' : 'text-ink';
  const subColor = tone === 'light' ? 'text-on-midnight-muted' : 'text-ink-muted';

  return (
    <span className="inline-flex items-center gap-3">
      <span
        className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/80 bg-[#000000] shadow-sm"
      >
        <img
          src="/assets/photos/logo-lm-consulting.png"
          alt="Logo officiel LM Consulting"
          width={44}
          height={44}
          className="h-full w-full scale-110 object-cover"
        />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className={`text-sm font-semibold tracking-[0.12em] whitespace-nowrap ${textColor}`}>
            LM CONSULTING
          </span>
          <span className={`mt-1 text-[11px] tracking-[0.04em] whitespace-nowrap ${subColor}`}>
            Yaoundé · Douala
          </span>
        </span>
      )}
    </span>
  );
}

export function Breadcrumbs({
  items,
  tone = 'dark',
}: {
  items: Array<{ label: string; href?: string }>;
  tone?: 'light' | 'dark';
}) {
  const { ui } = useI18n();
  const baseText =
    tone === 'light' ? 'text-on-midnight-muted' : 'text-ink-muted';
  const activeText = tone === 'light' ? 'text-on-midnight' : 'text-ink';

  return (
    <nav aria-label={ui.common.breadcrumbAria} className={`mb-8 text-xs ${baseText}`}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="inline-flex items-center gap-2">
              {item.href && !isLast ? (
                <AppLink
                  href={item.href}
                  className="editorial-link transition-colors hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  {item.label}
                </AppLink>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className={activeText}>
                  {item.label}
                </span>
              )}
              {!isLast && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Bloc de couleur uni éditorial avec légende discrète lorsqu'une photographie
 * réelle d'immeuble reste à intégrer.
 */
export function ArchitecturalPlaceholderPlate({
  caption,
  code,
  tone = 'midnight',
  className = '',
}: {
  caption: string;
  code?: string;
  tone?: 'midnight' | 'ivory';
  className?: string;
}) {
  const isMidnight = tone === 'midnight';
  return (
    <figure
      className={`relative flex min-h-[240px] flex-col justify-between border p-6 sm:p-8 ${
        isMidnight
          ? 'border-on-midnight/15 bg-midnight-surface text-on-midnight'
          : 'border-ink/15 bg-ivory-surface text-ink'
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-4 border-b border-current/10 pb-4">
        <span className="editorial-caption text-gold">
          {code ?? 'LM CONSULTING · CAMEROUN'}
        </span>
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-gold"
        />
      </div>

      <div className="my-auto py-8">
        <div
          aria-hidden="true"
          className="h-0.5 w-16 bg-gold"
        />
      </div>

      <figcaption
        className={`text-xs leading-relaxed ${
          isMidnight ? 'text-on-midnight-muted' : 'text-ink-muted'
        }`}
      >
        {caption}
      </figcaption>
    </figure>
  );
}

/**
 * Plan de repérage cartographique vectoriel autonome (zéro iframe Google Maps au chargement).
 */
export function CityLocatorMap({ office }: { office: OfficeItem }) {
  const { ui } = useI18n();
  const { mapVector } = office;
  return (
    <div className="border border-ink/15 bg-midnight p-5 text-on-midnight sm:p-7">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-on-midnight/15 pb-4">
        <div className="min-w-0">
          <p className="editorial-caption text-gold">{mapVector.title}</p>
          <p className="mt-1 text-xs text-on-midnight-muted">{office.fullAddress}</p>
        </div>
        <a
          href={office.googleMapsSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center gap-2 border border-gold bg-gold px-3.5 py-2 text-xs font-semibold whitespace-nowrap text-on-midnight transition-colors hover:bg-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <span>{ui.common.openInGoogleMaps}</span>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        </a>
      </div>

      <svg
        viewBox="0 0 600 320"
        role="img"
        aria-label={`${mapVector.title} — ${office.building}`}
        className="h-auto w-full bg-midnight-surface"
      >
        {/* Trame urbaine subtile */}
        <line x1="0" y1="80" x2="600" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="0" y1="160" x2="600" y2="160" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="0" y1="240" x2="600" y2="240" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="150" y1="0" x2="150" y2="320" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="300" y1="0" x2="300" y2="320" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="450" y1="0" x2="450" y2="320" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {/* Axes routiers principaux */}
        {mapVector.avenues.map((ave, idx) => (
          <g key={ave.name}>
            <path
              d={ave.d}
              fill="none"
              stroke={idx === 0 ? 'rgba(234,123,26,0.75)' : 'rgba(255,255,255,0.28)'}
              strokeWidth={idx === 0 ? 3 : 2}
            />
          </g>
        ))}

        {/* Repère d'implantation */}
        <circle
          cx={mapVector.pinX}
          cy={mapVector.pinY}
          r="18"
          fill="rgba(234, 123, 26, 0.22)"
          stroke="rgba(234, 123, 26, 0.75)"
          strokeWidth="1.5"
        />
        <circle
          cx={mapVector.pinX}
          cy={mapVector.pinY}
          r="6"
          fill="#EA7B1A"
          stroke="#0A1931"
          strokeWidth="2"
        />

        {/* Étiquettes des axes décalées avec halo cartographique */}
        {mapVector.avenues.map((ave) => (
          <text
            key={`label-${ave.name}`}
            x={ave.labelX}
            y={ave.labelY}
            textAnchor="middle"
            fill="#CBD5E1"
            fontSize="11"
            fontFamily="Poppins, sans-serif"
            className="map-label-halo"
          >
            {ave.name}
          </text>
        ))}

        {/* Étiquette principale de l'immeuble */}
        <text
          x={mapVector.pinX + 24}
          y={mapVector.pinY - 8}
          textAnchor="start"
          fill="#FFFFFF"
          fontSize="13"
          fontWeight="600"
          fontFamily="Poppins, sans-serif"
          className="map-label-halo"
        >
          {mapVector.pinLabel}
        </text>
        <text
          x={mapVector.pinX + 24}
          y={mapVector.pinY + 11}
          textAnchor="start"
          fill="#EA7B1A"
          fontSize="11"
          fontFamily="Poppins, sans-serif"
          className="map-label-halo"
        >
          {mapVector.pinSublabel}
        </text>
      </svg>
    </div>
  );
}
