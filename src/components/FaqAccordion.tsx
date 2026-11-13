import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Plus, Search, X } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { AppLink } from '../lib/router';

export type FaqCategoryKey =
  | 'all'
  | 'fiscalite'
  | 'financement'
  | 'comptabilite'
  | 'accompagnement';

export interface FaqEntry {
  id?: string;
  category?: string;
  question: string;
  answer: string;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * Accordéon FAQ interactif avec animation fluide, contrôle clavier et support multi-ouverture.
 */
export function FaqAccordion({
  items,
  tone = 'ivory',
  controlledOpenIds,
  onToggleId,
}: {
  items: FaqEntry[];
  tone?: 'ivory' | 'midnight';
  controlledOpenIds?: Set<string>;
  onToggleId?: (id: string) => void;
}) {
  const prefersReduced = useReducedMotion();
  const isLight = tone === 'ivory';
  const [internalOpenId, setInternalOpenId] = useState<string | null>(
    items[0]?.id ?? items[0]?.question ?? null
  );

  const isControlled = Boolean(controlledOpenIds && onToggleId);

  return (
    <div
      className={`divide-y border-y ${
        isLight
          ? 'divide-ink/14 border-ink/14'
          : 'divide-on-midnight/14 border-on-midnight/14'
      }`}
    >
      {items.map((item, idx) => {
        const key = item.id ?? item.question;
        const isOpen = isControlled
          ? Boolean(controlledOpenIds?.has(key))
          : internalOpenId === key;

        const handleToggle = () => {
          if (onToggleId) {
            onToggleId(key);
          } else {
            setInternalOpenId((prev) => (prev === key ? null : key));
          }
        };

        return (
          <div key={key} className="py-5 sm:py-6">
            <h3 className="m-0">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${key}`}
                id={`faq-trigger-${key}`}
                onClick={handleToggle}
                className={`group flex w-full cursor-pointer items-start justify-between gap-4 text-left font-display text-lg font-semibold leading-snug sm:gap-6 sm:text-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${
                  isLight ? 'text-ink' : 'text-on-midnight'
                }`}
              >
                <span className="flex min-w-0 items-baseline gap-3 sm:gap-4">
                  <span className="shrink-0 font-sans text-xs font-semibold tabular-nums text-amber-ink">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </span>
                  <span className="min-w-0 transition-colors duration-150 group-hover:text-amber-ink">
                    {item.question}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center border transition-all duration-200 ${
                    isOpen
                      ? 'rotate-45 border-gold bg-gold text-on-midnight'
                      : isLight
                      ? 'border-ink/20 text-ink group-hover:border-gold group-hover:text-amber-ink'
                      : 'border-on-midnight/20 text-on-midnight group-hover:border-gold group-hover:text-gold'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-panel-${key}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${key}`}
                  initial={
                    prefersReduced
                      ? { opacity: 1 }
                      : { opacity: 0, height: 0 }
                  }
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={
                    prefersReduced
                      ? { opacity: 0 }
                      : { opacity: 0, height: 0 }
                  }
                  transition={{ duration: 0.24, ease: EASE_OUT }}
                  className="overflow-hidden"
                >
                  <div
                    className={`pt-4 pr-2 pl-7 text-sm leading-relaxed sm:pl-9 sm:text-base ${
                      isLight ? 'text-ink-muted' : 'text-on-midnight-muted'
                    }`}
                  >
                    <p>{item.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Explorateur FAQ complet avec filtrage par thématique, recherche instantanée et contrôle tout déplier/replier.
 */
export function FaqInteractiveExplorer({
  items,
}: {
  items: FaqEntry[];
}) {
  const { ui } = useI18n();
  const prefersReduced = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<FaqCategoryKey>('all');
  const [query, setQuery] = useState('');
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const firstKey = items[0]?.id ?? items[0]?.question;
    return firstKey ? new Set([firstKey]) : new Set();
  });

  const categories: Array<{ key: FaqCategoryKey; label: string }> = [
    { key: 'all', label: ui.faqPage.allCategories },
    { key: 'fiscalite', label: ui.faqPage.categories.fiscalite },
    { key: 'financement', label: ui.faqPage.categories.financement },
    { key: 'comptabilite', label: ui.faqPage.categories.comptabilite },
    { key: 'accompagnement', label: ui.faqPage.categories.accompagnement },
  ];

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const catMatch =
        selectedCategory === 'all' || item.category === selectedCategory;
      if (!catMatch) return false;
      if (!q) return true;
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
      );
    });
  }, [items, selectedCategory, query]);

