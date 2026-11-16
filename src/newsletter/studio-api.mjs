import {previewSend,sendCampaign,SendRefused} from './campaign.mjs';
import {WEB_VIEW_TOKEN,NEWSLETTER_WEB_BASE} from '../marketing/model.mjs';
/** Server side of the studio send panel. Nothing here sends by itself: preview is
 * read-only, send needs the digest of that exact preview plus the typed phrase.
 * `subscribers` is a getter so a disabled store throws only when used. */
export function createNewsletterSender({getSubscribers,getResend,from,replyTo,baseUrl,dailyLimit=100,enabled}){
  /** record: studio record {id,draft,published,revision}. The browser-view placeholder
   * is only filled when exactly this revision is published, so the link in the mail
   * always shows what the mail shows and never 404s. */
  const content=record=>{
    const draft=record.draft;
    if(draft.kind!=='newsletter'||draft.mode!=='custom'||!draft.code?.html||!draft.code?.text)throw new SendRefused('Nur Newsletter mit eigenem HTML und Text können versendet werden.');
    let {html,text}=draft.code;
    if(html.includes(WEB_VIEW_TOKEN)||text.includes(WEB_VIEW_TOKEN)){
      if(!record.published||record.published.revision!==record.revision)throw new SendRefused('Browseransicht ist nicht veröffentlicht oder nicht auf dem aktuellen Stand.');
      const url=NEWSLETTER_WEB_BASE+encodeURIComponent(draft.slug);
      html=html.replaceAll(WEB_VIEW_TOKEN,url);text=text.replaceAll(WEB_VIEW_TOKEN,url);
    }
    return {html,text};
  };
  const prepare=async record=>{
    const body=content(record),recipients=await getSubscribers().mailable();
    return {body,recipients,args:{from,replyTo,subject:record.draft.subject,content:body,recipients,dailyLimit}};
  };
  return {
    async preview(record){
      const {args}=await prepare(record),p=previewSend(args);
      return {digest:p.digest,count:p.count,dailyLimit:p.dailyLimit,overDailyLimit:p.overDailyLimit,phrase:p.phrase,from:p.from,replyTo:p.replyTo,subject:p.subject,enabled:Boolean(enabled)};
    },
    async send(record,confirmation){
      const {args}=await prepare(record),p=previewSend(args);
      const campaignId=`nl-${String(record.id).replace(/[^a-z0-9]/gi,'').slice(0,8)}-${p.digest.slice(0,16)}`;
      return sendCampaign({...args,enabled,confirmation,resend:getResend(),baseUrl,campaignId});
    }
  };
}
