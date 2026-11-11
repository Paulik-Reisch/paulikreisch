import { funnelEmails, type FunnelDay } from '@/lib/funnel-emails';
import { sendTransactionalEmail } from '@/lib/resend';
import { getCollectionData, updateDocument } from '@/lib/admin-writes';

export async function processFunnelQueue(limit = 20) {
  const queue = await getCollectionData('funnel_queue');
  const now = Date.now();
  const due = queue
    .filter((d: any) => !d.sent && new Date(d.scheduledAt).getTime() <= now)
    .slice(0, limit);

  const results = [];
  for (const item of due) {
    const day = item.day as FunnelDay;
    const tmpl = funnelEmails[day];
    if (!tmpl) {
      results.push({ id: item.id, skipped: true, reason: 'no template' });
      continue;
    }
    const shopUrl = 'https://paulikreisch.de/shop';
    const checklistUrl = 'https://paulikreisch.de/checkliste-lernvollzugsanstalt.pdf';
    const html = tmpl.html({ shopUrl, checklistUrl } as any);
    try {
      await sendTransactionalEmail(item.email, tmpl.subject, html);
      await updateDocument('funnel_queue', item.id, { sent: true, sentAt: new Date().toISOString() }, 'system-funnel');
      results.push({ id: item.id, sent: true, day, email: item.email });
    } catch (e: any) {
      results.push({ id: item.id, sent: false, error: e?.message });
    }
  }
  return { due: due.length, results };
}
