export interface MdxFrontmatter {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  author: string;
  status: string;
  relatedServiceSlug: string;
  relatedServiceAnchor: string;
}

export type MdxBlock =
  | { type: 'h2'; text: string; id: string }
  | { type: 'h3'; text: string; id: string }
  | { type: 'paragraph'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; title: string; text: string };

export interface ParsedMdxArticle {
  frontmatter: MdxFrontmatter;
  excerpt: string;
  blocks: MdxBlock[];
}

function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function parseMdxDocument(rawContent: string): ParsedMdxArticle {
  const normalized = rawContent.replace(/\r\n/g, '\n').trim();
  const fmMatch = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  const rawMeta: Record<string, string> = {};
  let body = normalized;

  if (fmMatch) {
    const fmLines = fmMatch[1].split('\n');
    for (const line of fmLines) {
      const idx = line.indexOf(':');
      if (idx > 0) {
        const key = line.slice(0, idx).trim();
        const val = line
          .slice(idx + 1)
          .trim()
          .replace(/^"(.*)"$/, '$1');
        rawMeta[key] = val;
      }
    }
    body = fmMatch[2];
  }

  // Supprime les commentaires internes MDX {/* ... */} du rendu public
  const cleanBody = body.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').trim();

  // Extrait les blocs <Callout title="...">...</Callout> et les paragraphes/titres
  const blocks: MdxBlock[] = [];
  const calloutRegex = /<Callout\s+title="([^"]+)">([\s\S]*?)<\/Callout>/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const parseMarkdownSegment = (segment: string) => {
    const chunks = segment
      .split(/\n{2,}/)
      .map((c) => c.trim())
      .filter(Boolean);

    for (const chunk of chunks) {
      if (chunk.startsWith('### ')) {
        const text = chunk.slice(4).trim();
        blocks.push({ type: 'h3', text, id: slugifyHeading(text) });
      } else if (chunk.startsWith('## ')) {
        const text = chunk.slice(3).trim();
        blocks.push({ type: 'h2', text, id: slugifyHeading(text) });
      } else if (chunk.split('\n').every((l) => l.trim().startsWith('- '))) {
        const items = chunk
          .split('\n')
          .map((l) => l.trim().replace(/^-\s+/, ''));
        blocks.push({ type: 'ul', items });
      } else if (chunk.split('\n').every((l) => /^\d+\.\s+/.test(l.trim()))) {
        const items = chunk
          .split('\n')
          .map((l) => l.trim().replace(/^\d+\.\s+/, ''));
        blocks.push({ type: 'ol', items });
      } else {
        blocks.push({ type: 'paragraph', text: chunk.replace(/\n/g, ' ') });
      }
    }
  };

  while ((match = calloutRegex.exec(cleanBody)) !== null) {
    if (match.index > lastIndex) {
      parseMarkdownSegment(cleanBody.slice(lastIndex, match.index));
    }
    blocks.push({
      type: 'callout',
      title: match[1].trim(),
      text: match[2].trim().replace(/\n+/g, ' '),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < cleanBody.length) {
    parseMarkdownSegment(cleanBody.slice(lastIndex));
  }

  const firstParagraph = blocks.find((b) => b.type === 'paragraph');
  const excerpt = firstParagraph
    ? firstParagraph.text.replace(/\*\*([^*]+)\*\*/g, '$1').slice(0, 210).trim() + '…'
    : rawMeta.seoDescription || '';

  return {
    frontmatter: {
      slug: rawMeta.slug || '',
      title: rawMeta.title || '',
      seoTitle: rawMeta.seoTitle || rawMeta.title || '',
      seoDescription: rawMeta.seoDescription || '',
      category: rawMeta.category || 'Analyse',
      publishedAt: rawMeta.publishedAt || '2026-11-01',
      updatedAt: rawMeta.updatedAt || rawMeta.publishedAt || '2026-11-01',
      readingTime: rawMeta.readingTime || '5 min',
      author: rawMeta.author || 'Laurentine MVONDO',
      status: rawMeta.status || 'publie',
      relatedServiceSlug: rawMeta.relatedServiceSlug || 'mise-a-niveau-structuration-strategique',
      relatedServiceAnchor: rawMeta.relatedServiceAnchor || 'Découvrir le service associé',
    },
    excerpt,
    blocks,
  };
}
