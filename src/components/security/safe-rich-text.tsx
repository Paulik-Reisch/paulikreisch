import sanitizeHtml from 'sanitize-html';

export function SafeRichText({ html, className }: { html: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizeHtml(html, {
    allowedSchemes: ['https', 'http', 'mailto'],
    allowProtocolRelative: false,
  }) }} />;
}
