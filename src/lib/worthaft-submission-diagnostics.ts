export type WorthaftPhase = 'restore' | 'refresh' | 'signout' | 'signin' | 'save';
export type WorthaftCause = 'fetch' | 'timeout' | 'response' | 'storage' | 'unknown';
export type WorthaftDiagnostic = { phase: WorthaftPhase; code?: string; cause: WorthaftCause };

const allowedCodes = new Set([
  'auth/network-request-failed', 'auth/internal-error', 'auth/user-token-expired',
  'auth/user-not-found', 'auth/invalid-user-token', 'auth/user-disabled',
  'auth/operation-not-allowed', 'auth/too-many-requests', 'auth/quota-exceeded',
  'auth/invalid-api-key', 'auth/unauthorized-domain', 'auth/timeout',
  'auth/web-storage-unsupported', 'auth/operation-not-supported-in-this-environment',
  'cancelled', 'unknown', 'invalid-argument', 'deadline-exceeded', 'not-found',
  'already-exists', 'permission-denied', 'resource-exhausted', 'failed-precondition',
  'aborted', 'out-of-range', 'unimplemented', 'internal', 'unavailable',
  'data-loss', 'unauthenticated',
]);

/** Only fixed labels and known error codes may reach the UI. */
export function getWorthaftDiagnostic(error: unknown, phase: WorthaftPhase): WorthaftDiagnostic {
  const value = error as { code?: unknown; message?: unknown; customData?: { message?: unknown } } | null;
  const code = typeof value?.code === 'string' && allowedCodes.has(value.code)
    ? value.code : undefined;
  const detail = typeof value?.customData?.message === 'string'
    ? value.customData.message : typeof value?.message === 'string' ? value.message : '';
  // Never return the raw message, URL, request body, token, or user identifier.
  const cause: WorthaftCause = /timeout|timed out|time limit/i.test(detail) ? 'timeout'
    : /indexeddb|idb[- /]|object store|quotaexceeded|storage/i.test(detail) ? 'storage'
    : /json|unexpected token|unexpected end|syntaxerror/i.test(detail) ? 'response'
    : /failed to fetch|fetch failed|networkerror|network request failed|load failed|err_blocked_by_client/i.test(detail) ? 'fetch'
    : 'unknown';
  return { phase, ...(code ? { code } : {}), cause };
}

export class WorthaftDiagnosticError extends Error {
  readonly code?: string;
  readonly diagnostics: readonly WorthaftDiagnostic[];
  constructor(diagnostic: WorthaftDiagnostic, previous: readonly WorthaftDiagnostic[] = []) {
    super('Worthaft submission failed');
    this.name = 'WorthaftDiagnosticError';
    this.code = diagnostic.code;
    this.diagnostics = [...previous.slice(-1), diagnostic];
  }
}

export function asWorthaftDiagnosticError(error: unknown, phase: WorthaftPhase, previous: readonly WorthaftDiagnostic[] = []) {
  return new WorthaftDiagnosticError(getWorthaftDiagnostic(error, phase), previous);
}
