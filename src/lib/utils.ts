import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates a URL with standard UTM tracking parameters.
 * @param baseUrl The base URL to which UTM parameters will be appended.
 * @param campaign The name of the marketing campaign (e.g., 'premium-launch').
 * @param medium The medium used to reach the user (e.g., 'banner', 'email').
 * @param content Optional. Used to differentiate ads or links that point to the same URL (e.g., 'top-banner').
 * @returns The full URL with UTM parameters as a string.
 */
export function createTrackedUrl(baseUrl: string, campaign: string, medium: string, content?: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set('utm_source', 'paulikreisch.de');
  url.searchParams.set('utm_campaign', campaign);
  url.searchParams.set('utm_medium', medium);
  if (content) {
    url.searchParams.set('utm_content', content);
  }
  return url.toString();
}
