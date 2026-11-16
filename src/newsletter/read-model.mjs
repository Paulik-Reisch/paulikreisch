/** Pure projection: never returns addresses, consent records or signed links.
 * IDs stay server-side for the send-approval digest. */
export function summarizeNewsletterRecipients(rows) {
  const counts = {pending:0,active:0,unsubscribed:0,suppressed:0},recipients=[];
  for(const row of rows){
    if(Object.hasOwn(counts,row.status))counts[row.status]++;
    if(row.status==='active'&&row.confirmedAt&&row.consent&&typeof row.id==='string')recipients.push({id:row.id});
  }
  return {counts,recipients};
}
