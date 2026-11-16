import {previewSend,previewDigest,sendCampaign,SendRefused} from './campaign.mjs';
import {WEB_VIEW_TOKEN,NEWSLETTER_WEB_BASE} from '../marketing/model.mjs';
/** Private preflight never mutates recipients or contacts the provider. Read
 * model and public write store are separate capabilities. */
export function createNewsletterSender({getSubscribers,getReadModel,getStatus=()=>({}),getResend,from,replyTo,baseUrl,dailyLimit=100,enabled}){
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
      if(!enabled)blockers.push('Versand ist serverseitig nicht freigeschaltet.');
      if(configuration.storeEnabled===false)blockers.push('Öffentliche Anmeldung und Empfänger-Schreibpfade sind gesperrt.');
      if(configuration.providerConfigured===false)blockers.push('Versandanbieter ist nicht vollständig konfiguriert.');
      if(configuration.tokenKeysConfigured===false)blockers.push('Persönliche Link-Schlüssel sind nicht vollständig konfiguriert.');
      if(!from)blockers.push('Absender fehlt.');
      const count=recipients?.length??null;
      if(count===0)blockers.push('Keine bestätigten Empfänger.');
      if(count!==null&&count>dailyLimit)blockers.push('Empfängerzahl überschreitet das Kampagnenlimit.');
      // Validate placeholders against a synthetic address/token only. No personal
      // URL or real recipient reaches the private browser response.
      if(body){try{previewSend({from,replyTo,subject:record.draft.subject,content:body,recipients:[{id:'sample',email:'beispiel@example.invalid',unsubscribeToken:'VORSCHAU-KEIN-TOKEN'}],dailyLimit});}catch(e){blockers.push(e.message);}}
      warnings.push('Limit gilt pro Kampagne. Verbleibendes Tageskontingent und Zustellung wurden nicht beim Anbieter geprüft.');
      return {digest:body&&recipients?previewDigest({from,replyTo,subject:record.draft.subject,content:body,recipients}):null,count,counts,dailyLimit,overDailyLimit:count!==null&&count>dailyLimit,phrase:count===null?null:`SENDEN ${count}`,from,replyTo:replyTo??null,subject:record.draft.subject,enabled:Boolean(enabled),ready:blockers.length===0,configuration,publishedCurrent,blockers,warnings,revision:record.revision,browserUrl:NEWSLETTER_WEB_BASE+encodeURIComponent(record.draft.slug)};
    },
    async send(record,confirmation){
      if(!enabled)throw new SendRefused('Versand ist nicht freigeschaltet.');
      const {args}=await prepare(record),p=previewSend(args);
      if(confirmation?.digest!==p.digest)throw new SendRefused('Vorschau ist veraltet. Bitte neu prüfen.');
      if(confirmation?.phrase!==p.phrase)throw new SendRefused('Bestätigungsphrase stimmt nicht.');
      const campaignId=`nl-${String(record.id).replace(/[^a-z0-9]/gi,'').slice(0,8)}-${p.digest.slice(0,16)}`;
      return sendCampaign({...args,enabled,confirmation,resend:getResend(),baseUrl,campaignId});
    }
  };
}
