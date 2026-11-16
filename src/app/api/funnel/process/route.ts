/** Legacy queue dispatch is retired. In particular, GET/HEAD must never send mail.
 * No queue, credentials or provider are imported on this route. The old queue
 * has no new-store consent/suppression evidence and must not be reactivated.
 */
export const dynamic = 'force-dynamic';
function retired() {
  return Response.json({ ok: false, error: 'Der alte Funnelversand ist deaktiviert.' },
    { status: 410, headers: { 'cache-control': 'no-store' } });
}
export const GET = retired;
export const POST = retired;
