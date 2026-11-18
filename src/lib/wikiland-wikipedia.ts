import { tokenize, type WikiArticle, type WikiToken } from './wikiland-engine';

/** Only tag names in this set can reach React; remote attributes and URLs never do. */
const ALLOWED = new Set(['p', 'div', 'span', 'section', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'blockquote', 'pre', 'code', 'b', 'strong', 'i', 'em', 'small', 'sub', 'sup', 'br', 'hr', 'figure', 'figcaption']);
const DISCARD = new Set(['script', 'style', 'link', 'meta', 'iframe', 'object', 'embed', 'svg', 'math', 'noscript', 'input', 'button', 'img', 'audio', 'video']);
export type ArticleNode = { type: 'text'; tokens: WikiToken[] } | { type: 'element'; tag: string; children: ArticleNode[] };
export type FullWikiArticle = { article: WikiArticle; nodes: ArticleNode[] };

/** Fetch exactly the curated revision: the same puzzle must survive edits and reloads. */
export async function fetchWikipediaRevision(revision: number, signal?: AbortSignal, request: typeof fetch = fetch): Promise<{ title: string; html: string }> {
  const params = new URLSearchParams({ action: 'parse', oldid: String(revision), prop: 'text|revid', format: 'json', formatversion: '2', origin: '*' });
  const response = await request(`https://de.wikipedia.org/w/api.php?${params}`, { signal });
  if (!response.ok) throw new Error(`Wikipedia HTTP ${response.status}`);
  const data: unknown = await response.json();
  if (!data || typeof data !== 'object' || !('parse' in data)) throw new Error('Wikipedia returned no article.');
  const parsed = (data as { parse?: { title?: unknown; revid?: unknown; text?: unknown } }).parse;
  if (!parsed || parsed.revid !== revision || typeof parsed.title !== 'string' || typeof parsed.text !== 'string' || !parsed.text.trim()) throw new Error('Wikipedia returned an invalid revision.');
  return { title: parsed.title, html: parsed.text };
}

/** Parse in an inert template, then create a fresh, attribute-free allowlisted tree. */
export function prepareWikipediaArticle(base: WikiArticle, title: string, html: string, document: Document): FullWikiArticle {
  const template = document.createElement('template');
  template.innerHTML = html;
  const first = template.content.firstElementChild;
  const root = first?.classList.contains('mw-parser-output') && template.content.children.length === 1 ? first : template.content;
  const textParts: string[] = [];
  function convert(node: Node): ArticleNode[] {
    if (node.nodeType === 3) {
      const text = node.textContent ?? '';
      if (!text) return [];
      textParts.push(text);
      return [{ type: 'text', tokens: tokenize(text) }];
    }
    if (node.nodeType !== 1) return [];
    const element = node as Element;
    const tag = element.tagName.toLowerCase();
    // MediaWiki may represent formulas with MathML or an image. Preserve the
    // textual alternative as text, without loading remote resources.
    if (tag === 'math' || tag === 'img') {
      const alternative = tag === 'img' ? element.getAttribute('alt') : (element.getAttribute('aria-label') ?? element.querySelector('annotation')?.textContent ?? element.textContent);
      if (!alternative?.trim()) return [];
      textParts.push(alternative);
      return [{ type: 'text', tokens: tokenize(alternative) }];
    }
    if (DISCARD.has(tag)) return [];
    const structural = new Set(['table', 'thead', 'tbody', 'tfoot', 'tr', 'ul', 'ol', 'dl']);
    const children = Array.from(element.childNodes).filter(child => !(structural.has(tag) && child.nodeType === 3 && !child.textContent?.trim())).flatMap(convert);
    if (!ALLOWED.has(tag)) return children;
    return [{ type: 'element', tag, children }];
  }
  const nodes = Array.from(root.childNodes).filter(node => node.nodeType !== 3 || !!node.textContent?.trim()).flatMap(convert);
  if (!textParts.some(text => /\p{L}/u.test(text))) throw new Error('Wikipedia returned an empty article.');
  return { article: { ...base, title, paragraphs: textParts }, nodes };
}
