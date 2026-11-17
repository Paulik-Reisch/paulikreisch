/** Only explicitly published historical newsletters may cross the public boundary. */
export function publishedNewsletterHtml(data: { isLive?: unknown; content?: unknown } | undefined): string | null {
  return data?.isLive === true && typeof data.content === 'string' && data.content.length > 0
    ? data.content : null;
}
