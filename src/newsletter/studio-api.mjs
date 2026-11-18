import {previewSend,previewDigest,sendCampaign,SendRefused} from './campaign.mjs';
import {APPROVAL_TTL_MS,approvalKey,sendKey,evaluateApproval,describeSend} from './send-control.mjs';
import {WEB_VIEW_TOKEN,NEWSLETTER_WEB_BASE} from '../marketing/model.mjs';
/** Private preflight never mutates recipients or contacts the provider. Read
 * model and public write store are separate capabilities. */
export function createNewsletterSender({getSubscribers,getReadModel,getStatus=()=>({}),getResend,from,replyTo=/** @type {string|undefined} */(undefined),baseUrl,dailyLimit=100,enabled,control=/** @type {any} */(null),now=()=>Date.now()}){
  const content=(record,{strict=true}={})=>{
    const draft=record.draft;
    if(draft.kind!=='newsletter'||draft.mode!=='custom'||!draft.code?.html||!draft.code?.text)throw new SendRefused('Nur Newsletter mit eigenem HTML und Text können versendet werden.');
    let {html,text}=draft.code;
    if(html.includes(WEB_VIEW_TOKEN)||text.includes(WEB_VIEW_TOKEN)){
      if(strict&&(!record.published||record.published.revision!==record.revision))throw new SendRefused('Browseransicht ist nicht veröffentlicht oder nicht auf dem aktuellen Stand.');
      const url=NEWSLETTER_WEB_BASE+encodeURIComponent(draft.slug);
      html=html.replaceAll(WEB_VIEW_TOKEN,url);text=text.replaceAll(WEB_VIEW_TOKEN,url);
    }
    return {html,text};
  };
  const prepare=async record=>{
    const body=content(record),recipients=await getSubscribers().mailable();
    return {args:{from,replyTo,subject:record.draft.subject,content:body,recipients,dailyLimit}};
  };
  return {
    async preview(record){
      const configuration=getStatus(),blockers=[],warnings=[];
      let body,counts=null,recipients=null;
      try{body=content(record,{strict:false});}catch(e){blockers.push(e.message);}
      const hasWeb=String(record.draft.code?.html??'').includes(WEB_VIEW_TOKEN)||String(record.draft.code?.text??'').includes(WEB_VIEW_TOKEN);
      const publishedCurrent=Boolean(record.published&&record.published.revision===record.revision);
      if(hasWeb&&!publishedCurrent)blockers.push('Browseransicht ist nicht veröffentlicht oder nicht auf dem aktuellen Stand.');
      try{
        if(getReadModel){({counts,recipients}=await getReadModel().snapshot());}
        else{const s=getSubscribers();recipients=await s.mailable();counts=s.counts?await s.counts():null;}
      }catch{blockers.push('Empfängerstatus kann gerade nicht gelesen werden.');}
      if(configuration.webhookConfigured!==true)blockers.push('Signierter Bounce-/Beschwerde-Rückkanal ist nicht aktiv.');
      if(configuration.providerConfigured===false)blockers.push('Versandanbieter ist nicht vollständig konfiguriert.');
      if(configuration.tokenKeysConfigured===false)blockers.push('Persönliche Link-Schlüssel sind nicht vollständig konfiguriert.');
      if(!from)blockers.push('Absender fehlt.');
      const count=recipients?.length??null;
      if(count===0)blockers.push('Keine bestätigten Empfänger.');
      if(count!==null&&count>dailyLimit)blockers.push('Empfängerzahl überschreitet das Kampagnenlimit.');
      // Validate placeholders against a synthetic address/token only. No personal
      // URL or real recipient reaches the private browser response.
      if(body){try{previewSend({from,replyTo,subject:record.draft.subject,content:body,recipients:[{id:'sample',email:'beispiel@example.invalid',unsubscribeToken:'VORSCHAU-KEIN-TOKEN'}],dailyLimit});}catch(e){blockers.push(e.message);}}
      const digest=body&&recipients?previewDigest({from,replyTo,subject:record.draft.subject,content:body,recipients}):null;
      // Everything above must hold before an approval can be given. The server
      // switch, the approval and the one-time claim are checked on top of it.
      const approvable=blockers.length===0&&Boolean(control)&&digest!==null;
      let approval={state:'none'},sendState={state:'none'};
      if(control){
        try{approval=evaluateApproval(await control.read(approvalKey(record.id,record.revision)),digest,now());sendState=describeSend(await control.read(sendKey(record.id,record.revision)));}
        catch{blockers.push('Freigabestatus kann gerade nicht gelesen werden.');approval={state:'unknown'};}
      }else blockers.push('Freigabespeicher ist nicht eingerichtet.');
      if(sendState.state!=='none')blockers.push(sendState.state==='finished'?'Diese Version wurde bereits versendet. Keine Wiederholung.':'Für diese Version wurde ein Versand begonnen. Ergebnis beim Anbieter prüfen, nicht erneut senden.');
      if(approval.state!=='approved')blockers.push('Keine gültige Versandfreigabe für diese Version und diesen Empfängerkreis.');
      if(!enabled)blockers.push('Versand ist serverseitig nicht freigeschaltet (Notbremse).');
      warnings.push('Limit gilt pro Kampagne. Verbleibendes Tageskontingent und Zustellung wurden nicht beim Anbieter geprüft.');
      return {digest,approvable:approvable&&sendState.state==='none',approval,approvalPhrase:count===null?null:`FREIGEBEN ${count}`,approvalHours:APPROVAL_TTL_MS/3600000,sendState,count,counts,dailyLimit,overDailyLimit:count!==null&&count>dailyLimit,phrase:count===null?null:`SENDEN ${count}`,from,replyTo:replyTo??null,subject:record.draft.subject,enabled:Boolean(enabled),ready:blockers.length===0,configuration,publishedCurrent,blockers,warnings,revision:record.revision,browserUrl:NEWSLETTER_WEB_BASE+encodeURIComponent(record.draft.slug)};
    },
    async approve(record,{digest,phrase,actor}){
      if(!control)throw new SendRefused('Freigabespeicher ist nicht eingerichtet.');
      const p=await this.preview(record);
      if(!p.approvable)throw new SendRefused('Freigabe nicht möglich: '+(p.blockers.filter(b=>!/Versandfreigabe|Notbremse/.test(b)).join(' ')||'Voraussetzungen nicht erfüllt.'));
      if(digest!==p.digest)throw new SendRefused('Vorschau ist veraltet. Bitte neu prüfen.');
      if(phrase!==p.approvalPhrase)throw new SendRefused('Bestätigungsphrase stimmt nicht.');
      const key=approvalKey(record.id,record.revision),at=now(),data={state:'approved',digest:p.digest,count:p.count,approvedAt:new Date(at).toISOString(),approvedBy:String(actor||'').slice(0,200),expiresAt:new Date(at+APPROVAL_TTL_MS).toISOString()};
      const existing=await control.read(key);
      const ok=existing?await control.update(key,data,existing.generation):await control.create(key,data);
      if(!ok)throw new SendRefused('Gleichzeitige Änderung. Bitte neu prüfen.');
      return this.preview(record);
    },
    async revokeApproval(record,{actor}={}){
      if(!control)throw new SendRefused('Freigabespeicher ist nicht eingerichtet.');
      const key=approvalKey(record.id,record.revision),existing=await control.read(key);
      if(existing&&existing.state==='approved'){
        const claim=await control.read(sendKey(record.id,record.revision));
        if(claim)throw new SendRefused('Versand wurde bereits begonnen. Freigabe kann nicht mehr widerrufen werden.');
        if(!await control.update(key,{state:'revoked',revokedAt:new Date(now()).toISOString(),revokedBy:String(actor||'').slice(0,200)},existing.generation))throw new SendRefused('Gleichzeitige Änderung. Bitte neu prüfen.');
      }
      return this.preview(record);
    },
    async send(record,confirmation){
      if(!enabled)throw new SendRefused('Versand ist nicht freigeschaltet.');
      if(getStatus().webhookConfigured!==true)throw new SendRefused('Signierter Bounce-/Beschwerde-Rückkanal ist nicht aktiv.');
      const {args}=await prepare(record),p=previewSend(args);
      if(confirmation?.digest!==p.digest)throw new SendRefused('Vorschau ist veraltet. Bitte neu prüfen.');
      if(confirmation?.phrase!==p.phrase)throw new SendRefused('Bestätigungsphrase stimmt nicht.');
      const campaignId=`nl-${String(record.id).replace(/[^a-z0-9]/gi,'').slice(0,8)}-${p.digest.slice(0,16)}`;
      if(!control)throw new SendRefused('Freigabespeicher ist nicht eingerichtet.');
      const approval=evaluateApproval(await control.read(approvalKey(record.id,record.revision)),p.digest,now());
      if(approval.state!=='approved')throw new SendRefused('Keine gültige Versandfreigabe für diese Version und diesen Empfängerkreis.');
      const key=sendKey(record.id,record.revision),claimData={state:'claimed',at:new Date(now()).toISOString(),digest:p.digest,campaignId,count:p.count};
      const resend=getResend();
      // Durable create-only claim, written by sendCampaign right before the first provider
      // call (after every message was built). Validation errors therefore never consume it;
      // a timeout or crash after this point never releases it, so no duplicate send.
      const beforeSend=async()=>{
        if(!await control.create(key,claimData))throw new SendRefused('Für diese Version wurde der Versand bereits beansprucht. Keine Wiederholung.');
      };
      const result=await sendCampaign({...args,enabled,confirmation,resend,baseUrl,campaignId,beforeSend});
      const c=await control.read(key).catch(()=>null);
      if(c)await control.update(key,{...claimData,state:'finished',sent:result.sent,failed:result.failed,notAttempted:result.notAttempted,finishedAt:new Date(now()).toISOString()},c.generation).catch(()=>{});
      return result;
    }
  };
}
