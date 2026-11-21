import 'server-only';

/** Retired with the checklist. Never send a mail pointing at the removed PDF.
 * A replacement welcome mail needs its own content review and activation.
 * Keep the call contract so existing confirmations and subscriber data work. */
export async function sendFunnelDay0(
  _recipient: { id: string; email: string; unsubscribeToken: string },
): Promise<null> {
  return null;
}
