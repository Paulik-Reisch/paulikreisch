/** Minimal Resend REST client (no SDK dependency). The API key is read by the
 * caller from a server secret and never logged or returned. */
export class ResendError extends Error {constructor(status,message){super(message);this.status=status;}}
export function createResend({apiKey,fetcher=fetch,base='https://api.resend.com'}){
  if(typeof apiKey!=='string'||apiKey.length<8)throw Error('Resend key missing.');
  return {
    /** message: {from,to,subject,html,text,replyTo,headers,tags}. Returns {id}. */
    async send(message,{idempotencyKey}={}){
      if(!Array.isArray(message.to)||message.to.length!==1)throw Error('One recipient per message.');
      const body={from:message.from,to:message.to,subject:message.subject,html:message.html,text:message.text};
      if(message.replyTo)body.reply_to=message.replyTo;
      if(message.headers)body.headers=message.headers;
      if(message.tags)body.tags=message.tags;
      const headers={authorization:`Bearer ${apiKey}`,'content-type':'application/json'};
      if(idempotencyKey){if(idempotencyKey.length>256)throw Error('Idempotency key too long.');headers['idempotency-key']=idempotencyKey;}
      const response=await fetcher(`${base}/emails`,{method:'POST',headers,body:JSON.stringify(body),signal:AbortSignal.timeout(20000)});
      if(!response.ok){
        let detail='';try{detail=String((await response.json()).message??'').slice(0,200);}catch{}
        throw new ResendError(response.status,`Resend ${response.status}${detail?': '+detail:''}`);
      }
      const data=await response.json();
      if(typeof data.id!=='string')throw new ResendError(502,'Resend answer without id.');
      return {id:data.id};
    },
  };
}
