/** Durable, create-only control records for newsletter campaigns.
 * approval-<doc>-r<revision>: explicit, revocable send approval for one immutable
 *   saved revision. It is bound to the preview digest (content, sender, subject,
 *   recipient set), so any change makes it stale. It also expires, so an approval
 *   cannot be used long after it was given. 24 hours is a technical choice, not a
 *   provider guarantee; duplicate protection comes from the claim below.
 * send-<doc>-r<revision>: claim written right before the first provider call (after all
 *   messages were built). A revision is never sent twice, also not after a timeout or
 *   crash. The claim itself protects against duplicates, independent of the provider. */
export const APPROVAL_TTL_MS=24*60*60*1000;
const safe=value=>String(value).replace(/[^a-z0-9-]/gi,'').slice(0,40);
export const approvalKey=(id,revision)=>`approval-${safe(id)}-r${Number(revision)}`;
export const sendKey=(id,revision)=>`send-${safe(id)}-r${Number(revision)}`;
/** Test and fallback store with the same contract as the bucket binding. */
export function createMemoryControl(){
  const map=new Map();let generation=0;
  return {
    async read(key){const v=map.get(key);return v?{...structuredClone(v.data),generation:v.generation}:null;},
    async create(key,data){if(map.has(key))return false;map.set(key,{data:structuredClone(data),generation:++generation});return true;},
    async update(key,data,expected){const v=map.get(key);if(!v||v.generation!==expected)return false;map.set(key,{data:structuredClone(data),generation:++generation});return true;},
  };
}
export function evaluateApproval(record,digest,now){
  if(!record)return {state:'none'};
  if(record.state==='revoked')return {state:'revoked',revokedAt:record.revokedAt};
  if(record.state!=='approved')return {state:'none'};
  if(record.digest!==digest)return {state:'stale'};
  if(!(now<Date.parse(record.expiresAt)))return {state:'expired',expiresAt:record.expiresAt};
  return {state:'approved',approvedAt:record.approvedAt,approvedBy:record.approvedBy,expiresAt:record.expiresAt};
}
export function describeSend(record){
  if(!record)return {state:'none'};
  if(record.state==='finished')return {state:'finished',at:record.at,sent:record.sent,failed:record.failed,notAttempted:record.notAttempted};
  return {state:'claimed',at:record.at};
}
