import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Lenis from 'lenis';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';

const EDITORIAL_EASE = [0.16, 1, 0.3, 1] as const;

interface ScrollControlContextValue {
  scrollToTop: () => void;
}

const ScrollControlContext = createContext<ScrollControlContextValue>({
  scrollToTop: () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },
});

export function useScrollControl() {
  return useContext(ScrollControlContext);
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined' || prefersReduced) {
      return;
    }

    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1,
    });

    lenisRef.current = lenis;
    let rafId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReduced]);

  const scrollToTop = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.05 });
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    }
  }, [prefersReduced]);

  return (
    <ScrollControlContext.Provider value={{ scrollToTop }}>
      {children}
    </ScrollControlContext.Provider>
  );
}

/**
 * Révélation éditoriale initiale non bloquante (≤ 0,95 s).
 */
export function IntroAccentBar() {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      initial={{ scaleX: 0, opacity: 0.95 }}
      animate={{ scaleX: 1, opacity: 0 }}
      transition={{ duration: 0.9, ease: EDITORIAL_EASE }}
      className="pointer-events-none fixed top-0 right-0 left-0 z-50 h-[2px] origin-left bg-gold"
    />
  );
}

/**
 * Révélation de bloc au défilement : fluide, rapide et respectueuse de reduced-motion.
 */
export function EditorialReveal({
  children,
  delay = 0,
  y = 22,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0.08, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.56, delay, ease: EDITORIAL_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Grille ou liste animée en cascade à l'entrée dans le champ visuel.
 */
export function StaggerRevealGroup({
  children,
  className = '',
  stagger = 0.075,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const prefersReduced = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerRevealItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.52, ease: EDITORIAL_EASE },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Filet orange horizontal qui se déploie au passage du lecteur.
 */
export function AnimatedRule({
  className = '',
  tone = 'gold',
}: {
  className?: string;
  tone?: 'gold' | 'ink' | 'light';
}) {
  const prefersReduced = useReducedMotion();
  const colorClass =
    tone === 'gold'
      ? 'bg-gold'
      : tone === 'ink'
      ? 'bg-ink/20'
      : 'bg-on-midnight/20';

  if (prefersReduced) {
    return <div aria-hidden="true" className={`h-[1px] w-full ${colorClass} ${className}`} />;
  }

  return (
    <motion.div
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.65, ease: EDITORIAL_EASE }}
      className={`h-[1px] w-full origin-left ${colorClass} ${className}`}
    />
  );
}

interface SplitRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div' | 'span';
  className?: string;
  delay?: number;
  mode?: 'words' | 'lines';
}

/**
 * Révélation typographique mot par mot ou ligne par ligne.
 * Lisible à 100 % dans le HTML initial (SSR et sans JavaScript).
 */
export function SplitReveal({
  text,
  as: Tag = 'div',
  className = '',
  delay = 0,
  mode = 'words',
}: SplitRevealProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-6% 0px' });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || prefersReduced) {
    return (
      <Tag ref={ref as never} className={className} data-reveal="">
        {text}
      </Tag>
    );
  }

  const segments = mode === 'lines' ? text.split('\n') : text.split(' ');

  return (
    <Tag ref={ref as never} className={className} data-reveal="">
      {segments.map((segment, index) => (
        <span
          key={`${segment}-${index}`}
          className="inline-block overflow-hidden align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={{ y: '42%', opacity: 0.72 }}
            animate={isInView ? { y: '0%', opacity: 1 } : { y: '42%', opacity: 0.72 }}
            transition={{
              duration: 0.54,
              delay: delay + index * (mode === 'lines' ? 0.085 : 0.022),
              ease: EDITORIAL_EASE,
            }}
          >
            {segment}
            {mode === 'words' && index < segments.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

function ScrubWord({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.28, 1]);
  return (
    <motion.span style={{ opacity }} data-scrub-word="" className="inline">
      {word}{' '}
    </motion.span>
  );
}

function ScrollScrubTextAnimated({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLParagraphElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.42'],
  });

  const words = text.split(' ');

  return (
    <p ref={containerRef} className={className}>
      {words.map((word, idx) => {
        const start = idx / words.length;
        const end = Math.min(1, start + 1 / words.length + 0.08);
        return (
          <ScrubWord
            key={`${word}-${idx}`}
            word={word}
            progress={scrollYProgress}
            range={[start, end]}
          />
        );
      })}
    </p>
  );
}

/**
 * Grand texte de positionnement dont les mots s'éclaircissent progressivement au scroll.
 */
export function ScrollScrubText({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || prefersReduced) {
    return <p className={className}>{text}</p>;
  }

  return <ScrollScrubTextAnimated text={text} className={className} />;
}

/**
 * Compteur chiffré animé : affiche la vraie valeur dans le HTML serveur (SEO / no-JS)
 * et anime la progression à l'entrée dans le champ visuel.
 */
export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  className = '',
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const prefersReduced = useReducedMotion();
  const [displayValue, setDisplayValue] = useState<number>(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (prefersReduced || !isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const durationMs = 1150;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    setDisplayValue(0);
    window.requestAnimationFrame(step);
  }, [isInView, prefersReduced, value]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

/**
 * Micro-interaction magnétique fluide sur pointeur fin (desktop uniquement).
 */
export function MagneticWrap({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !wrapRef.current) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    setOffset({ x: relX * 0.14, y: relY * 0.18 });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={wrapRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 280, damping: 22, mass: 0.35 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * Fine barre de progression de lecture en haut d'écran (transform scaleX uniquement).
 */
export function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed top-0 right-0 left-0 z-50 h-[2px] origin-left bg-gold"
    />
  );
}

/**
 * Curseur éditorial discret sur ordinateur (désactivé sur écran tactile et reduced-motion).
 */
export function CustomDesktopCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || prefersReduced) return;
    const mq = window.matchMedia('(pointer: fine) and (min-width: 1024px)');
    setEnabled(mq.matches);

    const onChange = (ev: MediaQueryListEvent) => setEnabled(ev.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [prefersReduced]);

  useEffect(() => {
    if (!enabled) return;
    let mouseX = -40;
    let mouseY = -40;
    let curX = -40;
    let curY = -40;
    let isHoveringInteractive = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const target = e.target as HTMLElement | null;
      isHoveringInteractive = Boolean(
        target?.closest('a, button, summary, input, select, textarea')
      );
    };

    const tick = () => {
      curX += (mouseX - curX) * 0.24;
      curY += (mouseY - curY) * 0.24;
      if (dotRef.current) {
        const scale = isHoveringInteractive ? 1.75 : 1;
        dotRef.current.style.transform = `translate3d(${curX - 10}px, ${curY - 10}px, 0) scale(${scale})`;
        dotRef.current.style.borderColor = isHoveringInteractive
          ? 'rgba(234, 123, 26, 0.92)'
          : 'rgba(234, 123, 26, 0.45)';
      }
      raf = window.requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50 h-5 w-5 rounded-full border border-gold/50 transition-[border-color] duration-150 will-change-transform"
    />
  );
}