  const handleToggleId = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allFilteredOpen =
    filteredItems.length > 0 &&
    filteredItems.every((item) => openIds.has(item.id ?? item.question));

  const toggleAllVisible = () => {
    if (allFilteredOpen) {
      setOpenIds(new Set());
    } else {
      setOpenIds(new Set(filteredItems.map((item) => item.id ?? item.question)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Barre de recherche */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-muted"
          aria-hidden="true"
        />
        <label htmlFor="faq-search-input" className="sr-only">
          {ui.faqPage.searchPlaceholder}
        </label>
        <input
          id="faq-search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={ui.faqPage.searchPlaceholder}
          className="min-h-12 w-full border border-ink/20 bg-ivory pr-20 pl-11 text-sm text-ink placeholder:text-ink-muted/75 focus:border-midnight focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute top-1/2 right-2.5 inline-flex min-h-8 -translate-y-1/2 items-center gap-1 px-2.5 text-xs font-semibold text-ink-muted hover:text-ink"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{ui.faqPage.clearSearch}</span>
          </button>
        )}
      </div>

      {/* Onglets de catégories + bouton Tout déplier */}
      <div className="flex flex-col gap-4 border-b border-ink/12 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label={ui.faqPage.allCategories}
          className="flex flex-wrap gap-1.5"
        >
          {categories.map((cat) => {
            const active = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(cat.key)}
                className={`relative min-h-10 px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                  active
                    ? 'bg-midnight text-on-midnight'
                    : 'bg-ivory-surface text-ink-muted hover:text-ink'
                }`}
              >
                <span>{cat.label}</span>
                {active && !prefersReduced && (
                  <motion.span
                    layoutId="faq-active-tab-line"
                    aria-hidden="true"
                    className="absolute right-0 bottom-0 left-0 h-[2px] bg-gold"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <span className="text-xs tabular-nums text-ink-muted">
            {filteredItems.length} {ui.faqPage.resultsCountSuffix}
          </span>
          {filteredItems.length > 0 && (
            <button
              type="button"
              onClick={toggleAllVisible}
              className="min-h-9 border border-ink/20 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-ink transition-colors hover:border-gold hover:text-amber-ink"
            >
              {allFilteredOpen ? ui.faqPage.collapseAll : ui.faqPage.expandAll}
            </button>
          )}
        </div>
      </div>

      {/* Liste des questions filtrées ou état vide */}
      {filteredItems.length > 0 ? (
        <FaqAccordion
          items={filteredItems}
          tone="ivory"
          controlledOpenIds={openIds}
          onToggleId={handleToggleId}
        />
      ) : (
        <div className="border border-ink/15 bg-ivory-surface p-8 text-center">
          <p className="font-display text-lg font-semibold text-ink">
            {ui.faqPage.emptyStateTitle}
          </p>
          <p className="mx-auto mt-2 max-w-lg text-sm text-ink-muted">
            {ui.faqPage.emptyStateBody}
          </p>
          <AppLink
            href="/contact"
            className="mt-6 inline-flex min-h-11 items-center gap-2 bg-gold px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-on-midnight transition-colors hover:bg-amber"
          >
            <span>{ui.faqPage.emptyStateCta}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </AppLink>
        </div>
      )}
    </div>
  );
}
