/** Follow-up mail sequence engine (Day 1/3/5/7 style). Pure logic: no route,
 * no scheduler and no real provider is wired to it. A caller passes the
 * subscriber store, a provider with send(message,{idempotencyKey}) and the
 * content for each step. Nothing here sends by itself.
 *
 * Safety rules:
 * - only recipients in status "active" with a confirmation and consent record
 * - steps go strictly in order, each at most once (sent marker + provider
 *   idempotency key), measured from the confirmation time
 * - the status is checked again inside the claim transaction right before
 *   every send, so unsubscribed or suppressed people never get a retry
 * - a failed send is retried after a pause, at most MAX_ATTEMPTS times, then
 *   the step is parked as "failed" and the sequence stops for that person */
export const DAY_MS=24*3600*1000,CLAIM_LEASE_MS=15*60*1000,RETRY_MS=60*60*1000,MAX_ATTEMPTS=3;
export const defaultSteps=[{key:'day1',afterDays:1},{key:'day3',afterDays:3},{key:'day5',afterDays:5},{key:'day7',afterDays:7}];
const mailable=r=>r&&r.status==='active'&&r.confirmedAt&&r.consent;
/** Returns the step that may be claimed now, or null. */
export function nextStep(record,steps,nowMs){
  if(!mailable(record))return null;
  const seq=record.sequence??{};
  for(const step of steps){
    const s=seq[step.key];
    if(s?.sentAt)continue;
    if(s?.failedAt)return null;
    if(nowMs<Date.parse(record.confirmedAt)+step.afterDays*DAY_MS)return null;
    if(s?.claimedAt&&nowMs-Date.parse(s.claimedAt)<(s.attempts>0&&s.lastError?RETRY_MS:CLAIM_LEASE_MS))return null;
    return step;
  }
  return null;
}
/** @param {{store:any,subscribers:any,provider:any,steps?:any[],content:(key:string,ctx:any)=>({subject:string,html:string,text:string}|null),from:string,replyTo?:string,listHeaders:(token:string)=>any,unsubscribeUrl:(token:string)=>string,now?:()=>number,limit?:number,enabled?:boolean}} o */
export async function runSequence({store,subscribers,provider,steps=defaultSteps,content,from,replyTo,listHeaders,unsubscribeUrl,now=Date.now,limit=50,enabled=false}){
  const out={sent:0,failed:0,skipped:0,disabled:!enabled};
  if(!enabled)return out;
  for(const r of await store.list()){
    if(out.sent+out.failed>=limit)break;
    const step=nextStep(r,steps,now());
    if(!step)continue;
    const body=content(step.key,{});
    if(!body){out.skipped++;continue;}
    // Claim inside a transaction, re-checking status and step at that moment.
    const claim=await store.update(r.id,cur=>{
      const s=nextStep(cur,steps,now());
      if(!s||s.key!==step.key)return {value:null};
      const c=structuredClone(cur);c.sequence={...(c.sequence??{})};
      const old=c.sequence[step.key]??{};
      c.sequence[step.key]={...old,claimedAt:new Date(now()).toISOString(),attempts:(old.attempts??0)+1};
      return {record:c,value:{attempts:c.sequence[step.key].attempts,email:c.email,token:subscribers.unsubscribeToken(c)}};
    });
    if(!claim){out.skipped++;continue;}
    try{
      await provider.send({from,replyTo,to:[claim.email],subject:body.subject,html:body.html,text:body.text,headers:listHeaders(claim.token)},{idempotencyKey:`seq:${step.key}:${r.id}`});
      await store.update(r.id,cur=>{const c=structuredClone(cur);c.sequence[step.key]={...c.sequence[step.key],sentAt:new Date(now()).toISOString()};delete c.sequence[step.key].lastError;return {record:c,value:true};});
      out.sent++;
    }catch(e){
      await store.update(r.id,cur=>{const c=structuredClone(cur);const s=c.sequence[step.key];s.lastError=String(e?.message??e).slice(0,120);if(s.attempts>=MAX_ATTEMPTS)s.failedAt=new Date(now()).toISOString();return {record:c,value:true};});
      out.failed++;
    }
  }
  return out;
}
