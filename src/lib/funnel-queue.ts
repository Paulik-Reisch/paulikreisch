/** Retired legacy queue. Defense in depth for any future internal caller.
 * No recipient/queue reads, provider calls or writes are permitted. Existing
 * records are retained untouched; migration needs separate consent review.
 */
export async function processFunnelQueue(_limit = 20): Promise<never> {
  throw new Error('Legacy funnel dispatch disabled.');
}
