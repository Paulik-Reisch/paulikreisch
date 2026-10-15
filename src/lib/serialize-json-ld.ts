/** Escape '<' so JSON data cannot terminate an HTML script element. */
export function serializeJsonLd(value: unknown): string {
  return (JSON.stringify(value) ?? 'null').replace(/</g, '\u003c');
}
