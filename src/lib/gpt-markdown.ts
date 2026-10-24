import sanitizeHtml from 'sanitize-html';
import { marked } from 'marked';

const allowedTags = [
  'a', 'blockquote', 'br', 'code', 'del', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'hr', 'li', 'ol', 'p', 'pre', 's', 'strong', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'ul',
];

export function renderGptMarkdown(content: string): string {
  const markdownHtml = marked.parse(content, { async: false, gfm: true, breaks: false });
  return sanitizeHtml(markdownHtml, {
    allowedTags,
    allowedAttributes: {
      a: ['href', 'name', 'target', 'title', 'rel'],
      th: ['align', 'colspan', 'rowspan'],
      td: ['align', 'colspan', 'rowspan'],
      code: ['class'],
    },
    allowedClasses: { code: [/^language-[\w-]+$/] },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false,
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
    },
  });
}
