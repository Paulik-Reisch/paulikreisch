import {previewSend,sendCampaign,SendRefused} from './campaign.mjs';
/** Server side of the studio send panel. Nothing here sends by itself: preview is
 * read-only, send needs the digest of that exact preview plus the typed phrase.
 * `subscribers` is a getter so a disabled store throws only when used. */
export function createNewsletterSender({getSubscribers,getResend,from,replyTo,baseUrl,dailyLimit=100,enabled}){
  const content=draft=>{
    if(draft.kind!=='newsletter'||draft.mode!=='custom'||!draft.code?.html||!draft.code?.text)throw new SendRefused('Nur Newsletter mit eigenem HTML und Text können versendet werden.');
    return {html:draft.code.html,text:draft.code.text};
  };
  const prepare=async draft=>{
    const body=content(draft),recipients=await getSubscribers().mailable();
    return {body,recipients,args:{from,replyTo,subject:draft.subject,content:body,recipients,dailyLimit}};
  };
  return {
    async preview(draft){
      const {args}=await prepare(draft),p=previewSend(args);
      return {digest:p.digest,count:p.count,dailyLimit:p.dailyLimit,overDailyLimit:p.overDailyLimit,phrase:p.phrase,from:p.from,replyTo:p.replyTo,subject:p.subject,enabled:Boolean(enabled)};
    },
    async send(draft,confirmation,recordId){
      const {args}=await prepare(draft),p=previewSend(args);
      const campaignId=`nl-${String(recordId).replace(/[^a-z0-9]/gi,'').slice(0,8)}-${p.digest.slice(0,16)}`;
      return sendCampaign({...args,enabled,confirmation,resend:getResend(),baseUrl,campaignId});
    }
  };
}
