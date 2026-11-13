import { ADMIN_HOST } from './admin-host-policy';
export const ANALYTICS_HOST = 'analytics.paulikreisch.de';
export const STATIC_HOST = 'static.paulikreisch.de';
export const ANALYTICS_ORIGIN = `https://${ANALYTICS_HOST}`;
export const STATIC_ORIGIN = `https://${STATIC_HOST}`;
export function isIsolatedManagementHost(host: string | null): boolean {
  return host === ANALYTICS_HOST || host === STATIC_HOST || host === ADMIN_HOST;
}
export function isHiddenManagementPath(path: string): boolean {
  return path === '/analytics-private' || path.startsWith('/analytics-private/')
    || path === '/static-private' || path.startsWith('/static-private/');
}
